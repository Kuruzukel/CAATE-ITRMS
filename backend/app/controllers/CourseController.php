<?php

require_once __DIR__ . '/../models/Course.php';

class CourseController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $courseModel = new Course();
            $courses = $courseModel->all();

            // Load competencies and group them by course_code so we can
            // expose basic/common/core arrays without storing them on courses
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

            // Attach arrays to each course for API response only
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
            
            // Get the course before updating to get course_code and course_title
            $course = $courseModel->findById($id);
            if (!$course) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Course not found']);
                return;
            }
            
            // Update the course (course document no longer stores competency arrays;
            // competencies are managed exclusively in the competencies collection)
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
            
            // Delete existing competencies for this course
            $competenciesCollection->deleteMany(['course_code' => $courseCode]);
            
            $now = new MongoDB\BSON\UTCDateTime();
            $competenciesToInsert = [];
            
            // Insert Basic Competencies
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
            
            // Insert Common Competencies
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
            
            // Insert Core Competencies
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
            
            // Insert all competencies at once if there are any
            if (!empty($competenciesToInsert)) {
                $competenciesCollection->insertMany($competenciesToInsert);
            }
            
        } catch (Exception $e) {
            // Log error but don't fail the main update
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
                $enrollmentsCollection = $db->enrollments;
                $coursesCollection = $db->courses;

                // Get all courses with error handling
                $courses = [];
                try {
                    $courses = $coursesCollection->find()->toArray();
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error fetching courses: " . $e->getMessage());
                    $courses = [];
                }

                // Count enrollments per course
                $allCourses = [];
                $totalEnrollmentsCount = 0;

                foreach ($courses as $course) {
                    try {
                        $courseId = (string)$course['_id'];
                        $courseName = $course['title'] ?? 'Unknown Course';
                        $courseHours = $course['hours'] ?? 0;
                        $courseImage = $course['image'] ?? '';
                        $courseDescription = $course['description'] ?? '';

                        // Count enrolled trainees for this course (accept multiple status values)
                        $enrollmentCount = 0;
                        try {
                            $enrollmentCount = $enrollmentsCollection->countDocuments([
                                'course_id' => $courseId,
                                'status' => ['$in' => ['enrolled', 'active', 'approved', 'ongoing', 'Enrolled', 'Active', 'Approved', 'Ongoing']]
                            ]);
                        } catch (Exception $e) {
                            error_log("CourseController::getEnrollmentStatistics - Error counting enrollments for course $courseId: " . $e->getMessage());
                        }

                        // Also try without status filter to see if course_id matches
                        $totalForCourse = 0;
                        try {
                            $totalForCourse = $enrollmentsCollection->countDocuments([
                                'course_id' => $courseId
                            ]);
                        } catch (Exception $e) {
                            error_log("CourseController::getEnrollmentStatistics - Error counting total enrollments for course $courseId: " . $e->getMessage());
                        }

                        $totalEnrollmentsCount += $enrollmentCount;

                        $allCourses[] = [
                            'id' => $courseId,
                            'name' => $courseName,
                            'hours' => $courseHours,
                            'enrollmentCount' => $enrollmentCount,
                            'totalForCourse' => $totalForCourse,
                            'image' => $courseImage,
                            'description' => $courseDescription
                        ];
                    } catch (Exception $e) {
                        error_log("CourseController::getEnrollmentStatistics - Error processing course: " . $e->getMessage());
                        continue;
                    }
                }

                // Sort by enrollment count descending
                usort($allCourses, function($a, $b) {
                    return $b['enrollmentCount'] - $a['enrollmentCount'];
                });

                // Return all courses instead of just top 5
                $topCourses = $allCourses;

                // Calculate total enrollments (accept multiple status values)
                $totalEnrollments = 0;
                try {
                    $totalEnrollments = $enrollmentsCollection->countDocuments([
                        'status' => ['$in' => ['enrolled', 'active', 'approved', 'ongoing', 'Enrolled', 'Active', 'Approved', 'Ongoing']]
                    ]);
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error counting total enrollments: " . $e->getMessage());
                }

                // Debug: Get total count of all enrollments
                $allEnrollmentsCount = 0;
                try {
                    $allEnrollmentsCount = $enrollmentsCollection->countDocuments([]);
                } catch (Exception $e) {
                    error_log("CourseController::getEnrollmentStatistics - Error counting all enrollments: " . $e->getMessage());
                }

                echo json_encode([
                    'success' => true,
                    'data' => [
                        'totalEnrollments' => $totalEnrollments,
                        'topCourses' => $topCourses,
                        'debug' => [
                            'allEnrollmentsInDb' => $allEnrollmentsCount,
                            'totalCounted' => $totalEnrollmentsCount
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
