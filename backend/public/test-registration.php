<?php
// Simple test for registration API endpoint

header('Content-Type: text/html');

?>
<!DOCTYPE html>
<html>
<head>
    <title>Registration API Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .test-result { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Registration API Test</h1>
    
    <?php
    // Test data with all fields
    $testDataComplete = [
        'lastName' => 'Test',
        'firstName' => 'User',
        'middleName' => 'Sample',
        'sex' => 'male',
        'civilStatus' => 'single',
        'privacyConsent' => 'agree',
        'uliNumber' => '123-45-678-9012-34',
        'entryDate' => '2024-01-15',
        'contactNo' => '09123456789',
        'emailFacebook' => 'test@example.com'
    ];
    
    // Test data with only required fields
    $testDataMinimal = [
        'lastName' => 'Minimal',
        'firstName' => 'Test',
        'sex' => 'female',
        'civilStatus' => 'married'
    ];
    
    echo '<h2>Test Data (Complete):</h2>';
    echo '<pre>' . json_encode($testDataComplete, JSON_PRETTY_PRINT) . '</pre>';
    
    echo '<h2>Test Data (Minimal - Required Only):</h2>';
    echo '<pre>' . json_encode($testDataMinimal, JSON_PRETTY_PRINT) . '</pre>';
    
    // Function to test API
    function testAPI($testData, $testName) {
        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/CAATE-ITRMS/backend/public/api/v1/registrations';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        echo '<h3>' . $testName . ':</h3>';
        echo '<p><strong>URL:</strong> ' . $url . '</p>';
        echo '<p><strong>HTTP Code:</strong> ' . $httpCode . '</p>';
        
        if ($error) {
            echo '<div class="test-result error">';
            echo '<strong>cURL Error:</strong> ' . $error;
            echo '</div>';
        } else {
            if ($httpCode >= 200 && $httpCode < 300) {
                echo '<div class="test-result success">';
                echo '<strong>Success!</strong> ' . $testName . ' passed.';
                echo '</div>';
            } else {
                echo '<div class="test-result error">';
                echo '<strong>Error:</strong> HTTP ' . $httpCode;
                echo '</div>';
            }
            
            echo '<h4>Response:</h4>';
            echo '<pre>' . htmlspecialchars($response) . '</pre>';
        }
    }
    
    // Test both scenarios
    testAPI($testDataComplete, 'Complete Registration Test');
    testAPI($testDataMinimal, 'Minimal Registration Test (Optional Fields)');
    ?>
    
    <h2>Database Connection Test:</h2>
    <?php
    try {
        require_once __DIR__ . '/../app/config/database.php';
        $db = getMongoConnection();
        
        // Test connection
        $collections = $db->listCollections();
        
        echo '<div class="test-result success">';
        echo '<strong>Success!</strong> MongoDB connection is working.';
        echo '</div>';
        
        echo '<h3>Available Collections:</h3>';
        echo '<ul>';
        foreach ($collections as $collection) {
            echo '<li>' . $collection->getName() . '</li>';
        }
        echo '</ul>';
        
    } catch (Exception $e) {
        echo '<div class="test-result error">';
        echo '<strong>Database Error:</strong> ' . $e->getMessage();
        echo '</div>';
    }
    ?>
    
</body>
</html>