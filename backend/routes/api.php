<?php

require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/controllers/AuthController.php';
require_once __DIR__ . '/../app/controllers/UserController.php';
require_once __DIR__ . '/../app/controllers/AdminController.php';
require_once __DIR__ . '/../app/controllers/TraineeController.php';
require_once __DIR__ . '/../app/controllers/CourseController.php';
require_once __DIR__ . '/../app/controllers/CompetencyController.php';
require_once __DIR__ . '/../app/controllers/InventoryController.php';
require_once __DIR__ . '/../app/controllers/AppointmentController.php';
require_once __DIR__ . '/../app/controllers/EnrollmentController.php';
require_once __DIR__ . '/../app/controllers/RegistrationController.php';
require_once __DIR__ . '/../app/controllers/ApplicationController.php';

function handleRequest($uri, $method) {
    $uri = preg_replace('#^/CAATE-ITRMS/backend/public#', '', $uri);
    $uri = preg_replace('#^/CAATE-ITRMS/backend#', '', $uri);
    $uri = preg_replace('#^/backend/public#', '', $uri);
    $uri = preg_replace('#^/backend#', '', $uri);
    
    $routes = [
        'GET:/api/v1/health' => ['TraineeController', 'health'],
        'POST:/api/v1/auth/register' => ['AuthController', 'register'],
        'POST:/api/v1/auth/login' => ['AuthController', 'login'],
        'POST:/api/v1/auth/logout' => ['AuthController', 'logout'],
        'POST:/api/v1/auth/change-password' => ['AuthController', 'changePassword'],
        'GET:/api/v1/auth/session' => ['AuthController', 'checkSession'],
        'GET:/api/v1/users' => ['UserController', 'index'],
        'GET:/api/v1/users/{id}' => ['UserController', 'show'],
        'POST:/api/v1/users' => ['UserController', 'store'],
        'PUT:/api/v1/users/{id}' => ['UserController', 'update'],
        'DELETE:/api/v1/users/{id}' => ['UserController', 'destroy'],
        'POST:/api/v1/users/{id}/profile-image' => ['UserController', 'uploadProfileImage'],
        'GET:/api/v1/admins' => ['AdminController', 'index'],
        'GET:/api/v1/admins/{id}' => ['AdminController', 'show'],
        'POST:/api/v1/admins' => ['AdminController', 'store'],
        'PUT:/api/v1/admins/{id}' => ['AdminController', 'update'],
        'DELETE:/api/v1/admins/{id}' => ['AdminController', 'destroy'],
        'POST:/api/v1/admins/{id}/profile-image' => ['AdminController', 'uploadProfileImage'],
        'GET:/api/v1/trainees/statistics' => ['TraineeController', 'statistics'],
        'GET:/api/v1/trainees/test/upload' => ['TraineeController', 'testUpload'],
        'POST:/api/v1/trainees/test/upload' => ['TraineeController', 'testUpload'],
        'PUT:/api/v1/trainees/test/upload' => ['TraineeController', 'testUpload'],
        'GET:/api/v1/trainees' => ['TraineeController', 'index'],
        'GET:/api/v1/trainees/{id}' => ['TraineeController', 'show'],
        'POST:/api/v1/trainees' => ['TraineeController', 'store'],
        'PUT:/api/v1/trainees/{id}' => ['TraineeController', 'update'],
        'DELETE:/api/v1/trainees/{id}' => ['TraineeController', 'destroy'],
        'GET:/api/v1/courses/enrollment-statistics' => ['CourseController', 'getEnrollmentStatistics'],
        'GET:/api/v1/courses' => ['CourseController', 'index'],
        'GET:/api/v1/courses/{id}' => ['CourseController', 'show'],
        'POST:/api/v1/courses' => ['CourseController', 'store'],
        'PUT:/api/v1/courses/{id}' => ['CourseController', 'update'],
        'DELETE:/api/v1/courses/{id}' => ['CourseController', 'destroy'],
        'GET:/api/v1/enrollments/recent' => ['EnrollmentController', 'getRecentEnrollments'],
        'GET:/api/v1/registrations' => ['RegistrationController', 'index'],
        'GET:/api/v1/registrations/{id}' => ['RegistrationController', 'show'],
        'POST:/api/v1/registrations' => ['RegistrationController', 'store'],
        'PUT:/api/v1/registrations/{id}' => ['RegistrationController', 'update'],
        'GET:/api/v1/applications' => ['ApplicationController', 'index'],
        'GET:/api/v1/applications/{id}' => ['ApplicationController', 'show'],
        'POST:/api/v1/applications' => ['ApplicationController', 'store'],
        'PUT:/api/v1/applications/{id}' => ['ApplicationController', 'update'],
        'GET:/api/v1/competencies' => ['CompetencyController', 'index'],
        'GET:/api/v1/competencies/{id}' => ['CompetencyController', 'show'],
        'POST:/api/v1/competencies' => ['CompetencyController', 'store'],
        'PUT:/api/v1/competencies/{id}' => ['CompetencyController', 'update'],
        'DELETE:/api/v1/competencies/{id}' => ['CompetencyController', 'destroy'],
        'GET:/api/v1/inventory/statistics' => ['InventoryController', 'statistics'],
        'GET:/api/v1/inventory/filter-options' => ['InventoryController', 'getFilterOptions'],
        'GET:/api/v1/inventory' => ['InventoryController', 'index'],
        'GET:/api/v1/inventory/{id}' => ['InventoryController', 'show'],
        'POST:/api/v1/inventory' => ['InventoryController', 'store'],
        'PUT:/api/v1/inventory/{id}' => ['InventoryController', 'update'],
        'DELETE:/api/v1/inventory/{id}' => ['InventoryController', 'destroy'],
        'GET:/api/v1/appointments/statistics' => ['AppointmentController', 'statistics'],
        'GET:/api/v1/appointments' => ['AppointmentController', 'index'],
        'GET:/api/v1/appointments/{id}' => ['AppointmentController', 'show'],
        'POST:/api/v1/appointments' => ['AppointmentController', 'store'],
        'PUT:/api/v1/appointments/{id}' => ['AppointmentController', 'update'],
        'DELETE:/api/v1/appointments/{id}' => ['AppointmentController', 'destroy'],
    ];
    
    foreach ($routes as $route => $handler) {
        list($routeMethod, $routePath) = explode(':', $route);
        
        $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([a-zA-Z0-9_-]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        
        if ($routeMethod === $method && preg_match($pattern, $uri, $matches)) {
            array_shift($matches); // Remove full match
            
            $controllerName = $handler[0];
            $methodName = $handler[1];
            
            $controller = new $controllerName();
            call_user_func_array([$controller, $methodName], $matches);
            return;
        }
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
