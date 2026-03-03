<?php

/**
 * Create Test Trainee
 * Creates a test trainee account for testing the authentication system
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $traineesCollection = $db->trainees;
    
    // Check if test trainee already exists
    $existingTrainee = $traineesCollection->findOne(['email' => 'test.trainee@caate.edu']);
    
    if ($existingTrainee) {
        echo "Test trainee already exists!\n";
        echo "Email: test.trainee@caate.edu\n";
        echo "Username: testtrainee\n";
        echo "Password: trainee123\n";
        exit(0);
    }
    
    // Create test trainee
    $traineeData = [
        'traineeId' => 'TRN-TEST-001',
        'name' => 'Test Trainee',
        'fullName' => 'Test Trainee',
        'email' => 'test.trainee@caate.edu',
        'username' => 'testtrainee',
        'password' => password_hash('trainee123', PASSWORD_BCRYPT),
        'contactNumber' => '09123456789',
        'address' => 'Test Address, Test City',
        'dateOfBirth' => '2000-01-01',
        'gender' => 'Other',
        'status' => 'Active',
        'enrollmentDate' => new MongoDB\BSON\UTCDateTime(),
        'created_at' => new MongoDB\BSON\UTCDateTime(),
        'updated_at' => new MongoDB\BSON\UTCDateTime()
    ];
    
    $result = $traineesCollection->insertOne($traineeData);
    
    if ($result->getInsertedCount() > 0) {
        echo "✓ Test trainee created successfully!\n\n";
        echo "Login Credentials:\n";
        echo "==================\n";
        echo "Email: test.trainee@caate.edu\n";
        echo "Username: testtrainee\n";
        echo "Password: trainee123\n\n";
        echo "You can now test the trainee login and dashboard!\n";
    } else {
        echo "✗ Failed to create test trainee\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
