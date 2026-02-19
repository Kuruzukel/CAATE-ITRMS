<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Seed Sample Data for CAATE-ITRMS
 * Run this file to populate collections with sample data
 */

try {
    $db = getMongoConnection();
    
    echo "Seeding Sample Data for CAATE-ITRMS...\n\n";
    
    // Sample Admin User
    $usersCollection = $db->users;
    $adminExists = $usersCollection->findOne(['email' => 'admin@caate.edu']);
    
    if (!$adminExists) {
        $usersCollection->insertOne([
            'name' => 'Admin User',
            'email' => 'admin@caate.edu',
            'password' => password_hash('admin123', PASSWORD_BCRYPT),
            'role' => 'admin',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]);
        echo "✓ Created admin user (email: admin@caate.edu, password: admin123)\n";
    } else {
        echo "  Admin user already exists\n";
    }
    
    // Sample Courses
    $coursesCollection = $db->courses;
    $courseExists = $coursesCollection->findOne(['course_code' => 'BC-NC-001']);
    
    if (!$courseExists) {
        $courses = [
            [
                'course_code' => 'BC-NC-001',
                'title' => 'Beauty Care (Nail Care)',
                'description' => 'Comprehensive nail care and manicure training',
                'duration' => '3 months',
                'status' => 'active',
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ],
            [
                'course_code' => 'BC-SC-002',
                'title' => 'Beauty Care (Skin Care)',
                'description' => 'Professional skin care and facial treatment training',
                'duration' => '3 months',
                'status' => 'active',
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ],
            [
                'course_code' => 'AS-001',
                'title' => 'Aesthetic Services',
                'description' => 'Advanced aesthetic and beauty services',
                'duration' => '4 months',
                'status' => 'active',
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ]
        ];
        
        $coursesCollection->insertMany($courses);
        echo "✓ Created " . count($courses) . " sample courses\n";
    } else {
        echo "  Sample courses already exist\n";
    }
    
    // Sample Trainee
    $traineesCollection = $db->trainees;
    $traineeExists = $traineesCollection->findOne(['email' => 'trainee@example.com']);
    
    if (!$traineeExists) {
        $traineesCollection->insertOne([
            'student_id' => 'TRN-2024-001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'trainee@example.com',
            'phone' => '09123456789',
            'address' => 'Sample Address, City',
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]);
        echo "✓ Created sample trainee\n";
    } else {
        echo "  Sample trainee already exists\n";
    }
    
    echo "\nSample data seeding completed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
