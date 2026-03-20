<?php
/**
 * Get available years from enrollment data
 * Returns years that have registrations, applications, or admissions
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    $registrationCollection = $db->registrations;
    $applicationCollection = $db->applications;
    $admissionCollection = $db->admissions;
    
    $years = [];
    
    // Get years from registrations
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
    
    // Get years from applications
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
    
    // Get years from admissions
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
    
    // Convert to array and sort descending
    $yearsList = array_keys($years);
    rsort($yearsList);
    
    // If no years found, add current year
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
