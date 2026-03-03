<?php

/**
 * Update Admin Passwords to Plain Text
 * This script removes password hashing from admin accounts
 * Run this if you already created admin users with hashed passwords
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $adminsCollection = $db->admins;
    
    echo "Admin Password Update Utility\n";
    echo "==============================\n\n";
    
    // Find all admins
    $admins = $adminsCollection->find()->toArray();
    
    if (count($admins) === 0) {
        echo "No admin users found in database.\n";
        echo "Run 'php seed-admin.php' to create the default admin user.\n";
        exit(0);
    }
    
    echo "Found " . count($admins) . " admin user(s):\n\n";
    
    foreach ($admins as $admin) {
        echo "Admin: " . $admin['name'] . " (" . $admin['email'] . ")\n";
        echo "Current password: " . $admin['password'] . "\n";
        
        // Check if password looks hashed (bcrypt hashes start with $2y$)
        if (strpos($admin['password'], '$2y$') === 0) {
            echo "Status: Password is HASHED (needs update)\n";
            echo "\nWhat would you like to do?\n";
            echo "1. Set to default password (admin123)\n";
            echo "2. Enter custom password\n";
            echo "3. Skip this admin\n";
            echo "Choice (1-3): ";
            
            $choice = trim(fgets(STDIN));
            
            $newPassword = null;
            
            switch ($choice) {
                case '1':
                    $newPassword = 'admin123';
                    break;
                case '2':
                    echo "Enter new password: ";
                    $newPassword = trim(fgets(STDIN));
                    break;
                case '3':
                    echo "Skipped.\n\n";
                    continue 2;
                default:
                    echo "Invalid choice. Skipped.\n\n";
                    continue 2;
            }
            
            if ($newPassword) {
                // Update with plain text password
                $result = $adminsCollection->updateOne(
                    ['_id' => $admin['_id']],
                    [
                        '$set' => [
                            'password' => $newPassword,
                            'updated_at' => new MongoDB\BSON\UTCDateTime()
                        ]
                    ]
                );
                
                if ($result->getModifiedCount() > 0) {
                    echo "✓ Password updated to: {$newPassword}\n\n";
                } else {
                    echo "✗ Failed to update password\n\n";
                }
            }
        } else {
            echo "Status: Password is already PLAIN TEXT (no update needed)\n\n";
        }
    }
    
    echo "==============================\n";
    echo "Update complete!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
