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
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        $result = $this->collection->insertOne($data);
        return (string)$result->getInsertedId();
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
        $total = $this->collection->countDocuments();
        $active = $this->collection->countDocuments(['status' => 'active']);
        $enrolled = $this->collection->countDocuments(['status' => 'enrolled']);
        $completed = $this->collection->countDocuments(['status' => 'completed']);
        $pending = $this->collection->countDocuments(['status' => 'pending']);
        
        return [
            'total' => $total,
            'active' => $active,
            'enrolled' => $enrolled,
            'completed' => $completed,
            'pending' => $pending
        ];
    }
}
