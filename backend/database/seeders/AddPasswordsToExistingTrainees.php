<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "Adding passwords to existing trainee accounts...\n\n";
    
    $traineesCollection = $db->trainees;
    
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
        
        $defaultPassword = 'password123';
        
        $traineesCollection->updateOne(
            ['_id' => $trainee['_id']],
            ['$set' => [
                'password' => $defaultPassword,
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ]]
        );
        
        echo "  âœ“ Added password to: {$firstName} {$lastName} ({$traineeId})\n";
        $updated++;
    }
    
    if ($updated === 0) {
        echo "  â„¹ All trainees already have passwords!\n";
    } else {
        echo "\nâœ… Successfully added passwords to {$updated} trainee accounts!\n";
        echo "\nDefault password for all updated accounts: password123\n";
    }
    
    echo "\nTotal trainees in database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "âŒ Error: " . $e->getMessage() . "\n";
    exit(1);
}
