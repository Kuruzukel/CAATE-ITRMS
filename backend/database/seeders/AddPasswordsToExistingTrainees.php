<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Add passwords to existing trainee accounts that don't have one
 */

try {
    $db = getMongoConnection();
    
    echo "Adding passwords to existing trainee accounts...\n\n";
    
    $traineesCollection = $db->trainees;
    
    // Find all trainees without a password field or with empty password
    $traineesWithoutPassword = $traineesCollection->find([
        '$or' => [
            ['password' => ['$exists' => false]],
            ['password' => ''],
            ['password' => null]
        ]
    ]);
    
    $updated = 0;
    
    foreach ($traineesWithoutPassword as $trainee) {
        $traineeId = $trainee['trainee_id'] ?? 'Unknown';
        $firstName = $trainee['first_name'] ?? 'Unknown';
        $lastName = $trainee['last_name'] ?? 'Unknown';
        
        // Set default password to 'password123'
        $defaultPassword = 'password123';
        
        $traineesCollection->updateOne(
            ['_id' => $trainee['_id']],
            ['$set' => [
                'password' => $defaultPassword,
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ]]
        );
        
        echo "  ✓ Added password to: {$firstName} {$lastName} ({$traineeId})\n";
        $updated++;
    }
    
    if ($updated === 0) {
        echo "  ℹ All trainees already have passwords!\n";
    } else {
        echo "\n✅ Successfully added passwords to {$updated} trainee accounts!\n";
        echo "\nDefault password for all updated accounts: password123\n";
    }
    
    echo "\nTotal trainees in database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
