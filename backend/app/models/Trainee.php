<?php

require_once __DIR__ . '/../config/database.php';

class Trainee {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->trainees;
    }
    
    public function findByEmail($email) {
        $document = $this->collection->findOne(['email' => $email]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findByUsername($username) {
        $document = $this->collection->findOne(['username' => $username]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findByEmailOrUsername($identifier) {
        $document = $this->collection->findOne([
            '$or' => [
                ['email' => $identifier],
                ['username' => $identifier]
            ]
        ]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findById($id) {
        try {
            $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            if ($document) {
                $trainee = (array)$document;
                // Convert MongoDB ObjectId to string
                if (isset($trainee['_id'])) {
                    $trainee['_id'] = (string)$trainee['_id'];
                }
                return $trainee;
            }
            return null;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function all() {
        try {
            $cursor = $this->collection->find();
            $trainees = [];
            foreach ($cursor as $document) {
                $trainee = (array)$document;
                // Convert MongoDB ObjectId to string
                if (isset($trainee['_id'])) {
                    $trainee['_id'] = (string)$trainee['_id'];
                }
                $trainees[] = $trainee;
            }
            return $trainees;
        } catch (Exception $e) {
            error_log("Error fetching all trainees: " . $e->getMessage());
            return [];
        }
    }
    
    public function create($data) {
        try {
            // Generate trainee_id if not provided or empty
            if (empty($data['trainee_id'])) {
                $data['trainee_id'] = $this->generateTraineeId();
            }
            
            // Don't hash password - store as plain text
            // Password is already in plain text from the form
            
            // Add timestamps
            $data['created_at'] = new MongoDB\BSON\UTCDateTime();
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->insertOne($data);
            return (string)$result->getInsertedId();
        } catch (Exception $e) {
            error_log("Error creating trainee: " . $e->getMessage());
            throw $e;
        }
    }
    
    private function generateTraineeId() {
        // Get current year
        $year = date('Y');
        
        // Find the last trainee ID for this year
        $lastTrainee = $this->collection->findOne(
            ['trainee_id' => ['$regex' => "^TRN-$year-"]],
            ['sort' => ['trainee_id' => -1]]
        );
        
        if ($lastTrainee && isset($lastTrainee['trainee_id'])) {
            // Extract the number from the last ID (e.g., "TRN-2026-005" -> 5)
            $lastId = $lastTrainee['trainee_id'];
            $parts = explode('-', $lastId);
            $lastNumber = isset($parts[2]) ? (int)$parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            // First trainee for this year
            $newNumber = 1;
        }
        
        // Format: TRN-YYYY-NNN (e.g., TRN-2026-001)
        return sprintf('TRN-%d-%03d', $year, $newNumber);
    }
    
    public function update($id, $data) {
        try {
            // Remove password from update if empty
            if (isset($data['password']) && empty($data['password'])) {
                unset($data['password']);
            }
            // Don't hash password - store as plain text
            
            // Update timestamp
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $data]
            );
            
            return $result->getModifiedCount() > 0 || $result->getMatchedCount() > 0;
        } catch (Exception $e) {
            error_log("Error updating trainee: " . $e->getMessage());
            return false;
        }
    }
    
    public function delete($id) {
        try {
            $result = $this->collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            error_log("Error deleting trainee: " . $e->getMessage());
            return false;
        }
    }
    
    public function getStatistics() {
        try {
            $year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
            $db = getMongoConnection();
            
            // Total trainees - count all trainees in the collection
            $totalTrainees = $this->collection->countDocuments();
            
            // Get enrollment, application, and admission counts from their respective collections
            $enrollmentCollection = $db->enrollments;
            $applicationCollection = $db->applications;
            $admissionCollection = $db->admissions;
            
            // Count all enrollments (regardless of status)
            $totalEnrollment = $enrollmentCollection->countDocuments();
            
            // Count all applications (regardless of status)
            $totalApplication = $applicationCollection->countDocuments();
            
            // Count all admissions (regardless of status)
            $totalAdmission = $admissionCollection->countDocuments();
            
            // Active trainees (you may need to adjust the criteria)
            $activeTrainees = $this->collection->countDocuments(['status' => 'active']);
            
            // Graduates (you may need to adjust the criteria)
            $graduates = $this->collection->countDocuments(['status' => 'graduated']);
            
            // Monthly enrollments for the year
            $monthlyEnrollments = [];
            for ($month = 1; $month <= 12; $month++) {
                $startDate = new MongoDB\BSON\UTCDateTime(strtotime("$year-$month-01") * 1000);
                $endDate = new MongoDB\BSON\UTCDateTime(strtotime("$year-" . ($month + 1) . "-01") * 1000);
                
                $count = $this->collection->countDocuments([
                    'created_at' => [
                        '$gte' => $startDate,
                        '$lt' => $endDate
                    ]
                ]);
                
                $monthlyEnrollments[] = $count;
            }
            
            // Log statistics for debugging
            error_log("Statistics - Total Trainees: $totalTrainees, Enrollments: $totalEnrollment, Applications: $totalApplication, Admissions: $totalAdmission");
            
            return [
                'total' => $totalTrainees,
                'totalEnrollment' => $totalEnrollment,
                'totalApplication' => $totalApplication,
                'totalAdmission' => $totalAdmission,
                'active_trainees' => $activeTrainees,
                'graduates' => $graduates,
                'monthly_enrollments' => $monthlyEnrollments,
                'year' => $year
            ];
        } catch (Exception $e) {
            error_log("Error getting statistics: " . $e->getMessage());
            return [
                'total' => 0,
                'totalEnrollment' => 0,
                'totalApplication' => 0,
                'totalAdmission' => 0,
                'active_trainees' => 0,
                'graduates' => 0,
                'monthly_enrollments' => array_fill(0, 12, 0),
                'year' => date('Y')
            ];
        }
    }
}
