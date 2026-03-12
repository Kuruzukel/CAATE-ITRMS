<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/Trainee.php';
require_once __DIR__ . '/../helpers/JwtHelper.php';

class AuthController {
    
    public function register() {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Username, email and password are required'
                ]);
                return;
            }

            $traineeModel = new Trainee();

            // Check if trainee exists by email
            $existingTrainee = $traineeModel->findByEmail($data['email']);
            if ($existingTrainee) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'error' => 'Email already exists'
                ]);
                return;
            }

            // Check if username already exists
            $existingUsername = $traineeModel->findByUsername($data['username']);
            if ($existingUsername) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'error' => 'Username already exists'
                ]);
                return;
            }

            // Generate trainee ID
            $currentYear = date('Y');
            $traineeId = $this->generateTraineeId($traineeModel, $currentYear);

            // Create trainee account - only store username, email, and password
            // Name fields will be empty until filled in by admin
            $traineeData = [
                'trainee_id' => $traineeId,
                'first_name' => '',
                'last_name' => '',
                'middle_name' => '',
                'second_name' => '',
                'suffix' => '',
                'email' => $data['email'],
                'phone' => '',
                'username' => $data['username'],
                'password' => $data['password'],  // Store password as plain text
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];

            $newTraineeId = $traineeModel->create($traineeData);
            $trainee = $traineeModel->findById($newTraineeId);

            $token = JwtHelper::generateToken([
                'user_id' => (string)$trainee['_id'],
                'role' => 'trainee'
            ]);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful',
                'token' => $token,
                'role' => 'trainee',
                'user' => [
                    'id' => (string)$trainee['_id'],
                    'username' => $trainee['username'],
                    'email' => $trainee['email']
                ]
            ]);
        }

        // Helper function to generate trainee ID
        private function generateTraineeId($traineeModel, $year) {
            // Get all trainees with IDs for the current year
            $allTrainees = $traineeModel->all();
            $pattern = "/^TRN-{$year}-(\\d+)$/";
            $maxNumber = 0;

            foreach ($allTrainees as $trainee) {
                if (isset($trainee['trainee_id']) && preg_match($pattern, $trainee['trainee_id'], $matches)) {
                    $number = intval($matches[1]);
                    if ($number > $maxNumber) {
                        $maxNumber = $number;
                    }
                }
            }

            $nextNumber = $maxNumber + 1;
            return sprintf('TRN-%s-%03d', $year, $nextNumber);
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
        
        // Debug logging
        error_log("Login attempt for identifier: " . $identifier);
        
        // Try to find user in admins collection first
        $adminModel = new Admin();
        $admin = $adminModel->findByEmailOrUsername($identifier);
        
        if ($admin) {
            error_log("Admin found: " . json_encode([
                'name' => $admin['name'] ?? 'N/A',
                'email' => $admin['email'] ?? 'N/A',
                'username' => $admin['username'] ?? 'N/A',
                'has_password' => isset($admin['password'])
            ]));
            
            if (isset($admin['password'])) {
                error_log("Password comparison - Input: '$password', Stored: '{$admin['password']}'");
                
                if ($admin['password'] === $password) {
                    // Admin login successful (plain text password comparison)
                    session_start();
                    $_SESSION['user_id'] = (string)$admin['_id'];
                    $_SESSION['user_role'] = 'admin';
                    $_SESSION['user_name'] = $admin['name'];
                    $_SESSION['user_email'] = $admin['email'];
                    

                    
                    $token = JwtHelper::generateToken([
                        'user_id' => (string)$admin['_id'],
                        'role' => 'admin'
                    ]);
                    
                    error_log("Admin login successful");
                    
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
                } else {
                    error_log("Admin password mismatch");
                }
            }
        } else {
            error_log("No admin found with identifier: " . $identifier);
        }
        
        // Try to find user in trainees collection
        $traineeModel = new Trainee();
        $trainee = $traineeModel->findByEmailOrUsername($identifier);
        
        if ($trainee) {
            error_log("Trainee found: " . json_encode([
                'first_name' => $trainee['first_name'] ?? 'N/A',
                'last_name' => $trainee['last_name'] ?? 'N/A',
                'email' => $trainee['email'] ?? 'N/A',
                'has_password' => isset($trainee['password']),
                'password_value' => isset($trainee['password']) ? substr($trainee['password'], 0, 20) . '...' : 'N/A'
            ]));
            
            if (isset($trainee['password'])) {
                // Check if password matches (support both plain text and hashed)
                $passwordMatches = false;
                
                // First try hashed password verification
                if (password_verify($password, $trainee['password'])) {
                    $passwordMatches = true;
                    error_log("Trainee password verified (hashed)");
                } 
                // Fallback to plain text comparison
                elseif ($trainee['password'] === $password) {
                    $passwordMatches = true;
                    error_log("Trainee password verified (plain text)");
                }
                
                if ($passwordMatches) {
                    // Trainee login successful
                    session_start();
                    $_SESSION['user_id'] = (string)$trainee['_id'];
                    $_SESSION['user_role'] = 'trainee';
                    
                    // Build full name from available fields
                    $fullName = trim(
                        ($trainee['first_name'] ?? '') . ' ' . 
                        ($trainee['middle_name'] ?? '') . ' ' . 
                        ($trainee['last_name'] ?? '')
                    );
                    if (empty($fullName)) {
                        $fullName = $trainee['name'] ?? $trainee['fullName'] ?? '';
                    }
                    
                    $_SESSION['user_name'] = $fullName;
                    $_SESSION['user_email'] = $trainee['email'];
                    

                    
                    $token = JwtHelper::generateToken([
                        'user_id' => (string)$trainee['_id'],
                        'role' => 'trainee'
                    ]);
                    
                    error_log("Trainee login successful");
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Login successful',
                        'token' => $token,
                        'role' => 'trainee',
                        'user' => [
                            'id' => (string)$trainee['_id'],
                            'name' => $fullName,
                            'email' => $trainee['email'],
                            'username' => $trainee['username'] ?? '',
                            'role' => 'trainee'
                        ]
                    ]);
                    return;
                } else {
                    error_log("Trainee password verification failed");
                }
            }
        } else {
            error_log("No trainee found with identifier: " . $identifier);
        }
        
        // Invalid credentials - return 200 with error flag to avoid console errors
        error_log("Login failed - invalid credentials");
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);
    }
    
    public function logout() {
        // Set headers to prevent caching
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');
        
        session_start();
        

        
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }
    
    public function checkSession() {
        // Set headers to prevent caching
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');
        
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
    
    public function changePassword() {
        // Get user from Bearer token
        $token = $this->getBearerToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Unauthorized. Please login first.'
            ]);
            return;
        }
        
        // Verify token and get user info
        $userInfo = $this->verifyToken($token);
        if (!$userInfo) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid or expired token'
            ]);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Current password and new password are required'
            ]);
            return;
        }
        
        $userId = $userInfo['id'];
        $userRole = $userInfo['role'];
        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];
        
        // Validate new password strength
        if (strlen($newPassword) < 8) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'New password must be at least 8 characters long'
            ]);
            return;
        }
        
        // Get user based on role
        if ($userRole === 'admin') {
            $adminModel = new Admin();
            $user = $adminModel->findById($userId);
            
            if (!$user) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]);
                return;
            }
            
            // Verify current password
            if ($user['password'] !== $currentPassword) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Current password is incorrect'
                ]);
                return;
            }
            
            // Update password (plain text for admin)
            $adminModel->update($userId, ['password' => $newPassword]);
            
        } else if ($userRole === 'trainee') {
            $traineeModel = new Trainee();
            $user = $traineeModel->findById($userId);
            
            if (!$user) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]);
                return;
            }
            
            // Verify current password (support both hashed and plain text)
            $passwordMatches = false;
            if (password_verify($currentPassword, $user['password'])) {
                $passwordMatches = true;
            } elseif ($user['password'] === $currentPassword) {
                $passwordMatches = true;
            }
            
            if (!$passwordMatches) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Current password is incorrect'
                ]);
                return;
            }
            
            // Update password (hashed for trainee)
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $traineeModel->update($userId, ['password' => $hashedPassword]);
            
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid user role'
            ]);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }

    // Helper method to extract Bearer token from Authorization header
    private function getBearerToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    // Helper method to verify JWT token and extract user info
    private function verifyToken($token) {
        try {
            $decoded = JwtHelper::verifyToken($token);
            if ($decoded) {
                return [
                    'id' => $decoded['user_id'],
                    'role' => $decoded['role']
                ];
            }
        } catch (Exception $e) {
            error_log("Token verification failed: " . $e->getMessage());
        }
        return null;
    }
    
    // Helper method to extract Bearer token from Authorization header
    private function getBearerToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.+)/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
    
    // Helper method to verify JWT token and extract user info
    private function verifyToken($token) {
        try {
            $decoded = JwtHelper::verifyToken($token);
            if ($decoded) {
                return [
                    'id' => $decoded['user_id'],
                    'role' => $decoded['role']
                ];
            }
        } catch (Exception $e) {
            error_log("Token verification failed: " . $e->getMessage());
        }
        return null;
    }
    
}
