<?php

require_once __DIR__ . '/../config/database.php';

class Trainee {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->trainees;
    }
    
    public function all() {
        $trainees = $this->collection->find()->toArray();
        return array_map(function($trainee) {
            $trainee['_id'] = (string)$trainee['_id'];
            return $trainee;
        }, $trainees);
    }
    
    public function findById($id) {
        try {
            $trainee = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            if ($trainee) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function create($data) {
        try {
            $data['created_at'] = new MongoDB\BSON\UTCDateTime();
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->insertOne($data);
            return (string)$result->getInsertedId();
        } catch (Exception $e) {
            error_log('Trainee creation error: ' . $e->getMessage());
            throw new Exception('Failed to create trainee: ' . $e->getMessage());
        }
    }
    
    public function update($id, $data) {
        try {
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $data]
            );
            
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            return false;
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
    
    public function getStatistics() {
        $db = getMongoConnection();
        
        // Get total trainees
        $total = $this->collection->countDocuments();
        
        // Get total enrollment records
        $totalEnrollment = $db->enrollments->countDocuments();
        
        // Get total application records
        $totalApplication = $db->applications->countDocuments();
        
        // Get total admission records
        $totalAdmission = $db->admissions->countDocuments();
        
        // Get today's enrollments
        $todayStart = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
        $todayEnd = new MongoDB\BSON\UTCDateTime(strtotime('tomorrow') * 1000);
        $todayEnrollments = $db->enrollments->countDocuments([
            'created_at' => [
                '$gte' => $todayStart,
                '$lt' => $todayEnd
            ]
        ]);
        
        // Get this month's enrollments
        $monthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
        $monthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of next month') * 1000);
        $monthEnrollments = $db->enrollments->countDocuments([
            'created_at' => [
                '$gte' => $monthStart,
                '$lt' => $monthEnd
            ]
        ]);
        
        // Get pending enrollments (assuming status field exists)
        $pendingEnrollments = $db->enrollments->countDocuments([
            'status' => ['$in' => ['pending', 'Pending']]
        ]);
        
        // Get approved enrollments
        $approvedEnrollments = $db->enrollments->countDocuments([
            'status' => ['$in' => ['approved', 'Approved', 'enrolled', 'Enrolled']]
        ]);
        
        // Calculate percentage increase for today (comparing to yesterday)
        $yesterdayStart = new MongoDB\BSON\UTCDateTime(strtotime('yesterday') * 1000);
        $yesterdayEnd = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
        $yesterdayEnrollments = $db->enrollments->countDocuments([
            'created_at' => [
                '$gte' => $yesterdayStart,
                '$lt' => $yesterdayEnd
            ]
        ]);
        
        $todayPercentageIncrease = 0;
        if ($yesterdayEnrollments > 0) {
            $todayPercentageIncrease = (($todayEnrollments - $yesterdayEnrollments) / $yesterdayEnrollments) * 100;
        } elseif ($todayEnrollments > 0) {
            $todayPercentageIncrease = 100;
        }
        
        // Calculate percentage increase for this month (comparing to last month)
        $lastMonthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of last month') * 1000);
        $lastMonthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
        $lastMonthEnrollments = $db->enrollments->countDocuments([
            'created_at' => [
                '$gte' => $lastMonthStart,
                '$lt' => $lastMonthEnd
            ]
        ]);
        
        $monthPercentageIncrease = 0;
        if ($lastMonthEnrollments > 0) {
            $monthPercentageIncrease = (($monthEnrollments - $lastMonthEnrollments) / $lastMonthEnrollments) * 100;
        } elseif ($monthEnrollments > 0) {
            $monthPercentageIncrease = 100;
        }
        
        return [
            'total' => $total,
            'totalEnrollment' => $totalEnrollment,
            'totalApplication' => $totalApplication,
            'totalAdmission' => $totalAdmission,
            'todayEnrollments' => $todayEnrollments,
            'monthEnrollments' => $monthEnrollments,
            'pendingEnrollments' => $pendingEnrollments,
            'approvedEnrollments' => $approvedEnrollments,
            'todayPercentageIncrease' => round($todayPercentageIncrease, 1),
            'monthPercentageIncrease' => round($monthPercentageIncrease, 1)
        ];
    }
}
