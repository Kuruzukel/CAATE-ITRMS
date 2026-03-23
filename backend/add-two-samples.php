<?php
/**
 * Add 2 more sample enrollment records
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== ADDING 2 MORE SAMPLE ENROLLMENTS ===\n\n";
    echo "Current Date: " . date('Y-m-d H:i:s') . "\n\n";
    
    $now = new MongoDB\BSON\UTCDateTime();
    
    // Get registrations collection
    $registrationCollection = $db->registrations;
    
    // Sample registrations
    echo "Creating 2 sample registrations...\n";
    $registrations = [
        [
            'firstName' => 'Carlos',
            'lastName' => 'Mendoza',
            'middleName' => 'R.',
            'traineeFullName' => 'Carlos R. Mendoza',
            'emailFacebook' => 'carlos.mendoza@example.com',
            'contactNo' => '09221234567',
            'selectedCourse' => 'Permanent Make-Up Tattoo Services Level III',
            'selectedCourseId' => 'COURSE006',
            'sex' => 'Male',
            'civilStatus' => 'Single',
            'age' => 28,
            'status' => 'approved',
            'submittedAt' => $now,
            'createdAt' => $now,
            'updatedAt' => $now
        ],
        [
            'firstName' => 'Isabella',
            'lastName' => 'Torres',
            'middleName' => 'M.',
            'traineeFullName' => 'Isabella M. Torres',
            'emailFacebook' => 'isabella.torres@example.com',
            'contactNo' => '09231234567',
            'selectedCourse' => 'Advanced Skin Care Services Level III',
            'selectedCourseId' => 'COURSE007',
            'sex' => 'Female',
            'civilStatus' => 'Married',
            'age' => 32,
            'status' => 'pending',
            'submittedAt' => $now,
            'createdAt' => $now,
            'updatedAt' => $now
        ]
    ];
    
    foreach ($registrations as $registration) {
        $result = $registrationCollection->insertOne($registration);
        echo "  ✓ Created registration: {$registration['traineeFullName']} - {$registration['selectedCourse']} (Status: {$registration['status']})\n";
    }
    
    echo "\n=== COMPLETED ===\n";
    echo "Added 2 new sample registrations!\n";
    echo "Refresh your dashboard to see the new enrollments.\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
