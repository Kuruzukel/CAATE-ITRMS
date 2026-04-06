<?php

require_once __DIR__ . '/../models/Enrollment.php';
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../models/Trainee.php';

class EnrollmentController {
    
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
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                    } catch (Exception $e) {
                    }
                }
                
                $traineeName = 'Unknown';
                if ($trainee) {
                    $firstName = $trainee['first_name'] ?? '';
                    $lastName = $trainee['last_name'] ?? '';
                    $traineeName = trim($firstName . ' ' . $lastName);
                } else if (isset($registration['traineeFullName'])) {
                    $traineeName = $registration['traineeFullName'];
                }
                
                $courseName = $course['title'] ?? ($registration['selectedCourse'] ?? 'Unknown Course');
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
                $courseId = $application['course_id'] ?? '';
                $traineeId = $application['trainee_id'] ?? '';
                
                $course = null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                    } catch (Exception $e) {
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                    } catch (Exception $e) {
                    }
                }
                
                $traineeName = 'Unknown';
                if ($trainee) {
                    $firstName = $trainee['first_name'] ?? '';
                    $lastName = $trainee['last_name'] ?? '';
                    $traineeName = trim($firstName . ' ' . $lastName);
                }
                
                $courseName = $course['title'] ?? 'Unknown Course';
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
                    'traineeId' => $traineeId,
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
                $courseId = $admission['course_id'] ?? '';
                $traineeId = $admission['trainee_id'] ?? '';
                
                $course = null;
                if ($courseId) {
                    try {
                        $course = $coursesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($courseId)]);
                    } catch (Exception $e) {
                    }
                }
                
                $trainee = null;
                if ($traineeId) {
                    try {
                        $trainee = $traineesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($traineeId)]);
                    } catch (Exception $e) {
                    }
                }
                
                $traineeName = 'Unknown';
                if ($trainee) {
                    $firstName = $trainee['first_name'] ?? '';
                    $lastName = $trainee['last_name'] ?? '';
                    $traineeName = trim($firstName . ' ' . $lastName);
                }
                
                $courseName = $course['title'] ?? 'Unknown Course';
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
                    'traineeId' => $traineeId,
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
