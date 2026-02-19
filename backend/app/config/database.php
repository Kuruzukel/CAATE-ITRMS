<?php

// MongoDB Configuration
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: 27017);
define('DB_NAME', getenv('DB_NAME') ?: 'CAATE-ITRMS');
define('DB_USERNAME', getenv('DB_USERNAME') ?: '');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');

// MongoDB Connection
function getMongoConnection() {
    try {
        $connectionString = "mongodb://";
        
        if (DB_USERNAME && DB_PASSWORD) {
            $connectionString .= DB_USERNAME . ":" . DB_PASSWORD . "@";
        }
        
        $connectionString .= DB_HOST . ":" . DB_PORT;
        
        $client = new MongoDB\Client($connectionString);
        return $client->selectDatabase(DB_NAME);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
}
