<?php

require_once __DIR__ . '/app/models/Course.php';

echo "===========================================\n";
echo "Testing Dual Collection Update\n";
echo "===========================================\n\n";

try {
    $courseModel = new Course();
    
    // Find a course to test with
    $courses = $courseModel->all();
    if (empty($courses)) {
        echo "❌ No courses found in database\n";
        exit(1);
    }
    
    $testCourse = $courses[0];
    $courseId = (string)$testCourse['_id'];
    
    echo "Testing with course: {$testCourse['course_title']}\n";
    echo "Course ID: {$courseId}\n";
    echo "Course Code: {$testCourse['course_code']}\n\n";
    
    // Show current competencies
    echo "--- CURRENT COMPETENCIES ---\n";
    $basicCount = isset($testCourse['basic_competencies']) ? count($testCourse['basic_competencies']) : 0;
    $commonCount = isset($testCourse['common_competencies']) ? count($testCourse['common_competencies']) : 0;
    $coreCount = isset($testCourse['core_competencies']) ? count($testCourse['core_competencies']) : 0;
    echo "Basic: {$basicCount}, Common: {$commonCount}, Core: {$coreCount}\n\n";
    
    // Prepare test update (add a test competency)
    $updatedData = [
        'basic_competencies' => isset($testCourse['basic_competencies']) 
            ? $testCourse['basic_competencies'] 
            : [],
        'common_competencies' => isset($testCourse['common_competencies']) 
            ? $testCourse['common_competencies'] 
            : [],
        'core_competencies' => isset($testCourse['core_competencies']) 
            ? $testCourse['core_competencies'] 
            : []
    ];
    
    // Add a test competency to basic
    $updatedData['basic_competencies'][] = 'TEST COMPETENCY - ' . date('Y-m-d H:i:s');
    
    echo "--- UPDATING COURSE ---\n";
    echo "Adding test competency to basic_competencies...\n\n";
    
    $result = $courseModel->update($courseId, $updatedData);
    
    if ($result['success']) {
        echo "✓ Course updated successfully\n";
        echo "  Modified: " . ($result['modified'] ? 'Yes' : 'No') . "\n\n";
        
        // Verify in both collections
        echo "--- VERIFYING BOTH COLLECTIONS ---\n";
        
        // Check courses collection
        $updatedCourse = $courseModel->findById($courseId);
        $newBasicCount = count($updatedCourse['basic_competencies']);
        echo "Courses collection - Basic competencies: {$newBasicCount}\n";
        
        // Check competencies collection
        $db = getMongoConnection();
        $competenciesCollection = $db->competencies;
        $competencyDocs = $competenciesCollection->countDocuments([
            'course_code' => $testCourse['course_code'],
            'competency_type' => 'Basic'
        ]);
        echo "Competencies collection - Basic competencies: {$competencyDocs}\n\n";
        
        if ($newBasicCount === $competencyDocs) {
            echo "✓ SUCCESS! Both collections are in sync\n";
        } else {
            echo "⚠ WARNING: Collections are not in sync\n";
        }
        
        // Clean up - remove test competency
        echo "\n--- CLEANING UP ---\n";
        $cleanData = [
            'basic_competencies' => isset($testCourse['basic_competencies']) 
                ? $testCourse['basic_competencies'] 
                : [],
            'common_competencies' => isset($testCourse['common_competencies']) 
                ? $testCourse['common_competencies'] 
                : [],
            'core_competencies' => isset($testCourse['core_competencies']) 
                ? $testCourse['core_competencies'] 
                : []
        ];
        
        $courseModel->update($courseId, $cleanData);
        echo "✓ Test competency removed\n";
        
    } else {
        echo "❌ Update failed: " . ($result['error'] ?? 'Unknown error') . "\n";
    }
    
    echo "\n===========================================\n";
    echo "Test Complete\n";
    echo "===========================================\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
