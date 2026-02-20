<?php

require_once __DIR__ . '/../models/Competency.php';
require_once __DIR__ . '/../config/database.php';

class CompetencyController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $db = getMongoConnection();
            $competenciesCollection = $db->competencies;
            $coursesCollection = $db->courses;
            
            // Get all competencies
            $competencies = iterator_to_array($competenciesCollection->find());
            
            // Enrich competencies with course data (badge and image)
            foreach ($competencies as &$competency) {
                $courseCode = $competency['course_code'] ?? '';
                
                if ($courseCode) {
                    // Find matching course
                    $course = $coursesCollection->findOne(['course_code' => $courseCode]);
                    
                    if ($course) {
                        // Add badge and image from course
                        $competency['badge'] = $course['badge'] ?? $courseCode;
                        $competency['image'] = $course['image'] ?? '';
                        $competency['hours'] = $course['hours'] ?? $course['duration'] ?? '';
                    }
                }
            }
            
            echo json_encode(['success' => true, 'data' => $competencies]);
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
            $competencyModel = new Competency();
            $competency = $competencyModel->findById($id);
            
            if (!$competency) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Competency not found']);
                return;
            }
            
            echo json_encode(['success' => true, 'data' => $competency]);
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
            
            $competencyModel = new Competency();
            $competencyId = $competencyModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Competency created successfully',
                'id' => $competencyId
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
            
            $competencyModel = new Competency();
            $result = $competencyModel->update($id, $data);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Competency updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Competency not found or no changes made']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $competencyModel = new Competency();
            $result = $competencyModel->delete($id);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Competency deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Competency not found']);
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
