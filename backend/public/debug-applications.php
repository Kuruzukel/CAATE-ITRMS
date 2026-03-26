<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../app/config/database.php';

try {
    $db = getMongoConnection();
    $applications = $db->applications->find([], ['limit' => 5])->toArray();
    
    echo json_encode([
        'success' => true,
        'count' => count($applications),
        'applications' => $applications
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
