<?php

require_once __DIR__ . '/../app/config/database.php';

header('Content-Type: application/json');

try {
    $db = getMongoConnection();
    $graduatesCollection = $db->graduates;
    
    // Find all graduates
    $graduates = $graduatesCollection->find([]);
    
    $seen = [];
    $duplicates = [];
    
    foreach ($graduates as $graduate) {
        $key = $graduate['name'] . '|' . $graduate['trainee_id'] . '|' . $graduate['email'];
        
        if (isset($seen[$key])) {
            // This is a duplicate, mark for deletion
            $duplicates[] = $graduate['_id'];
        } else {
            // First occurrence, keep it
            $seen[$key] = $graduate['_id'];
        }
    }
    
    $deletedCount = 0;
    
    // Delete duplicates
    if (!empty($duplicates)) {
        $result = $graduatesCollection->deleteMany([
            '_id' => ['$in' => $duplicates]
        ]);
        $deletedCount = $result->getDeletedCount();
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Deleted $deletedCount duplicate graduates",
        'deleted' => $deletedCount,
        'kept' => count($seen)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
