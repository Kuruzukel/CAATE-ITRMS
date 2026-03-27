<?php

require_once __DIR__ . '/../../app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "Starting migration: Fix application user_ids...\n\n";
    
    $applicationsCollection = $db->applications;
    $traineesCollection = $db->trainees;
    $usersCollection = $db->users;
    
    $applications = $applicationsCollection->find()->toArray();
    
    echo "Found " . count($applications) . " applications\n\n";
    
    $fixed = 0;
    $skipped = 0;
    
    foreach ($applications as $app) {
        $appId = (string)$app['_id'];
        $userId = $app['user_id'] ?? null;
        
        if (!$userId) {
            echo "âš  Application {$appId} has no user_id, skipping...\n";
            $skipped++;
            continue;
        }
        
        if (is_string($userId)) {
            try {
                $userId = new MongoDB\BSON\ObjectId($userId);
            } catch (Exception $e) {
                echo "âš  Application {$appId} has invalid user_id, skipping...\n";
                $skipped++;
                continue;
            }
        }
        
        $user = $usersCollection->findOne(['_id' => $userId]);
        
        if ($user && isset($user['role']) && $user['role'] === 'admin') {
            echo "Found application with admin user_id: {$appId}\n";
            
            $appEmail = $app['contact']['email'] ?? $app['email'] ?? null;
            
            if ($appEmail) {
                $trainee = $traineesCollection->findOne(['email' => $appEmail]);
                
                if ($trainee) {
                    $result = $applicationsCollection->updateOne(
                        ['_id' => $app['_id']],
                        ['$set' => ['user_id' => $trainee['_id']]]
                    );
                    
                    if ($result->getModifiedCount() > 0) {
                        echo "  âœ“ Updated to trainee: {$trainee['trainee_id']} ({$trainee['email']})\n";
                        $fixed++;
                    }
                } else {
                    echo "  âš  No matching trainee found for email: {$appEmail}\n";
                    $skipped++;
                }
            } else {
                echo "  âš  No email found in application\n";
                $skipped++;
            }
        } else {
            $trainee = $traineesCollection->findOne(['_id' => $userId]);
            if ($trainee) {
                echo "âœ“ Application {$appId} already has correct trainee user_id\n";
                $skipped++;
            } else {
                echo "âš  Application {$appId} has unknown user_id\n";
                $skipped++;
            }
        }
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "Migration completed!\n";
    echo "Fixed: {$fixed}\n";
    echo "Skipped: {$skipped}\n";
    echo "Total: " . count($applications) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
