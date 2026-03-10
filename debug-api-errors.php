<?php
// Debug script to identify API 500 errors
header('Content-Type: text/html; charset=utf-8');
echo "<h1>CAATE-ITRMS API Debug</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .error{color:red;} .success{color:green;} .warning{color:orange;} pre{background:#f5f5f5;padding:10px;border-radius:5px;}</style>";

echo "<h2>1. Testing MongoDB Connection</h2>";

// Test 1: Check if MongoDB client can be created
try {
    // Try to include the autoloader
    $autoloadPaths = [
        __DIR__ . '/backend/vendor/autoload.php',
        __DIR__ . '/vendor/autoload.php',
    ];
    
    $autoloaderFound = false;
    foreach ($autoloadPaths as $path) {
        if (file_exists($path)) {
            require_once $path;
            $autoloaderFound = true;
            echo "<p class='success'>✓ Autoloader found at: $path</p>";
            break;
        }
    }
    
    if (!$autoloaderFound) {
        echo "<p class='error'>✗ Composer autoloader not found. Run 'composer install' in backend directory.</p>";
        exit;
    }
    
    // Test MongoDB connection
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    $databases = $client->listDatabases();
    echo "<p class='success'>✓ MongoDB connection successful</p>";
    
    // Test specific database
    $db = $client->selectDatabase('CAATE-ITRMS');
    $collections = $db->listCollections();
    echo "<p class='success'>✓ Database 'CAATE-ITRMS' accessible</p>";
    
    echo "<h3>Available Collections:</h3><ul>";
    foreach ($collections as $collection) {
        $name = $collection->getName();
        $count = $db->selectCollection($name)->countDocuments();
        echo "<li>$name ($count documents)</li>";
    }
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<p class='error'>✗ MongoDB Error: " . $e->getMessage() . "</p>";
    echo "<h3>Troubleshooting Steps:</h3>";
    echo "<ol>";
    echo "<li>Make sure MongoDB is running: <code>mongod</code></li>";
    echo "<li>Check if MongoDB is listening on port 27017</li>";
    echo "<li>Install MongoDB PHP library: <code>composer install</code> in backend directory</li>";
    echo "</ol>";
}

echo "<h2>2. Testing API Endpoints</h2>";

// Test the failing endpoints
$endpoints = [
    'http://localhost/CAATE-ITRMS/backend/public/api/v1/trainees/statistics?year=2026',
    'http://localhost/CAATE-ITRMS/backend/public/api/v1/courses/enrollment-statistics',
    'http://localhost/CAATE-ITRMS/backend/public/api/v1/admins/69a6c872e2c5b69c920ce9c2'
];

foreach ($endpoints as $endpoint) {
    echo "<h3>Testing: $endpoint</h3>";
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($endpoint, false, $context);
    $httpCode = 200;
    
    if (isset($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (strpos($header, 'HTTP/') === 0) {
                preg_match('/HTTP\/\d\.\d\s+(\d+)/', $header, $matches);
                if (isset($matches[1])) {
                    $httpCode = (int)$matches[1];
                }
            }
        }
    }
    
    if ($response === false) {
        echo "<p class='error'>✗ Request failed - endpoint not reachable</p>";
    } else {
        echo "<p>HTTP Status: $httpCode</p>";
        if ($httpCode === 200) {
            echo "<p class='success'>✓ Endpoint working</p>";
            echo "<pre>" . htmlspecialchars(substr($response, 0, 500)) . "...</pre>";
        } else {
            echo "<p class='error'>✗ Endpoint returned error</p>";
            echo "<pre>" . htmlspecialchars($response) . "</pre>";
        }
    }
}

echo "<h2>3. Environment Check</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>MongoDB Extension: " . (extension_loaded('mongodb') ? '✓ Loaded' : '✗ Not loaded') . "</p>";
echo "<p>Current Directory: " . __DIR__ . "</p>";

// Check if .env file exists
$envPath = __DIR__ . '/backend/.env';
if (file_exists($envPath)) {
    echo "<p class='success'>✓ .env file found</p>";
} else {
    echo "<p class='warning'>⚠ .env file not found (using defaults)</p>";
    echo "<p>Create .env file from .env.example if needed</p>";
}

?>