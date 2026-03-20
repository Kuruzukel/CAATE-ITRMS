<?php
require_once __DIR__ . '/app/models/Trainee.php';

$traineeModel = new Trainee();
$stats = $traineeModel->getStatistics();

echo "=== TOP COURSES TEST ===\n\n";

if (isset($stats['topCourses'])) {
    echo "Top Courses Found: " . count($stats['topCourses']) . "\n\n";
    
    foreach ($stats['topCourses'] as $course) {
        echo "Course: " . $course['name'] . "\n";
        echo "Image: " . $course['image'] . "\n";
        echo "Hours: " . $course['hours'] . "\n";
        echo "Enrollments: " . $course['enrollmentCount'] . "\n\n";
    }
} else {
    echo "No topCourses data found\n";
}

echo "\n=== FULL STATS KEYS ===\n";
print_r(array_keys($stats));
