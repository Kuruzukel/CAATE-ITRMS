<?php

require_once __DIR__ . '/../config/database.php';

class Course {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->courses;
    }
    
    public function all() {
        $cursor = $this->collection->find([], ['sort' => ['order' => 1]]);
        return iterator_to_array($cursor);
    }
    
    public function findById($id) {
        try {
            return $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function create($data) {
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        $result = $this->collection->insertOne($data);
        return (string)$result->getInsertedId();
    }
    
    public function update($id, $data) {
        try {
            // Get the existing document first
            $existing = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if (!$existing) {
                return [
                    'success' => false,
                    'modified' => false,
                    'matched' => false,
                    'error' => 'Course not found'
                ];
            }
            
            // Check if any actual data changed (excluding updated_at)
            $hasChanges = false;
            foreach ($data as $key => $value) {
                if ($key !== 'updated_at' && isset($existing[$key])) {
                    // Compare values, handling different types
                    $existingValue = $existing[$key];
                    if ($existingValue != $value) {
                        $hasChanges = true;
                        break;
                    }
                } elseif ($key !== 'updated_at' && !isset($existing[$key])) {
                    // New field being added
                    $hasChanges = true;
                    break;
                }
            }
            
            // Always update the updated_at timestamp
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();

            // Do not persist competency arrays on the course document itself.
            // They are stored in the separate competencies collection and only
            // attached to API responses for convenience.
            $updateData = $data;
            unset(
                $updateData['basic_competencies'],
                $updateData['common_competencies'],
                $updateData['core_competencies']
            );

            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $updateData]
            );
            
            // Check if course_code or title changed
            $oldCourseCode = $existing['course_code'] ?? '';
            $newCourseCode = $data['course_code'] ?? $oldCourseCode;
            $oldTitle = $existing['title'] ?? '';
            $newTitle = $data['title'] ?? $oldTitle;
            
            $courseInfoChanged = ($oldCourseCode !== $newCourseCode) || ($oldTitle !== $newTitle);
            
            // Sync to competencies if course info changed or competencies were updated
            if ($hasChanges && $oldCourseCode) {
                if ($courseInfoChanged) {
                    // Update course_code and title in competencies collection
                    $this->updateCompetenciesCourseInfo($oldCourseCode, $newCourseCode, $newTitle);
                }
                
                // If competencies arrays were updated, sync them
                if (isset($data['basic_competencies']) || 
                    isset($data['common_competencies']) || 
                    isset($data['core_competencies'])) {
                    $this->syncCompetenciesToCollection($existing, $data);
                }
            }
            
            // Return both success status and whether actual changes were made
            return [
                'success' => true,
                'modified' => $hasChanges,
                'matched' => $result->getMatchedCount() > 0
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'modified' => false,
                'matched' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function updateCompetenciesCourseInfo($oldCourseCode, $newCourseCode, $newTitle) {
        try {
            $db = getMongoConnection();
            $competenciesCollection = $db->competencies;
            
            // Update course_code and title in all matching competencies
            $competenciesCollection->updateMany(
                ['course_code' => $oldCourseCode],
                ['$set' => [
                    'course_code' => $newCourseCode,
                    'title' => $newTitle,
                    'updated_at' => new MongoDB\BSON\UTCDateTime()
                ]]
            );
        } catch (Exception $e) {
            error_log("Failed to update competencies course info: " . $e->getMessage());
        }
    }
    
    private function syncCompetenciesToCollection($existing, $updatedData) {
        try {
            $db = getMongoConnection();
            $competenciesCollection = $db->competencies;
            
            // Get course identifiers
            $courseCode = $existing['course_code'] ?? '';
            $courseTitle = $existing['course_title'] ?? $existing['title'] ?? '';
            
            if (empty($courseCode)) {
                return; // Can't sync without course code
            }
            
            // Delete existing competencies for this course
            $competenciesCollection->deleteMany(['course_code' => $courseCode]);
            
            // Prepare competencies to insert
            $competenciesToInsert = [];
            $timestamp = new MongoDB\BSON\UTCDateTime();
            
            // Add basic competencies
            if (isset($updatedData['basic_competencies']) && is_array($updatedData['basic_competencies'])) {
                foreach ($updatedData['basic_competencies'] as $competency) {
                    if (!empty(trim($competency))) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Basic',
                            'competency_name' => trim($competency),
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp
                        ];
                    }
                }
            }
            
            // Add common competencies
            if (isset($updatedData['common_competencies']) && is_array($updatedData['common_competencies'])) {
                foreach ($updatedData['common_competencies'] as $competency) {
                    if (!empty(trim($competency))) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Common',
                            'competency_name' => trim($competency),
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp
                        ];
                    }
                }
            }
            
            // Add core competencies
            if (isset($updatedData['core_competencies']) && is_array($updatedData['core_competencies'])) {
                foreach ($updatedData['core_competencies'] as $competency) {
                    if (!empty(trim($competency))) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Core',
                            'competency_name' => trim($competency),
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp
                        ];
                    }
                }
            }
            
            // Insert new competencies if any exist
            if (!empty($competenciesToInsert)) {
                $competenciesCollection->insertMany($competenciesToInsert);
            }
            
        } catch (Exception $e) {
            // Log error but don't fail the main update
            error_log("Failed to sync competencies: " . $e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            $result = $this->collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
}
