<?php

require_once __DIR__ . '/database/seeders/InventorySeeder.php';

echo "===========================================\n";
echo "CAATE Inventory Database Seeder\n";
echo "===========================================\n\n";

try {
    $seeder = new InventorySeeder();
    $seeder->seed();
    
    echo "\n===========================================\n";
    echo "Seeding completed successfully!\n";
    echo "===========================================\n";
} catch (Exception $e) {
    echo "\n===========================================\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "===========================================\n";
    exit(1);
}
