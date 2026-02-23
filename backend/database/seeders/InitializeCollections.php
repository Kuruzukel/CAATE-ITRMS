<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Initialize MongoDB Collections for CAATE-ITRMS
 * Run this file once to create all collections with indexes
 */

try {
    $db = getMongoConnection();
    
    echo "Initializing CAATE-ITRMS Database Collections...\n\n";
    
    // Collections to create
    $collections = [
        'users' => [
            'indexes' => [
                ['key' => ['email' => 1], 'unique' => true],
                ['key' => ['role' => 1]]
            ]
        ],
        'trainees' => [
            'indexes' => [
                ['key' => ['email' => 1], 'unique' => true],
                ['key' => ['trainee_id' => 1], 'unique' => true]
            ]
        ],
        'courses' => [
            'indexes' => [
                ['key' => ['course_code' => 1], 'unique' => true],
                ['key' => ['title' => 1]]
            ]
        ],
        'enrollments' => [
            'indexes' => [
                ['key' => ['trainee_id' => 1]],
                ['key' => ['course_id' => 1]],
                ['key' => ['status' => 1]]
            ]
        ],
        'schedules' => [
            'indexes' => [
                ['key' => ['course_id' => 1]],
                ['key' => ['date' => 1]]
            ]
        ],
        'attendance' => [
            'indexes' => [
                ['key' => ['trainee_id' => 1]],
                ['key' => ['schedule_id' => 1]],
                ['key' => ['date' => 1]]
            ]
        ],
        'competencies' => [
            'indexes' => [
                ['key' => ['course_id' => 1]],
                ['key' => ['title' => 1]]
            ]
        ],
        'applications' => [
            'indexes' => [
                ['key' => ['email' => 1]],
                ['key' => ['status' => 1]],
                ['key' => ['created_at' => -1]]
            ]
        ],
        'admissions' => [
            'indexes' => [
                ['key' => ['trainee_id' => 1]],
                ['key' => ['status' => 1]],
                ['key' => ['admission_date' => -1]]
            ]
        ],
        'graduates' => [
            'indexes' => [
                ['key' => ['trainee_id' => 1]],
                ['key' => ['course_id' => 1]],
                ['key' => ['graduation_date' => -1]]
            ]
        ],
        'inventory' => [
            'indexes' => [
                ['key' => ['item_code' => 1], 'unique' => true],
                ['key' => ['type' => 1]],
                ['key' => ['category' => 1]]
            ]
        ],
        'requests' => [
            'indexes' => [
                ['key' => ['trainee_id' => 1]],
                ['key' => ['status' => 1]],
                ['key' => ['created_at' => -1]]
            ]
        ]
    ];
    
    foreach ($collections as $collectionName => $config) {
        // Create collection
        try {
            $db->createCollection($collectionName);
            echo "✓ Created collection: {$collectionName}\n";
        } catch (Exception $e) {
            echo "  Collection '{$collectionName}' already exists\n";
        }
        
        // Create indexes
        if (isset($config['indexes'])) {
            $collection = $db->selectCollection($collectionName);
            foreach ($config['indexes'] as $index) {
                try {
                    $options = isset($index['unique']) ? ['unique' => $index['unique']] : [];
                    $collection->createIndex($index['key'], $options);
                    $indexKeys = json_encode($index['key']);
                    echo "  ✓ Created index on {$collectionName}: {$indexKeys}\n";
                } catch (Exception $e) {
                    echo "  Index already exists on {$collectionName}\n";
                }
            }
        }
        echo "\n";
    }
    
    echo "Database initialization completed successfully!\n";
    echo "Database: CAATE-ITRMS\n";
    echo "Total Collections: " . count($collections) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
