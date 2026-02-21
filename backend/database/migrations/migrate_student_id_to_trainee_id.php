<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Migration Script: Rename student_id to trainee_id
 * This script renames the student_id field to trainee_id in the trainees collection
 */

try {
    $db = getMongoConnection();
    
    echo "Starting migration: student_id -> trainee_id\n\n";
    
    // Get the trainees collection
    $traineesCollection = $db->selectCollection('trainees');
    
    // Count documents with student_id field
    $countWithStudentId = $traineesCollection->countDocuments(['student_id' => ['$exists' => true]]);
    echo "Found {$countWithStudentId} documents with 'student_id' field\n";
    
    if ($countWithStudentId === 0) {
        echo "No documents to migrate. All documents already use 'trainee_id'.\n";
        exit(0);
    }
    
    // Rename student_id to trainee_id for all documents
    $result = $traineesCollection->updateMany(
        ['student_id' => ['$exists' => true]],
        ['$rename' => ['student_id' => 'trainee_id']]
    );
    
    echo "Migration completed!\n";
    echo "Modified {$result->getModifiedCount()} documents\n";
    
    // Verify the migration
    $countWithTraineeId = $traineesCollection->countDocuments(['trainee_id' => ['$exists' => true]]);
    $countWithStudentId = $traineesCollection->countDocuments(['student_id' => ['$exists' => true]]);
    
    echo "\nVerification:\n";
    echo "Documents with 'trainee_id': {$countWithTraineeId}\n";
    echo "Documents with 'student_id': {$countWithStudentId}\n";
    
    if ($countWithStudentId === 0) {
        echo "\n✓ Migration successful! All documents now use 'trainee_id'\n";
    } else {
        echo "\n⚠ Warning: Some documents still have 'student_id' field\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
