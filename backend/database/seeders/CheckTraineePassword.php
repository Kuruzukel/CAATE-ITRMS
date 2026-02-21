<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

try {
    $db = getMongoConnection();
    $traineesCollection = $db->trainees;
    
    $trainee = $traineesCollection->findOne(['trainee_id' => 'TRN-2026-001']);
    
    if ($trainee) {
        echo "Trainee: {$trainee['first_name']} {$trainee['last_name']}\n";
        echo "Trainee ID: {$trainee['trainee_id']}\n";
        echo "Email: {$trainee['email']}\n";
        echo "Password: " . ($trainee['password'] ?? 'NOT SET') . "\n";
    } else {
        echo "Trainee TRN-2026-001 not found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
