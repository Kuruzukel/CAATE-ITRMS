<?php

require_once __DIR__ . '/app/config/database.php';

echo "===========================================\n";
echo "Verifying Dual Collection Update\n";
echo "===========================================\n\n";

try {
    $db = getMongoConnection();
    $coursesCollection = $db->courses;
    $competenciesCollection = $db->competencies;
    
    // Get a sample course
    $sampleCourse = $coursesCollection->findOne(['course_code' => 'NC II - SOCBCN220']);
    
    if (!$sampleCourse) {
        echo "❌ Sample course not found\n";
        exit(1);
    }
    
    echo "Sample Course: {$sampleCourse['course_title']}\n";
    echo "Course Code: {$sampleCourse['course_code']}\n\n";
    
    // Count competencies in courses collection
    echo "--- COURSES COLLECTION ---\n";
    $basicCount = isset($sampleCourse['basic_competencies']) ? count($sampleCourse['basic_competencies']) : 0;
    $commonCount = isset($sampleCourse['common_competencies']) ? count($sampleCourse['common_competencies']) : 0;
    $coreCount = isset($sampleCourse['core_competencies']) ? count($sampleCourse['core_competencies']) : 0;
    
    echo "Basic Competencies: {$basicCount}\n";
    if ($basicCount > 0) {
        foreach ($sampleCourse['basic_competencies'] as $comp) {
            echo "  • {$comp}\n";
        }
    }
    
    echo "\nCommon Competencies: {$commonCount}\n";
    if ($commonCount > 0) {
        foreach ($sampleCourse['common_competencies'] as $comp) {
            echo "  • {$comp}\n";
        }
    }
    
    echo "\nCore Competencies: {$coreCount}\n";
    if ($coreCount > 0) {
        foreach ($sampleCourse['core_competencies'] as $comp) {
            echo "  • {$comp}\n";
        }
    }
    
    $totalInCourse = $basicCount + $commonCount + $coreCount;
    echo "\nTotal in courses collection: {$totalInCourse}\n\n";
    
    // Count competencies in competencies collection
    echo "--- COMPETENCIES COLLECTION ---\n";
    $basicDocs = $competenciesCollection->countDocuments([
        'course_code' => $sampleCourse['course_code'],
        'competency_type' => 'Basic'
    ]);
    $commonDocs = $competenciesCollection->countDocuments([
        'course_code' => $sampleCourse['course_code'],
        'competency_type' => 'Common'
    ]);
    $coreDocs = $competenciesCollection->countDocuments([
        'course_code' => $sampleCourse['course_code'],
        'competency_type' => 'Core'
    ]);
    
    echo "Basic Competencies: {$basicDocs}\n";
    echo "Common Competencies: {$commonDocs}\n";
    echo "Core Competencies: {$coreDocs}\n";
    
    $totalInCompetencies = $basicDocs + $commonDocs + $coreDocs;
    echo "\nTotal in competencies collection: {$totalInCompetencies}\n\n";
    
    // Verify sync
    echo "--- SYNC STATUS ---\n";
    if ($totalInCourse === $totalInCompetencies) {
        echo "✓ Collections are in sync!\n";
        echo "✓ Both collections have {$totalInCourse} competencies for this course\n";
    } else {
        echo "⚠ Collections are NOT in sync\n";
        echo "  Courses collection: {$totalInCourse}\n";
        echo "  Competencies collection: {$totalInCompetencies}\n";
    }
    
    echo "\n===========================================\n";
    echo "Verification Complete\n";
    echo "===========================================\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
