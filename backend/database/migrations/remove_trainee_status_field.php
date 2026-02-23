<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Migration: Remove status field from trainees collection
 * This script removes the status field from all trainee documents
 */

try {
    $db = getMongoConnection();
    $traineesCollection = $db->trainees;
    
    echo "Removing status field from trainees collection...\n\n";
    
    // Count documents with status field
    $countWithStatus = $traineesCollection->countDocuments(['status' => ['$exists' => true]]);
    echo "Found {$countWithStatus} trainee(s) with status field\n";
    
    if ($countWithStatus > 0) {
        // Remove status field from all documents
        $result = $traineesCollection->updateMany(
            ['status' => ['$exists' => true]],
            ['$unset' => ['status' => '']]
        );
        
        echo "✓ Removed status field from {$result->getModifiedCount()} trainee(s)\n";
    } else {
        echo "✓ No trainees with status field found\n";
    }
    
    // Drop status index if it exists
    echo "\nRemoving status index from trainees collection...\n";
    try {
        $traineesCollection->dropIndex('status_1');
        echo "✓ Dropped status index\n";
    } catch (Exception $e) {
        echo "  Status index does not exist or already removed\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "Total trainees in collection: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
