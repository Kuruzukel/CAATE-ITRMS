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
            
            // First, try to convert string user_ids to ObjectIds
            $this->convertUserIdsToObjectIds();
            
            // Aggregate to join with trainees collection (not users)
            $pipeline = [
                [
                    '$addFields' => [
                        'user_id_obj' => [
                            '$cond' => [
                                'if' => ['$eq' => [['$type' => '$user_id'], 'string']],
                                'then' => ['$toObjectId' => '$user_id'],
                                'else' => '$user_id'
                            ]
                        ]
                    ]
                ],
                [
                    '$lookup' => [
                        'from' => 'trainees',  // Changed from 'users' to 'trainees'
                        'localField' => 'user_id_obj',
                        'foreignField' => '_id',
                        'as' => 'trainee_data'
                    ]
                ],
                [
                    '$unwind' => [
                        'path' => '$trainee_data',
                        'preserveNullAndEmptyArrays' => true
                    ]
                ],
                [
                    '$addFields' => [
                        'userData' => [
                            'trainee_id' => '$trainee_data.trainee_id',
                            'profile_image' => '$trainee_data.profile_image',
                            'email' => '$trainee_data.email',
                            'first_name' => '$trainee_data.first_name',
                            'last_name' => '$trainee_data.last_name'
                        ]
                    ]
                ],
                [
                    '$project' => [
                        'trainee_data' => 0,
                        'user_id_obj' => 0
                    ]
                ],
                [
                    '$sort' => ['created_at' => -1]
                ]
            ];
            
            $cursor = $this->collection->aggregate($pipeline);
            $results = iterator_to_array($cursor);
            
            // Debug log
            error_log("getAllWithUserData: Found " . count($results) . " applications");
            if (count($results) > 0) {
                error_log("First application user_id: " . json_encode($results[0]['user_id'] ?? 'null'));
                error_log("First application userData: " . json_encode($results[0]['userData'] ?? 'null'));
            }
            
            return $results;
        } catch (Exception $e) {
            error_log('Error in getAllWithUserData: ' . $e->getMessage());
            return $this->all();
        }
    }
    
    private function convertUserIdsToObjectIds() {
        try {
            // Find all applications with string user_ids and convert them
            $applications = $this->collection->find([
                'user_id' => ['$type' => 'string']
            ]);
            
            foreach ($applications as $app) {
                if (isset($app['user_id']) && is_string($app['user_id'])) {
                    try {
                        $objectId = new MongoDB\BSON\ObjectId($app['user_id']);
                        $this->collection->updateOne(
                            ['_id' => $app['_id']],
                            ['$set' => ['user_id' => $objectId]]
                        );
                    } catch (Exception $e) {
                        error_log('Could not convert user_id to ObjectId: ' . $e->getMessage());
                    }
                }
            }
        } catch (Exception $e) {
            error_log('Error converting user_ids: ' . $e->getMessage());
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
