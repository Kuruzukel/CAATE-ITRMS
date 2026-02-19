<?php

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $collection = $db->courses;
    
    echo "Checking indexes on courses collection...\n\n";
    
    // List all indexes
    $indexes = $collection->listIndexes();
    echo "Current indexes:\n";
    foreach ($indexes as $index) {
        echo "  - " . $index->getName() . "\n";
        if (isset($index['key'])) {
            foreach ($index['key'] as $field => $direction) {
                echo "    Field: $field\n";
            }
        }
    }
    
    echo "\n";
    
    // Drop the problematic index
    echo "Dropping course_code_1 index...\n";
    try {
        $collection->dropIndex('course_code_1');
        echo "✓ Index dropped successfully!\n";
    } catch (Exception $e) {
        echo "Note: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
    echo "========================================\n";
    echo "Index fix completed!\n";
    echo "========================================\n";
    echo "\nYou can now run the seed script again.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
