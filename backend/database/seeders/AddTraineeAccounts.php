<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Add 10 Sample Trainee Accounts (matching John Aeron's structure)
 */

try {
    $db = getMongoConnection();
    
    echo "Adding 10 Sample Trainee Accounts...\n\n";
    
    $traineesCollection = $db->trainees;
    
    $startNumber = 1;
    
    $firstNames = ['Maria', 'Juan', 'Sofia', 'Miguel', 'Isabella', 'Carlos', 'Gabriela', 'Diego', 'Valentina', 'Luis'];
    $lastNames = ['Santos', 'Reyes', 'Cruz', 'Garcia', 'Mendoza', 'Torres', 'Ramos', 'Flores', 'Rivera', 'Morales'];
    
    $created = 0;
    
    for ($i = 0; $i < 10; $i++) {
        $traineeNumber = str_pad($startNumber + $i, 3, '0', STR_PAD_LEFT);
        $traineeId = "TRN-2026-{$traineeNumber}";
        $firstName = $firstNames[$i];
        $lastName = $lastNames[$i];
        $email = strtolower($firstName . '.' . $lastName . '@example.com');
        $phone = '0917' . str_pad(rand(1000000, 9999999), 7, '0', STR_PAD_LEFT);
        
        // Check if trainee already exists
        $existing = $traineesCollection->findOne(['trainee_id' => $traineeId]);
        if ($existing) {
            echo "  ⚠ Skipped: {$traineeId} already exists\n";
            continue;
        }
        
        $trainee = [
            'first_name' => $firstName,
            'second_name' => '',
            'last_name' => $lastName,
            'middle_name' => '',
            'suffix' => '',
            'email' => $email,
            'phone' => $phone,
            'status' => 'pending',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime(),
            'trainee_id' => $traineeId
        ];
        
        $traineesCollection->insertOne($trainee);
        echo "  ✓ Created: {$firstName} {$lastName} ({$traineeId})\n";
        $created++;
    }
    
    echo "\n✅ Successfully created {$created} trainee accounts!\n";
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "TRAINEE ACCOUNTS SUMMARY\n";
    echo str_repeat("=", 80) . "\n";
    echo "Structure: Same as John Aeron Del Rosaruu (TRN-2026-001)\n";
    echo "Field Order: first_name, second_name, last_name, middle_name, suffix,\n";
    echo "             email, phone, status, created_at, updated_at, trainee_id\n";
    echo "No address field included\n";
    echo str_repeat("=", 80) . "\n";
    
    echo "\nTotal trainees in database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nIf you see a duplicate key error on student_id, run this first:\n";
    echo "php database/migrations/drop_student_id_index.php\n";
    exit(1);
}
