<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../app/config/database.php';

try {
    $db = getMongoConnection();
    
    $registrationCollection = $db->registrations;
    $applicationCollection = $db->applications;
    $admissionCollection = $db->admissions;
    
    $years = [];
    
    $registrations = $registrationCollection->find(
        [],
        ['projection' => ['created_at' => 1]]
    );
    
    foreach ($registrations as $doc) {
        if (isset($doc['created_at'])) {
            $year = (int)$doc['created_at']->toDateTime()->format('Y');
            $years[$year] = true;
        }
    }
    
    $applications = $applicationCollection->find(
        [],
        ['projection' => ['created_at' => 1]]
    );
    
    foreach ($applications as $doc) {
        if (isset($doc['created_at'])) {
            $year = (int)$doc['created_at']->toDateTime()->format('Y');
            $years[$year] = true;
        }
    }
    
    $admissions = $admissionCollection->find(
        [],
        ['projection' => ['created_at' => 1]]
    );
    
    foreach ($admissions as $doc) {
        if (isset($doc['created_at'])) {
            $year = (int)$doc['created_at']->toDateTime()->format('Y');
            $years[$year] = true;
        }
    }
    
    $yearsList = array_keys($years);
    rsort($yearsList);
    
    if (empty($yearsList)) {
        $yearsList = [(int)date('Y')];
    }
    
    echo json_encode([
        'success' => true,
        'years' => $yearsList
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
