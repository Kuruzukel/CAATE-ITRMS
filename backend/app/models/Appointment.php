<?php

require_once __DIR__ . '/../config/database.php';

class Appointment {
    private $collection;
    
    public function __construct() {
        $database = Database::getInstance();
        $this->collection = $database->getCollection('appointments');
    }
    
    public function all() {
        $cursor = $this->collection->find([], ['sort' => ['createdAt' => -1]]);
        return iterator_to_array($cursor);
    }
    
    public function findById($id) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            return $this->collection->findOne(['_id' => $objectId]);
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function create($data) {
        $result = $this->collection->insertOne($data);
        return (string) $result->getInsertedId();
    }
    
    public function update($id, $data) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            $result = $this->collection->updateOne(
                ['_id' => $objectId],
                ['$set' => $data]
            );
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function delete($id) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            $result = $this->collection->deleteOne(['_id' => $objectId]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function getStatistics() {
        $total = $this->collection->countDocuments();
        $confirmed = $this->collection->countDocuments(['status' => 'Approved']);
        $pending = $this->collection->countDocuments(['status' => 'Pending']);
        $cancelled = $this->collection->countDocuments(['status' => 'Cancelled']);
        
        return [
            'total' => $total,
            'confirmed' => $confirmed,
            'pending' => $pending,
            'cancelled' => $cancelled
        ];
    }
}
