<?php

require_once __DIR__ . '/../models/Application.php';

class ApplicationController {
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        
        try {
            // Get JSON input
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON input',
                    'raw_input' => substr($rawInput, 0, 100) // First 100 chars for debugging
                ]);
                return;
            }
            
            // Get database connection
            $db = getMongoConnection();
            if (!$db) {
                throw new Exception('Database connection failed');
            }
            
            // Get applications collection directly
            $collection = $db->applications;
            
            // Prepare application data with all form fields
            $applicationData = [
                'user_id' => $input['userId'] ?? null,
                'first_name' => $input['firstName'] ?? '',
                'middle_name' => $input['middleName'] ?? '',
                'last_name' => $input['lastName'] ?? '',
                'email' => $input['email'] ?? '',
                'contact_no' => $input['contactNo'] ?? '',
                'address' => [
                    'street' => $input['numberStreet'] ?? '',
                    'barangay' => $input['barangay'] ?? '',
                    'city' => $input['city'] ?? '',
                    'province' => $input['province'] ?? '',
                    'region' => $input['region'] ?? '',
                    'zip_code' => $input['zipCode'] ?? ''
                ],
                'birth_date' => $input['birthDate'] ?? '',
                'age' => isset($input['age']) ? (int)$input['age'] : null,
                'sex' => $input['sex'] ?? '',
                'civil_status' => $input['civilStatus'] ?? '',
                'nationality' => $input['nationality'] ?? '',
                'assessment_title' => $input['assessmentTitle'] ?? '',
                'assessment_type' => $input['assessmentType'] ?? '',
                'signature' => $input['signature'] ?? '',
                'picture' => $input['picture'] ?? '',
                'status' => $input['status'] ?? 'pending',
                'submitted_at' => $input['submittedAt'] ?? date('Y-m-d H:i:s'),
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'form_data' => $input // Store all form data for reference
            ];
            
            // Insert directly into collection
            $result = $collection->insertOne($applicationData);
            
            if ($result && $result->getInsertedId()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Application submitted successfully',
                    'data' => [
                        'id' => (string)$result->getInsertedId()
                    ]
                ]);
            } else {
                throw new Exception('Failed to insert application');
            }
            
        } catch (Exception $e) {
            error_log('ApplicationController::store error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error creating application: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $applicationModel = new Application();
            $applications = $applicationModel->getAll();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $applications
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching applications: ' . $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $applicationModel = new Application();
            $application = $applicationModel->getById($id);
            
            if ($application) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $application
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Application not found'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching application: ' . $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT');
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON input'
                ]);
                return;
            }
            
            $applicationModel = new Application();
            $result = $applicationModel->update($id, $input);
            
            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Application updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Application not found'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating application: ' . $e->getMessage()
            ]);
        }
    }
}
