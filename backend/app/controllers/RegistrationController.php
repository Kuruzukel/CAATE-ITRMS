<?php

require_once __DIR__ . '/../config/database.php';

class RegistrationController {
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        
        try {
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                return;
            }
            
            // Validate required fields
            $requiredFields = ['firstName', 'sex', 'civilStatus'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (!isset($input[$field]) || empty(trim($input[$field]))) {
                    $missingFields[] = $field;
                }
            }
            
            if (!empty($missingFields)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields)
                ]);
                return;
            }
            
            // Get MongoDB connection
            $db = getMongoConnection();
            
            // Prepare registration data
            $registrationData = [
                'uliNumber' => $input['uliNumber'] ?? '',
                'entryDate' => $input['entryDate'] ?? '',
                'lastName' => trim($input['lastName']),
                'firstName' => trim($input['firstName']),
                'middleName' => trim($input['middleName'] ?? ''),
                'numberStreet' => trim($input['numberStreet'] ?? ''),
                'barangay' => trim($input['barangay'] ?? ''),
                'district' => trim($input['district'] ?? ''),
                'cityMunicipality' => trim($input['cityMunicipality'] ?? ''),
                'province' => trim($input['province'] ?? ''),
                'region' => trim($input['region'] ?? ''),
                'emailFacebook' => trim($input['emailFacebook'] ?? ''),
                'contactNo' => trim($input['contactNo'] ?? ''),
                'nationality' => trim($input['nationality'] ?? ''),
                'sex' => $input['sex'],
                'civilStatus' => $input['civilStatus'],
                'employmentStatus' => $input['employmentStatus'] ?? '',
                'employmentType' => $input['employmentType'] ?? '',
                'birthMonth' => trim($input['birthMonth'] ?? ''),
                'birthDay' => trim($input['birthDay'] ?? ''),
                'birthYear' => trim($input['birthYear'] ?? ''),
                'age' => intval($input['age'] ?? 0),
                'birthCity' => trim($input['birthCity'] ?? ''),
                'birthProvince' => trim($input['birthProvince'] ?? ''),
                'birthRegion' => trim($input['birthRegion'] ?? ''),
                'education' => $input['education'] ?? '',
                'parentName' => trim($input['parentName'] ?? ''),
                'parentAddress' => trim($input['parentAddress'] ?? ''),
                'clientClassification' => $input['clientClassification'] ?? [],
                'disabilityType' => $input['disabilityType'] ?? [],
                'disabilityCause' => $input['disabilityCause'] ?? [],
                'courseQualification' => trim($input['courseQualification'] ?? ''),
                'scholarshipType' => trim($input['scholarshipType'] ?? ''),
                'privacyConsent' => $input['privacyConsent'] ?? '',
                'status' => 'pending',
                'submittedAt' => new MongoDB\BSON\UTCDateTime(),
                'createdAt' => new MongoDB\BSON\UTCDateTime(),
                'updatedAt' => new MongoDB\BSON\UTCDateTime()
            ];
            
            // Insert into registrations collection
            $result = $db->registrations->insertOne($registrationData);
            
            if ($result->getInsertedCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Registration submitted successfully',
                    'data' => [
                        'id' => (string) $result->getInsertedId(),
                        'status' => 'pending'
                    ]
                ]);
            } else {
                throw new Exception('Failed to insert registration');
            }
            
        } catch (MongoDB\Driver\Exception\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $db = getMongoConnection();
            
            // Get query parameters
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 10);
            $status = $_GET['status'] ?? null;
            
            $skip = ($page - 1) * $limit;
            
            // Build filter
            $filter = [];
            if ($status) {
                $filter['status'] = $status;
            }
            
            // Get registrations with pagination
            $registrations = $db->registrations->find(
                $filter,
                [
                    'sort' => ['submittedAt' => -1],
                    'skip' => $skip,
                    'limit' => $limit
                ]
            )->toArray();
            
            // Get total count
            $total = $db->registrations->countDocuments($filter);
            
            echo json_encode([
                'success' => true,
                'data' => $registrations,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $db = getMongoConnection();
            
            $registration = $db->registrations->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            
            if ($registration) {
                echo json_encode([
                    'success' => true,
                    'data' => $registration
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Registration not found'
                ]);
            }
            
        } catch (MongoDB\Driver\Exception\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid registration ID'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                return;
            }
            
            $db = getMongoConnection();
            
            // Add updated timestamp
            $input['updatedAt'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $db->registrations->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $input]
            );
            
            if ($result->getMatchedCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Registration updated successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Registration not found'
                ]);
            }
            
        } catch (MongoDB\Driver\Exception\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid registration ID'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }
}