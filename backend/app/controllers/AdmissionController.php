<?php

require_once __DIR__ . '/../models/Admission.php';

class AdmissionController {
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        
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
            
            // Resolve trainee to get the actual trainee_id field (TRN-2026-XXX)
            $resolvedTrainee = $this->resolveTrainee($input);
            $trainee = $resolvedTrainee['trainee'];
            
            $admissionData = [
                'user_id' => $resolvedTrainee['user_id'],
                'trainee_id' => $trainee['trainee_id'] ?? null,
                'first_name' => $trainee['first_name'] ?? $trainee['firstName'] ?? '',
                'second_name' => $trainee['second_name'] ?? $trainee['secondName'] ?? '',
                'middle_name' => $trainee['middle_name'] ?? $trainee['middleName'] ?? '',
                'last_name' => $trainee['last_name'] ?? $trainee['lastName'] ?? '',
                'suffix' => $trainee['suffix'] ?? '',
                'profile_image' => $trainee['profile_image'] ?? $trainee['profileImage'] ?? null,
                'reference_number' => $input['referenceNumber'] ?? '',
                'picture' => $input['picture'] ?? null,
                'applicant_name' => $input['applicantName'] ?? '',
                'tel_number' => $input['telNumber'] ?? '',
                'assessment_applied' => $input['assessmentApplied'] ?? '',
                'or_number' => $input['orNumber'] ?? '',
                'date_issued' => $input['dateIssued'] ?? '',
                'assessment_center' => $input['assessmentCenter'] ?? '',
                'submitted_requirements' => $input['submittedRequirements'] ?? [],
                'remarks' => $input['remarks'] ?? [],
                'assessment_date' => $input['assessmentDate'] ?? '',
                'assessment_time' => $input['assessmentTime'] ?? '',
                'processing_officer_signature' => $input['processingOfficerSignature'] ?? null,
                'processing_officer_printed_name' => $input['processingOfficerPrintedName'] ?? '',
                'processing_officer_date' => $input['processingOfficerDate'] ?? '',
                'applicant_signature' => $input['applicantSignature'] ?? null,
                'applicant_printed_name' => $input['applicantPrintedName'] ?? '',
                'applicant_date' => $input['applicantDate'] ?? '',
                'status' => $input['status'] ?? 'pending',
                'submitted_at' => $input['submittedAt'] ?? date('Y-m-d H:i:s'),
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $admissionModel = new Admission();
            $insertedId = $admissionModel->create($admissionData);
            
            if ($insertedId) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Admission slip submitted successfully',
                    'data' => [
                        'id' => $insertedId
                    ]
                ]);
            } else {
                throw new Exception('Failed to insert admission slip');
            }
            
        } catch (Exception $e) {
            error_log('AdmissionController::store error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error creating admission slip: ' . $e->getMessage()
            ]);
        }
    }
    
    private function convertToObjectId($id) {
        if (!$id) return null;
        
        try {
            if (is_string($id)) {
                return new MongoDB\BSON\ObjectId($id);
            }
            return $id;
        } catch (Exception $e) {
            error_log('Error converting to ObjectId: ' . $e->getMessage());
            return $id;
        }
    }
    
    private function resolveTrainee($input) {
        $traineeModel = new Trainee();
        $trainee = null;
        $userId = $input['trainee_id'] ?? null;
        
        // If trainee_id is provided, try to find the trainee by MongoDB _id
        if ($userId) {
            $trainee = $traineeModel->findById($userId);
        }
        
        // If not found, return empty trainee data
        if (!$trainee) {
            $trainee = [];
        }
        
        return [
            'trainee' => $trainee,
            'user_id' => $this->convertToObjectId($userId)
        ];
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $admissionModel = new Admission();
            $admissions = $admissionModel->all();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $admissions
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching admissions: ' . $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $admissionModel = new Admission();
            $admission = $admissionModel->findById($id);
            
            if ($admission) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $admission
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Admission slip not found'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching admission slip: ' . $e->getMessage()
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
            
            $input['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $admissionModel = new Admission();
            $result = $admissionModel->update($id, $input);
            
            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Admission slip updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Admission slip not found'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating admission slip: ' . $e->getMessage()
            ]);
        }
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: DELETE');
        
        try {
            $admissionModel = new Admission();
            $result = $admissionModel->delete($id);
            
            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Admission slip deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Admission slip not found'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error deleting admission slip: ' . $e->getMessage()
            ]);
        }
    }
}
