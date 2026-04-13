<?php

require_once __DIR__ . '/../models/Enrollment.php';
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../models/Trainee.php';

class EnrollmentController {
    
    private function extractTraineeName($record, $trainee = null) {
        // First, try to get name from trainee lookup
        if ($trainee) {
            $firstName = $trainee['first_name'] ?? '';
            $lastName = $trainee['last_name'] ?? '';
            $fullName = trim($firstName . ' ' . $lastName);
            if (!empty($fullName)) {
                return $fullName;
            }
            if (isset($trainee['name']) && !empty($trainee['name'])) {
                return $trainee['name'];
            }
        }
        
        // Try direct fields in record
        if (isset($record['first_name']) && isset($record['last_name'])) {
            $firstName = $record['first_name'] ?? '';
            $middleName = $record['middle_name'] ?? '';
            $lastName = $record['last_name'] ?? '';
            $fullName = trim($firstName . ' ' . $middleName . ' ' . $lastName);
            if (!empty($fullName) && $fullName !== '  ') {
                return $fullName;
            }
        }
        
        // Try nested name object (for applications)
        if (isset($record['name']) && is_array($record['name'])) {
            $firstName = $record['name']['first_name'] ?? ($record['name']['firstName'] ?? '');
            $middleName = $record['name']['middle_name'] ?? ($record['name']['middleName'] ?? '');
            $lastName = $record['name']['last_name'] ?? ($record['name']['lastName'] ?? '');
            $fullName = trim($firstName . ' ' . $middleName . ' ' . $lastName);
            if (!empty($fullName) && $fullName !== '  ') {
                return $fullName;
            }
        }
        
        // Try other possible name fields
        $possibleNameFields = [
            'applicant_name',
            'trainee_name',
            'traineeFullName',
            'full_name',
            'fullName',
            'name'
        ];
        
        foreach ($possibleNameFields as $field) {
            if (isset($record[$field]) && !empty($record[$field]) && is_string($record[$field])) {
                return $record[$field];
            }
        }
        
        return 'Unknown';
    }
    
    public function getRecentEnrollments() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            
            $db = getMongoConnection();
            $registrationCollection = $db->registrations;
            $applicationCollection = $db->applications;
            $admissionCollection = $db->admissions;
            $coursesCollection = $db->courses;
            $traineesCollection = $db->trainees;
            
            $recentEnrollments = [];
            
            // Fetch all registrations (all statuses)
            $registrations = $registrationCollection->find(
                [],
                [
                    'sort' => ['createdAt' => -1],
                    'limit' => $limit
                ]
            )->toArray();
            
            foreach ($registrations as $registration) {
                $courseId = $registration['selectedCourseId'] ?? '';
                $traineeId = $registration['userId'] ?? '';
                
                $course = null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $course = $coursesCollection->findOne(['_id' => $courseId]);
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $trainee = $traineesCollection->findOne(['_id' => $traineeId]);
                    }
                }
                
                $traineeName = $this->extractTraineeName($registration, $trainee);
                $courseName = $course['title'] ?? ($registration['selectedCourse'] ?? ($registration['course_name'] ?? 'Unknown Course'));
                $status = $registration['status'] ?? 'pending';
                
                $createdAt = null;
                if (isset($registration['createdAt'])) {
                    if ($registration['createdAt'] instanceof MongoDB\BSON\UTCDateTime) {
                        $createdAt = $registration['createdAt']->toDateTime()->format('Y-m-d H:i:s');
                    } else {
                        $createdAt = $registration['createdAt'];
                    }
                }
                
                $recentEnrollments[] = [
                    'id' => (string)$registration['_id'],
                    'traineeName' => $traineeName,
                    'traineeId' => $traineeId,
                    'courseName' => $courseName,
                    'status' => $status,
                    'enrollmentDate' => $createdAt,
                    'type' => 'registration'
                ];
            }
            
            // Fetch all applications (all statuses)
            $applications = $applicationCollection->find(
                [],
                [
                    'sort' => ['created_at' => -1],
                    'limit' => $limit
                ]
            )->toArray();
            
            foreach ($applications as $application) {
                // Applications use 'user_id' instead of 'trainee_id'
                $traineeId = $application['user_id'] ?? ($application['trainee_id'] ?? '');
                $courseId = $application['course_id'] ?? '';
                
                $course = null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $course = $coursesCollection->findOne(['_id' => $courseId]);
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        if ($traineeId instanceof MongoDB\BSON\ObjectId) {
                            $trainee = $traineesCollection->findOne(['_id' => $traineeId]);
                        } else {
                            $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                        }
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $trainee = $traineesCollection->findOne(['_id' => $traineeId]);
                    }
                }
                
                $traineeName = $this->extractTraineeName($application, $trainee);
                $courseName = $course['title'] ?? ($application['assessment_title'] ?? ($application['course_name'] ?? 'Unknown Course'));
                $status = $application['status'] ?? 'pending';
                
                $createdAt = null;
                if (isset($application['created_at'])) {
                    if ($application['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
                        $createdAt = $application['created_at']->toDateTime()->format('Y-m-d H:i:s');
                    } else {
                        $createdAt = $application['created_at'];
                    }
                }
                
                $recentEnrollments[] = [
                    'id' => (string)$application['_id'],
                    'traineeName' => $traineeName,
                    'traineeId' => is_object($traineeId) ? (string)$traineeId : $traineeId,
                    'courseName' => $courseName,
                    'status' => $status,
                    'enrollmentDate' => $createdAt,
                    'type' => 'application'
                ];
            }
            
            // Fetch all admissions (all statuses)
            $admissions = $admissionCollection->find(
                [],
                [
                    'sort' => ['created_at' => -1],
                    'limit' => $limit
                ]
            )->toArray();
            
            foreach ($admissions as $admission) {
                // Admissions use 'user_id' instead of 'trainee_id'
                $traineeId = $admission['user_id'] ?? ($admission['trainee_id'] ?? '');
                
                // Admissions don't have course_id, they have assessment_applied
                $courseId = $admission['course_id'] ?? '';
                
                $course = null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $course = $coursesCollection->findOne(['_id' => $courseId]);
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        if ($traineeId instanceof MongoDB\BSON\ObjectId) {
                            $trainee = $traineesCollection->findOne(['_id' => $traineeId]);
                        } else {
                            $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                        }
                    } catch (Exception $e) {
                        // Try finding by string ID if ObjectId fails
                        $trainee = $traineesCollection->findOne(['_id' => $traineeId]);
                    }
                }
                
                $traineeName = $this->extractTraineeName($admission, $trainee);
                $courseName = $course['title'] ?? ($admission['assessment_applied'] ?? ($admission['course_name'] ?? 'Unknown Course'));
                $status = $admission['status'] ?? 'pending';
                
                $createdAt = null;
                if (isset($admission['created_at'])) {
                    if ($admission['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
                        $createdAt = $admission['created_at']->toDateTime()->format('Y-m-d H:i:s');
                    } else {
                        $createdAt = $admission['created_at'];
                    }
                }
                
                $recentEnrollments[] = [
                    'id' => (string)$admission['_id'],
                    'traineeName' => $traineeName,
                    'traineeId' => is_object($traineeId) ? (string)$traineeId : $traineeId,
                    'courseName' => $courseName,
                    'status' => $status,
                    'enrollmentDate' => $createdAt,
                    'type' => 'admission'
                ];
            }
            
            // Sort all enrollments by date (most recent first)
            usort($recentEnrollments, function($a, $b) {
                return strtotime($b['enrollmentDate']) - strtotime($a['enrollmentDate']);
            });
            
            // Limit to requested number
            $recentEnrollments = array_slice($recentEnrollments, 0, $limit);
            
            echo json_encode([
                'success' => true,
                'data' => $recentEnrollments
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
