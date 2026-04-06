<?php
/**
 * Cleanup Script: Remove enrollments with Unknown trainee names or Unknown courses
 * This script removes invalid enrollment records from registrations, applications, and admissions collections
 */

echo "<!DOCTYPE html>";
echo "<html><head><title>Cleanup Unknown Enrollments</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:1200px;margin:20px auto;padding:20px;}";
echo "pre{background:#f5f5f5;padding:15px;border-radius:5px;overflow-x:auto;}";
echo ".success{color:#10b981;}.error{color:#ef4444;}.warning{color:#f59e0b;}</style>";
echo "</head><body>";
echo "<h1>🧹 Cleanup Unknown Enrollments</h1>";
echo "<pre>";

// Load composer autoloader
$autoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
];

$autoloaderFound = false;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $autoloaderFound = true;
        break;
    }
}

if (!$autoloaderFound) {
    echo "<span class='error'>❌ ERROR: Composer autoloader not found!</span>\n";
    echo "Solution: Run 'composer install' in the backend directory\n";
    echo "</pre></body></html>";
    exit;
}

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    $db = $client->selectDatabase('CAATE-ITRMS'); // Use the correct database name
    
    echo "<span class='success'>✓ Connected to MongoDB (Database: CAATE-ITRMS)</span>\n\n";
    
    // Collections to clean
    $collections = [
        'registrations' => [
            'nameField' => 'traineeFullName',
            'courseField' => 'selectedCourse'
        ],
        'applications' => [
            'nameField' => null, // Will check via trainee lookup
            'courseField' => null // Will check via course lookup
        ],
        'admissions' => [
            'nameField' => null, // Will check via trainee lookup
            'courseField' => null // Will check via course lookup
        ]
    ];
    
    $totalDeleted = 0;
    
    foreach ($collections as $collectionName => $fields) {
        echo "=== Processing: $collectionName ===\n";
        
        $collection = $db->$collectionName;
        $coursesCollection = $db->courses;
        $traineesCollection = $db->trainees;
        
        $toDelete = [];
        
        // Get all documents
        $documents = $collection->find()->toArray();
        echo "Found " . count($documents) . " total records\n";
        
        foreach ($documents as $doc) {
            $shouldDelete = false;
            $reason = [];
            
            // Check for registrations (has direct fields)
            if ($collectionName === 'registrations') {
                // Check trainee name
                if (isset($fields['nameField'])) {
                    $nameField = $fields['nameField'];
                    $traineeName = $doc[$nameField] ?? '';
                    
                    if (empty($traineeName) || 
                        strtolower(trim($traineeName)) === 'unknown' ||
                        trim($traineeName) === '') {
                        $shouldDelete = true;
                        $reason[] = "Unknown trainee name";
                    }
                }
                
                // Check course name
                if (isset($fields['courseField'])) {
                    $courseField = $fields['courseField'];
                    $courseName = $doc[$courseField] ?? '';
                    
                    if (empty($courseName) || 
                        strtolower(trim($courseName)) === 'unknown course' ||
                        strtolower(trim($courseName)) === 'unknown' ||
                        trim($courseName) === '') {
                        $shouldDelete = true;
                        $reason[] = "Unknown course";
                    }
                }
                
                // Check if course_id or selectedCourseId exists and is valid
                $courseId = $doc['selectedCourseId'] ?? $doc['course_id'] ?? null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                        if (!$course) {
                            $shouldDelete = true;
                            $reason[] = "Course not found in database";
                        }
                    } catch (Exception $e) {
                        $shouldDelete = true;
                        $reason[] = "Invalid course ID";
                    }
                }
                
                // Check if trainee exists
                $traineeId = $doc['userId'] ?? $doc['trainee_id'] ?? null;
                if ($traineeId) {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                        if (!$trainee) {
                            $shouldDelete = true;
                            $reason[] = "Trainee not found in database";
                        }
                    } catch (Exception $e) {
                        $shouldDelete = true;
                        $reason[] = "Invalid trainee ID";
                    }
                }
            }
            
            // Check for applications and admissions (need to lookup)
            if ($collectionName === 'applications' || $collectionName === 'admissions') {
                // Check course
                $courseId = $doc['course_id'] ?? null;
                if (!$courseId) {
                    $shouldDelete = true;
                    $reason[] = "Missing course ID";
                } else {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                        if (!$course) {
                            $shouldDelete = true;
                            $reason[] = "Course not found in database";
                        }
                    } catch (Exception $e) {
                        $shouldDelete = true;
                        $reason[] = "Invalid course ID";
                    }
                }
                
                // Check trainee
                $traineeId = $doc['trainee_id'] ?? null;
                if (!$traineeId) {
                    $shouldDelete = true;
                    $reason[] = "Missing trainee ID";
                } else {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                        if (!$trainee) {
                            $shouldDelete = true;
                            $reason[] = "Trainee not found in database";
                        }
                    } catch (Exception $e) {
                        $shouldDelete = true;
                        $reason[] = "Invalid trainee ID";
                    }
                }
            }
            
            if ($shouldDelete) {
                $toDelete[] = [
                    'id' => $doc['_id'],
                    'reason' => implode(', ', $reason)
                ];
            }
        }
        
        // Delete the records
        if (count($toDelete) > 0) {
            echo "<span class='warning'>Found " . count($toDelete) . " records to delete:</span>\n";
            
            foreach ($toDelete as $item) {
                try {
                    $result = $collection->deleteOne(['_id' => $item['id']]);
                    if ($result->getDeletedCount() > 0) {
                        echo "  <span class='success'>✓</span> Deleted: {$item['id']} - Reason: {$item['reason']}\n";
                        $totalDeleted++;
                    }
                } catch (Exception $e) {
                    echo "  <span class='error'>✗</span> Failed to delete {$item['id']}: " . $e->getMessage() . "\n";
                }
            }
        } else {
            echo "<span class='success'>✓ No invalid records found</span>\n";
        }
        
        echo "\n";
    }
    
    echo "=== Summary ===\n";
    echo "<span class='success'>Total records deleted: $totalDeleted</span>\n";
    echo "\n<span class='success'>✓ Cleanup completed successfully!</span>\n";
    
} catch (Exception $e) {
    echo "<span class='error'>❌ ERROR: " . $e->getMessage() . "</span>\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "</pre>";
echo "<hr>";
echo "<p><a href='dashboard.html' style='padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;'>← Back to Dashboard</a></p>";
echo "<p><strong>Note:</strong> Refresh your admin dashboard to see the updated enrollment feed.</p>";
echo "</body></html>";
?>
