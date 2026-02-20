<?php

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $courses = $db->courses->find([], ['limit' => 1]);
    
    foreach ($courses as $course) {
        echo "Course: " . $course['title'] . "\n\n";
        
        if (isset($course['basic_competencies'])) {
            echo "Basic Competencies: " . count($course['basic_competencies']) . "\n";
            foreach ($course['basic_competencies'] as $comp) {
                echo "  - $comp\n";
            }
        }
        
        if (isset($course['common_competencies'])) {
            echo "\nCommon Competencies: " . count($course['common_competencies']) . "\n";
            foreach ($course['common_competencies'] as $comp) {
                echo "  - $comp\n";
            }
        }
        
        if (isset($course['core_competencies'])) {
            echo "\nCore Competencies: " . count($course['core_competencies']) . "\n";
            foreach ($course['core_competencies'] as $comp) {
                echo "  - $comp\n";
            }
        }
    }
    
    echo "\n\nCompetencies are available in the API!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
