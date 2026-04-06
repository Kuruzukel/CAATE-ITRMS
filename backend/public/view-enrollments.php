<?php
/**
 * View all enrollment data to diagnose the issue
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
    $db = $client->selectDatabase('CAATE-ITRMS'); // Use the correct database name
    
    $result = [
        'registrations' => [],
        'applications' => [],
        'admissions' => [],
        'enrollments' => []
    ];
    
    // Get registrations
    $registrations = $db->registrations->find([], ['limit' => 20])->toArray();
    foreach ($registrations as $reg) {
        $result['registrations'][] = [
            'id' => (string)$reg['_id'],
            'traineeFullName' => $reg['traineeFullName'] ?? 'N/A',
            'selectedCourse' => $reg['selectedCourse'] ?? 'N/A',
            'selectedCourseId' => $reg['selectedCourseId'] ?? 'N/A',
            'userId' => $reg['userId'] ?? 'N/A',
            'status' => $reg['status'] ?? 'N/A',
            'createdAt' => isset($reg['createdAt']) ? (string)$reg['createdAt'] : 'N/A'
        ];
    }
    
    // Get applications
    $applications = $db->applications->find([], ['limit' => 20])->toArray();
    foreach ($applications as $app) {
        $result['applications'][] = [
            'id' => (string)$app['_id'],
            'trainee_id' => $app['trainee_id'] ?? 'N/A',
            'course_id' => $app['course_id'] ?? 'N/A',
            'status' => $app['status'] ?? 'N/A',
            'created_at' => isset($app['created_at']) ? (string)$app['created_at'] : 'N/A'
        ];
    }
    
    // Get admissions
    $admissions = $db->admissions->find([], ['limit' => 20])->toArray();
    foreach ($admissions as $adm) {
        $result['admissions'][] = [
            'id' => (string)$adm['_id'],
            'trainee_id' => $adm['trainee_id'] ?? 'N/A',
            'course_id' => $adm['course_id'] ?? 'N/A',
            'status' => $adm['status'] ?? 'N/A',
            'created_at' => isset($adm['created_at']) ? (string)$adm['created_at'] : 'N/A'
        ];
    }
    
    // Get enrollments (if collection exists)
    $enrollments = $db->enrollments->find([], ['limit' => 20])->toArray();
    foreach ($enrollments as $enr) {
        $result['enrollments'][] = [
            'id' => (string)$enr['_id'],
            'trainee_id' => $enr['trainee_id'] ?? 'N/A',
            'course_id' => $enr['course_id'] ?? 'N/A',
            'status' => $enr['status'] ?? 'N/A',
            'enrollment_date' => isset($enr['enrollment_date']) ? (string)$enr['enrollment_date'] : 'N/A'
        ];
    }
    
    $result['counts'] = [
        'registrations' => count($result['registrations']),
        'applications' => count($result['applications']),
        'admissions' => count($result['admissions']),
        'enrollments' => count($result['enrollments'])
    ];
    
    echo json_encode($result, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
