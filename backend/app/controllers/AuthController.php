<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/JwtHelper.php';

class AuthController {
    
    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email and password are required']);
            return;
        }
        
        $userModel = new User();
        
        // Check if user exists
        if ($userModel->findByEmail($data['email'])) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already exists']);
            return;
        }
        
        // Create user
        $userId = $userModel->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ]);
        
        $user = $userModel->findById($userId);
        $token = JwtHelper::generateToken(['user_id' => (string)$user['_id']]);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => [
                'id' => (string)$user['_id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    }
    
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }
        
        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);
        
        if (!$user || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }
        
        $token = JwtHelper::generateToken(['user_id' => (string)$user['_id']]);
        
        echo json_encode([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => (string)$user['_id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    }
    
    public function logout() {
        echo json_encode(['message' => 'Logout successful']);
    }
}
