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

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid email format'
                ]);
                return;
            }

            $adminModel = new Admin();
            $user = $adminModel->findByEmail($email);
            $userType = 'admin';

            if (!$user) {
                $traineeModel = new Trainee();
                $user = $traineeModel->findByEmail($email);
                $userType = 'trainee';
            }

            if ($user) {
                $token = bin2hex(random_bytes(32)); // 64 character string
                $expiresAt = new MongoDB\BSON\UTCDateTime((time() + 3600) * 1000); // 1 hour

                $db = getMongoConnection();
                $resetCollection = $db->{'password-resets'};

                $resetCollection->deleteMany(['email' => $email]);

                $resetCollection->insertOne([
                    'email' => $email,
                    'token' => $token,
                    'user_type' => $userType,
                    'user_id' => $user['_id'],
                    'expires_at' => $expiresAt,
                    'created_at' => new MongoDB\BSON\UTCDateTime(),
                    'used' => false
                ]);

                $this->sendResetEmail($email, $token);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Password reset link sent to email'
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
        $baseUrl = 'http://localhost/CAATE-ITRMS/auth/src/pages';
        $resetLink = "$baseUrl/reset-password.html?token=$token&email=" . urlencode($email);

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
        
        try {
            if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                require_once __DIR__ . '/../../vendor/autoload.php';
                
                $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
                
                $mail->isSMTP();
                $mail->Host = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = getenv('MAIL_USERNAME') ?: ''; // Your Gmail address
                $mail->Password = getenv('MAIL_PASSWORD') ?: ''; // Your Gmail App Password
                $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = getenv('MAIL_PORT') ?: 587;
                
                if (empty($mail->Username) || empty($mail->Password)) {
                    error_log("Email not sent: MAIL_USERNAME or MAIL_PASSWORD not configured");
                    return;
                }
                
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
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'>
    <meta name='color-scheme' content='light'>
    <meta name='supported-color-schemes' content='light'>
    <style>
        * { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; padding: 20px 10px !important; }
            .email-card { padding: 20px !important; }
            .logo-circle { width: 80px !important; height: 80px !important; font-size: 40px !important; }
            h1 { font-size: 24px !important; }
            .button { padding: 14px 30px !important; font-size: 16px !important; }
        }
    </style>
</head>
<body style='margin: 0; padding: 0; background-color: #0f2942; width: 100%;'>
    <table role='presentation' class='email-container' style='width: 100%; max-width: 600px; margin: 0 auto; padding: 20px;' cellpadding='0' cellspacing='0' border='0'>
        <tr>
            <td class='email-card' style='background: #1a3a52; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);'>
                
                <table role='presentation' style='width: 100%;' cellpadding='0' cellspacing='0' border='0'>
                    <tr>
                        <td style='text-align: center; padding-bottom: 20px;'>
                            <div class='logo-circle' style='width: 90px; height: 90px; background: rgba(54, 145, 191, 0.3); border-radius: 50%; display: inline-block; line-height: 90px; font-size: 45px; border: 2px solid #3691bf;'>
                                🔐
                            </div>
                        </td>
                    </tr>
                </table>
                
                <h1 style='font-size: 28px; margin: 0 0 15px 0; color: #ffffff; font-weight: 700; text-align: center;'>
                    Password Reset Request
                </h1>
                
                <p style='font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; color: #ffffff; text-align: center;'>
                    Hello,
                </p>
                
                <p style='font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #ffffff; text-align: center;'>
                    We received a request to reset your password for your <strong style='color: #5eb3e0;'>CAATE-ITRMS</strong> account.
                </p>
                
                <table role='presentation' style='width: 100%; margin: 25px 0;' cellpadding='0' cellspacing='0' border='0'>
                    <tr>
                        <td style='text-align: center;'>
                            <a href='$resetLink' class='button' style='display: inline-block; padding: 16px 40px; background: #3691bf; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 17px; text-transform: uppercase; letter-spacing: 0.5px;'>
                                RESET PASSWORD
                            </a>
                        </td>
                    </tr>
                </table>
                
                <div style='background: rgba(255, 193, 7, 0.25); border: 1px solid #ffc107; border-radius: 10px; padding: 15px; margin: 20px 0; text-align: center;'>
                    <p style='color: #ffffff; margin: 0; font-size: 15px; font-weight: 600;'>
                        ⏰ This link will expire in 1 hour
                    </p>
                </div>
                
                <div style='height: 1px; background: rgba(54, 145, 191, 0.4); margin: 25px 0;'></div>
                
                <div style='background: rgba(54, 145, 191, 0.15); border: 1px solid rgba(54, 145, 191, 0.4); border-radius: 10px; padding: 20px; margin: 20px 0;'>
                    <p style='font-size: 14px; color: #ffffff; margin: 0; line-height: 1.6; text-align: center;'>
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.
                    </p>
                </div>
                
                <div style='text-align: center; margin: 20px 0;'>
                    <span style='display: inline-block; background: rgba(16, 185, 129, 0.25); border: 1px solid #10b981; border-radius: 20px; padding: 8px 16px; font-size: 13px; color: #ffffff; font-weight: 600;'>
                        🛡️ Secure Password Reset
                    </span>
                </div>
                
                <div style='text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(54, 145, 191, 0.4);'>
                    <p style='font-size: 13px; color: #b0c4d4; margin: 0 0 8px 0;'>
                        This is an automated email from <strong style='color: #5eb3e0;'>CAATE-ITRMS</strong>
                    </p>
                    <p style='font-size: 12px; color: #b0c4d4; margin: 0 0 15px 0;'>
                        Please do not reply to this email
                    </p>
                    <p style='margin: 0; font-weight: 600; font-size: 13px; color: #5eb3e0;'>
                        Creative Aesthetic Academy & Technical Education Inc.
                    </p>
                </div>
                
            </td>
        </tr>
    </table>
</body>
</html>
";
                
                $mail->AltBody = "Password Reset Request\n\n" .
                                "Click this link to reset your password: $resetLink\n\n" .
                                "This link will expire in 1 hour.\n\n" .
                                "<span style='color: #e8e8e8 !important;'>If you didn't request a password reset, please ignore this email.";
                
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

            $db = getMongoConnection();
            $resetCollection = $db->{'password-resets'};

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

            if (strlen($newPassword) < 8) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Password must be at least 8 characters long'
                ]);
                return;
            }

            $db = getMongoConnection();
            $resetCollection = $db->{'password-resets'};

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

            $expiresAt = $resetRecord['expires_at']->toDateTime()->getTimestamp();
            if (time() > $expiresAt) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Reset token has expired'
                ]);
                return;
            }

            $userId = (string)$resetRecord['user_id'];
            $userType = $resetRecord['user_type'];

            if ($userType === 'admin') {
                $adminModel = new Admin();
                $adminModel->update($userId, ['password' => $newPassword]);
            } else if ($userType === 'trainee') {
                $traineeModel = new Trainee();
                $traineeModel->update($userId, ['password' => $newPassword]);
            }

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



