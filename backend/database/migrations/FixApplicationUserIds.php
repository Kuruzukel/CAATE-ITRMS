<?php

require_once __DIR__ . '/../../app/config/database.php';

/**
 * Migration: Fix application user_ids to point to trainees instead of admins
 * This script updates applications that have admin user_ids to use trainee user_ids
 */

try {
    $db = getMongoConnection();
    
    echo "Starting migration: Fix application user_ids...\n\n";
    
    $applicationsCollection = $db->applications;
    $traineesCollection = $db->trainees;
    $usersCollection = $db->users;
    
    // Get all applications
    $applications = $applicationsCollection->find()->toArray();
    
    echo "Found " . count($applications) . " applications\n\n";
    
    $fixed = 0;
    $skipped = 0;
    
    foreach ($applications as $app) {
        $appId = (string)$app['_id'];
        $userId = $app['user_id'] ?? null;
        
        if (!$userId) {
            echo "⚠ Application {$appId} has no user_id, skipping...\n";
            $skipped++;
            continue;
        }
        
        // Convert to ObjectId if string
        if (is_string($userId)) {
            try {
                $userId = new MongoDB\BSON\ObjectId($userId);
            } catch (Exception $e) {
                echo "⚠ Application {$appId} has invalid user_id, skipping...\n";
                $skipped++;
                continue;
            }
        }
        
        // Check if user_id points to an admin
        $user = $usersCollection->findOne(['_id' => $userId]);
        
        if ($user && isset($user['role']) && $user['role'] === 'admin') {
            echo "Found application with admin user_id: {$appId}\n";
            
            // Try to find matching trainee by email from application
            $appEmail = $app['contact']['email'] ?? $app['email'] ?? null;
            
            if ($appEmail) {
                $trainee = $traineesCollection->findOne(['email' => $appEmail]);
                
                if ($trainee) {
                    // Update application with trainee's ID
                    $result = $applicationsCollection->updateOne(
                        ['_id' => $app['_id']],
                        ['$set' => ['user_id' => $trainee['_id']]]
                    );
                    
                    if ($result->getModifiedCount() > 0) {
                        echo "  ✓ Updated to trainee: {$trainee['trainee_id']} ({$trainee['email']})\n";
                        $fixed++;
                    }
                } else {
                    echo "  ⚠ No matching trainee found for email: {$appEmail}\n";
                    $skipped++;
                }
            } else {
                echo "  ⚠ No email found in application\n";
                $skipped++;
            }
        } else {
            // Check if it's already a trainee
            $trainee = $traineesCollection->findOne(['_id' => $userId]);
            if ($trainee) {
                echo "✓ Application {$appId} already has correct trainee user_id\n";
                $skipped++;
            } else {
                echo "⚠ Application {$appId} has unknown user_id\n";
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
