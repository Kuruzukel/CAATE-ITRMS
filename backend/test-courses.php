<?php
require_once __DIR__ . '/app/config/database.php';

$db = getMongoConnection();
$coursesCollection = $db->courses;

echo "=== COURSES TEST ===\n\n";

// Get one course to see structure
$course = $coursesCollection->findOne();
if ($course) {
    echo "Sample Course Structure:\n";
    print_r((array)$course);
} else {
    echo "No courses found in database\n";
}

echo "\n=== ALL COURSES ===\n";
$allCourses = $coursesCollection->find();
foreach ($allCourses as $c) {
    $courseArray = (array)$c;
    echo "\nCourse: " . ($courseArray['name'] ?? 'N/A') . "\n";
    echo "Image: " . ($courseArray['image'] ?? 'N/A') . "\n";
    echo "Hours: " . ($courseArray['hours'] ?? 'N/A') . "\n";
}
