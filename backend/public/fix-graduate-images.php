<?php

require_once __DIR__ . '/../app/config/database.php';

header('Content-Type: application/json');

try {
    $db = getMongoConnection();
    $graduatesCollection = $db->graduates;
    
    // Find all graduates with old image URLs
    $graduates = $graduatesCollection->find([
        'image_url' => ['$regex' => '^/uploads/graduates/']
    ]);
    
    $updatedCount = 0;
    
    foreach ($graduates as $graduate) {
        $oldImageUrl = $graduate['image_url'];
        
        // Extract just the filename
        $filename = basename($oldImageUrl);
        
        // Create new URL
        $newImageUrl = 'http://localhost/CAATE-ITRMS/backend/public/uploads/graduates/' . $filename;
        
        // Update the graduate
        $result = $graduatesCollection->updateOne(
            ['_id' => $graduate['_id']],
            ['$set' => ['image_url' => $newImageUrl]]
        );
        
        if ($result->getModifiedCount() > 0) {
            $updatedCount++;
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Updated $updatedCount graduate image URLs",
        'updated' => $updatedCount
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
