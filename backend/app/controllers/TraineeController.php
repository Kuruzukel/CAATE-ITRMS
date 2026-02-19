<?php

require_once __DIR__ . '/../models/Trainee.php';

class TraineeController {
    
    public function health() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $traineeModel = new Trainee();
            echo json_encode([
                'success' => true,
                'message' => 'API and Database connection OK',
                'mongodb' => 'Connected'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $trainees = $traineeModel->all();
        
        echo json_encode(['success' => true, 'data' => $trainees]);
    }
    
    public function show($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $trainee = $traineeModel->findById($id);
        
        if (!$trainee) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
            return;
        }
        
        echo json_encode(['success' => true, 'data' => $trainee]);
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
            
            $traineeModel = new Trainee();
            $traineeId = $traineeModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Trainee created successfully',
                'id' => $traineeId
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
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $traineeModel = new Trainee();
        $result = $traineeModel->update($id, $data);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Trainee updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
        }
    }
    
    public function destroy($id) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $result = $traineeModel->delete($id);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Trainee deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Trainee not found']);
        }
    }
    
    public function statistics() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        $traineeModel = new Trainee();
        $stats = $traineeModel->getStatistics();
        
        echo json_encode(['success' => true, 'data' => $stats]);
    }
}
