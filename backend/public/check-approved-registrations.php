<?php
// Load composer autoloader
$autoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
];

foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        break;
    }
}

header('Content-Type: application/json');

try {
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    $db = $client->selectDatabase('CAATE-ITRMS');
    
    $registrations = $db->registrations->find()->toArray();
    
    $result = [];
    foreach ($registrations as $reg) {
        $result[] = [
            '_id' => (string)$reg['_id'],
            'traineeFullName' => $reg['traineeFullName'] ?? 'N/A',
            'selectedCourse' => $reg['selectedCourse'] ?? 'N/A',
            'selectedCourseId' => $reg['selectedCourseId'] ?? 'N/A',
            'status' => $reg['status'] ?? 'N/A'
        ];
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
