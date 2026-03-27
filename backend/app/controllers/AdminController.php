<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController {
    
    public function index() {
        $adminModel = new Admin();
        $admins = $adminModel->all();
        
        echo json_encode(['data' => $admins]);
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            error_log("AdminController::show - Fetching admin with ID: $id");
            
            $adminModel = new Admin();
            $admin = $adminModel->findById($id);
            
            if (!$admin) {
                error_log("AdminController::show - Admin not found for ID: $id");
                http_response_code(404);
                echo json_encode(['error' => 'Admin not found']);
                return;
            }
            
            $formattedAdmin = [
                'id' => isset($admin['_id']) ? (string)$admin['_id'] : $id,
                'name' => $admin['name'] ?? '',
                'email' => $admin['email'] ?? '',
                'username' => $admin['username'] ?? '',
                'role' => $admin['role'] ?? 'admin',
                'firstName' => $admin['first_name'] ?? '',
                'secondName' => $admin['second_name'] ?? '',
                'middleName' => $admin['middle_name'] ?? '',
                'lastName' => $admin['last_name'] ?? '',
                'suffix' => $admin['suffix'] ?? '',
                'phone' => $admin['phone'] ?? '',
                'address' => $admin['address'] ?? '',
                'created_at' => $admin['created_at'] ?? null,
                'updated_at' => $admin['updated_at'] ?? null,
                'profileImage' => $admin['profile_image'] ?? null
            ];
            
            error_log("AdminController::show - Successfully fetched admin: " . json_encode($formattedAdmin));
            
            echo json_encode(['data' => $formattedAdmin]);
        } catch (Exception $e) {
            error_log("AdminController::show - Exception: " . $e->getMessage());
            error_log("AdminController::show - Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
        }
    }
    
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $adminModel = new Admin();
        $adminId = $adminModel->create($data);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'Admin created successfully',
            'id' => $adminId
        ]);
    }
    
    public function update($id) {
        try {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            
            error_log("=== AdminController::update START ===");
            error_log("AdminController::update - ID: $id");
            error_log("AdminController::update - Raw input: " . $rawInput);
            error_log("AdminController::update - Decoded data: " . json_encode($data));
            error_log("AdminController::update - Data keys: " . implode(', ', array_keys($data ?? [])));
            
            if (!$data) {
                error_log("AdminController::update - ERROR: No data received or invalid JSON");
                http_response_code(400);
                echo json_encode(['error' => 'No data received or invalid JSON']);
                return;
            }
            
            if (!$id || strlen($id) !== 24) {
                error_log("AdminController::update - ERROR: Invalid ID format: $id");
                http_response_code(400);
                echo json_encode(['error' => 'Invalid admin ID format']);
                return;
            }
        
        if (isset($data['username']) && empty(trim($data['username']))) {
            http_response_code(422);
            echo json_encode(['error' => 'Username is required']);
            return;
        }
        
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid email address format']);
            return;
        }
        
        if (isset($data['first_name']) && empty(trim($data['first_name']))) {
            http_response_code(422);
            echo json_encode(['error' => 'First name is required']);
            return;
        }
        
        
        $adminModel = new Admin();
        
        $existingAdmin = $adminModel->findById($id);
        if (!$existingAdmin) {
            error_log("AdminController::update - ERROR: Admin not found with ID: $id");
            http_response_code(404);
            echo json_encode(['error' => 'Admin not found']);
            return;
        }
        
        error_log("AdminController::update - Admin found, proceeding with validation");
        
        if (isset($data['username']) && $data['username'] !== ($existingAdmin['username'] ?? '')) {
            $duplicateAdmin = $adminModel->findByUsername($data['username']);
            if ($duplicateAdmin && (string)$duplicateAdmin['_id'] !== $id) {
                http_response_code(422);
                echo json_encode(['error' => 'Username is already taken']);
                return;
            }
        }
        
        if (isset($data['first_name']) || isset($data['second_name']) || isset($data['middle_name']) || isset($data['last_name']) || isset($data['suffix'])) {
            $firstName = $data['first_name'] ?? $existingAdmin['first_name'] ?? '';
            $secondName = $data['second_name'] ?? $existingAdmin['second_name'] ?? '';
            $middleName = $data['middle_name'] ?? $existingAdmin['middle_name'] ?? '';
            $lastName = $data['last_name'] ?? $existingAdmin['last_name'] ?? '';
            $suffix = $data['suffix'] ?? $existingAdmin['suffix'] ?? '';
            
            $nameParts = array_filter([$firstName, $secondName, $middleName, $lastName, $suffix]);
            $data['name'] = implode(' ', $nameParts);
            
            error_log("AdminController::update - Updated name: " . $data['name']);
        }
        
        error_log("AdminController::update - About to call adminModel->update()");
        error_log("AdminController::update - Final data to save: " . json_encode($data));
        
        $result = $adminModel->update($id, $data);
        
        error_log("AdminController::update - Update result: " . ($result ? 'SUCCESS' : 'FAILED'));
        error_log("=== AdminController::update END ===");
        
        if ($result) {
            echo json_encode(['message' => 'Admin updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update admin profile. Please try again.']);
        }
        
        } catch (Exception $e) {
            error_log("AdminController::update - EXCEPTION: " . $e->getMessage());
            error_log("AdminController::update - Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
        }
    }
    
    public function destroy($id) {
        $adminModel = new Admin();
        $result = $adminModel->delete($id);
        
        if ($result) {
            echo json_encode(['message' => 'Admin deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Admin not found']);
        }
    }
    
    public function uploadProfileImage($id) {
        if (!isset($_FILES['profileImage'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No image file provided']);
            return;
        }
        
        $file = $_FILES['profileImage'];
        
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Only JPG and PNG are allowed.']);
            return;
        }
        
        $maxSize = 2 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File size too large. Maximum 2MB allowed.']);
            return;
        }
        
        $uploadDir = __DIR__ . '/../../public/uploads/profiles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'admin_' . $id . '_' . time() . '.' . $extension;
        $uploadPath = $uploadDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $adminModel = new Admin();
            $imagePath = '/CAATE-ITRMS/backend/public/uploads/profiles/' . $filename;
            
            error_log("AdminController::uploadProfileImage - Updating admin $id with image path: $imagePath");
            
            $result = $adminModel->update($id, ['profile_image' => $imagePath]);
            
            error_log("AdminController::uploadProfileImage - Update result: " . ($result ? 'success' : 'failed'));
            
            if ($result) {
                $updatedAdmin = $adminModel->findById($id);
                error_log("AdminController::uploadProfileImage - Verified profile_image in DB: " . ($updatedAdmin['profile_image'] ?? 'null'));
                
                echo json_encode([
                    'message' => 'Profile image updated successfully',
                    'image_path' => $imagePath
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update admin record']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload file']);
        }
    }
    
    public function testUpdate($id) {
        error_log("=== AdminController::testUpdate START ===");
        
        try {
            $adminModel = new Admin();
            
            $admin = $adminModel->findById($id);
            if (!$admin) {
                error_log("testUpdate - Admin not found");
                echo json_encode(['error' => 'Admin not found', 'id' => $id]);
                return;
            }
            
            error_log("testUpdate - Admin found: " . json_encode($admin));
            
            $testData = ['test_field' => 'test_value_' . time()];
            $result = $adminModel->update($id, $testData);
            
            error_log("testUpdate - Update result: " . ($result ? 'SUCCESS' : 'FAILED'));
            
            echo json_encode([
                'message' => 'Test completed',
                'admin_found' => true,
                'update_result' => $result,
                'test_data' => $testData
            ]);
            
        } catch (Exception $e) {
            error_log("testUpdate - Exception: " . $e->getMessage());
            echo json_encode(['error' => $e->getMessage()]);
        }
        
        error_log("=== AdminController::testUpdate END ===");
    }
}