<?php

require_once __DIR__ . '/../models/Application.php';
require_once __DIR__ . '/../models/Trainee.php';

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
            
            $resolvedTrainee = $this->resolveTrainee($input);
            $trainee = $resolvedTrainee['trainee'];

            $applicationData = [
                'user_id' => $resolvedTrainee['user_id'],
                'trainee_id' => $this->getFirstAvailableValue($input, ['traineeId', 'trainee_id'], $trainee['trainee_id'] ?? ''),
                'reference_number' => $this->getFirstAvailableValue($input, ['referenceNumber', 'reference_number'], $this->buildReferenceNumber($input)),
                'uli' => $this->getFirstAvailableValue($input, ['uliNumber', 'uli'], $this->buildULI($input)),
                'picture' => $input['picture'] ?? null,
                'signature' => $input['signature'] ?? null,
                'school_name' => $this->getFirstAvailableValue($input, ['schoolName', 'school_name']),
                'assessment_title' => $this->getFirstAvailableValue($input, ['assessmentTitle', 'assessment_title']),
                'school_address' => $this->getFirstAvailableValue($input, ['schoolAddress', 'school_address']),
                'application_date' => $this->getFirstAvailableValue($input, ['applicationDate', 'application_date']),
                'assessment_type' => $this->getFirstAvailableValue($input, ['assessmentType', 'assessment_type']),
                'client_type' => $this->getFirstAvailableValue($input, ['clientType', 'client_type']),
                'name' => $this->buildNameData($input, $trainee),
                'mailing_address' => $this->buildMailingAddressData($input),
                'mothers_name' => $this->getFirstAvailableValue($input, ['motherName', 'mothersName', 'mothers_name']),
                'fathers_name' => $this->getFirstAvailableValue($input, ['fatherName', 'fathersName', 'fathers_name']),
                'sex' => $this->getFirstAvailableValue($input, ['sex']),
                'civil_status' => $this->getFirstAvailableValue($input, ['civilStatus', 'civil_status']),
                'employment_status' => $this->getFirstAvailableValue($input, ['employmentStatus', 'employment_status']),
                'birth_date' => $this->getFirstAvailableValue($input, ['birthDate', 'birth_date']),
                'birth_place' => $this->getFirstAvailableValue($input, ['birthPlace', 'birth_place']),
                'age' => $this->getIntegerValue($input, ['age']),
                'education' => $this->getFirstAvailableValue($input, ['education']),
                'parent_guardian_name' => $this->getFirstAvailableValue($input, ['parentGuardianName', 'parent_guardian_name']),
                'parent_guardian_address' => $this->getFirstAvailableValue($input, ['parentGuardianAddress', 'parent_guardian_address']),
                'contact' => $this->buildContactData($input, $trainee),
                'work_experience' => $this->buildWorkExperienceData($input),
                'training_seminars' => $this->buildTrainingSeminarsData($input),
                'licensure_exams' => $this->buildLicensureExamsData($input),
                'competency_assessments' => $this->buildCompetencyAssessmentsData($input),
                'status' => $this->getFirstAvailableValue($input, ['status'], 'pending'),
                'submitted_at' => $this->getFirstAvailableValue($input, ['submittedAt', 'submitted_at'], date('Y-m-d H:i:s')),
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

    private function getFirstAvailableValue($input, $keys, $default = '') {
        foreach ($keys as $key) {
            if (array_key_exists($key, $input) && $input[$key] !== null && $input[$key] !== '') {
                return $input[$key];
            }
        }
        return $default;
    }

    private function getIntegerValue($input, $keys, $default = null) {
        $value = $this->getFirstAvailableValue($input, $keys, null);
        if ($value === null || $value === '') {
            return $default;
        }
        return (int)$value;
    }

    private function resolveTrainee($input) {
        $traineeModel = new Trainee();
        $trainee = null;
        $userId = $this->getFirstAvailableValue($input, ['userId', 'user_id'], null);

        if ($userId) {
            $trainee = $traineeModel->findById($userId);
        }

        if (!$trainee) {
            $traineeId = $this->getFirstAvailableValue($input, ['traineeId', 'trainee_id'], null);
            if ($traineeId) {
                foreach ($traineeModel->all() as $candidate) {
                    if (($candidate['trainee_id'] ?? '') === $traineeId) {
                        $trainee = $candidate;
                        $userId = $candidate['_id'] ?? $userId;
                        break;
                    }
                }
            }
        }

        return [
            'trainee' => $trainee,
            'user_id' => $this->convertToObjectId($userId)
        ];
    }

    private function buildNameData($input, $trainee = null) {
        $nameInput = isset($input['name']) && is_array($input['name']) ? $input['name'] : [];

        return [
            'surname' => $this->getFirstAvailableValue($nameInput + $input, ['surname'], $trainee['last_name'] ?? ''),
            'first_name' => $this->getFirstAvailableValue($nameInput + $input, ['first_name', 'firstName', 'firstname'], $trainee['first_name'] ?? ''),
            'second_name' => $this->getFirstAvailableValue($nameInput + $input, ['second_name', 'secondname']),
            'middle_name' => $this->getFirstAvailableValue($nameInput + $input, ['middle_name', 'middleName'], $trainee['middle_name'] ?? ''),
            'middle_initial' => $this->getFirstAvailableValue($nameInput + $input, ['middle_initial', 'middleInitial']),
            'name_extension' => $this->getFirstAvailableValue($nameInput + $input, ['name_extension', 'nameExtension'])
        ];
    }

    private function buildMailingAddressData($input) {
        $addressInput = isset($input['mailing_address']) && is_array($input['mailing_address']) ? $input['mailing_address'] : [];

        return [
            'number_street' => $this->getFirstAvailableValue($addressInput + $input, ['number_street', 'numberStreet', 'mailingNumber']),
            'barangay' => $this->getFirstAvailableValue($addressInput + $input, ['barangay']),
            'district' => $this->getFirstAvailableValue($addressInput + $input, ['district']),
            'city' => $this->getFirstAvailableValue($addressInput + $input, ['city', 'cityMunicipality']),
            'province' => $this->getFirstAvailableValue($addressInput + $input, ['province']),
            'region' => $this->getFirstAvailableValue($addressInput + $input, ['region']),
            'zip' => $this->getFirstAvailableValue($addressInput + $input, ['zip'])
        ];
    }

    private function buildContactData($input, $trainee = null) {
        $contactInput = isset($input['contact']) && is_array($input['contact']) ? $input['contact'] : [];

        return [
            'tel' => $this->getFirstAvailableValue($contactInput + $input, ['tel']),
            'mobile' => $this->getFirstAvailableValue($contactInput + $input, ['mobile']),
            'fax' => $this->getFirstAvailableValue($contactInput + $input, ['fax']),
            'email' => $this->getFirstAvailableValue($contactInput + $input, ['email'], $trainee['email'] ?? ''),
            'other_contact' => $this->getFirstAvailableValue($contactInput + $input, ['other_contact', 'otherContact'])
        ];
    }

    private function buildWorkExperienceData($input) {
        if (isset($input['work_experience']) && is_array($input['work_experience'])) {
            return $input['work_experience'];
        }
        return $this->buildWorkExperience($input);
    }

    private function buildTrainingSeminarsData($input) {
        if (isset($input['training_seminars']) && is_array($input['training_seminars'])) {
            return $input['training_seminars'];
        }
        return $this->buildTrainingSeminars($input);
    }

    private function buildLicensureExamsData($input) {
        if (isset($input['licensure_exams']) && is_array($input['licensure_exams'])) {
            return $input['licensure_exams'];
        }
        return $this->buildLicensureExams($input);
    }

    private function buildCompetencyAssessmentsData($input) {
        if (isset($input['competency_assessments']) && is_array($input['competency_assessments'])) {
            return $input['competency_assessments'];
        }
        return $this->buildCompetencyAssessments($input);
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
