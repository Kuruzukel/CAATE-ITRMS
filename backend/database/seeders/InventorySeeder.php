<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

class InventorySeeder {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getDatabase();
    }
    
    public function seed() {
        echo "Starting inventory seeding...\n";
        
        // Seed CAATE Inventory
        $this->seedCaateInventory();
        
        // Seed Audit Inventory
        $this->seedAuditInventory();
        
        echo "Inventory seeding completed!\n";
    }
    
    private function seedCaateInventory() {
        echo "Seeding CAATE Inventory...\n";
        
        $collection = $this->db->selectCollection('caate-inventory');
        
        // Clear existing data
        $collection->deleteMany([]);
        
        // Load data from JSON files
        $nailCareData = $this->loadJsonFile(__DIR__ . '/../../../inventory-data/json/nail-care-inventory.json');
        $skinCareData = $this->loadJsonFile(__DIR__ . '/../../../inventory-data/json/skin-care-inventory.json');
        
        $allData = array_merge($nailCareData, $skinCareData);
        
        if (!empty($allData)) {
            // Convert date strings to MongoDB date objects
            foreach ($allData as &$item) {
                if (isset($item['created_at'])) {
                    $item['created_at'] = new MongoDB\BSON\UTCDateTime(strtotime($item['created_at']) * 1000);
                }
                if (isset($item['updated_at'])) {
                    $item['updated_at'] = new MongoDB\BSON\UTCDateTime(strtotime($item['updated_at']) * 1000);
                }
            }
            
            $result = $collection->insertMany($allData);
            echo "Inserted " . $result->getInsertedCount() . " CAATE inventory items\n";
        } else {
            echo "No CAATE inventory data found\n";
        }
    }
    
    private function seedAuditInventory() {
        echo "Seeding Audit Inventory...\n";
        
        $collection = $this->db->selectCollection('audit-inventory');
        
        // Clear existing data
        $collection->deleteMany([]);
        
        // Load data from JSON files (same data for now)
        $nailCareData = $this->loadJsonFile(__DIR__ . '/../../../inventory-data/json/nail-care-inventory.json');
        $skinCareData = $this->loadJsonFile(__DIR__ . '/../../../inventory-data/json/skin-care-inventory.json');
        
        $allData = array_merge($nailCareData, $skinCareData);
        
        if (!empty($allData)) {
            // Convert date strings to MongoDB date objects
            foreach ($allData as &$item) {
                if (isset($item['created_at'])) {
                    $item['created_at'] = new MongoDB\BSON\UTCDateTime(strtotime($item['created_at']) * 1000);
                }
                if (isset($item['updated_at'])) {
                    $item['updated_at'] = new MongoDB\BSON\UTCDateTime(strtotime($item['updated_at']) * 1000);
                }
            }
            
            $result = $collection->insertMany($allData);
            echo "Inserted " . $result->getInsertedCount() . " audit inventory items\n";
        } else {
            echo "No audit inventory data found\n";
        }
    }
    
    private function loadJsonFile($filePath) {
        if (!file_exists($filePath)) {
            echo "Warning: File not found: $filePath\n";
            return [];
        }
        
        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo "Error decoding JSON from $filePath: " . json_last_error_msg() . "\n";
            return [];
        }
        
        return $data;
    }
}

// Run the seeder
if (php_sapi_name() === 'cli') {
    $seeder = new InventorySeeder();
    $seeder->seed();
}
