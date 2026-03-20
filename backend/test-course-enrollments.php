<?php
require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== TESTING COURSE ENROLLMENT STATISTICS ===\n\n";
    
    // Get all courses
    $courses = $db->courses->find()->toArray();
    echo "Total Courses: " . count($courses) . "\n\n";
    
    // Get first course for testing
    if (count($courses) > 0) {
        $testCourse = $courses[0];
        $courseId = (string)$testCourse['_id'];
        $courseName = $testCourse['title'] ?? 'Unknown';
        
        echo "Testing with course: $courseName\n";
        echo "Course ID: $courseId\n\n";
        
        // Check registrations
        echo "--- REGISTRATIONS ---\n";
        $allRegistrations = $db->registrations->find()->toArray();
        echo "Total registrations in DB: " . count($allRegistrations) . "\n";
        
        if (count($allRegistrations) > 0) {
            $sample = $allRegistrations[0];
            echo "Sample registration fields:\n";
            echo "  - selectedCourse: " . ($sample['selectedCourse'] ?? 'N/A') . "\n";
            echo "  - selectedCourseId: " . ($sample['selectedCourseId'] ?? 'N/A') . "\n";
            echo "  - status: " . ($sample['status'] ?? 'N/A') . "\n\n";
        }
        
        // Count by selectedCourseId
        $regBySelectedCourseId = $db->registrations->countDocuments([
            'selectedCourseId' => $courseId
        ]);
        echo "Registrations with selectedCourseId=$courseId: $regBySelectedCourseId\n";
        
        // Count approved by selectedCourseId
        $approvedRegBySelectedCourseId = $db->registrations->countDocuments([
            'selectedCourseId' => $courseId,
            'status' => ['$in' => ['approved', 'enrolled']]
        ]);
        echo "Approved registrations with selectedCourseId=$courseId: $approvedRegBySelectedCourseId\n\n";
        
        // Check all statuses in registrations
        echo "All registration statuses:\n";
        $statuses = $db->registrations->distinct('status');
        foreach ($statuses as $status) {
            $count = $db->registrations->countDocuments(['status' => $status]);
            echo "  - $status: $count\n";
        }
        echo "\n";
        
        // Check applications
        echo "--- APPLICATIONS ---\n";
        $allApplications = $db->applications->find()->toArray();
        echo "Total applications in DB: " . count($allApplications) . "\n";
        
        if (count($allApplications) > 0) {
            $sample = $allApplications[0];
            echo "Sample application fields:\n";
            echo "  - course_id: " . ($sample['course_id'] ?? 'N/A') . "\n";
            echo "  - status: " . ($sample['status'] ?? 'N/A') . "\n\n";
        }
        
        // Check admissions
        echo "--- ADMISSIONS ---\n";
        $allAdmissions = $db->admissions->find()->toArray();
        echo "Total admissions in DB: " . count($allAdmissions) . "\n";
        
        if (count($allAdmissions) > 0) {
            $sample = $allAdmissions[0];
            echo "Sample admission fields:\n";
            echo "  - course_id: " . ($sample['course_id'] ?? 'N/A') . "\n";
            echo "  - status: " . ($sample['status'] ?? 'N/A') . "\n\n";
        }
        
        // Test the actual API logic
        echo "=== TESTING API LOGIC ===\n";
        foreach ($courses as $course) {
            $cId = (string)$course['_id'];
            $cName = $course['title'] ?? 'Unknown';
            
            $regCount = $db->registrations->countDocuments([
                'selectedCourseId' => $cId,
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            
            $appCount = $db->applications->countDocuments([
                'course_id' => $cId,
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            
            $admCount = $db->admissions->countDocuments([
                'course_id' => $cId,
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            
            $total = $regCount + $appCount + $admCount;
            
            if ($total > 0) {
                echo "$cName: $total (Reg: $regCount, App: $appCount, Adm: $admCount)\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
