<?php

/**
 * Seed Admin User
 * Creates a default admin user in the admins collection
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $adminsCollection = $db->admins;
    
    // Check if admin already exists
    $existingAdmin = $adminsCollection->findOne(['email' => 'kelmiyata@caate.edu']);
    
    if ($existingAdmin) {
        echo "Admin user already exists!\n";
        echo "Email: kelmiyata@caate.edu\n";
        exit(0);
    }
    
    // Create admin user
    $adminData = [
        'name' => 'Kel Miyata',
        'email' => 'kelmiyata@caate.edu',
        'username' => 'kelmiyata',
        'password' => 'admin123', // Plain text password for admins
        'role' => 'admin',
        'created_at' => new MongoDB\BSON\UTCDateTime(),
        'updated_at' => new MongoDB\BSON\UTCDateTime()
    ];
    
    $result = $adminsCollection->insertOne($adminData);
    
    if ($result->getInsertedCount() > 0) {
        echo "✓ Admin user created successfully!\n\n";
        echo "Login Credentials:\n";
        echo "==================\n";
        echo "Email: kelmiyata@caate.edu\n";
        echo "Username: kelmiyata\n";
        echo "Password: admin123\n\n";
        echo "⚠️  IMPORTANT: Please change the password after first login!\n";
    } else {
        echo "✗ Failed to create admin user\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
