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
            
            $admissionData = [
                'trainee_id' => $input['trainee_id'] ?? null,
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
}
