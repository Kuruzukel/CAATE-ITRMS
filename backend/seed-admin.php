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
    $existingAdmin = $adminsCollection->findOne(['email' => 'admin@example.com']);
    
    if ($existingAdmin) {
        echo "Admin user already exists!\n";
        echo "Email: admin@example.com\n";
        exit(0);
    }
    
    // Create admin user with hashed password
    $adminData = [
        'name' => 'Kel Miyata',
        'email' => 'admin@example.com',
        'username' => 'admin',
        'password' => password_hash('ChangeMe123!', PASSWORD_BCRYPT), // Hashed password
        'role' => 'admin',
        'created_at' => new MongoDB\BSON\UTCDateTime(),
        'updated_at' => new MongoDB\BSON\UTCDateTime()
    ];
    
    $result = $adminsCollection->insertOne($adminData);
    
    if ($result->getInsertedCount() > 0) {
        echo "✓ Admin user created successfully!\n\n";
        echo "Login Credentials:\n";
        echo "==================\n";
        echo "Email: admin@example.com\n";
        echo "Username: admin\n";
        echo "Password: ChangeMe123!\n\n";
        echo "⚠️  CRITICAL: Change this password immediately after first login!\n";
        echo "⚠️  This is a default password for development only!\n";
    } else {
        echo "✗ Failed to create admin user\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
