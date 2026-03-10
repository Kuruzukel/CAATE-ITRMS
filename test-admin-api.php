<?php
// Test the specific admin API endpoint that's failing
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Testing Admin API Endpoint</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .error{color:red;} .success{color:green;} pre{background:#f5f5f5;padding:10px;border-radius:5px;overflow:auto;}</style>";

// Include required files
require_once __DIR__ . '/backend/vendor/autoload.php';
require_once __DIR__ . '/backend/app/config/database.php';
require_once __DIR__ . '/backend/app/models/Admin.php';
require_once __DIR__ . '/backend/app/controllers/AdminController.php';

echo "<h2>Testing AdminController::show('69a6c872e2c5b69c920ce9c2')</h2>";
try {
    $controller = new AdminController();
    
    // Capture output
    ob_start();
    $controller->show('69a6c872e2c5b69c920ce9c2');
    $output = ob_get_clean();
    
    echo "<p class='success'>✓ Method executed without fatal errors</p>";
    echo "<h3>Output:</h3><pre>" . htmlspecialchars($output) . "</pre>";
    
    // Try to decode JSON to verify it's valid
    $decoded = json_decode($output, true);
    if ($decoded !== null) {
        echo "<p class='success'>✓ Valid JSON response</p>";
        if (isset($decoded['data'])) {
            echo "<p class='success'>✓ Data field present</p>";
            if (isset($decoded['data']['loginHistory'])) {
                echo "<p class='success'>✓ Login history processed successfully</p>";
                echo "<p>Login history entries: " . count($decoded['data']['loginHistory']) . "</p>";
            }
        }
    } else {
        echo "<p class='error'>✗ Invalid JSON response</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>✗ Exception: " . $e->getMessage() . "</p>";
    echo "<p>File: " . $e->getFile() . " Line: " . $e->getLine() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<h2>Testing Direct Admin Model</h2>";
try {
    $adminModel = new Admin();
    $admin = $adminModel->findById('69a6c872e2c5b69c920ce9c2');
    
    if ($admin) {
        echo "<p class='success'>✓ Admin found in database</p>";
        echo "<p>Admin name: " . ($admin['name'] ?? 'N/A') . "</p>";
        echo "<p>Login history field type: " . gettype($admin['login_history'] ?? null) . "</p>";
        
        if (isset($admin['login_history'])) {
            $historyType = get_class($admin['login_history']);
            echo "<p>Login history class: " . $historyType . "</p>";
        }
    } else {
        echo "<p class='error'>✗ Admin not found</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>✗ Database query failed: " . $e->getMessage() . "</p>";
}

?>