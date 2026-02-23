<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Migration: Remove status field from trainees collection
 * This script removes the status field from all trainee documents
 */

try {
    $db = getMongoConnection();
    
    echo "Starting migration: Remove status field from trainees collection...\n\n";
    
    $traineesCollection = $db->trainees;
    
    // Count documents with status field
    $countWithStatus = $traineesCollection->countDocuments(['status' => ['$exists' => true]]);
    
    echo "Found {$countWithStatus} trainee documents with status field\n";
    
    if ($countWithStatus > 0) {
        // Remove status field from all documents
        $result = $traineesCollection->updateMany(
            ['status' => ['$exists' => true]],
            ['$unset' => ['status' => '']]
        );
        
        echo "✓ Removed status field from {$result->getModifiedCount()} documents\n";
    } else {
        echo "✓ No documents found with status field\n";
    }
    
    // Drop the status index if it exists
    try {
        $traineesCollection->dropIndex('status_1');
        echo "✓ Dropped status index from trainees collection\n";
    } catch (Exception $e) {
        echo "  Status index does not exist or already dropped\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "Total trainees in database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
