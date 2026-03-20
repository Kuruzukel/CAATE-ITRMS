<?php
/**
 * Test script to verify enrollment statistics from database
 * This will show today's registrations, applications, and admissions
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== ENROLLMENT STATISTICS TEST ===\n\n";
    echo "Current Date: " . date('Y-m-d H:i:s') . "\n";
    echo "Timezone: " . date_default_timezone_get() . "\n\n";
    
    // Calculate today's date range
    $todayStart = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
    $todayEnd = new MongoDB\BSON\UTCDateTime(strtotime('tomorrow') * 1000);
    
    echo "Today Start: " . date('Y-m-d H:i:s', $todayStart->toDateTime()->getTimestamp()) . "\n";
    echo "Today End: " . date('Y-m-d H:i:s', $todayEnd->toDateTime()->getTimestamp()) . "\n\n";
    
    // Get collections
    $registrationCollection = $db->registrations;
    $applicationCollection = $db->applications;
    $admissionCollection = $db->admissions;
    
    // Total counts
    echo "--- TOTAL COUNTS ---\n";
    $totalRegistrations = $registrationCollection->countDocuments();
    $totalApplications = $applicationCollection->countDocuments();
    $totalAdmissions = $admissionCollection->countDocuments();
    
    echo "Total Registrations: $totalRegistrations\n";
    echo "Total Applications: $totalApplications\n";
    echo "Total Admissions: $totalAdmissions\n";
    echo "Total Enrollments: " . ($totalRegistrations + $totalApplications + $totalAdmissions) . "\n\n";
    
    // Today's counts
    echo "--- TODAY'S ENROLLMENTS ---\n";
    $todayRegistrations = $registrationCollection->countDocuments([
        'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
    ]);
    $todayApplications = $applicationCollection->countDocuments([
        'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
    ]);
    $todayAdmissions = $admissionCollection->countDocuments([
        'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
    ]);
    
    echo "Today's Registrations: $todayRegistrations\n";
    echo "Today's Applications: $todayApplications\n";
    echo "Today's Admissions: $todayAdmissions\n";
    echo "Today's Total Enrollments: " . ($todayRegistrations + $todayApplications + $todayAdmissions) . "\n\n";
    
    // Status breakdown
    echo "--- STATUS BREAKDOWN ---\n";
    
    // Approved/Enrolled
    $approvedRegistrations = $registrationCollection->countDocuments([
        'status' => ['$in' => ['approved', 'enrolled']]
    ]);
    $approvedApplications = $applicationCollection->countDocuments([
        'status' => ['$in' => ['approved', 'enrolled']]
    ]);
    $approvedAdmissions = $admissionCollection->countDocuments([
        'status' => ['$in' => ['approved', 'enrolled']]
    ]);
    
    echo "Approved Registrations: $approvedRegistrations\n";
    echo "Approved Applications: $approvedApplications\n";
    echo "Approved Admissions: $approvedAdmissions\n";
    echo "Total Approved: " . ($approvedRegistrations + $approvedApplications + $approvedAdmissions) . "\n\n";
    
    // Pending
    $pendingRegistrations = $registrationCollection->countDocuments(['status' => 'pending']);
    $pendingApplications = $applicationCollection->countDocuments(['status' => 'pending']);
    $pendingAdmissions = $admissionCollection->countDocuments(['status' => 'pending']);
    
    echo "Pending Registrations: $pendingRegistrations\n";
    echo "Pending Applications: $pendingApplications\n";
    echo "Pending Admissions: $pendingAdmissions\n";
    echo "Total Pending: " . ($pendingRegistrations + $pendingApplications + $pendingAdmissions) . "\n\n";
    
    // Cancelled
    $cancelledRegistrations = $registrationCollection->countDocuments([
        'status' => ['$in' => ['cancelled', 'rejected']]
    ]);
    $cancelledApplications = $applicationCollection->countDocuments([
        'status' => ['$in' => ['cancelled', 'rejected']]
    ]);
    $cancelledAdmissions = $admissionCollection->countDocuments([
        'status' => ['$in' => ['cancelled', 'rejected']]
    ]);
    
    echo "Cancelled Registrations: $cancelledRegistrations\n";
    echo "Cancelled Applications: $cancelledApplications\n";
    echo "Cancelled Admissions: $cancelledAdmissions\n";
    echo "Total Cancelled: " . ($cancelledRegistrations + $cancelledApplications + $cancelledAdmissions) . "\n\n";
    
    // Sample records from today (if any)
    echo "--- SAMPLE TODAY'S RECORDS ---\n";
    
    $todayRegs = $registrationCollection->find(
        ['created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
        ['limit' => 3]
    )->toArray();
    
    if (count($todayRegs) > 0) {
        echo "\nRegistrations created today:\n";
        foreach ($todayRegs as $reg) {
            $createdAt = $reg['created_at']->toDateTime()->format('Y-m-d H:i:s');
            $status = $reg['status'] ?? 'N/A';
            $name = ($reg['first_name'] ?? '') . ' ' . ($reg['last_name'] ?? '');
            echo "  - $name (Status: $status, Created: $createdAt)\n";
        }
    } else {
        echo "\nNo registrations created today.\n";
    }
    
    $todayApps = $applicationCollection->find(
        ['created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
        ['limit' => 3]
    )->toArray();
    
    if (count($todayApps) > 0) {
        echo "\nApplications created today:\n";
        foreach ($todayApps as $app) {
            $createdAt = $app['created_at']->toDateTime()->format('Y-m-d H:i:s');
            $status = $app['status'] ?? 'N/A';
            $name = ($app['first_name'] ?? '') . ' ' . ($app['last_name'] ?? '');
            echo "  - $name (Status: $status, Created: $createdAt)\n";
        }
    } else {
        echo "\nNo applications created today.\n";
    }
    
    $todayAdms = $admissionCollection->find(
        ['created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
        ['limit' => 3]
    )->toArray();
    
    if (count($todayAdms) > 0) {
        echo "\nAdmissions created today:\n";
        foreach ($todayAdms as $adm) {
            $createdAt = $adm['created_at']->toDateTime()->format('Y-m-d H:i:s');
            $status = $adm['status'] ?? 'N/A';
            $traineeId = $adm['trainee_id'] ?? 'N/A';
            echo "  - Trainee ID: $traineeId (Status: $status, Created: $createdAt)\n";
        }
    } else {
        echo "\nNo admissions created today.\n";
    }
    
    echo "\n=== TEST COMPLETED SUCCESSFULLY ===\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
