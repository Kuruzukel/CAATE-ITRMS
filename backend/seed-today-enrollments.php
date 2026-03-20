<?php
/**
 * Seed script to create sample enrollments for today
 * This will add test registrations, applications, and admissions with today's date
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== SEEDING TODAY'S ENROLLMENTS ===\n\n";
    echo "Current Date: " . date('Y-m-d H:i:s') . "\n\n";
    
    $now = new MongoDB\BSON\UTCDateTime();
    
    // Collections
    $registrationCollection = $db->registrations;
    $applicationCollection = $db->applications;
    $admissionCollection = $db->admissions;
    
    // Sample registrations for today
    echo "Creating sample registrations for today...\n";
    $registrations = [
        [
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'email' => 'maria.santos.today@example.com',
            'phone' => '09171234567',
            'course_id' => 'COURSE001',
            'course_name' => 'Beauty Care (Nail Care) NC II',
            'status' => 'approved',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan.delacruz.today@example.com',
            'phone' => '09181234567',
            'course_id' => 'COURSE002',
            'course_name' => 'Beauty Care (Skin Care) NC II',
            'status' => 'pending',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'first_name' => 'Ana',
            'last_name' => 'Reyes',
            'email' => 'ana.reyes.today@example.com',
            'phone' => '09191234567',
            'course_id' => 'COURSE003',
            'course_name' => 'Aesthetic Services Level III',
            'status' => 'approved',
            'created_at' => $now,
            'updated_at' => $now
        ]
    ];
    
    foreach ($registrations as $registration) {
        $result = $registrationCollection->insertOne($registration);
        echo "  ✓ Created registration: {$registration['first_name']} {$registration['last_name']} (Status: {$registration['status']})\n";
    }
    
    // Sample applications for today
    echo "\nCreating sample applications for today...\n";
    $applications = [
        [
            'first_name' => 'Pedro',
            'last_name' => 'Garcia',
            'email' => 'pedro.garcia.today@example.com',
            'phone' => '09201234567',
            'course_id' => 'COURSE001',
            'course_name' => 'Beauty Care (Nail Care) NC II',
            'status' => 'approved',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'first_name' => 'Sofia',
            'last_name' => 'Martinez',
            'email' => 'sofia.martinez.today@example.com',
            'phone' => '09211234567',
            'course_id' => 'COURSE004',
            'course_name' => 'Eyelash & Eyebrow Services Level III',
            'status' => 'pending',
            'created_at' => $now,
            'updated_at' => $now
        ]
    ];
    
    foreach ($applications as $application) {
        $result = $applicationCollection->insertOne($application);
        echo "  ✓ Created application: {$application['first_name']} {$application['last_name']} (Status: {$application['status']})\n";
    }
    
    // Sample admissions for today
    echo "\nCreating sample admissions for today...\n";
    $admissions = [
        [
            'trainee_id' => 'TRN-2026-001',
            'course_id' => 'COURSE002',
            'course_name' => 'Beauty Care (Skin Care) NC II',
            'admission_date' => $now,
            'status' => 'approved',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'trainee_id' => 'TRN-2026-002',
            'course_id' => 'COURSE005',
            'course_name' => 'Trainers Methodology Level I',
            'admission_date' => $now,
            'status' => 'pending',
            'created_at' => $now,
            'updated_at' => $now
        ]
    ];
    
    foreach ($admissions as $admission) {
        $result = $admissionCollection->insertOne($admission);
        echo "  ✓ Created admission: {$admission['trainee_id']} (Status: {$admission['status']})\n";
    }
    
    // Summary
    echo "\n=== SUMMARY ===\n";
    echo "Registrations created: " . count($registrations) . "\n";
    echo "Applications created: " . count($applications) . "\n";
    echo "Admissions created: " . count($admissions) . "\n";
    echo "Total enrollments created: " . (count($registrations) + count($applications) + count($admissions)) . "\n";
    
    echo "\n=== SEEDING COMPLETED SUCCESSFULLY ===\n";
    echo "\nYou can now refresh the admin dashboard to see today's enrollment statistics!\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
