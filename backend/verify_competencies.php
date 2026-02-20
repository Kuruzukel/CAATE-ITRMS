<?php

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    $collection = $db->competencies;
    
    echo "========================================\n";
    echo "COMPETENCIES DATABASE VERIFICATION\n";
    echo "========================================\n\n";
    
    // Total count
    $totalCount = $collection->countDocuments([]);
    echo "Total Competencies: {$totalCount}\n\n";
    
    // Count by type
    echo "Breakdown by Type:\n";
    echo "-------------------\n";
    $pipeline = [
        ['$group' => [
            '_id' => '$competency_type',
            'count' => ['$sum' => 1]
        ]],
        ['$sort' => ['_id' => 1]]
    ];
    
    $typeBreakdown = $collection->aggregate($pipeline);
    foreach ($typeBreakdown as $type) {
        echo "  {$type['_id']}: {$type['count']}\n";
    }
    
    // Count by course
    echo "\nBreakdown by Course:\n";
    echo "---------------------\n";
    $pipeline = [
        ['$group' => [
            '_id' => [
                'course_code' => '$course_code',
                'course_title' => '$course_title'
            ],
            'count' => ['$sum' => 1]
        ]],
        ['$sort' => ['_id.course_code' => 1]]
    ];
    
    $courseBreakdown = $collection->aggregate($pipeline);
    foreach ($courseBreakdown as $course) {
        echo "  [{$course['_id']['course_code']}] {$course['_id']['course_title']}: {$course['count']} competencies\n";
    }
    
    // Sample competencies
    echo "\nSample Competencies (First 5):\n";
    echo "-------------------------------\n";
    $samples = $collection->find([], ['limit' => 5]);
    foreach ($samples as $sample) {
        echo "  • [{$sample['competency_type']}] {$sample['competency_name']}\n";
        echo "    Course: {$sample['course_title']}\n\n";
    }
    
    // Check indexes
    echo "Indexes:\n";
    echo "---------\n";
    $indexes = $collection->listIndexes();
    foreach ($indexes as $index) {
        $keys = json_encode($index['key']);
        echo "  • {$index['name']}: {$keys}\n";
    }
    
    echo "\n========================================\n";
    echo "Verification Complete!\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
