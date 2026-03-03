<?php

/**
 * Add Passwords to Existing Trainees
 * This script adds a default password to all trainees that don't have one
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $traineesCollection = $db->trainees;
    
    // Default password (should be changed by users)
    $defaultPassword = 'trainee123';
    $hashedPassword = password_hash($defaultPassword, PASSWORD_BCRYPT);
    
    // Find all trainees without a password field
    $traineesWithoutPassword = $traineesCollection->find([
        '$or' => [
            ['password' => ['$exists' => false]],
            ['password' => null],
            ['password' => '']
        ]
    ]);
    
    $count = 0;
    $updated = [];
    
    foreach ($traineesWithoutPassword as $trainee) {
        // Update trainee with password
        $result = $traineesCollection->updateOne(
            ['_id' => $trainee['_id']],
            [
                '$set' => [
                    'password' => $hashedPassword,
                    'password_updated_at' => new MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
        
        if ($result->getModifiedCount() > 0) {
            $count++;
            $updated[] = [
                'id' => (string)$trainee['_id'],
                'name' => $trainee['name'] ?? $trainee['fullName'] ?? 'Unknown',
                'email' => $trainee['email'] ?? 'No email'
            ];
        }
    }
    
    if ($count > 0) {
        echo "✓ Successfully added passwords to {$count} trainee(s)\n\n";
        echo "Default Password: {$defaultPassword}\n";
        echo "⚠️  Users should change this password after first login!\n\n";
        
        echo "Updated Trainees:\n";
        echo "==================\n";
        foreach ($updated as $trainee) {
            echo "- {$trainee['name']} ({$trainee['email']})\n";
        }
    } else {
        echo "✓ All trainees already have passwords!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
