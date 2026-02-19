@echo off
echo ========================================
echo CAATE-ITRMS Backend Setup
echo ========================================
echo.

REM Check if Composer is installed
where composer >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer is not installed!
    echo.
    echo Please install Composer from: https://getcomposer.org/download/
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Composer...
composer --version
echo.

echo [2/3] Installing dependencies...
composer require mongodb/mongodb
echo.

echo [3/3] Testing MongoDB connection...
php -r "try { new MongoDB\Client('mongodb://localhost:27017'); echo 'MongoDB connection successful!'; } catch (Exception $e) { echo 'Error: ' . $e->getMessage(); }"
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: php seed_courses.php
echo 3. Or visit: http://localhost/CAATE-ITRMS/backend/public/seed.php
echo.
pause
