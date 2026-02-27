<?php
// Simple test script to check if appointments API is working

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/models/Appointment.php';

try {
    $appointmentModel = new Appointment();
    $appointments = $appointmentModel->all();
    
    echo json_encode([
        'success' => true,
        'message' => 'Appointments API is working',
        'count' => count($appointments),
        'data' => $appointments
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
