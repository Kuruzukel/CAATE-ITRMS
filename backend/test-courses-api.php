<?php
/**
 * Test script to check courses API
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== TESTING COURSES API ===\n\n";
    
    // Check if courses collection exists and has data
    $coursesCollection = $db->courses;
    $courseCount = $coursesCollection->countDocuments();
    
    echo "Total courses in database: $courseCount\n\n";
    
    if ($courseCount > 0) {
        echo "Sample courses:\n";
        $courses = $coursesCollection->find([], ['limit' => 5])->toArray();
        
        foreach ($courses as $course) {
            $id = (string)$course['_id'];
            $title = $course['title'] ?? 'No title';
            $badge = $course['badge'] ?? $course['course_code'] ?? 'No badge';
            $status = $course['enrollment_status'] ?? 'No status';
            
            echo "  - ID: $id\n";
            echo "    Title: $title\n";
            echo "    Badge: $badge\n";
            echo "    Status: $status\n\n";
        }
    } else {
        echo "⚠️  No courses found in database!\n";
        echo "You may need to seed the database with course data.\n";
    }
    
    echo "\n=== TEST COMPLETED ===\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
