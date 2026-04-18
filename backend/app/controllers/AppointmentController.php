<?php

require_once __DIR__ . '/../models/Appointment.php';

class AppointmentController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $appointments = $appointmentModel->all();
            
            echo json_encode(['success' => true, 'data' => $appointments]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $appointment = $appointmentModel->findById($id);
            
            if (!$appointment) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
                return;
            }
            
            echo json_encode(['success' => true, 'data' => $appointment]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                return;
            }
            
            if (!isset($data['status'])) {
                $data['status'] = 'Pending';
            }
            
            $data['createdAt'] = new MongoDB\BSON\UTCDateTime();
            $data['updatedAt'] = new MongoDB\BSON\UTCDateTime();
            
            $appointmentModel = new Appointment();
            $appointmentId = $appointmentModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Appointment created successfully',
                'id' => $appointmentId
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                return;
            }
            
            $appointmentModel = new Appointment();
            
            // Get the current appointment data before updating
            $currentAppointment = $appointmentModel->findById($id);
            if (!$currentAppointment) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
                return;
            }
            
            $oldStatus = $currentAppointment['status'] ?? null;
            $newStatus = $data['status'] ?? $oldStatus;
            
            $data['updatedAt'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $appointmentModel->update($id, $data);
            
            if ($result) {
                // Send email notification if status changed to Pending, Approved, or Cancelled
                if (isset($data['status']) && $oldStatus !== $newStatus) {
                    if (in_array($newStatus, ['Pending', 'Approved', 'Cancelled'])) {
                        // Get updated appointment data
                        $updatedAppointment = $appointmentModel->findById($id);
                        $this->sendStatusChangeEmail($updatedAppointment, $newStatus);
                    }
                }
                
                echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function sendStatusChangeEmail($appointment, $status) {
        $email = $appointment['email'] ?? null;
        
        if (!$email) {
            error_log("AppointmentController: Cannot send email - No email address found in appointment");
            error_log("AppointmentController: Appointment data: " . json_encode($appointment));
            return;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            error_log("AppointmentController: Invalid email format: $email");
            return;
        }
        
        error_log("AppointmentController: Preparing to send email to: $email for status: $status");
        
        // Build full name
        $fullName = trim(implode(' ', array_filter([
            $appointment['firstName'] ?? '',
            $appointment['secondName'] ?? '',
            $appointment['middleName'] ?? '',
            $appointment['lastName'] ?? '',
            $appointment['suffix'] ?? ''
        ])));
        
        if (empty($fullName)) {
            $fullName = 'Valued Customer';
        }
        
        // Format service information
        $serviceCategory = $this->formatServiceCategory($appointment['serviceCategory'] ?? '');
        $serviceType = $this->formatServiceType($appointment['serviceType'] ?? '');
        
        // Format date and time
        $appointmentDate = 'Not set';
        $appointmentTime = 'Not set';
        
        if (!empty($appointment['preferredDate'])) {
            try {
                $dateObj = new DateTime($appointment['preferredDate']);
                $appointmentDate = $dateObj->format('F d, Y');
            } catch (Exception $e) {
                error_log("AppointmentController: Error formatting date: " . $e->getMessage());
            }
        }
        
        if (!empty($appointment['preferredTime'])) {
            $time = $appointment['preferredTime'];
            $timeObj = DateTime::createFromFormat('H:i', $time);
            if ($timeObj) {
                $appointmentTime = $timeObj->format('h:i A');
            }
        }
        
        // Log the email details
        $logDir = __DIR__ . '/../../storage/logs';
        if (!file_exists($logDir)) {
            mkdir($logDir, 0777, true);
        }
        
        $logMessage = "\n" . str_repeat('=', 80) . "\n";
        $logMessage .= "Appointment Status Change Notification\n";
        $logMessage .= str_repeat('=', 80) . "\n";
        $logMessage .= "Date: " . date('Y-m-d H:i:s') . "\n";
        $logMessage .= "Email: $email\n";
        $logMessage .= "Name: $fullName\n";
        $logMessage .= "Status: $status\n";
        $logMessage .= "Service: $serviceCategory - $serviceType\n";
        $logMessage .= "Appointment Date: $appointmentDate\n";
        $logMessage .= "Appointment Time: $appointmentTime\n";
        $logMessage .= str_repeat('=', 80) . "\n";
        
        file_put_contents($logDir . '/appointment-notifications.log', $logMessage, FILE_APPEND);
        
        // Try to send email using PHPMailer
        try {
            if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                error_log("AppointmentController: PHPMailer class not found. Please install: composer require phpmailer/phpmailer");
                return;
            }
            
            require_once __DIR__ . '/../../vendor/autoload.php';
            
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            
            // SMTP Configuration
            $mail->isSMTP();
            $mail->Host = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = getenv('MAIL_USERNAME') ?: '';
            $mail->Password = getenv('MAIL_PASSWORD') ?: '';
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = getenv('MAIL_PORT') ?: 587;
            
            if (empty($mail->Username) || empty($mail->Password)) {
                error_log("AppointmentController: Email not sent - MAIL_USERNAME or MAIL_PASSWORD not configured in .env file");
                return;
            }
            
            error_log("AppointmentController: SMTP configured - Host: {$mail->Host}, Port: {$mail->Port}, Username: {$mail->Username}");
            
            // Email settings
            $mail->setFrom(
                getenv('MAIL_FROM_ADDRESS') ?: 'noreply@caate.edu.ph', 
                getenv('MAIL_FROM_NAME') ?: 'CAATE-ITRMS'
            );
            $mail->addAddress($email, $fullName);
            $mail->isHTML(true);
            
            // Customize subject and content based on status
            $statusConfig = $this->getStatusEmailConfig($status);
            
            $mail->Subject = $statusConfig['subject'];
            
            $mail->Body = $this->buildEmailTemplate(
                $fullName,
                $status,
                $statusConfig,
                $serviceCategory,
                $serviceType,
                $appointmentDate,
                $appointmentTime,
                $appointment['specialNotes'] ?? ''
            );
            
            $mail->AltBody = $this->buildPlainTextEmail(
                $fullName,
                $status,
                $serviceCategory,
                $serviceType,
                $appointmentDate,
                $appointmentTime
            );
            
            // Send the email
            $mail->send();
            error_log("AppointmentController: Appointment status change email sent successfully to: $email");
            
            // Log success
            $successLog = "SUCCESS: Email sent at " . date('Y-m-d H:i:s') . "\n";
            file_put_contents($logDir . '/appointment-notifications.log', $successLog, FILE_APPEND);
            
        } catch (Exception $e) {
            error_log("AppointmentController: Email sending failed - " . $e->getMessage());
            error_log("AppointmentController: PHPMailer Error Info: " . $mail->ErrorInfo);
            
            // Log failure
            $failLog = "FAILED: " . $e->getMessage() . " at " . date('Y-m-d H:i:s') . "\n";
            file_put_contents($logDir . '/appointment-notifications.log', $failLog, FILE_APPEND);
        }
    }
    
    private function getStatusEmailConfig($status) {
        $configs = [
            'Pending' => [
                'subject' => 'Appointment Under Review - CAATE-ITRMS',
                'icon' => '⏳',
                'color' => '#f59e0b',
                'title' => 'Appointment Under Review',
                'message' => 'Your appointment request is currently being reviewed by our team. We will notify you once it has been confirmed.',
                'badge' => 'Under Review',
                'badgeColor' => 'rgba(245, 158, 11, 0.25)',
                'badgeBorder' => '#f59e0b'
            ],
            'Approved' => [
                'subject' => 'Appointment Confirmed - CAATE-ITRMS',
                'icon' => '✅',
                'color' => '#10b981',
                'title' => 'Appointment Confirmed!',
                'message' => 'Great news! Your appointment has been confirmed. We look forward to seeing you at the scheduled date and time.',
                'badge' => 'Confirmed',
                'badgeColor' => 'rgba(16, 185, 129, 0.25)',
                'badgeBorder' => '#10b981'
            ],
            'Cancelled' => [
                'subject' => 'Appointment Cancelled - CAATE-ITRMS',
                'icon' => '❌',
                'color' => '#ef4444',
                'title' => 'Appointment Cancelled',
                'message' => 'Your appointment has been cancelled. If you would like to reschedule, please submit a new appointment request.',
                'badge' => 'Cancelled',
                'badgeColor' => 'rgba(239, 68, 68, 0.25)',
                'badgeBorder' => '#ef4444'
            ]
        ];
        
        return $configs[$status] ?? $configs['Pending'];
    }
    
    private function buildEmailTemplate($fullName, $status, $config, $serviceCategory, $serviceType, $date, $time, $notes) {
        $appointmentLink = 'http://localhost/CAATE-ITRMS/auth/src/pages/admission/appointment-form.html';
        
        $buttonHtml = '';
        if ($status === 'Approved') {
            $buttonHtml = "
                <table role='presentation' style='width: 100%; margin: 25px 0;' cellpadding='0' cellspacing='0' border='0'>
                    <tr>
                        <td style='text-align: center;'>
                            <a href='$appointmentLink' class='button' style='display: inline-block; padding: 16px 40px; background: #3691bf; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 17px; text-transform: uppercase; letter-spacing: 0.5px;'>
                                VIEW APPOINTMENT
                            </a>
                        </td>
                    </tr>
                </table>";
        }
        
        return "<!DOCTYPE html>
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
                            <div class='logo-circle' style='width: 90px; height: 90px; background: rgba(54, 145, 191, 0.3); border-radius: 50%; display: inline-block; line-height: 90px; font-size: 45px; border: 2px solid {$config['color']};'>
                                {$config['icon']}
                            </div>
                        </td>
                    </tr>
                </table>
                
                <h1 style='font-size: 28px; margin: 0 0 15px 0; color: #ffffff; font-weight: 700; text-align: center;'>
                    {$config['title']}
                </h1>
                
                <p style='font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; color: #ffffff; text-align: center;'>
                    Hello <strong style='color: #5eb3e0;'>$fullName</strong>,
                </p>
                
                <p style='font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #ffffff; text-align: center;'>
                    {$config['message']}
                </p>
                
                <div style='background: rgba(54, 145, 191, 0.15); border: 1px solid rgba(54, 145, 191, 0.4); border-radius: 10px; padding: 20px; margin: 20px 0;'>
                    <h3 style='color: #5eb3e0; margin: 0 0 15px 0; font-size: 18px; text-align: center;'>Appointment Details</h3>
                    
                    <table style='width: 100%; color: #ffffff;' cellpadding='8' cellspacing='0'>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2);'><strong>Service:</strong></td>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2); text-align: right;'>$serviceCategory</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2);'><strong>Type:</strong></td>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2); text-align: right;'>$serviceType</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2);'><strong>Date:</strong></td>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2); text-align: right;'>$date</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2);'><strong>Time:</strong></td>
                            <td style='padding: 8px; border-bottom: 1px solid rgba(54, 145, 191, 0.2); text-align: right;'>$time</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px;'><strong>Status:</strong></td>
                            <td style='padding: 8px; text-align: right;'>
                                <span style='display: inline-block; background: {$config['badgeColor']}; border: 1px solid {$config['badgeBorder']}; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 600;'>
                                    {$config['badge']}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                $buttonHtml
                
                <div style='height: 1px; background: rgba(54, 145, 191, 0.4); margin: 25px 0;'></div>
                
                <div style='background: rgba(54, 145, 191, 0.15); border: 1px solid rgba(54, 145, 191, 0.4); border-radius: 10px; padding: 20px; margin: 20px 0;'>
                    <p style='font-size: 14px; color: #ffffff; margin: 0; line-height: 1.6; text-align: center;'>
                        If you have any questions or need to make changes, please contact us at 
                        <a href='mailto:creativeaestheticacademy@gmail.com' style='color: #5eb3e0; text-decoration: none;'>creativeaestheticacademy@gmail.com</a>
                        or call <strong style='color: #5eb3e0;'>0968 100 2025</strong>
                    </p>
                </div>
                
                <div style='text-align: center; margin: 20px 0;'>
                    <span style='display: inline-block; background: rgba(16, 185, 129, 0.25); border: 1px solid #10b981; border-radius: 20px; padding: 8px 16px; font-size: 13px; color: #ffffff; font-weight: 600;'>
                        🛡️ Secure Notification
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
</html>";
    }
    
    private function buildPlainTextEmail($fullName, $status, $serviceCategory, $serviceType, $date, $time) {
        return "Appointment Status Update\n\n" .
               "Hello $fullName,\n\n" .
               "Your appointment status has been updated to: $status\n\n" .
               "Appointment Details:\n" .
               "Service: $serviceCategory\n" .
               "Type: $serviceType\n" .
               "Date: $date\n" .
               "Time: $time\n" .
               "Status: $status\n\n" .
               "If you have any questions, please contact us at creativeaestheticacademy@gmail.com or call 0968 100 2025.\n\n" .
               "This is an automated email from CAATE-ITRMS. Please do not reply to this email.";
    }
    
    private function formatServiceCategory($category) {
        $categories = [
            'skincare' => 'Skin Care',
            'haircare' => 'Hair Care',
            'nailcare' => 'Nail Care',
            'bodytreatment' => 'Body Treatment',
            'aesthetic' => 'Aesthetic Services'
        ];
        return $categories[$category] ?? $category;
    }
    
    private function formatServiceType($type) {
        if (!$type) return 'N/A';
        return ucwords(str_replace('-', ' ', $type));
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $result = $appointmentModel->delete($id);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Appointment deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function statistics() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $stats = $appointmentModel->getStatistics();
            
            echo json_encode(['success' => true, 'data' => $stats]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
