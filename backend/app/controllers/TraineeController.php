<?php

require_once __DIR__ . '/../models/Trainee.php';

class TraineeController {
    
    public function health() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $db = getMongoConnection();
            
            $collections = [];
            $errors = [];
            
            try {
                $count = $db->trainees->countDocuments();
                $collections['trainees'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['trainees'] = $e->getMessage();
                $collections['trainees'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            try {
                $count = $db->enrollments->countDocuments();
                $collections['enrollments'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['enrollments'] = $e->getMessage();
                $collections['enrollments'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            try {
                $count = $db->courses->countDocuments();
                $collections['courses'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['courses'] = $e->getMessage();
                $collections['courses'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            try {
                $count = $db->admins->countDocuments();
                $collections['admins'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['admins'] = $e->getMessage();
                $collections['admins'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            try {
                $count = $db->applications->countDocuments();
                $collections['applications'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['applications'] = $e->getMessage();
                $collections['applications'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            try {
                $count = $db->admissions->countDocuments();
                $collections['admissions'] = ['status' => 'ok', 'count' => $count];
            } catch (Exception $e) {
                $errors['admissions'] = $e->getMessage();
                $collections['admissions'] = ['status' => 'error', 'error' => $e->getMessage()];
            }
            
            $response = [
                'success' => true,
                'message' => 'API and Database connection OK',
                'mongodb' => 'Connected',
                'collections' => $collections
            ];
            
            if (!empty($errors)) {
                $response['warnings'] = $errors;
            }
            
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $trainees = $traineeModel->all();
        
        echo json_encode(['success' => true, 'data' => $trainees]);
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $trainee = $traineeModel->findById($id);
        
        if (!$trainee) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
            return;
        }
        
        echo json_encode(['success' => true, 'data' => $trainee]);
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
            
            $traineeModel = new Trainee();
            $traineeId = $traineeModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Trainee created successfully',
                'id' => $traineeId
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

        $traineeModel = new Trainee();
        $data = [];
        $imagePath = null;

        $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            if (preg_match('/boundary=([^;]+)/', $contentType, $matches)) {
                $boundary = trim($matches[1], '"');
                
                $input = file_get_contents('php://input');
                
                $parts = preg_split('/--' . preg_quote($boundary) . '(?:--)?/', $input);
                
                foreach ($parts as $index => $part) {
                    $part = trim($part);
                    if (empty($part)) {
                        continue;
                    }
                    
                    if (strpos($part, "\r\n\r\n") !== false) {
                        list($headers, $content) = explode("\r\n\r\n", $part, 2);
                    } elseif (strpos($part, "\n\n") !== false) {
                        list($headers, $content) = explode("\n\n", $part, 2);
                    } else {
                        continue;
                    }
                    
                    $content = rtrim($content, "\r\n");
                    
                    if (preg_match('/name="([^"]+)"/', $headers, $nameMatch)) {
                        $fieldName = $nameMatch[1];
                        
                        if (preg_match('/filename="([^"]+)"/', $headers, $filenameMatch)) {
                            $fileName = $filenameMatch[1];
                            
                            if ($fieldName === 'profile_image') {
                                $uploadDir = __DIR__ . '/../../public/uploads/profiles/';
                                
                                if (!is_dir($uploadDir)) {
                                    mkdir($uploadDir, 0755, true);
                                }
                                
                                $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
                                $newFileName = 'trainee_' . $id . '_' . time() . '.' . $fileExtension;
                                $filePath = $uploadDir . $newFileName;
                                
                                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                                $mimeType = finfo_buffer($finfo, $content);
                                finfo_close($finfo);
                                
                                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                                if (!in_array($mimeType, $allowedTypes)) {
                                    http_response_code(400);
                                    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.']);
                                    return;
                                }
                                
                                if (strlen($content) > 2 * 1024 * 1024) {
                                    http_response_code(400);
                                    echo json_encode(['success' => false, 'error' => 'File size exceeds 2MB limit.']);
                                    return;
                                }
                                
                                if (file_put_contents($filePath, $content)) {
                                    $imagePath = '/CAATE-ITRMS/backend/public/uploads/profiles/' . $newFileName;
                                    $data['profile_image'] = $imagePath;
                                } else {
                                    http_response_code(500);
                                    echo json_encode(['success' => false, 'error' => 'Failed to save uploaded file.']);
                                    return;
                                }
                            }
                        } else {
                            $data[$fieldName] = $content;
                        }
                    }
                }
            }
        } else {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                $data = [];
            }
        }
        
        $result = $traineeModel->update($id, $data);
        
        if ($result) {
            $response = ['success' => true, 'message' => 'Trainee updated successfully'];
            
            if ($imagePath) {
                $response['profile_image'] = $imagePath;
            }
            
            echo json_encode($response);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
        }
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $result = $traineeModel->delete($id);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Trainee deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
        }
    }
    
    public function statistics() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $traineeModel = new Trainee();
            $stats = $traineeModel->getStatistics();
            
            echo json_encode(['success' => true, 'data' => $stats]);
        } catch (Exception $e) {
            error_log("TraineeController::statistics - Exception: " . $e->getMessage());
            error_log("TraineeController::statistics - Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => 'Failed to fetch statistics: ' . $e->getMessage()
            ]);
        }
    }
}
