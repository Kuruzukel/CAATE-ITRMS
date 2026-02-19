<?php

require_once __DIR__ . '/../config/database.php';

class Schedule {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->schedules;
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
    
    public function findByCourseId($courseId) {
        return $this->collection->find(['course_id' => $courseId])->toArray();
    }
    
    public function create($data) {
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
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
}
