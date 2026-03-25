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
                    'message' => 'Invalid JSON input'
                ]);
                return;
            }
            
            // Prepare application data structure
            $applicationData = [
                // User reference
                'user_id' => $input['userId'] ?? null,
                
                // Reference Number (concatenated from individual fields)
                'reference_number' => $this->buildReferenceNumber($input),
                
                // ULI (concatenated from individual fields)
                'uli' => $this->buildULI($input),
                
                // Picture and Signature
                'picture' => $input['picture'] ?? null,
                'signature' => $input['signature'] ?? null,
                
                // School Information
                'school_name' => $input['schoolName'] ?? '',
                'assessment_title' => $input['assessmentTitle'] ?? '',
                'school_address' => $input['schoolAddress'] ?? '',
                'application_date' => $input['applicationDate'] ?? '',
                
                // Assessment Type
                'assessment_type' => $input['assessmentType'] ?? '',
                
                // Client Type
                'client_type' => $input['clientType'] ?? '',
                
                // Profile - Name
                'name' => [
                    'surname' => $input['surname'] ?? '',
                    'first_name' => $input['firstname'] ?? '',
                    'second_name' => $input['secondname'] ?? '',
                    'middle_name' => $input['middleName'] ?? '',
                    'middle_initial' => $input['middleInitial'] ?? '',
                    'name_extension' => $input['nameExtension'] ?? ''
                ],
                
                // Mailing Address
                'mailing_address' => [
                    'number_street' => $input['mailingNumber'] ?? '',
                    'barangay' => $input['barangay'] ?? '',
                    'district' => $input['district'] ?? '',
                    'city' => $input['city'] ?? '',
                    'province' => $input['province'] ?? '',
                    'region' => $input['region'] ?? '',
                    'zip' => $input['zip'] ?? ''
                ],
                
                // Parent Information
                'mothers_name' => $input['mothersName'] ?? '',
                'fathers_name' => $input['fathersName'] ?? '',
                
                // Personal Information
                'sex' => $input['sex'] ?? '',
                'civil_status' => $input['civilStatus'] ?? '',
                'employment_status' => $input['employmentStatus'] ?? '',
                'birth_date' => $input['birthDate'] ?? '',
                'birth_place' => $input['birthPlace'] ?? '',
                'education' => $input['education'] ?? '',
                'parent_guardian_name' => $input['parentGuardianName'] ?? '',
                'parent_guardian_address' => $input['parentGuardianAddress'] ?? '',
                
                // Contact Information
                'contact' => [
                    'tel' => $input['tel'] ?? '',
                    'mobile' => $input['mobile'] ?? '',
                    'fax' => $input['fax'] ?? '',
                    'email' => $input['email'] ?? '',
                    'others' => $input['others'] ?? ''
                ],
                
                // Work Experience (array of objects)
                'work_experience' => $this->buildWorkExperience($input),
                
                // Training/Seminars (array of objects)
                'training_seminars' => $this->buildTrainingSeminars($input),
                
                // Licensure Examinations (array of objects)
                'licensure_exams' => $this->buildLicensureExams($input),
                
                // Competency Assessments (array of objects)
                'competency_assessments' => $this->buildCompetencyAssessments($input),
                
                // Status and timestamps
                'status' => $input['status'] ?? 'pending',
                'submitted_at' => $input['submittedAt'] ?? date('Y-m-d H:i:s'),
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            // Use the Application model to create
            $applicationModel = new Application();
            $insertedId = $applicationModel->create($applicationData);
            
            if ($insertedId) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Application submitted successfully',
                    'data' => [
                        'id' => $insertedId
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
                'message' => 'Error creating application: ' . $e->getMessage()
            ]);
        }
    }
    
    // Helper function to build reference number from individual fields
    private function buildReferenceNumber($input) {
        $parts = [
            $input['referenceQualifiable'] ?? '',
            $input['referenceYY1'] ?? '',
            $input['referenceYY2'] ?? '',
            $input['referenceRegion1'] ?? '',
            $input['referenceRegion2'] ?? '',
            $input['referenceProvince1'] ?? '',
            $input['referenceProvince2'] ?? '',
            $input['referenceAC1'] ?? '',
            $input['referenceAC2'] ?? '',
            $input['referenceAC3'] ?? '',
            $input['referenceSeries1'] ?? '',
            $input['referenceSeries2'] ?? '',
            $input['referenceSeries3'] ?? '',
            $input['referenceSeries4'] ?? '',
            $input['referenceSeries5'] ?? '',
            $input['referenceSeries6'] ?? ''
        ];
        return implode('', $parts);
    }
    
    // Helper function to build ULI from individual fields
    private function buildULI($input) {
        $parts = [];
        for ($i = 1; $i <= 16; $i++) {
            $parts[] = $input["uli{$i}"] ?? '';
        }
        return implode('', $parts);
    }
    
    // Helper function to build work experience array
    private function buildWorkExperience($input) {
        $workExperience = [];
        
        if (isset($input['workCompany']) && is_array($input['workCompany'])) {
            $count = count($input['workCompany']);
            for ($i = 0; $i < $count; $i++) {
                $workExperience[] = [
                    'company' => $input['workCompany'][$i] ?? '',
                    'position' => $input['workPosition'][$i] ?? '',
                    'inclusive_dates' => $input['workDates'][$i] ?? '',
                    'monthly_salary' => $input['workSalary'][$i] ?? '',
                    'status_of_appointment' => $input['workStatus'][$i] ?? '',
                    'years_of_experience' => isset($input['workYears'][$i]) ? (float)$input['workYears'][$i] : 0
                ];
            }
        }
        
        return $workExperience;
    }
    
    // Helper function to build training/seminars array
    private function buildTrainingSeminars($input) {
        $trainingSeminars = [];
        
        if (isset($input['trainingTitle']) && is_array($input['trainingTitle'])) {
            $count = count($input['trainingTitle']);
            for ($i = 0; $i < $count; $i++) {
                $trainingSeminars[] = [
                    'title' => $input['trainingTitle'][$i] ?? '',
                    'venue' => $input['trainingVenue'][$i] ?? '',
                    'inclusive_dates' => $input['trainingDates'][$i] ?? '',
                    'number_of_hours' => isset($input['trainingHours'][$i]) ? (int)$input['trainingHours'][$i] : 0,
                    'conducted_by' => $input['trainingConductedBy'][$i] ?? ''
                ];
            }
        }
        
        return $trainingSeminars;
    }
    
    // Helper function to build licensure exams array
    private function buildLicensureExams($input) {
        $licensureExams = [];
        
        if (isset($input['licensureTitle']) && is_array($input['licensureTitle'])) {
            $count = count($input['licensureTitle']);
            for ($i = 0; $i < $count; $i++) {
                $licensureExams[] = [
                    'title' => $input['licensureTitle'][$i] ?? '',
                    'year_taken' => isset($input['licensureYear'][$i]) ? (int)$input['licensureYear'][$i] : null,
                    'examination_venue' => $input['licensureVenue'][$i] ?? '',
                    'rating' => $input['licensureRating'][$i] ?? '',
                    'remarks' => $input['licensureRemarks'][$i] ?? '',
                    'expiry_date' => $input['licensureExpiry'][$i] ?? ''
                ];
            }
        }
        
        return $licensureExams;
    }
    
    // Helper function to build competency assessments array
    private function buildCompetencyAssessments($input) {
        $competencyAssessments = [];
        
        if (isset($input['competencyTitle']) && is_array($input['competencyTitle'])) {
            $count = count($input['competencyTitle']);
            for ($i = 0; $i < $count; $i++) {
                $competencyAssessments[] = [
                    'title' => $input['competencyTitle'][$i] ?? '',
                    'qualification_level' => $input['competencyLevel'][$i] ?? '',
                    'industry_sector' => $input['competencySector'][$i] ?? '',
                    'certificate_number' => $input['competencyCert'][$i] ?? '',
                    'date_of_issuance' => $input['competencyIssuance'][$i] ?? '',
                    'expiration_date' => $input['competencyExpiry'][$i] ?? ''
                ];
            }
        }
        
        return $competencyAssessments;
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
