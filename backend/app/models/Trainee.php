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
        return $document ? (array)$document : null;
    }
    
    public function findByUsername($username) {
        $document = $this->collection->findOne(['username' => $username]);
        return $document ? (array)$document : null;
    }
    
    public function findByEmailOrUsername($identifier) {
        $document = $this->collection->findOne([
            '$or' => [
                ['email' => $identifier],
                ['username' => $identifier]
            ]
        ]);
        return $document ? (array)$document : null;
    }
    
    public function findById($id) {
        try {
            $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $document ? (array)$document : null;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function all() {
        try {
            $cursor = $this->collection->find();
            $trainees = [];
            foreach ($cursor as $document) {
                $trainees[] = (array)$document;
            }
            return $trainees;
        } catch (Exception $e) {
            error_log("Error fetching all trainees: " . $e->getMessage());
            return [];
        }
    }
    
    public function create($data) {
        try {
            // Hash password if provided
            if (isset($data['password'])) {
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
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
    
    public function update($id, $data) {
        try {
            // Remove password from update if empty
            if (isset($data['password']) && empty($data['password'])) {
                unset($data['password']);
            } elseif (isset($data['password'])) {
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
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
            
            // Total trainees
            $totalTrainees = $this->collection->countDocuments();
            
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
            
            return [
                'total_trainees' => $totalTrainees,
                'active_trainees' => $activeTrainees,
                'graduates' => $graduates,
                'monthly_enrollments' => $monthlyEnrollments,
                'year' => $year
            ];
        } catch (Exception $e) {
            error_log("Error getting statistics: " . $e->getMessage());
            return [
                'total_trainees' => 0,
                'active_trainees' => 0,
                'graduates' => 0,
                'monthly_enrollments' => array_fill(0, 12, 0),
                'year' => date('Y')
            ];
        }
    }
}
