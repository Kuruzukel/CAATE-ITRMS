<?php

require_once __DIR__ . '/../config/database.php';

class Application {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->applications;
    }
    
    public function all() {
        $cursor = $this->collection->find();
        return iterator_to_array($cursor);
    }
    
    public function getAll() {
        return $this->all();
    }
    
    public function getAllWithUserData() {
        try {
            $db = getMongoConnection();
            
            // Aggregate to join with users collection
            $pipeline = [
                [
                    '$lookup' => [
                        'from' => 'users',
                        'localField' => 'user_id',
                        'foreignField' => '_id',
                        'as' => 'user_data'
                    ]
                ],
                [
                    '$unwind' => [
                        'path' => '$user_data',
                        'preserveNullAndEmptyArrays' => true
                    ]
                ],
                [
                    '$addFields' => [
                        'userData' => [
                            'trainee_id' => '$user_data.trainee_id',
                            'profile_image' => '$user_data.profile_image',
                            'email' => '$user_data.email'
                        ]
                    ]
                ],
                [
                    '$project' => [
                        'user_data' => 0
                    ]
                ],
                [
                    '$sort' => ['created_at' => -1]
                ]
            ];
            
            $cursor = $this->collection->aggregate($pipeline);
            return iterator_to_array($cursor);
        } catch (Exception $e) {
            error_log('Error in getAllWithUserData: ' . $e->getMessage());
            return $this->all();
        }
    }
    
    public function findById($id) {
        try {
            return $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function getById($id) {
        return $this->findById($id);
    }
    
    public function create($data) {
        // Add timestamps
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        // Set default status
        $data['status'] = $data['status'] ?? 'pending';
        
        // Insert the document
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
