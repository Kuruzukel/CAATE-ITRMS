<?php

echo "========================================\n";
echo "CAATE-ITRMS Complete Database Seeder\n";
echo "========================================\n\n";

echo "Step 1: Seeding Courses...\n";
echo "----------------------------------------\n";
require_once __DIR__ . '/seed_courses.php';

echo "\n\n";

echo "Step 2: Seeding Competencies...\n";
echo "----------------------------------------\n";
require_once __DIR__ . '/seed_competencies.php';

echo "\n\n";

echo "Step 3: Verifying Data...\n";
echo "----------------------------------------\n";
require_once __DIR__ . '/verify_competencies.php';

echo "\n";
echo "========================================\n";
echo "✓ All seeding operations completed!\n";
echo "========================================\n";
