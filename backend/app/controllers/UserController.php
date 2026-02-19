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
}
