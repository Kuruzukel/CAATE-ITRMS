<?php

require_once __DIR__ . '/../models/Course.php';

class CourseController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $courseModel = new Course();
            $courses = $courseModel->all();
            
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
            
            // Update the course
            $result = $courseModel->update($id, $data);

            if ($result['success']) {
                // If competencies were updated, sync to competencies collection
                $hasCompetencies = isset($data['basic_competencies']) || 
                                   isset($data['common_competencies']) || 
                                   isset($data['core_competencies']);
                
                if ($hasCompetencies) {
                    $this->syncCompetenciesToCollection($course, $data);
                }
                
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
}
