<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Comprehensive Sample Data for CAATE-ITRMS
 */

try {
    $db = getMongoConnection();
    
    echo "Seeding Comprehensive Sample Data for CAATE-ITRMS...\n\n";
    
    // 1. Users Collection
    echo "Creating Users...\n";
    $usersCollection = $db->users;
    $users = [
        [
            'name' => 'Admin User',
            'email' => 'admin@caate.edu',
            'password' => password_hash('admin123', PASSWORD_BCRYPT),
            'role' => 'admin',
            'phone' => '09171234567',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'Maria Santos',
            'email' => 'maria.santos@caate.edu',
            'password' => password_hash('staff123', PASSWORD_BCRYPT),
            'role' => 'staff',
            'phone' => '09181234567',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'John Reyes',
            'email' => 'john.reyes@caate.edu',
            'password' => password_hash('instructor123', PASSWORD_BCRYPT),
            'role' => 'instructor',
            'phone' => '09191234567',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    foreach ($users as $user) {
        if (!$usersCollection->findOne(['email' => $user['email']])) {
            $usersCollection->insertOne($user);
            echo "  ✓ Created user: {$user['name']}\n";
        }
    }
    
    // 2. Courses Collection
    echo "\nCreating Courses...\n";
    $coursesCollection = $db->courses;
    $courses = [
        [
            'course_code' => 'BC-NC-001',
            'title' => 'Beauty Care (Nail Care)',
            'description' => 'Comprehensive nail care, manicure, and pedicure training program',
            'duration' => '3 months',
            'fee' => 15000,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'course_code' => 'BC-SC-002',
            'title' => 'Beauty Care (Skin Care)',
            'description' => 'Professional skin care, facial treatment, and beauty therapy',
            'duration' => '3 months',
            'fee' => 18000,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'course_code' => 'AS-001',
            'title' => 'Aesthetic Services',
            'description' => 'Advanced aesthetic and beauty services including makeup artistry',
            'duration' => '4 months',
            'fee' => 22000,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'course_code' => 'PMT-001',
            'title' => 'Permanent Makeup Tattoo',
            'description' => 'Professional permanent makeup and microblading techniques',
            'duration' => '2 months',
            'fee' => 25000,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'course_code' => 'ASC-001',
            'title' => 'Advanced Skin Care',
            'description' => 'Advanced skin care treatments and dermatological procedures',
            'duration' => '5 months',
            'fee' => 28000,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    $courseIds = [];
    foreach ($courses as $course) {
        $existing = $coursesCollection->findOne(['course_code' => $course['course_code']]);
        if (!$existing) {
            $result = $coursesCollection->insertOne($course);
            $courseIds[$course['course_code']] = $result->getInsertedId();
            echo "  ✓ Created course: {$course['title']}\n";
        } else {
            $courseIds[$course['course_code']] = $existing['_id'];
        }
    }
    
    // 3. Trainees Collection
    echo "\nCreating Trainees...\n";
    $traineesCollection = $db->trainees;
    $trainees = [
        [
            'trainee_id' => 'TRN-2024-001',
            'first_name' => 'Anna',
            'last_name' => 'Cruz',
            'email' => 'anna.cruz@example.com',
            'phone' => '09171111111',
            'address' => '123 Main St, Manila',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('2000-05-15') * 1000),
            'gender' => 'Female',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => 'TRN-2024-002',
            'first_name' => 'Sofia',
            'last_name' => 'Garcia',
            'email' => 'sofia.garcia@example.com',
            'phone' => '09172222222',
            'address' => '456 Rizal Ave, Quezon City',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('1999-08-20') * 1000),
            'gender' => 'Female',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => 'TRN-2024-003',
            'first_name' => 'Isabella',
            'last_name' => 'Mendoza',
            'email' => 'isabella.mendoza@example.com',
            'phone' => '09173333333',
            'address' => '789 Bonifacio St, Makati',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('2001-03-10') * 1000),
            'gender' => 'Female',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => 'TRN-2024-004',
            'first_name' => 'Mia',
            'last_name' => 'Torres',
            'email' => 'mia.torres@example.com',
            'phone' => '09174444444',
            'address' => '321 Luna St, Pasig',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('2000-11-25') * 1000),
            'gender' => 'Female',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => 'TRN-2024-005',
            'first_name' => 'Emma',
            'last_name' => 'Ramos',
            'email' => 'emma.ramos@example.com',
            'phone' => '09175555555',
            'address' => '654 Del Pilar St, Mandaluyong',
            'date_of_birth' => new MongoDB\BSON\UTCDateTime(strtotime('1998-07-18') * 1000),
            'gender' => 'Female',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    $traineeIds = [];
    foreach ($trainees as $trainee) {
        $existing = $traineesCollection->findOne(['trainee_id' => $trainee['trainee_id']]);
        if (!$existing) {
            $result = $traineesCollection->insertOne($trainee);
            $traineeIds[$trainee['trainee_id']] = $result->getInsertedId();
            echo "  ✓ Created trainee: {$trainee['first_name']} {$trainee['last_name']}\n";
        } else {
            $traineeIds[$trainee['trainee_id']] = $existing['_id'];
        }
    }
    
    // 4. Enrollments Collection
    echo "\nCreating Enrollments...\n";
    $enrollmentsCollection = $db->enrollments;
    $enrollments = [
        [
            'trainee_id' => (string)$traineeIds['TRN-2024-001'],
            'course_id' => (string)$courseIds['BC-NC-001'],
            'enrollment_date' => new MongoDB\BSON\UTCDateTime(strtotime('2024-01-15') * 1000),
            'status' => 'active',
            'payment_status' => 'paid',
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => (string)$traineeIds['TRN-2024-002'],
            'course_id' => (string)$courseIds['BC-SC-002'],
            'enrollment_date' => new MongoDB\BSON\UTCDateTime(strtotime('2024-01-20') * 1000),
            'status' => 'active',
            'payment_status' => 'paid',
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => (string)$traineeIds['TRN-2024-003'],
            'course_id' => (string)$courseIds['AS-001'],
            'enrollment_date' => new MongoDB\BSON\UTCDateTime(strtotime('2024-02-01') * 1000),
            'status' => 'active',
            'payment_status' => 'partial',
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => (string)$traineeIds['TRN-2024-004'],
            'course_id' => (string)$courseIds['PMT-001'],
            'enrollment_date' => new MongoDB\BSON\UTCDateTime(strtotime('2024-02-10') * 1000),
            'status' => 'active',
            'payment_status' => 'paid',
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => (string)$traineeIds['TRN-2024-005'],
            'course_id' => (string)$courseIds['ASC-001'],
            'enrollment_date' => new MongoDB\BSON\UTCDateTime(strtotime('2024-02-15') * 1000),
            'status' => 'active',
            'payment_status' => 'paid',
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    foreach ($enrollments as $enrollment) {
        $enrollmentsCollection->insertOne($enrollment);
        echo "  ✓ Created enrollment\n";
    }
    
    // 5. Inventory Collection
    echo "\nCreating Inventory Items...\n";
    $inventoryCollection = $db->inventory;
    $inventoryItems = [
        [
            'item_code' => 'INV-001',
            'name' => 'Nail Polish Set',
            'category' => 'Nail Care',
            'type' => 'consumable',
            'quantity' => 50,
            'unit' => 'set',
            'price' => 500,
            'status' => 'available',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'item_code' => 'INV-002',
            'name' => 'Facial Steamer',
            'category' => 'Skin Care Equipment',
            'type' => 'equipment',
            'quantity' => 5,
            'unit' => 'unit',
            'price' => 8000,
            'status' => 'available',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'item_code' => 'INV-003',
            'name' => 'Makeup Brush Set',
            'category' => 'Aesthetic Tools',
            'type' => 'tool',
            'quantity' => 30,
            'unit' => 'set',
            'price' => 1200,
            'status' => 'available',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'item_code' => 'INV-004',
            'name' => 'Microblading Pen',
            'category' => 'Permanent Makeup',
            'type' => 'tool',
            'quantity' => 15,
            'unit' => 'unit',
            'price' => 3500,
            'status' => 'available',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'item_code' => 'INV-005',
            'name' => 'Facial Cleanser',
            'category' => 'Skin Care Products',
            'type' => 'consumable',
            'quantity' => 100,
            'unit' => 'bottle',
            'price' => 350,
            'status' => 'available',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    foreach ($inventoryItems as $item) {
        if (!$inventoryCollection->findOne(['item_code' => $item['item_code']])) {
            $inventoryCollection->insertOne($item);
            echo "  ✓ Created inventory: {$item['name']}\n";
        }
    }
    
    // 6. Applications Collection
    echo "\nCreating Applications...\n";
    $applicationsCollection = $db->applications;
    $applications = [
        [
            'first_name' => 'Olivia',
            'last_name' => 'Santos',
            'email' => 'olivia.santos@example.com',
            'phone' => '09176666666',
            'course_interest' => 'Beauty Care (Nail Care)',
            'status' => 'pending',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'first_name' => 'Ava',
            'last_name' => 'Reyes',
            'email' => 'ava.reyes@example.com',
            'phone' => '09177777777',
            'course_interest' => 'Aesthetic Services',
            'status' => 'approved',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'first_name' => 'Charlotte',
            'last_name' => 'Dela Cruz',
            'email' => 'charlotte.delacruz@example.com',
            'phone' => '09178888888',
            'course_interest' => 'Advanced Skin Care',
            'status' => 'pending',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    foreach ($applications as $application) {
        $applicationsCollection->insertOne($application);
        echo "  ✓ Created application: {$application['first_name']} {$application['last_name']}\n";
    }
    
    // 7. Graduates Collection
    echo "\nCreating Graduates...\n";
    $graduatesCollection = $db->graduates;
    $graduates = [
        [
            'trainee_id' => 'TRN-2023-050',
            'student_name' => 'Maria Clara Santos',
            'course_id' => (string)$courseIds['BC-NC-001'],
            'course_name' => 'Beauty Care (Nail Care)',
            'graduation_date' => new MongoDB\BSON\UTCDateTime(strtotime('2023-12-15') * 1000),
            'certificate_number' => 'CERT-2023-050',
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ],
        [
            'trainee_id' => 'TRN-2023-051',
            'student_name' => 'Jasmine Reyes',
            'course_id' => (string)$courseIds['BC-SC-002'],
            'course_name' => 'Beauty Care (Skin Care)',
            'graduation_date' => new MongoDB\BSON\UTCDateTime(strtotime('2023-12-20') * 1000),
            'certificate_number' => 'CERT-2023-051',
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ]
    ];
    
    foreach ($graduates as $graduate) {
        $graduatesCollection->insertOne($graduate);
        echo "  ✓ Created graduate: {$graduate['student_name']}\n";
    }
    
    echo "\n✅ Comprehensive sample data seeding completed!\n";
    echo "\nSummary:\n";
    echo "- Users: " . $usersCollection->countDocuments() . "\n";
    echo "- Courses: " . $coursesCollection->countDocuments() . "\n";
    echo "- Trainees: " . $traineesCollection->countDocuments() . "\n";
    echo "- Enrollments: " . $enrollmentsCollection->countDocuments() . "\n";
    echo "- Inventory: " . $inventoryCollection->countDocuments() . "\n";
    echo "- Applications: " . $applicationsCollection->countDocuments() . "\n";
    echo "- Graduates: " . $graduatesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
