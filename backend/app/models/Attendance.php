<?php

require_once __DIR__ . '/../config/database.php';

class Attendance {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->attendance;
    }
    
    public function all() {
        $cursor = $this->collection->find();
        return iterator_to_array($cursor);
    }
    
    public function findById($id) {
        try {
            return $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function findByTraineeId($traineeId) {
        return $this->collection->find(['trainee_id' => $traineeId])->toArray();
    }
    
    public function create($data) {
        $data['date'] = $data['date'] ?? new MongoDB\BSON\UTCDateTime();
        $data['status'] = $data['status'] ?? 'present';
        $result = $this->collection->insertOne($data);
        return (string)$result->getInsertedId();
    }
    
    public function update($id, $data) {
        try {
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
}
