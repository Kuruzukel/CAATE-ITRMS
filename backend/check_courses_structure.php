<?php

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $collection = $db->courses;
    
    // Get one course to see its structure
    $course = $collection->findOne(['course_code' => 'NC II - SOCBCN220']);
    
    if ($course) {
        echo "Current Course Structure:\n";
        echo "========================\n\n";
        print_r($course);
    } else {
        echo "No course found.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
