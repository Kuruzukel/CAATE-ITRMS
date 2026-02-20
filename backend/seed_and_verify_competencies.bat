@echo off
echo ========================================
echo CAATE-ITRMS Competencies Seeder
echo ========================================
echo.

echo Checking PHP installation...
php --version
if errorlevel 1 (
    echo ERROR: PHP is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo Checking MongoDB connection...
php -r "require 'app/config/database.php'; try { getMongoConnection(); echo 'MongoDB connection successful!'; } catch (Exception $e) { echo 'ERROR: ' . $e->getMessage(); exit(1); }"
if errorlevel 1 (
    echo.
    echo ERROR: Cannot connect to MongoDB
    echo Please ensure MongoDB is running
    pause
    exit /b 1
)
echo.
echo.

echo ========================================
echo Starting Competencies Seeding...
echo ========================================
echo.
php seed_competencies.php
if errorlevel 1 (
    echo.
    echo ERROR: Seeding failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo Verifying Seeded Data...
echo ========================================
echo.
php verify_competencies.php
echo.

echo ========================================
echo All Done!
echo ========================================
echo.
pause
