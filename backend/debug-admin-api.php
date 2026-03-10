<?php

require_once __DIR__ . '/app/controllers/AdminController.php';

// Test the AdminController directly
echo "Testing AdminController with ID: 69a6c872e2c5b69c920ce9c2\n";
echo "=======================================================\n\n";

try {
    $controller = new AdminController();
    
    // Capture the output
    ob_start();
    $controller->show('69a6c872e2c5b69c920ce9c2');
    $output = ob_get_clean();
    
    echo "API Response:\n";
    echo $output . "\n\n";
    
    // Parse and display formatted
    $data = json_decode($output, true);
    if ($data && isset($data['data'])) {
        echo "Formatted Data:\n";
        echo "===============\n";
        foreach ($data['data'] as $key => $value) {
            echo sprintf("%-15s: %s\n", $key, $value ?? 'null');
        }
    } else {
        echo "Error: Could not parse response or no data found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

?>