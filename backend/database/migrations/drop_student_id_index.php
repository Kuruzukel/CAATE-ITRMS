<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Drop the student_id unique index from trainees collection
 * This is needed because we've migrated to trainee_id
 */

try {
    $db = getMongoConnection();
    
    echo "Dropping student_id index from trainees collection...\n\n";
    
    $traineesCollection = $db->trainees;
    
    // List all indexes
    echo "Current indexes:\n";
    $indexes = $traineesCollection->listIndexes();
    foreach ($indexes as $index) {
        echo "  - {$index->getName()}\n";
    }
    
    echo "\n";
    
    // Try to drop the student_id index
    try {
        $traineesCollection->dropIndex('student_id_1');
        echo "✅ Successfully dropped student_id_1 index\n";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'index not found') !== false) {
            echo "ℹ️  Index student_id_1 does not exist (already removed)\n";
        } else {
            throw $e;
        }
    }
    
    echo "\nRemaining indexes:\n";
    $indexes = $traineesCollection->listIndexes();
    foreach ($indexes as $index) {
        echo "  - {$index->getName()}\n";
    }
    
    echo "\n✅ Migration completed!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
