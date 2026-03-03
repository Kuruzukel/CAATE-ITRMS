<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/Trainee.php';
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
        
        if (!isset($data['identifier']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Email/Username and password are required'
            ]);
            return;
        }
        
        $identifier = $data['identifier'];
        $password = $data['password'];
        
        // Try to find user in admins collection first
        $adminModel = new Admin();
        $admin = $adminModel->findByEmailOrUsername($identifier);
        
        if ($admin && isset($admin['password']) && password_verify($password, $admin['password'])) {
            // Admin login successful
            session_start();
            $_SESSION['user_id'] = (string)$admin['_id'];
            $_SESSION['user_role'] = 'admin';
            $_SESSION['user_name'] = $admin['name'];
            $_SESSION['user_email'] = $admin['email'];
            
            $token = JwtHelper::generateToken([
                'user_id' => (string)$admin['_id'],
                'role' => 'admin'
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'admin',
                'user' => [
                    'id' => (string)$admin['_id'],
                    'name' => $admin['name'],
                    'email' => $admin['email'],
                    'username' => $admin['username'] ?? '',
                    'role' => 'admin'
                ]
            ]);
            return;
        }
        
        // Try to find user in trainees collection
        $traineeModel = new Trainee();
        $trainee = $traineeModel->findByEmailOrUsername($identifier);
        
        if ($trainee && isset($trainee['password']) && password_verify($password, $trainee['password'])) {
            // Trainee login successful
            session_start();
            $_SESSION['user_id'] = (string)$trainee['_id'];
            $_SESSION['user_role'] = 'trainee';
            $_SESSION['user_name'] = $trainee['name'] ?? $trainee['fullName'] ?? '';
            $_SESSION['user_email'] = $trainee['email'];
            
            $token = JwtHelper::generateToken([
                'user_id' => (string)$trainee['_id'],
                'role' => 'trainee'
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'trainee',
                'user' => [
                    'id' => (string)$trainee['_id'],
                    'name' => $trainee['name'] ?? $trainee['fullName'] ?? '',
                    'email' => $trainee['email'],
                    'username' => $trainee['username'] ?? '',
                    'role' => 'trainee'
                ]
            ]);
            return;
        }
        
        // Invalid credentials
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);
    }
    
    public function logout() {
        session_start();
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }
    
    public function checkSession() {
        session_start();
        
        if (isset($_SESSION['user_id']) && isset($_SESSION['user_role'])) {
            echo json_encode([
                'success' => true,
                'authenticated' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['user_name'] ?? '',
                    'email' => $_SESSION['user_email'] ?? '',
                    'role' => $_SESSION['user_role']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'authenticated' => false
            ]);
        }
    }
}
