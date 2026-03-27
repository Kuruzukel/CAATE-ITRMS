<?php

require_once __DIR__ . '/../models/Course.php';

class CourseController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $courseModel = new Course();
            $courses = $courseModel->all();

            $db = getMongoConnection();
            $competenciesCollection = $db->competencies;

            $grouped = [];
            $cursor = $competenciesCollection->find();

            foreach ($cursor as $competency) {
                $courseCode = $competency['course_code'] ?? '';
                if (!$courseCode) {
                    continue;
                }

                $type = $competency['competency_type'] ?? '';
                $name = $competency['competency_name'] ?? '';

                if ($name === '') {
                    continue;
                }

                if (!isset($grouped[$courseCode])) {
                    $grouped[$courseCode] = [
                        'Basic' => [],
                        'Common' => [],
                        'Core' => [],
                    ];
                }

                if ($type === 'Basic') {
                    $grouped[$courseCode]['Basic'][] = $name;
                } elseif ($type === 'Common') {
                    $grouped[$courseCode]['Common'][] = $name;
                } elseif ($type === 'Core') {
                    $grouped[$courseCode]['Core'][] = $name;
                }
            }

            foreach ($courses as &$course) {
                $courseCode = $course['course_code'] ?? '';

                if ($courseCode && isset($grouped[$courseCode])) {
                    $course['basic_competencies'] = $grouped[$courseCode]['Basic'];
                    $course['common_competencies'] = $grouped[$courseCode]['Common'];
                    $course['core_competencies'] = $grouped[$courseCode]['Core'];
                } else {
                    $course['basic_competencies'] = [];
                    $course['common_competencies'] = [];
                    $course['core_competencies'] = [];
                }
            }
            unset($course);

            echo json_encode(['success' => true, 'data' => $courses]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $courseModel = new Course();
            $course = $courseModel->findById($id);
            
            if (!$course) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Course not found']);
                return;
            }
            
            echo json_encode(['success' => true, 'data' => $course]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function store() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                return;
            }
            
            $courseModel = new Course();
            $courseId = $courseModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Course created successfully',
                'id' => $courseId
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function update($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                return;
            }

            $courseModel = new Course();
            
            $course = $courseModel->findById($id);
            if (!$course) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Course not found']);
                return;
            }
            
            $result = $courseModel->update($id, $data);

            if ($result['success']) {
                if ($result['modified']) {
                    echo json_encode([
                        'success' => true, 
                        'message' => 'Course updated successfully',
                        'modified' => true
                    ]);
                } else if ($result['matched']) {
                    echo json_encode([
                        'success' => true, 
                        'message' => 'No changes were made',
                        'modified' => false
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Course not found']);
                }
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false, 
                    'error' => $result['error'] ?? 'Failed to update course'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function syncCompetenciesToCollection($course, $data) {
        try {
            $db = getMongoConnection();
            $competenciesCollection = $db->competencies;
            
            $courseCode = $course['course_code'] ?? '';
            $courseTitle = $course['title'] ?? '';
            
            $competenciesCollection->deleteMany(['course_code' => $courseCode]);
            
            $now = new MongoDB\BSON\UTCDateTime();
            $competenciesToInsert = [];
            
            if (isset($data['basic_competencies']) && is_array($data['basic_competencies'])) {
                foreach ($data['basic_competencies'] as $competency) {
                    if (trim($competency)) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Basic',
                            'competency_name' => trim($competency),
                            'created_at' => $now,
                            'updated_at' => $now
                        ];
                    }
                }
            }
            
            if (isset($data['common_competencies']) && is_array($data['common_competencies'])) {
                foreach ($data['common_competencies'] as $competency) {
                    if (trim($competency)) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Common',
                            'competency_name' => trim($competency),
                            'created_at' => $now,
                            'updated_at' => $now
                        ];
                    }
                }
            }
            
            if (isset($data['core_competencies']) && is_array($data['core_competencies'])) {
                foreach ($data['core_competencies'] as $competency) {
                    if (trim($competency)) {
                        $competenciesToInsert[] = [
                            'course_code' => $courseCode,
                            'course_title' => $courseTitle,
                            'competency_type' => 'Core',
                            'competency_name' => trim($competency),
                            'created_at' => $now,
                            'updated_at' => $now
                        ];
                    }
                }
            }
            
            if (!empty($competenciesToInsert)) {
                $competenciesCollection->insertMany($competenciesToInsert);
            }
            
        } catch (Exception $e) {
            error_log("Failed to sync competencies: " . $e->getMessage());
        }
    }

    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $courseModel = new Course();
            $result = $courseModel->delete($id);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Course not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function getEnrollmentStatistics() {
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');

            try {
                $db = getMongoConnection();
                $registrationCollection = $db->registrations;
                $applicationCollection = $db->applications;
                $admissionCollection = $db->admissions;
                $coursesCollection = $db->courses;

                $courses = [];
                try {
                    $courses = $coursesCollection->find()->toArray();
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error fetching courses: " . $e->getMessage());
                    $courses = [];
                }

                $allCourses = [];
                $totalEnrollmentsCount = 0;

                foreach ($courses as $course) {
                    try {
                        $courseId = (string)$course['_id'];
                        $courseName = $course['title'] ?? 'Unknown Course';
                        $courseHours = $course['hours'] ?? 0;
                        $courseImage = $course['image'] ?? '';
                        $courseDescription = $course['description'] ?? '';

                        $approvedRegistrations = 0;
                        try {
                            $approvedRegistrations = $registrationCollection->countDocuments([
                                'selectedCourseId' => $courseId,
                                'status' => 'approved'
                            ]);
                        } catch (Exception $e) {
                            error_log("CourseController::getEnrollmentStatistics - Error counting registrations for course $courseId: " . $e->getMessage());
                        }

                        $approvedApplications = 0;
                        try {
                            $approvedApplications = $applicationCollection->countDocuments([
                                'course_id' => $courseId,
                                'status' => 'approved'
                            ]);
                        } catch (Exception $e) {
                            error_log("CourseController::getEnrollmentStatistics - Error counting applications for course $courseId: " . $e->getMessage());
                        }

                        $approvedAdmissions = 0;
                        try {
                            $approvedAdmissions = $admissionCollection->countDocuments([
                                'course_id' => $courseId,
                                'status' => 'approved'
                            ]);
                        } catch (Exception $e) {
                            error_log("CourseController::getEnrollmentStatistics - Error counting admissions for course $courseId: " . $e->getMessage());
                        }

                        $enrollmentCount = $approvedRegistrations + $approvedApplications + $approvedAdmissions;
                        $totalEnrollmentsCount += $enrollmentCount;

                        $allCourses[] = [
                            'id' => $courseId,
                            'name' => $courseName,
                            'hours' => $courseHours,
                            'enrollmentCount' => $enrollmentCount,
                            'image' => $courseImage,
                            'description' => $courseDescription,
                            'breakdown' => [
                                'registrations' => $approvedRegistrations,
                                'applications' => $approvedApplications,
                                'admissions' => $approvedAdmissions
                            ]
                        ];
                    } catch (Exception $e) {
                        error_log("CourseController::getEnrollmentStatistics - Error processing course: " . $e->getMessage());
                        continue;
                    }
                }

                usort($allCourses, function($a, $b) {
                    return $b['enrollmentCount'] - $a['enrollmentCount'];
                });

                $topCourses = $allCourses;

                $totalApprovedRegistrations = 0;
                $totalApprovedApplications = 0;
                $totalApprovedAdmissions = 0;
                
                try {
                    $totalApprovedRegistrations = $registrationCollection->countDocuments([
                        'status' => 'approved'
                    ]);
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error counting total registrations: " . $e->getMessage());
                }

                try {
                    $totalApprovedApplications = $applicationCollection->countDocuments([
                        'status' => 'approved'
                    ]);
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error counting total applications: " . $e->getMessage());
                }

                try {
                    $totalApprovedAdmissions = $admissionCollection->countDocuments([
                        'status' => 'approved'
                    ]);
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error counting total admissions: " . $e->getMessage());
                }

                $totalEnrollments = $totalApprovedRegistrations + $totalApprovedApplications + $totalApprovedAdmissions;

                echo json_encode([
                    'success' => true,
                    'data' => [
                        'totalEnrollments' => $totalEnrollments,
                        'topCourses' => $topCourses,
                        'breakdown' => [
                            'registrations' => $totalApprovedRegistrations,
                            'applications' => $totalApprovedApplications,
                            'admissions' => $totalApprovedAdmissions
                        ]
                    ]
                ]);
            } catch (Exception $e) {
                error_log("CourseController::getEnrollmentStatistics - Exception: " . $e->getMessage());
                error_log("CourseController::getEnrollmentStatistics - Stack trace: " . $e->getTraceAsString());
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to fetch enrollment statistics: ' . $e->getMessage()
                ]);
            }
        }

}
