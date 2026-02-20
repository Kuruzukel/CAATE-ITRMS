<?php
echo "<h1>MongoDB Setup Diagnostic</h1>";
echo "<pre>";

// Check 1: Composer autoloader
echo "=== Checking Composer Autoloader ===\n";
$autoloadPaths = [
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
];

$autoloaderFound = false;
foreach ($autoloadPaths as $path) {
    echo "Checking: $path ... ";
    if (file_exists($path)) {
        echo "✓ FOUND\n";
        require_once $path;
        $autoloaderFound = true;
        break;
    } else {
        echo "✗ NOT FOUND\n";
    }
}

if (!$autoloaderFound) {
    echo "\n❌ ERROR: Composer autoloader not found!\n";
    echo "Solution: Run 'composer install' in the backend directory\n";
    echo "</pre>";
    exit;
}

echo "\n";

// Check 2: MongoDB library
echo "=== Checking MongoDB Library ===\n";
if (class_exists('MongoDB\Client')) {
    echo "✓ MongoDB\\Client class is available\n";
} else {
    echo "✗ MongoDB\\Client class NOT found\n";
    echo "Solution: Run 'composer require mongodb/mongodb' in backend directory\n";
    echo "</pre>";
    exit;
}

echo "\n";

// Check 3: MongoDB extension
echo "=== Checking MongoDB PHP Extension ===\n";
if (extension_loaded('mongodb')) {
    echo "✓ MongoDB extension is loaded\n";
    $version = phpversion('mongodb');
    echo "  Version: $version\n";
} else {
    echo "⚠ MongoDB extension is NOT loaded\n";
    echo "  Note: The library can work without the extension, but it's recommended\n";
}

echo "\n";

// Check 4: Try to connect
echo "=== Testing MongoDB Connection ===\n";
try {
    $client = new MongoDB\Client("mongodb://127.0.0.1:27017");
    echo "✓ MongoDB client created successfully\n";
    
    $databases = $client->listDatabases();
    echo "✓ Successfully connected to MongoDB server\n";
    echo "  Available databases:\n";
    foreach ($databases as $db) {
        echo "    - " . $db->getName() . "\n";
    }
    
} catch (Exception $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
    echo "\nPossible solutions:\n";
    echo "1. Make sure MongoDB server is running\n";
    echo "2. Check if MongoDB is listening on 127.0.0.1:27017\n";
    echo "3. Check firewall settings\n";
}

echo "\n";
echo "=== PHP Information ===\n";
echo "PHP Version: " . phpversion() . "\n";
echo "OS: " . PHP_OS . "\n";

echo "</pre>";

echo "<hr>";
echo "<h2>Next Steps:</h2>";
echo "<ol>";
echo "<li>If all checks pass, you can proceed to <a href='seed.php'>seed the database</a></li>";
echo "<li>If MongoDB library is missing, run: <code>composer install</code> in backend directory</li>";
echo "<li>If MongoDB server is not running, start it</li>";
echo "</ol>";
?>
