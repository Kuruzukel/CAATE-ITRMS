<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "Starting migration: Remove status field from trainees collection...\n\n";
    
    $traineesCollection = $db->trainees;
    
    $countWithStatus = $traineesCollection->countDocuments(['status' => ['$exists' => true]]);
    
    echo "Found {$countWithStatus} trainee documents with status field\n";
    
    if ($countWithStatus > 0) {
        $result = $traineesCollection->updateMany(
            ['status' => ['$exists' => true]],
            ['$unset' => ['status' => '']]
        );
        
        echo "âœ“ Removed status field from {$result->getModifiedCount()} documents\n";
    } else {
        echo "âœ“ No documents found with status field\n";
    }
    
    try {
        $traineesCollection->dropIndex('status_1');
        echo "âœ“ Dropped status index from trainees collection\n";
    } catch (Exception $e) {
        echo "  Status index does not exist or already dropped\n";
    }
    
    echo "\nâœ… Migration completed successfully!\n";
    echo "Total trainees in database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "âŒ Error: " . $e->getMessage() . "\n";
    exit(1);
}
