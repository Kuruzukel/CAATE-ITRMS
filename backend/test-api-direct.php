<?php
// Simulate API call
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['year'] = 2026;

require_once __DIR__ . '/app/models/Trainee.php';

$traineeModel = new Trainee();
$stats = $traineeModel->getStatistics(2026);

echo "=== API RESPONSE TEST ===\n\n";
echo "Top Courses Data:\n";
echo json_encode($stats['topCourses'], JSON_PRETTY_PRINT);
