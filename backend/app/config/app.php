<?php

// Application Configuration
define('APP_NAME', getenv('APP_NAME') ?: 'CAATE Backend');
define('APP_ENV', getenv('APP_ENV') ?: 'development');
define('APP_DEBUG', getenv('APP_DEBUG') ?: true);
define('APP_URL', getenv('APP_URL') ?: 'http://localhost');

// JWT Secret Key
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-this');
define('JWT_EXPIRATION', 3600 * 24); // 24 hours
