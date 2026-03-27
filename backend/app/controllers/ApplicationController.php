<?php

require_once __DIR__ . '/../models/Application.php';

class ApplicationController {
    
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
            
            $applicationData = [
                'user_id' => $this->convertToObjectId($input['userId'] ?? null),
                
                'reference_number' => $this->buildReferenceNumber($input),
                
                'uli' => $this->buildULI($input),
                
                'picture' => $input['picture'] ?? null,
                'signature' => $input['signature'] ?? null,
                
                'school_name' => $input['schoolName'] ?? '',
                'assessment_title' => $input['assessmentTitle'] ?? '',
                'school_address' => $input['schoolAddress'] ?? '',
                'application_date' => $input['applicationDate'] ?? '',
                
                'assessment_type' => $input['assessmentType'] ?? '',
                
                'client_type' => $input['clientType'] ?? '',
                
                'name' => [
                    'surname' => $input['surname'] ?? '',
                    'first_name' => $input['firstName'] ?? '',
                    'second_name' => $input['secondname'] ?? '',
                    'middle_name' => $input['middleName'] ?? '',
                    'middle_initial' => $input['middleInitial'] ?? '',
                    'name_extension' => $input['nameExtension'] ?? ''
                ],
                
                'mailing_address' => [
                    'number_street' => $input['numberStreet'] ?? '',
                    'barangay' => $input['barangay'] ?? '',
                    'district' => $input['district'] ?? '',
                    'city' => $input['city'] ?? '',
                    'province' => $input['province'] ?? '',
                    'region' => $input['region'] ?? '',
                    'zip' => $input['zip'] ?? ''
                ],
                
                'mothers_name' => $input['motherName'] ?? '',
                'fathers_name' => $input['fatherName'] ?? '',
                
                'sex' => $input['sex'] ?? '',
                'civil_status' => $input['civilStatus'] ?? '',
                'employment_status' => $input['employmentStatus'] ?? '',
                'birth_date' => $input['birthDate'] ?? '',
                'birth_place' => $input['birthPlace'] ?? '',
                'age' => isset($input['age']) ? (int)$input['age'] : null,
                'education' => $input['education'] ?? '',
                'parent_guardian_name' => $input['parentGuardianName'] ?? '',
                'parent_guardian_address' => $input['parentGuardianAddress'] ?? '',
                
                'contact' => [
                    'tel' => $input['tel'] ?? '',
                    'mobile' => $input['mobile'] ?? '',
                    'fax' => $input['fax'] ?? '',
                    'email' => $input['email'] ?? '',
                    'other_contact' => $input['otherContact'] ?? ''
                ],
                
                'work_experience' => $this->buildWorkExperience($input),
                
                'training_seminars' => $this->buildTrainingSeminars($input),
                
                'licensure_exams' => $this->buildLicensureExams($input),
                
                'competency_assessments' => $this->buildCompetencyAssessments($input),
                
                'status' => $input['status'] ?? 'pending',
                'submitted_at' => $input['submittedAt'] ?? date('Y-m-d H:i:s'),
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
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
    
    private function buildULI($input) {
        $parts = [];
        for ($i = 1; $i <= 16; $i++) {
            $parts[] = $input["uli{$i}"] ?? '';
        }
        return implode('', $parts);
    }
    
    private function buildWorkExperience($input) {
        $workExperience = [];
        
        if (isset($input['workCompany']) && is_array($input['workCompany'])) {
            $count = count($input['workCompany']);
            
            for ($i = 0; $i < $count; $i++) {
                $company = trim($input['workCompany'][$i] ?? '');
                $position = trim($input['workPosition'][$i] ?? '');
                $dates = trim($input['workDates'][$i] ?? '');
                $salary = trim($input['workSalary'][$i] ?? '');
                $status = trim($input['workStatus'][$i] ?? '');
                $years = isset($input['workYears'][$i]) && $input['workYears'][$i] !== '' ? (float)$input['workYears'][$i] : 0;
                
                if ($company !== '' || $position !== '' || $dates !== '' || $salary !== '' || $status !== '' || $years > 0) {
                    $workExperience[] = [
                        'company' => $company,
                        'position' => $position,
                        'inclusive_dates' => $dates,
                        'monthly_salary' => $salary,
                        'status_of_appointment' => $status,
                        'years_of_experience' => $years
                    ];
                }
            }
        }
        
        return $workExperience;
    }
    
    private function buildTrainingSeminars($input) {
        $trainingSeminars = [];
        
        if (isset($input['trainingTitle']) && is_array($input['trainingTitle'])) {
            $count = count($input['trainingTitle']);
            for ($i = 0; $i < $count; $i++) {
                $title = trim($input['trainingTitle'][$i] ?? '');
                $venue = trim($input['trainingVenue'][$i] ?? '');
                $dates = trim($input['trainingDates'][$i] ?? '');
                $hours = isset($input['trainingHours'][$i]) && $input['trainingHours'][$i] !== '' ? (int)$input['trainingHours'][$i] : 0;
                $conductedBy = trim($input['trainingConductedBy'][$i] ?? '');
                
                if ($title !== '' || $venue !== '' || $dates !== '' || $hours > 0 || $conductedBy !== '') {
                    $trainingSeminars[] = [
                        'title' => $title,
                        'venue' => $venue,
                        'inclusive_dates' => $dates,
                        'number_of_hours' => $hours,
                        'conducted_by' => $conductedBy
                    ];
                }
            }
        }
        
        return $trainingSeminars;
    }
    
    private function buildLicensureExams($input) {
        $licensureExams = [];
        
        if (isset($input['licensureTitle']) && is_array($input['licensureTitle'])) {
            $count = count($input['licensureTitle']);
            for ($i = 0; $i < $count; $i++) {
                $title = trim($input['licensureTitle'][$i] ?? '');
                $year = isset($input['licensureYear'][$i]) && $input['licensureYear'][$i] !== '' ? (int)$input['licensureYear'][$i] : null;
                $venue = trim($input['licensureVenue'][$i] ?? '');
                $rating = trim($input['licensureRating'][$i] ?? '');
                $remarks = trim($input['licensureRemarks'][$i] ?? '');
                $expiry = trim($input['licensureExpiry'][$i] ?? '');
                
                if ($title !== '' || $year !== null || $venue !== '' || $rating !== '' || $remarks !== '' || $expiry !== '') {
                    $licensureExams[] = [
                        'title' => $title,
                        'year_taken' => $year,
                        'examination_venue' => $venue,
                        'rating' => $rating,
                        'remarks' => $remarks,
                        'expiry_date' => $expiry
                    ];
                }
            }
        }
        
        return $licensureExams;
    }
    
    private function buildCompetencyAssessments($input) {
        $competencyAssessments = [];
        
        if (isset($input['competencyTitle']) && is_array($input['competencyTitle'])) {
            $count = count($input['competencyTitle']);
            for ($i = 0; $i < $count; $i++) {
                $title = trim($input['competencyTitle'][$i] ?? '');
                $level = trim($input['competencyLevel'][$i] ?? '');
                $sector = trim($input['competencySector'][$i] ?? '');
                $cert = trim($input['competencyCert'][$i] ?? '');
                $issuance = trim($input['competencyIssuance'][$i] ?? '');
                $expiry = trim($input['competencyExpiry'][$i] ?? '');
                
                if ($title !== '' || $level !== '' || $sector !== '' || $cert !== '' || $issuance !== '' || $expiry !== '') {
                    $competencyAssessments[] = [
                        'title' => $title,
                        'qualification_level' => $level,
                        'industry_sector' => $sector,
                        'certificate_number' => $cert,
                        'date_of_issuance' => $issuance,
                        'expiration_date' => $expiry
                    ];
                }
            }
        }
        
        return $competencyAssessments;
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $applicationModel = new Application();
            $applications = $applicationModel->getAllWithUserData();
            
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
