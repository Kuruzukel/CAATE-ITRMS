<?php
/**
 * Debug script to check course ID matching between registrations and courses
 */

// Load composer autoloader
$autoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
];

$autoloaderFound = false;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $autoloaderFound = true;
        break;
    }
}

header('Content-Type: application/json');

if (!$autoloaderFound) {
    echo json_encode(['error' => 'Composer autoloader not found']);
    exit;
}

try {
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    $db = $client->selectDatabase('CAATE-ITRMS');
    
    $result = [
        'courses' => [],
        'registrations' => [],
        'matching_issues' => []
    ];
    
    // Get all courses
    $courses = $db->courses->find()->toArray();
    foreach ($courses as $course) {
        $result['courses'][] = [
            '_id' => (string)$course['_id'],
            'title' => $course['title'] ?? 'N/A',
            'code' => $course['code'] ?? 'N/A'
        ];
    }
    
    // Get all registrations with status approved
    $registrations = $db->registrations->find(['status' => 'approved'])->toArray();
    foreach ($registrations as $reg) {
        $courseId = $reg['selectedCourseId'] ?? 'N/A';
        $courseName = $reg['selectedCourse'] ?? 'N/A';
        
        $result['registrations'][] = [
            '_id' => (string)$reg['_id'],
            'traineeFullName' => $reg['traineeFullName'] ?? 'N/A',
            'selectedCourse' => $courseName,
            'selectedCourseId' => $courseId,
            'status' => $reg['status'] ?? 'N/A'
        ];
        
        // Check if course ID exists in courses collection
        if ($courseId !== 'N/A') {
            try {
                $course = $db->courses->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                if (!$course) {
                    $result['matching_issues'][] = [
                        'registration_id' => (string)$reg['_id'],
                        'trainee' => $reg['traineeFullName'] ?? 'N/A',
                        'issue' => 'Course ID not found in courses collection',
                        'selectedCourseId' => $courseId,
                        'selectedCourseName' => $courseName
                    ];
                }
            } catch (Exception $e) {
                $result['matching_issues'][] = [
                    'registration_id' => (string)$reg['_id'],
                    'trainee' => $reg['traineeFullName'] ?? 'N/A',
                    'issue' => 'Invalid course ID format',
                    'selectedCourseId' => $courseId,
                    'selectedCourseName' => $courseName
                ];
            }
        }
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
