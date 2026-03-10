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
}