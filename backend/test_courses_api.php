<?php

// Test script to check courses API
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/models/Course.php';

echo "=== Testing Courses API ===\n\n";

try {
    // Test 1: Check database connection
    echo "1. Testing database connection...\n";
    $db = getMongoConnection();
    echo "   ✓ Database connected successfully\n\n";
    
    // Test 2: Check courses collection
    echo "2. Checking courses collection...\n";
    $courseModel = new Course();
    $courses = $courseModel->all();
    $courseCount = count($courses);
    echo "   ✓ Found {$courseCount} courses in database\n\n";
    
    // Test 3: Display courses
    if ($courseCount > 0) {
        echo "3. Courses in database:\n";
        foreach ($courses as $course) {
            $id = isset($course->_id) ? (string)$course->_id : 'N/A';
            $title = isset($course->title) ? $course->title : 'N/A';
            $badge = isset($course->badge) ? $course->badge : 'N/A';
            echo "   - [{$badge}] {$title} (ID: {$id})\n";
        }
    } else {
        echo "3. ⚠ No courses found!\n";
        echo "   Run: php backend/seed_courses.php\n";
    }
    
    echo "\n=== Test Complete ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
