<?php

require_once __DIR__ . '/../models/Enrollment.php';
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../models/Trainee.php';

class EnrollmentController {
    
    public function getRecentEnrollments() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
            
            $db = getMongoConnection();
            $enrollmentsCollection = $db->enrollments;
            $coursesCollection = $db->courses;
            $traineesCollection = $db->trainees;
            
            $enrollments = $enrollmentsCollection->find(
                [],
                [
                    'sort' => ['enrollment_date' => -1],
                    'limit' => $limit
                ]
            )->toArray();
            
            $recentEnrollments = [];
            
            foreach ($enrollments as $enrollment) {
                $courseId = $enrollment['course_id'] ?? '';
                $traineeId = $enrollment['trainee_id'] ?? '';
                
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
                $status = $enrollment['status'] ?? 'unknown';
                
                $recentEnrollments[] = [
                    'id' => (string)$enrollment['_id'],
                    'traineeName' => $traineeName,
                    'courseName' => $courseName,
                    'status' => $status,
                    'enrollmentDate' => $enrollment['enrollment_date']->toDateTime()->format('Y-m-d H:i:s')
                ];
            }
            
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
