<?php

// Check if this is an API request
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($requestUri, '/api/') !== false) {
    // API Request
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/../app/config/database.php';
    require_once __DIR__ . '/../routes/api.php';

    // Handle OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Route handler
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    handleRequest($requestUri, $requestMethod);
} else {
    // Web Request - Show welcome page
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CAATE-ITRMS Backend API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                padding: 50px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 600px;
                text-align: center;
            }
            
            h1 {
                color: #667eea;
                font-size: 2.5em;
                margin-bottom: 20px;
            }
            
            p {
                color: #666;
                font-size: 1.2em;
                margin-bottom: 30px;
            }
            
            .links {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            a {
                display: block;
                padding: 15px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                transition: all 0.3s;
            }
            
            a:hover {
                background: #764ba2;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .status {
                margin-top: 30px;
                padding: 15px;
                background: #d4edda;
                color: #155724;
                border-radius: 10px;
                font-weight: 600;
            }
            
            .endpoints {
                margin-top: 30px;
                text-align: left;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
            }
            
            .endpoints h3 {
                color: #667eea;
                margin-bottom: 15px;
            }
            
            .endpoints code {
                display: block;
                background: #e9ecef;
                padding: 8px 12px;
                border-radius: 5px;
                margin: 5px 0;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 CAATE-ITRMS</h1>
            <p>Integrated Training & Resource Management System</p>
            
            <div class="status">
                ✅ Backend API is Running
            </div>
            
            <div class="links">
                <a href="view-data.php" target="_blank">📊 View Database Data</a>
                <a href="api-data.php" target="_blank">🔌 View JSON API Data</a>
            </div>
            
            <div class="endpoints">
                <h3>API Endpoints</h3>
                <code>POST /api/v1/auth/register</code>
                <code>POST /api/v1/auth/login</code>
                <code>POST /api/v1/auth/logout</code>
                <code>GET /api/v1/users</code>
                <code>GET /api/v1/users/{id}</code>
            </div>
        </div>
    </body>
    </html>
    <?php
}
