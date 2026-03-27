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
            $existing = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if (!$existing) {
                return [
                    'success' => false,
                    'modified' => false,
                    'matched' => false,
                    'error' => 'Course not found'
                ];
            }
            
            $hasChanges = false;
            foreach ($data as $key => $value) {
                if ($key !== 'updated_at' && isset($existing[$key])) {
                    $existingValue = $existing[$key];
                    if ($existingValue != $value) {
                        $hasChanges = true;
                        break;
                    }
                } elseif ($key !== 'updated_at' && !isset($existing[$key])) {
                    $hasChanges = true;
                    break;
                }
            }
            
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();

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
            
            $oldCourseCode = $existing['course_code'] ?? '';
            $newCourseCode = $data['course_code'] ?? $oldCourseCode;
            $oldTitle = $existing['title'] ?? '';
            $newTitle = $data['title'] ?? $oldTitle;
            
            $courseInfoChanged = ($oldCourseCode !== $newCourseCode) || ($oldTitle !== $newTitle);
            
            if ($hasChanges && $oldCourseCode) {
                if ($courseInfoChanged) {
                    $this->updateCompetenciesCourseInfo($oldCourseCode, $newCourseCode, $newTitle);
                }
                
                if (isset($data['basic_competencies']) || 
                    isset($data['common_competencies']) || 
                    isset($data['core_competencies'])) {
                    $this->syncCompetenciesToCollection($existing, $data);
                }
            }
            
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
            
            $courseCode = $existing['course_code'] ?? '';
            $courseTitle = $existing['course_title'] ?? $existing['title'] ?? '';
            
            if (empty($courseCode)) {
                return; // Can't sync without course code
            }
            
            $competenciesCollection->deleteMany(['course_code' => $courseCode]);
            
            $competenciesToInsert = [];
            $timestamp = new MongoDB\BSON\UTCDateTime();
            
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
            
            if (!empty($competenciesToInsert)) {
                $competenciesCollection->insertMany($competenciesToInsert);
            }
            
        } catch (Exception $e) {
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
