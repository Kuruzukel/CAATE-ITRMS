<?php

require_once __DIR__ . '/../models/Graduate.php';

class GraduateController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET');
        
        try {
            $graduateModel = new Graduate();
            $graduates = $graduateModel->getAll();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $graduates
            ]);
        } catch (Exception $e) {
            error_log('GraduateController::index error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching graduates: ' . $e->getMessage()
            ]);
        }
    }
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        
        try {
            // Handle file upload
            $imageUrl = null;
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/graduates/';
                
                // Create directory if it doesn't exist
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                
                $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $fileName = uniqid('graduate_') . '.' . $fileExtension;
                $uploadPath = $uploadDir . $fileName;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                    $imageUrl = '/uploads/graduates/' . $fileName;
                }
            }
            
            $graduateData = [
                'name' => $_POST['name'] ?? '',
                'trainee_id' => $_POST['trainee_id'] ?? '',
                'course' => $_POST['course'] ?? '',
                'certification' => $_POST['certification'] ?? '',
                'graduation_date' => $_POST['graduation_date'] ?? '',
                'email' => $_POST['email'] ?? '',
                'image_url' => $imageUrl,
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $graduateModel = new Graduate();
            $insertedId = $graduateModel->create($graduateData);
            
            if ($insertedId) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Graduate added successfully',
                    'data' => [
                        'id' => $insertedId,
                        'image_url' => $imageUrl
                    ]
                ]);
            } else {
                throw new Exception('Failed to insert graduate');
            }
            
        } catch (Exception $e) {
            error_log('GraduateController::store error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error creating graduate: ' . $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $graduateModel = new Graduate();
            $graduate = $graduateModel->findById($id);
            
            if ($graduate) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $graduate
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Graduate not found'
                ]);
            }
        } catch (Exception $e) {
            error_log('GraduateController::show error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching graduate: ' . $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT');
        
        try {
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON input'
                ]);
                return;
            }
            
            $updateData = [
                'name' => $input['name'] ?? '',
                'trainee_id' => $input['trainee_id'] ?? '',
                'course' => $input['course'] ?? '',
                'certification' => $input['certification'] ?? '',
                'graduation_date' => $input['graduation_date'] ?? '',
                'email' => $input['email'] ?? '',
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $graduateModel = new Graduate();
            $updated = $graduateModel->update($id, $updateData);
            
            if ($updated) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Graduate updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Graduate not found'
                ]);
            }
        } catch (Exception $e) {
            error_log('GraduateController::update error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating graduate: ' . $e->getMessage()
            ]);
        }
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: DELETE');
        
        try {
            $graduateModel = new Graduate();
            $deleted = $graduateModel->delete($id);
            
            if ($deleted) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Graduate deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Graduate not found'
                ]);
            }
        } catch (Exception $e) {
            error_log('GraduateController::destroy error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error deleting graduate: ' . $e->getMessage()
            ]);
        }
    }
}
