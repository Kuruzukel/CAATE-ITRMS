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

            $existingTrainee = $traineeModel->findByEmail($data['email']);
            if ($existingTrainee) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'error' => 'Email already exists'
                ]);
                return;
            }

            $existingUsername = $traineeModel->findByUsername($data['username']);
            if ($existingUsername) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'error' => 'Username already exists'
                ]);
                return;
            }

            $currentYear = date('Y');
            $traineeId = $this->generateTraineeId($traineeModel, $currentYear);

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

        private function generateTraineeId($traineeModel, $year) {
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
        
        error_log("Login attempt for identifier: " . $identifier);
        
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
                $passwordMatches = false;
                
                if (password_verify($password, $trainee['password'])) {
                    $passwordMatches = true;
                    error_log("Trainee password verified (hashed)");
                } 
                elseif ($trainee['password'] === $password) {
                    $passwordMatches = true;
                    error_log("Trainee password verified (plain text)");
                }
                
                if ($passwordMatches) {
                    session_start();
                    $_SESSION['user_id'] = (string)$trainee['_id'];
                    $_SESSION['user_role'] = 'trainee';
                    
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
                            'profile_image' => $trainee['profile_image'] ?? '',
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
        
        error_log("Login failed - invalid credentials");
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);
    }
    
    public function logout() {
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
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        error_log("=== AuthController::changePassword - START ===");
        error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
        error_log("Request URI: " . $_SERVER['REQUEST_URI']);
        
        try {
            $token = $this->getBearerToken();
            
            error_log("AuthController::changePassword - Token received: " . ($token ? "yes" : "no"));
            
            if (!$token) {
                error_log("AuthController::changePassword - No token provided");
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Unauthorized. Please login first.'
                ]);
                return;
            }
            
            $userInfo = $this->verifyToken($token);
            if (!$userInfo) {
                error_log("AuthController::changePassword - Token verification failed");
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid or expired token'
                ]);
                return;
            }
            
            $rawInput = file_get_contents('php://input');
            error_log("AuthController::changePassword - Raw input: " . $rawInput);
            
            $data = json_decode($rawInput, true);
            error_log("AuthController::changePassword - Decoded data: " . json_encode($data));
            error_log("AuthController::changePassword - Has currentPassword: " . (isset($data['currentPassword']) ? 'yes' : 'no'));
            error_log("AuthController::changePassword - Has newPassword: " . (isset($data['newPassword']) ? 'yes' : 'no'));
            
            if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
                error_log("AuthController::changePassword - Missing required fields");
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Current password and new password are required'
                ]);
                return;
            }
            
            $userId = $userInfo['id'];
            $userRole = $userInfo['role'];
            $currentPassword = trim($data['currentPassword']);
            $newPassword = trim($data['newPassword']);
            
            error_log("AuthController::changePassword - User ID: $userId, Role: $userRole");
            
            if ($currentPassword === $newPassword) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'New password must be different from current password'
                ]);
                return;
            }
            
            if (strlen($newPassword) < 8) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'New password must be at least 8 characters long'
                ]);
                return;
            }
            
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
                
                $storedPassword = trim($user['password']);
                error_log("AuthController::changePassword - Admin stored password: " . $storedPassword);
                error_log("AuthController::changePassword - Admin current password input: " . $currentPassword);
                
                if ($storedPassword !== $currentPassword) {
                    error_log("AuthController::changePassword - Admin password verification failed");
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Current password is incorrect'
                    ]);
                    return;
                }
                
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
                
                $passwordMatches = false;
                
                error_log("AuthController::changePassword - Stored password: " . $user['password']);
                error_log("AuthController::changePassword - Current password input: " . $currentPassword);
                
                if (password_verify($currentPassword, $user['password'])) {
                    $passwordMatches = true;
                    error_log("AuthController::changePassword - Password verified using hash");
                } 
                elseif ($user['password'] === $currentPassword) {
                    $passwordMatches = true;
                    error_log("AuthController::changePassword - Password verified using plain text");
                }
                
                error_log("AuthController::changePassword - Password matches: " . ($passwordMatches ? 'yes' : 'no'));
                
                if (!$passwordMatches) {
                    error_log("AuthController::changePassword - Password verification failed");
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Current password is incorrect'
                    ]);
                    return;
                }
                
                $traineeModel->update($userId, ['password' => $newPassword]);
                
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
        } catch (Exception $e) {
            error_log("AuthController::changePassword - Exception: " . $e->getMessage());
            error_log("AuthController::changePassword - Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ]);
        }
    }

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

    private function verifyToken($token) {
        try {
            error_log("AuthController::verifyToken - Verifying token: " . substr($token, 0, 20) . "...");
            
            $decoded = JwtHelper::validateToken($token);
            
            if ($decoded) {
                error_log("AuthController::verifyToken - Token valid. User ID: " . ($decoded['user_id'] ?? 'N/A') . ", Role: " . ($decoded['role'] ?? 'N/A'));
                return [
                    'id' => $decoded['user_id'],
                    'role' => $decoded['role']
                ];
            } else {
                error_log("AuthController::verifyToken - Token validation returned false");
            }
        } catch (Exception $e) {
            error_log("AuthController::verifyToken - Exception: " . $e->getMessage());
            error_log("AuthController::verifyToken - Stack trace: " . $e->getTraceAsString());
        }
        return null;
    }

    public function forgotPassword() {
        header('Content-Type: application/json');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['email'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Email is required'
                ]);
                return;
            }

            $email = trim($data['email']);

            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid email format'
                ]);
                return;
            }

            // Search in admins collection
            $adminModel = new Admin();
            $user = $adminModel->findByEmail($email);
            $userType = 'admin';

            // If not found, search in trainees collection
            if (!$user) {
                $traineeModel = new Trainee();
                $user = $traineeModel->findByEmail($email);
                $userType = 'trainee';
            }

            // Always return success (security: don't reveal if email exists)
            if ($user) {
                // Generate reset token
                $token = bin2hex(random_bytes(32)); // 64 character string
                $expiresAt = new MongoDB\BSON\UTCDateTime((time() + 3600) * 1000); // 1 hour

                // Store token in password_resets collection
                $db = getMongoConnection();
                $resetCollection = $db->password_resets;

                // Delete any existing tokens for this email
                $resetCollection->deleteMany(['email' => $email]);

                // Insert new token
                $resetCollection->insertOne([
                    'email' => $email,
                    'token' => $token,
                    'user_type' => $userType,
                    'user_id' => $user['_id'],
                    'expires_at' => $expiresAt,
                    'created_at' => new MongoDB\BSON\UTCDateTime(),
                    'used' => false
                ]);

                // Send email
                $this->sendResetEmail($email, $token);
            }

            // Always return success
            echo json_encode([
                'success' => true,
                'message' => 'If an account exists with this email, a password reset link has been sent.'
            ]);

        } catch (Exception $e) {
            error_log("ForgotPassword Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'An error occurred. Please try again later.'
            ]);
        }
    }

    private function sendResetEmail($email, $token) {
        // Base URL - adjust based on your environment
        $baseUrl = 'http://localhost/CAATE-ITRMS/auth/src/pages';
        $resetLink = "$baseUrl/reset-password.html?token=$token&email=" . urlencode($email);

        // Log the reset link for development
        $logDir = __DIR__ . '/../../storage/logs';
        if (!file_exists($logDir)) {
            mkdir($logDir, 0777, true);
        }
        
        $logMessage = "\n" . str_repeat('=', 80) . "\n";
        $logMessage .= "Password Reset Request\n";
        $logMessage .= str_repeat('=', 80) . "\n";
        $logMessage .= "Date: " . date('Y-m-d H:i:s') . "\n";
        $logMessage .= "Email: $email\n";
        $logMessage .= "Token: $token\n";
        $logMessage .= "Reset Link: $resetLink\n";
        $logMessage .= str_repeat('=', 80) . "\n";
        
        file_put_contents($logDir . '/password-resets.log', $logMessage, FILE_APPEND);
        
        // Try to send email using PHPMailer
        try {
            // Check if PHPMailer is installed
            if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                require_once __DIR__ . '/../../vendor/autoload.php';
                
                $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
                
                // SMTP Configuration
                $mail->isSMTP();
                $mail->Host = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = getenv('MAIL_USERNAME') ?: ''; // Your Gmail address
                $mail->Password = getenv('MAIL_PASSWORD') ?: ''; // Your Gmail App Password
                $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = getenv('MAIL_PORT') ?: 587;
                
                // Only send if credentials are configured
                if (empty($mail->Username) || empty($mail->Password)) {
                    error_log("Email not sent: MAIL_USERNAME or MAIL_PASSWORD not configured");
                    return;
                }
                
                // Email content
                $mail->setFrom(getenv('MAIL_FROM_ADDRESS') ?: 'noreply@caate.edu.ph', 
                              getenv('MAIL_FROM_NAME') ?: 'CAATE-ITRMS');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = 'Password Reset Request - CAATE-ITRMS';
                
                $mail->Body = "
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(135deg, #0a1f33 0%, #0f2942 50%, #163856 100%);
                            padding: 40px 20px;
                            min-height: 100vh;
                        }
                        
                        .email-wrapper {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        
                        .glass-card {
                            background: linear-gradient(90deg, rgba(15, 41, 66, 0.95) 0%, rgba(10, 31, 51, 0.95) 100%);
                            backdrop-filter: blur(20px) saturate(180%);
                            -webkit-backdrop-filter: blur(20px) saturate(180%);
                            border-radius: 20px;
                            border: 1px solid rgba(54, 145, 191, 0.3);
                            padding: 40px;
                            box-shadow: 0 10px 40px rgba(22, 56, 86, 0.5),
                                        0 4px 12px rgba(54, 145, 191, 0.3),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                                        0 0 0 1px rgba(54, 145, 191, 0.1);
                            transition: all 0.3s ease;
                        }
                        
                        .logo-container {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        
                        .logo-circle {
                            width: 100px;
                            height: 100px;
                            background: linear-gradient(135deg, rgba(54, 145, 191, 0.3) 0%, rgba(50, 85, 150, 0.3) 100%);
                            backdrop-filter: blur(10px);
                            border-radius: 50%;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 48px;
                            color: white;
                            border: 2px solid rgba(54, 145, 191, 0.5);
                            box-shadow: 0 8px 32px rgba(22, 56, 86, 0.4),
                                        inset 0 2px 0 rgba(255, 255, 255, 0.2);
                        }
                        
                        .content {
                            color: white;
                            text-align: center;
                        }
                        
                        h1 {
                            font-size: 32px;
                            margin-bottom: 20px;
                            color: white;
                            font-weight: 700;
                            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                        }
                        
                        p {
                            font-size: 16px;
                            line-height: 1.8;
                            margin-bottom: 20px;
                            color: rgba(255, 255, 255, 0.95);
                        }
                        
                        .button-container {
                            margin: 40px 0;
                        }
                        
                        .reset-button {
                            display: inline-block;
                            padding: 18px 50px;
                            background: linear-gradient(135deg, rgba(54, 145, 191, 0.35) 0%, rgba(50, 85, 150, 0.3) 100%);
                            backdrop-filter: blur(25px) saturate(180%);
                            -webkit-backdrop-filter: blur(25px) saturate(180%);
                            color: white;
                            text-decoration: none;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 18px;
                            box-shadow: 0 8px 32px rgba(22, 56, 86, 0.35),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.25),
                                        0 0 0 1px rgba(54, 145, 191, 0.25);
                            transition: all 0.3s ease;
                            border: 1.5px solid rgba(54, 145, 191, 0.5);
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                        }
                        
                        .reset-button:hover {
                            background: linear-gradient(135deg, rgba(54, 145, 191, 0.55) 0%, rgba(50, 85, 150, 0.5) 100%);
                            backdrop-filter: blur(30px) saturate(200%);
                            -webkit-backdrop-filter: blur(30px) saturate(200%);
                            transform: translateY(-2px) scale(1.02);
                            box-shadow: 0 12px 40px rgba(22, 56, 86, 0.45),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.35),
                                        0 0 30px rgba(54, 145, 191, 0.5),
                                        0 0 0 1px rgba(54, 145, 191, 0.4);
                            border: 1.5px solid rgba(54, 145, 191, 0.7);
                        }
                        
                        .link-box {
                            background: rgba(54, 145, 191, 0.1);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(54, 145, 191, 0.3);
                            border-radius: 12px;
                            padding: 20px;
                            margin: 30px 0;
                            word-break: break-all;
                            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
                        }
                        
                        .link-box a {
                            color: #a8d8ff;
                            text-decoration: none;
                            font-size: 14px;
                            font-weight: 500;
                        }
                        
                        .warning-box {
                            background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 193, 7, 0.4);
                            border-radius: 12px;
                            padding: 20px;
                            margin: 30px 0;
                            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                        }
                        
                        .warning-box p {
                            color: #ffd54f;
                            margin: 0;
                            font-size: 16px;
                            font-weight: 600;
                        }
                        
                        .info-box {
                            background: rgba(54, 145, 191, 0.08);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(54, 145, 191, 0.25);
                            border-radius: 12px;
                            padding: 25px;
                            margin-top: 35px;
                            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
                        }
                        
                        .info-box p {
                            font-size: 15px;
                            color: rgba(255, 255, 255, 0.85);
                            margin-bottom: 0;
                            line-height: 1.7;
                        }
                        
                        .divider {
                            height: 1px;
                            background: linear-gradient(90deg,
                                transparent 0%,
                                rgba(54, 145, 191, 0.3) 20%,
                                rgba(54, 145, 191, 0.5) 50%,
                                rgba(54, 145, 191, 0.3) 80%,
                                transparent 100%);
                            margin: 35px 0;
                            box-shadow: 0 1px 2px rgba(54, 145, 191, 0.2);
                        }
                        
                        .footer {
                            text-align: center;
                            margin-top: 40px;
                            padding-top: 30px;
                            border-top: 1px solid rgba(54, 145, 191, 0.2);
                        }
                        
                        .footer p {
                            font-size: 14px;
                            color: rgba(255, 255, 255, 0.7);
                            margin-bottom: 10px;
                        }
                        
                        .brand-name {
                            font-weight: 700;
                            color: #3691bf;
                            text-shadow: 0 2px 4px rgba(54, 145, 191, 0.3);
                        }
                        
                        .security-badge {
                            display: inline-block;
                            background: rgba(16, 185, 129, 0.15);
                            border: 1px solid rgba(16, 185, 129, 0.3);
                            border-radius: 20px;
                            padding: 8px 16px;
                            font-size: 13px;
                            color: #6ee7b7;
                            margin-top: 20px;
                            font-weight: 600;
                        }
                        
                        @media only screen and (max-width: 600px) {
                            .glass-card {
                                padding: 30px 20px;
                            }
                            
                            h1 {
                                font-size: 26px;
                            }
                            
                            .reset-button {
                                padding: 16px 40px;
                                font-size: 16px;
                            }
                            
                            .logo-circle {
                                width: 80px;
                                height: 80px;
                                font-size: 40px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class='email-wrapper'>
                        <div class='glass-card'>
                            <div class='logo-container'>
                                <div class='logo-circle'>🔐</div>
                            </div>
                            
                            <div class='content'>
                                <h1>Password Reset Request</h1>
                                <p>Hello,</p>
                                <p>We received a request to reset your password for your <strong class='brand-name'>CAATE-ITRMS</strong> account.</p>
                                
                                <div class='button-container'>
                                    <a href='$resetLink' class='reset-button'>Reset Password</a>
                                </div>
                                
                                <p style='font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 25px;'>Or copy and paste this link into your browser:</p>
                                
                                <div class='link-box'>
                                    <a href='$resetLink'>$resetLink</a>
                                </div>
                                
                                <div class='warning-box'>
                                    <p>⏰ This link will expire in 1 hour</p>
                                </div>
                                
                                <div class='divider'></div>
                                
                                <div class='info-box'>
                                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
                                </div>
                                
                                <div class='security-badge'>
                                    🛡️ Secure Password Reset
                                </div>
                            </div>
                            
                            <div class='footer'>
                                <p>This is an automated email from <span class='brand-name'>CAATE-ITRMS</span></p>
                                <p style='font-size: 13px;'>Please do not reply to this email</p>
                                <div class='divider' style='margin: 20px 0;'></div>
                                <p style='margin-top: 15px; font-weight: 600;'><span class='brand-name'>Creative Aesthetic Academy & Technical Education Inc.</span></p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                ";
                
                $mail->AltBody = "Password Reset Request\n\n" .
                                "Click this link to reset your password: $resetLink\n\n" .
                                "This link will expire in 1 hour.\n\n" .
                                "If you didn't request a password reset, please ignore this email.";
                
                $mail->send();
                error_log("Password reset email sent successfully to: $email");
            } else {
                error_log("PHPMailer not installed. Email not sent. Install with: composer require phpmailer/phpmailer");
            }
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
        }
    }

    public function verifyResetToken() {
        header('Content-Type: application/json');

        try {
            if (!isset($_GET['token'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Token is required'
                ]);
                return;
            }

            $token = $_GET['token'];

            // Find token in database
            $db = getMongoConnection();
            $resetCollection = $db->password_resets;

            $resetRecord = $resetCollection->findOne([
                'token' => $token,
                'used' => false
            ]);

            if (!$resetRecord) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid or expired reset token'
                ]);
                return;
            }

            // Check if token is expired
            $expiresAt = $resetRecord['expires_at']->toDateTime()->getTimestamp();
            $now = time();

            if ($now > $expiresAt) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Reset token has expired'
                ]);
                return;
            }

            echo json_encode([
                'success' => true,
                'message' => 'Token is valid',
                'email' => $resetRecord['email']
            ]);

        } catch (Exception $e) {
            error_log("VerifyResetToken Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'An error occurred'
            ]);
        }
    }

    public function resetPassword() {
        header('Content-Type: application/json');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['token']) || !isset($data['email']) || !isset($data['newPassword'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Token, email, and new password are required'
                ]);
                return;
            }

            $token = $data['token'];
            $email = trim($data['email']);
            $newPassword = trim($data['newPassword']);

            // Validate password strength
            if (strlen($newPassword) < 8) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Password must be at least 8 characters long'
                ]);
                return;
            }

            // Find and validate token
            $db = getMongoConnection();
            $resetCollection = $db->password_resets;

            $resetRecord = $resetCollection->findOne([
                'token' => $token,
                'email' => $email,
                'used' => false
            ]);

            if (!$resetRecord) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid reset token'
                ]);
                return;
            }

            // Check if token is expired
            $expiresAt = $resetRecord['expires_at']->toDateTime()->getTimestamp();
            if (time() > $expiresAt) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Reset token has expired'
                ]);
                return;
            }

            // Update password based on user type
            $userId = (string)$resetRecord['user_id'];
            $userType = $resetRecord['user_type'];

            if ($userType === 'admin') {
                $adminModel = new Admin();
                $adminModel->update($userId, ['password' => $newPassword]);
            } else if ($userType === 'trainee') {
                $traineeModel = new Trainee();
                $traineeModel->update($userId, ['password' => $newPassword]);
            }

            // Mark token as used
            $resetCollection->updateOne(
                ['_id' => $resetRecord['_id']],
                ['$set' => ['used' => true]]
            );

            echo json_encode([
                'success' => true,
                'message' => 'Password has been reset successfully'
            ]);

        } catch (Exception $e) {
            error_log("ResetPassword Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'An error occurred'
            ]);
        }
    }
    
}
