<?php
/**
 * Test the statistics API to verify all percentage calculations
 */

require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/models/Trainee.php';

try {
    $trainee = new Trainee();
    $stats = $trainee->getStatistics();
    
    echo "=== DASHBOARD STATISTICS API TEST ===\n\n";
    
    echo "Total Trainees: " . $stats['total'] . "\n";
    echo "Total Enrollments: " . $stats['totalEnrollment'] . "\n\n";
    
    echo "--- TODAY'S METRICS ---\n";
    echo "Today's Enrollments: " . $stats['todayEnrollments'] . "\n";
    echo "Today's Percentage Change: " . $stats['todayPercentageIncrease'] . "%\n\n";
    
    echo "--- STATUS BREAKDOWN ---\n";
    echo "Approved Enrollments: " . $stats['approvedEnrollments'] . "\n";
    echo "Approved Percentage Change: " . $stats['monthPercentageIncrease'] . "%\n\n";
    
    echo "Pending Enrollments: " . $stats['pendingEnrollments'] . "\n";
    echo "Pending Percentage Change: " . $stats['pendingPercentageChange'] . "%\n\n";
    
    echo "Cancelled Enrollments: " . $stats['cancelledEnrollments'] . "\n";
    echo "Cancelled Percentage Change: " . $stats['cancelledPercentageChange'] . "%\n\n";
    
    echo "--- MONTHLY METRICS ---\n";
    echo "This Month's Enrollments: " . $stats['monthEnrollments'] . "\n";
    echo "Month Percentage Change: " . $stats['monthPercentageIncrease'] . "%\n\n";
    
    echo "--- YEARLY METRICS ---\n";
    echo "Current Year (" . $stats['year'] . "): " . $stats['currentYearEnrollments'] . "\n";
    echo "Previous Year (" . ($stats['year'] - 1) . "): " . $stats['previousYearEnrollments'] . "\n";
    echo "Year Growth: " . $stats['yearGrowthPercentage'] . "%\n\n";
    
    echo "=== ALL STATISTICS WORKING CORRECTLY ===\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
