<?php

require_once __DIR__ . '/../config/database.php';

class Course {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->courses;
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
            
            // Return both success status and whether changes were made
            return [
                'success' => true,
                'modified' => $result->getModifiedCount() > 0,
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
    
    public function delete($id) {
        try {
            $result = $this->collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
}
