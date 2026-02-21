<?php
/**
 * Migration Script: Rename student_id to trainee_id in trainees collection
 * 
 * This script updates all existing documents in the trainees collection
 * to rename the student_id field to trainee_id
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// MongoDB connection settings
$mongoUri = $_ENV['MONGODB_URI'] ?? 'mongodb://localhost:27017';
$dbName = $_ENV['MONGODB_DATABASE'] ?? 'CAATE-ITRMS';

try {
    // Connect to MongoDB
    $client = new MongoDB\Client($mongoUri);
    $database = $client->selectDatabase($dbName);
    $collection = $database->selectCollection('trainees');
    
    echo "Connected to MongoDB\n";
    echo "Database: $dbName\n";
    echo "Collection: trainees\n\n";
    
    // Find all documents with student_id field
    $documentsWithStudentId = $collection->find(['student_id' => ['$exists' => true]]);
    $count = 0;
    
    foreach ($documentsWithStudentId as $document) {
        $count++;
        $studentId = $document['student_id'];
        
        // Update the document: rename student_id to trainee_id
        $result = $collection->updateOne(
            ['_id' => $document['_id']],
            [
                '$set' => ['trainee_id' => $studentId],
                '$unset' => ['student_id' => '']
            ]
        );
        
        if ($result->getModifiedCount() > 0) {
            echo "✓ Updated document {$document['_id']}: student_id '$studentId' → trainee_id '$studentId'\n";
        }
    }
    
    echo "\n";
    echo "Migration completed successfully!\n";
    echo "Total documents updated: $count\n";
    
    // Verify the migration
    $remainingStudentIds = $collection->countDocuments(['student_id' => ['$exists' => true]]);
    $traineeIds = $collection->countDocuments(['trainee_id' => ['$exists' => true]]);
    
    echo "\nVerification:\n";
    echo "Documents with student_id: $remainingStudentIds\n";
    echo "Documents with trainee_id: $traineeIds\n";
    
    if ($remainingStudentIds === 0) {
        echo "\n✓ All student_id fields have been successfully renamed to trainee_id\n";
    } else {
        echo "\n⚠ Warning: Some documents still have student_id field\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
