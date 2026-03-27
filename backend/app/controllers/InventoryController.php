<?php

class InventoryController {
    private $db;
    private $collection;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getDatabase();
        
        $collectionName = $_GET['collection'] ?? 'inventory';
        
        $this->collection = $this->db->selectCollection($collectionName);
    }
    
    public function index() {
        try {
            $filter = [];
            
            $inventoryType = $_GET['inventory_type'] ?? null;
            $program = $_GET['program'] ?? null;
            $stockStatus = $_GET['stock_status'] ?? null;
            $search = $_GET['search'] ?? null;
            
            if ($inventoryType) {
                $filter['inventory_type'] = $inventoryType;
            }
            
            if ($program) {
                $filter['program'] = $program;
            }
            
            if ($stockStatus) {
                $filter['stock_status'] = $stockStatus;
            }
            
            if ($search) {
                $filter['item_name'] = new MongoDB\BSON\Regex($search, 'i');
            }
            
            $options = [
                'sort' => ['created_at' => -1]
            ];
            
            $cursor = $this->collection->find($filter, $options);
            $items = iterator_to_array($cursor);
            
            foreach ($items as &$item) {
                if (isset($item['_id'])) {
                    $item['_id'] = (string) $item['_id'];
                }
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => array_values($items),
                'count' => count($items)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        try {
            $item = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if (!$item) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Item not found'
                ]);
                return;
            }
            
            $item['_id'] = (string) $item['_id'];
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $item
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function store() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $required = ['program', 'inventory_type', 'item_name', 'specification', 'quantity_required', 'quantity_on_site'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'error' => "Missing required field: $field"
                    ]);
                    return;
                }
            }
            
            $qtyRequired = (int) $data['quantity_required'];
            $qtyOnSite = (int) $data['quantity_on_site'];
            $difference = $qtyOnSite - $qtyRequired;
            
            $stockStatus = 'In Stock';
            if ($qtyOnSite == 0) {
                $stockStatus = 'Out of Stock';
            } elseif ($qtyOnSite < $qtyRequired) {
                $stockStatus = 'Low Stock';
            }
            
            $item = [
                'program' => $data['program'],
                'inventory_type' => $data['inventory_type'],
                'item_name' => $data['item_name'],
                'specification' => $data['specification'],
                'quantity_required' => $qtyRequired,
                'quantity_on_site' => $qtyOnSite,
                'difference' => $difference,
                'stock_status' => $stockStatus,
                'inspector_remarks' => $data['inspector_remarks'] ?? '',
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $this->collection->insertOne($item);
            $item['_id'] = (string) $result->getInsertedId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'data' => $item,
                'message' => 'Item created successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $existingItem = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if (!$existingItem) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Item not found'
                ]);
                return;
            }
            
            $updateData = [];
            
            $normalize = function($value) {
                if ($value === null || $value === '' || $value === 'N/A') {
                    return '';
                }
                return trim((string)$value);
            };
            
            if (isset($data['program']) && $normalize($data['program']) !== $normalize($existingItem['program'] ?? '')) {
                $updateData['program'] = $data['program'];
            }
            if (isset($data['inventory_type']) && $normalize($data['inventory_type']) !== $normalize($existingItem['inventory_type'] ?? '')) {
                $updateData['inventory_type'] = $data['inventory_type'];
            }
            if (isset($data['item_name']) && $normalize($data['item_name']) !== $normalize($existingItem['item_name'] ?? '')) {
                $updateData['item_name'] = $data['item_name'];
            }
            if (isset($data['specification']) && $normalize($data['specification']) !== $normalize($existingItem['specification'] ?? '')) {
                $updateData['specification'] = $data['specification'];
            }
            if (isset($data['quantity_required']) && (int)$data['quantity_required'] !== (int)($existingItem['quantity_required'] ?? 0)) {
                $updateData['quantity_required'] = (int) $data['quantity_required'];
            }
            if (isset($data['quantity_on_site']) && (int)$data['quantity_on_site'] !== (int)($existingItem['quantity_on_site'] ?? 0)) {
                $updateData['quantity_on_site'] = (int) $data['quantity_on_site'];
            }
            if (isset($data['inspector_remarks']) && $normalize($data['inspector_remarks']) !== $normalize($existingItem['inspector_remarks'] ?? '')) {
                $updateData['inspector_remarks'] = $data['inspector_remarks'];
            }
            if (isset($data['stock_status']) && $normalize($data['stock_status']) !== $normalize($existingItem['stock_status'] ?? '')) {
                $updateData['stock_status'] = $data['stock_status'];
            }
            
            if (isset($updateData['quantity_required']) || isset($updateData['quantity_on_site'])) {
                $qtyRequired = $updateData['quantity_required'] ?? (int)($existingItem['quantity_required'] ?? 0);
                $qtyOnSite = $updateData['quantity_on_site'] ?? (int)($existingItem['quantity_on_site'] ?? 0);
                
                $newDifference = $qtyOnSite - $qtyRequired;
                $existingDifference = (int)($existingItem['difference'] ?? 0);
                
                if ($newDifference !== $existingDifference) {
                    $updateData['difference'] = $newDifference;
                }
                
                $newStockStatus = 'In Stock';
                if ($qtyOnSite == 0) {
                    $newStockStatus = 'Out of Stock';
                } elseif ($qtyOnSite < $qtyRequired) {
                    $newStockStatus = 'Low Stock';
                }
                
                $existingStockStatus = $normalize($existingItem['stock_status'] ?? '');
                if ($normalize($newStockStatus) !== $existingStockStatus) {
                    $updateData['stock_status'] = $newStockStatus;
                }
            }
            
            if (empty($updateData)) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'No changes made',
                    'modified' => false
                ]);
                return;
            }
            
            $updateData['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $updateData]
            );
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Item updated successfully',
                'modified' => true
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function destroy($id) {
        try {
            $collectionName = $_GET['collection'] ?? 'inventory';
            $collection = $this->db->selectCollection($collectionName);
            
            $result = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if ($result->getDeletedCount() === 0) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Item not found'
                ]);
                return;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Item deleted successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function statistics() {
        try {
            $totalItems = $this->collection->countDocuments([]);
            $inStock = $this->collection->countDocuments(['stock_status' => 'In Stock']);
            $lowStock = $this->collection->countDocuments(['stock_status' => 'Low Stock']);
            $outOfStock = $this->collection->countDocuments(['stock_status' => 'Out of Stock']);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'total_items' => $totalItems,
                    'in_stock' => $inStock,
                    'low_stock' => $lowStock,
                    'out_of_stock' => $outOfStock
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function getFilterOptions() {
        try {
            $programs = $this->collection->distinct('program');
            
            $stockStatuses = $this->collection->distinct('stock_status');
            
            sort($programs);
            sort($stockStatuses);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'programs' => array_values(array_filter($programs)), // Remove null/empty values
                    'stock_statuses' => array_values(array_filter($stockStatuses))
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
