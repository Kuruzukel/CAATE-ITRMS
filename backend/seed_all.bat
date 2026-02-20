@echo off
echo ========================================
echo CAATE-ITRMS Complete Database Seeder
echo ========================================
echo.
echo This will seed:
echo   1. Courses
echo   2. Competencies
echo.

php seed_all.php

echo.
echo Press any key to exit...
pause > nul
