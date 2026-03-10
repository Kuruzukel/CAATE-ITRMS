<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController {
    
    public function index() {
        $adminModel = new Admin();
        $admins = $adminModel->all();
        
        echo json_encode(['data' => $admins]);
    }
    
    public function show($id) {
        try {
            $adminModel = new Admin();
            $admin = $adminModel->findById($id);
            
            if (!$admin) {
                http_response_code(404);
                echo json_encode(['error' => 'Admin not found']);
                return;
            }
            
            // Format login history if it exists
            $loginHistory = [];
            if (isset($admin['login_history'])) {
                $historyArray = $admin['login_history'];
                
                // Convert BSON array to PHP array properly
                if ($historyArray instanceof MongoDB\Model\BSONArray) {
                    // Use iterator to convert BSONArray to regular PHP array
                    $historyArray = iterator_to_array($historyArray);
                } elseif ($historyArray instanceof MongoDB\BSON\PackedArray) {
                    // Handle PackedArray type
                    $historyArray = $historyArray->toArray();
                } elseif (is_object($historyArray) && method_exists($historyArray, 'toArray')) {
                    $historyArray = $historyArray->toArray();
                } elseif (is_object($historyArray)) {
                    $historyArray = (array)$historyArray;
                }
                
                if (is_array($historyArray)) {
                    foreach (array_reverse($historyArray) as $entry) {
                        // Convert BSON document to array if needed
                        if (is_object($entry)) {
                            $entry = (array)$entry;
                        }
                        
                        $loginHistory[] = [
                            'timestamp' => $entry['timestamp'] ?? null,
                            'action' => $entry['action'] ?? 'unknown',
                            'ip_address' => $entry['ip_address'] ?? ($entry['ipAddress'] ?? 'Unknown'),
                            'device' => $entry['device'] ?? 'Unknown',
                            'status' => $entry['status'] ?? 'unknown'
                        ];
                    }
                }
            }
            
            // Format the admin data for the frontend
            $formattedAdmin = [
                'id' => (string)$admin['_id'],
                'name' => $admin['name'] ?? '',
                'email' => $admin['email'] ?? '',
                'username' => $admin['username'] ?? '',
                'role' => $admin['role'] ?? 'admin',
                'firstName' => $admin['first_name'] ?? '',
                'middleName' => $admin['middle_name'] ?? '',
                'lastName' => $admin['last_name'] ?? '',
                'phone' => $admin['phone'] ?? '',
                'address' => $admin['address'] ?? '',
                'created_at' => $admin['created_at'] ?? null,
                'updated_at' => $admin['updated_at'] ?? null,
                'lastLogin' => $admin['last_login'] ?? null,
                'lastLogout' => $admin['last_logout'] ?? null,
                'loginHistory' => $loginHistory,
                'profileImage' => $admin['profile_image'] ?? null
            ];
            
            echo json_encode(['data' => $formattedAdmin]);
        } catch (Exception $e) {
            error_log("AdminController::show - Exception: " . $e->getMessage());
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
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Log the incoming data for debugging
        error_log("AdminController::update - ID: $id");
        error_log("AdminController::update - Data: " . json_encode($data));
        
        // Validate required fields
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
        
        if (isset($data['last_name']) && empty(trim($data['last_name']))) {
            http_response_code(422);
            echo json_encode(['error' => 'Last name is required']);
            return;
        }
        
        // If individual name fields are being updated, also update the combined name field
        if (isset($data['first_name']) || isset($data['middle_name']) || isset($data['last_name'])) {
            $adminModel = new Admin();
            $currentAdmin = $adminModel->findById($id);
            
            if (!$currentAdmin) {
                http_response_code(404);
                echo json_encode(['error' => 'Admin not found']);
                return;
            }
            
            $firstName = $data['first_name'] ?? $currentAdmin['first_name'] ?? '';
            $middleName = $data['middle_name'] ?? $currentAdmin['middle_name'] ?? '';
            $lastName = $data['last_name'] ?? $currentAdmin['last_name'] ?? '';
            
            // Construct full name
            $nameParts = array_filter([$firstName, $middleName, $lastName]);
            $data['name'] = implode(' ', $nameParts);
            
            error_log("AdminController::update - Updated name: " . $data['name']);
        }
        
        $adminModel = new Admin();
        $result = $adminModel->update($id, $data);
        
        error_log("AdminController::update - Result: " . ($result ? 'success' : 'failed'));
        
        if ($result) {
            echo json_encode(['message' => 'Admin updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update admin profile. Please try again.']);
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
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Only JPG and PNG are allowed.']);
            return;
        }
        
        // Validate file size (2MB max)
        $maxSize = 2 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File size too large. Maximum 2MB allowed.']);
            return;
        }
        
        // Create upload directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../public/uploads/profiles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'admin_' . $id . '_' . time() . '.' . $extension;
        $uploadPath = $uploadDir . $filename;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            // Update admin record with new profile image path
            $adminModel = new Admin();
            $imagePath = '/CAATE-ITRMS/backend/public/uploads/profiles/' . $filename;
            $result = $adminModel->update($id, ['profile_image' => $imagePath]);
            
            if ($result) {
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
}