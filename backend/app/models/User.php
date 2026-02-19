<?php

require_once __DIR__ . '/../config/database.php';

class User {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->users;
    }
    
    public function all() {
        $cursor = $this->collection->find();
        $users = [];
        
        foreach ($cursor as $document) {
            $users[] = [
                'id' => (string)$document['_id'],
                'name' => $document['name'] ?? '',
                'email' => $document['email'] ?? '',
                'created_at' => $document['created_at'] ?? null
            ];
        }
        
        return $users;
    }
    
    public function findById($id) {
        try {
            $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $document ? (array)$document : null;
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function findByEmail($email) {
        $document = $this->collection->findOne(['email' => $email]);
        return $document ? (array)$document : null;
    }
    
    public function create($data) {
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
