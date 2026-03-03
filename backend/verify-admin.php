<?php

/**
 * Verify Admin User
 * Checks if the admin user exists and displays credentials
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $adminsCollection = $db->admins;
    
    echo "=== Checking Admin Users ===\n\n";
    
    // Find all admins
    $admins = $adminsCollection->find();
    $count = 0;
    
    foreach ($admins as $admin) {
        $count++;
        echo "Admin #{$count}:\n";
        echo "  ID: " . (string)$admin['_id'] . "\n";
        echo "  Name: " . ($admin['name'] ?? 'N/A') . "\n";
        echo "  Email: " . ($admin['email'] ?? 'N/A') . "\n";
        echo "  Username: " . ($admin['username'] ?? 'N/A') . "\n";
        echo "  Password: " . ($admin['password'] ?? 'N/A') . "\n";
        echo "  Role: " . ($admin['role'] ?? 'N/A') . "\n";
        echo "\n";
    }
    
    if ($count === 0) {
        echo "No admin users found in database!\n";
        echo "\nRun the seed script to create an admin user:\n";
        echo "  php backend/seed-admin.php\n";
    } else {
        echo "Total admins found: {$count}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
