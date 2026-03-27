<?php

require_once __DIR__ . '/../models/User.php';

class UserController {
    
    public function index() {
        $userModel = new User();
        $users = $userModel->all();
        
        echo json_encode(['data' => $users]);
    }
    
    public function show($id) {
        $userModel = new User();
        $user = $userModel->findById($id);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        echo json_encode(['data' => $user]);
    }
    
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $userModel = new User();
        $userId = $userModel->create($data);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'User created successfully',
            'id' => $userId
        ]);
    }
    
    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $userModel = new User();
        $result = $userModel->update($id, $data);
        
        if ($result) {
            echo json_encode(['message' => 'User updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    }
    
    public function destroy($id) {
        $userModel = new User();
        $result = $userModel->delete($id);
        
        if ($result) {
            echo json_encode(['message' => 'User deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
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
            echo json_encode(['error' => 'Invalid file type. Only JPG and PNG are allowed']);
            return;
        }
        
        $maxSize = 2 * 1024 * 1024; // 2MB
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File size too large. Maximum 2MB allowed']);
            return;
        }
        
        $uploadDir = __DIR__ . '/../../public/uploads/profiles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'user_' . $id . '_' . time() . '.' . $extension;
        $uploadPath = $uploadDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $userModel = new User();
            $imagePath = '/CAATE-ITRMS/backend/public/uploads/profiles/' . $filename;
            $result = $userModel->update($id, ['profile_image' => $imagePath]);
            
            if ($result) {
                echo json_encode([
                    'message' => 'Profile image updated successfully',
                    'data' => ['image_path' => $imagePath]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update user record']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload file']);
        }
    }
}
