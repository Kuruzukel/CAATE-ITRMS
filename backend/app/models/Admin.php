<?php

require_once __DIR__ . '/../config/database.php';

class Admin {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->admins;
    }
    
    public function all() {
        $cursor = $this->collection->find();
        $admins = [];
        
        foreach ($cursor as $document) {
            $admins[] = [
                'id' => (string)$document['_id'],
                'name' => $document['name'] ?? '',
                'email' => $document['email'] ?? '',
                'username' => $document['username'] ?? '',
                'role' => $document['role'] ?? 'admin',
                'firstName' => $document['first_name'] ?? '',
                'secondName' => $document['second_name'] ?? '',
                'middleName' => $document['middle_name'] ?? '',
                'lastName' => $document['last_name'] ?? '',
                'suffix' => $document['suffix'] ?? '',
                'phone' => $document['phone'] ?? '',
                'address' => $document['address'] ?? '',
                'created_at' => $document['created_at'] ?? null,
                'updated_at' => $document['updated_at'] ?? null
            ];
        }
        
        return $admins;
    }
    
    public function findById($id) {
        try {
            $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $document ? (array)$document : null;
        } catch (Exception $e) {
            error_log("Admin::findById - Exception: " . $e->getMessage());
            error_log("Admin::findById - Stack trace: " . $e->getTraceAsString());
            return null;
        }
    }
    
    public function findByEmail($email) {
        $document = $this->collection->findOne(['email' => $email]);
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
    
    public function findByUsername($username) {
        $document = $this->collection->findOne(['username' => $username]);
        return $document ? (array)$document : null;
    }
    
    public function create($data) {
        // Add timestamps
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        $result = $this->collection->insertOne($data);
        return (string)$result->getInsertedId();
    }
    
    public function update($id, $data) {
        try {
            // Test database connection first
            $testResult = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            if (!$testResult) {
                error_log("Admin::update - ERROR: Document not found with ID: $id");
                return false;
            }
            
            error_log("Admin::update - Document found, proceeding with update");
            error_log("Admin::update - Current document: " . json_encode($testResult));
            
            // Add updated timestamp
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            error_log("Admin::update - ID: $id");
            error_log("Admin::update - Data to save: " . json_encode($data));
            error_log("Admin::update - Data keys: " . implode(', ', array_keys($data)));
            
            // Log the exact MongoDB query
            error_log("Admin::update - MongoDB query: updateOne(['_id' => ObjectId('$id')], ['\$set' => " . json_encode($data) . "])");
            
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $data]
            );
            
            $success = $result->getModifiedCount() > 0;
            error_log("Admin::update - Modified count: " . $result->getModifiedCount());
            error_log("Admin::update - Matched count: " . $result->getMatchedCount());
            error_log("Admin::update - Success: " . ($success ? 'true' : 'false'));
            
            // Check the document after update
            $updatedDocument = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            error_log("Admin::update - Document after update: " . json_encode($updatedDocument));
            
            // If no documents were modified but one was matched, it might mean no actual changes
            if ($result->getMatchedCount() > 0 && $result->getModifiedCount() === 0) {
                error_log("Admin::update - Document matched but not modified (no changes detected or data identical)");
                return true; // Consider this a success since the document exists
            }
            
            return $success;
        } catch (Exception $e) {
            error_log("Admin::update - Exception: " . $e->getMessage());
            error_log("Admin::update - Stack trace: " . $e->getTraceAsString());
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