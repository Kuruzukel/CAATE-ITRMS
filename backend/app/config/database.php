<?php

// Load Composer autoloader if it exists
$autoloadPaths = [
    __DIR__ . '/../../../vendor/autoload.php',  // Project root
    __DIR__ . '/../../vendor/autoload.php',      // Backend folder
];

foreach ($autoloadPaths as $autoloadPath) {
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
        break;
    }
}

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
        
        // Test the connection
        $client->listDatabases();
        
        return $client->selectDatabase(DB_NAME);
    } catch (MongoDB\Driver\Exception\ConnectionTimeoutException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'MongoDB connection timeout. Is MongoDB running on ' . DB_HOST . ':' . DB_PORT . '?'
        ]);
        exit();
    } catch (MongoDB\Driver\Exception\Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'MongoDB error: ' . $e->getMessage()
        ]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit();
    }
}
