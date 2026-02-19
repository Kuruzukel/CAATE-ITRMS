@echo off
echo ========================================
echo Installing Composer Dependencies
echo ========================================
echo.

REM Check if composer is installed
where composer >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Composer is not installed or not in PATH
    echo.
    echo Please install Composer from: https://getcomposer.org/download/
    echo.
    pause
    exit /b 1
)

echo Composer found!
echo.

REM Install dependencies
echo Running: composer install
composer install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Dependencies installed
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Make sure MongoDB server is running
    echo 2. Visit: http://localhost/CAATE-ITRMS/backend/public/check_mongodb.php
    echo 3. Then visit: http://localhost/CAATE-ITRMS/backend/public/seed.php
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Installation failed
    echo ========================================
    echo.
)

pause
