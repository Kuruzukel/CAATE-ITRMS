<?php

require_once __DIR__ . '/../models/Appointment.php';

class AppointmentController {
    
    public function index() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $appointments = $appointmentModel->all();
            
            echo json_encode(['success' => true, 'data' => $appointments]);
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
            $appointmentModel = new Appointment();
            $appointment = $appointmentModel->findById($id);
            
            if (!$appointment) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
                return;
            }
            
            echo json_encode(['success' => true, 'data' => $appointment]);
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
            
            // Add default status if not provided
            if (!isset($data['status'])) {
                $data['status'] = 'Pending';
            }
            
            // Add timestamp
            $data['createdAt'] = new MongoDB\BSON\UTCDateTime();
            $data['updatedAt'] = new MongoDB\BSON\UTCDateTime();
            
            $appointmentModel = new Appointment();
            $appointmentId = $appointmentModel->create($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Appointment created successfully',
                'id' => $appointmentId
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
            
            // Update timestamp
            $data['updatedAt'] = new MongoDB\BSON\UTCDateTime();
            
            $appointmentModel = new Appointment();
            $result = $appointmentModel->update($id, $data);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
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
            $appointmentModel = new Appointment();
            $result = $appointmentModel->delete($id);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Appointment deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Appointment not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function statistics() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        
        try {
            $appointmentModel = new Appointment();
            $stats = $appointmentModel->getStatistics();
            
            echo json_encode(['success' => true, 'data' => $stats]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
