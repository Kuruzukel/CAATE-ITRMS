<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController {
    
    public function index() {
        $adminModel = new Admin();
        $admins = $adminModel->all();
        
        echo json_encode(['data' => $admins]);
    }
    
    public function show($id) {
        $adminModel = new Admin();
        $admin = $adminModel->findById($id);
        
        if (!$admin) {
            http_response_code(404);
            echo json_encode(['error' => 'Admin not found']);
            return;
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
            'profileImage' => $admin['profile_image'] ?? null
        ];
        
        echo json_encode(['data' => $formattedAdmin]);
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
        
        $adminModel = new Admin();
        $result = $adminModel->update($id, $data);
        
        if ($result) {
            echo json_encode(['message' => 'Admin updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Admin not found']);
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