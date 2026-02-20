<?php

require_once __DIR__ . '/../app/controllers/AuthController.php';
require_once __DIR__ . '/../app/controllers/UserController.php';
require_once __DIR__ . '/../app/controllers/TraineeController.php';
require_once __DIR__ . '/../app/controllers/CourseController.php';
require_once __DIR__ . '/../app/controllers/CompetencyController.php';

function handleRequest($uri, $method) {
    // Remove base path if exists
    $uri = preg_replace('#^/CAATE-ITRMS/backend/public#', '', $uri);
    $uri = preg_replace('#^/CAATE-ITRMS/backend#', '', $uri);
    $uri = preg_replace('#^/backend/public#', '', $uri);
    $uri = preg_replace('#^/backend#', '', $uri);
    
    // API Routes
    $routes = [
        'GET:/api/v1/health' => ['TraineeController', 'health'],
        'POST:/api/v1/auth/register' => ['AuthController', 'register'],
        'POST:/api/v1/auth/login' => ['AuthController', 'login'],
        'POST:/api/v1/auth/logout' => ['AuthController', 'logout'],
        'GET:/api/v1/users' => ['UserController', 'index'],
        'GET:/api/v1/users/{id}' => ['UserController', 'show'],
        'POST:/api/v1/users' => ['UserController', 'store'],
        'PUT:/api/v1/users/{id}' => ['UserController', 'update'],
        'DELETE:/api/v1/users/{id}' => ['UserController', 'destroy'],
        'GET:/api/v1/trainees/statistics' => ['TraineeController', 'statistics'],
        'GET:/api/v1/trainees' => ['TraineeController', 'index'],
        'GET:/api/v1/trainees/{id}' => ['TraineeController', 'show'],
        'POST:/api/v1/trainees' => ['TraineeController', 'store'],
        'PUT:/api/v1/trainees/{id}' => ['TraineeController', 'update'],
        'DELETE:/api/v1/trainees/{id}' => ['TraineeController', 'destroy'],
        'GET:/api/v1/courses' => ['CourseController', 'index'],
        'GET:/api/v1/courses/{id}' => ['CourseController', 'show'],
        'POST:/api/v1/courses' => ['CourseController', 'store'],
        'PUT:/api/v1/courses/{id}' => ['CourseController', 'update'],
        'DELETE:/api/v1/courses/{id}' => ['CourseController', 'destroy'],
        'GET:/api/v1/competencies' => ['CompetencyController', 'index'],
        'GET:/api/v1/competencies/{id}' => ['CompetencyController', 'show'],
        'POST:/api/v1/competencies' => ['CompetencyController', 'store'],
        'PUT:/api/v1/competencies/{id}' => ['CompetencyController', 'update'],
        'DELETE:/api/v1/competencies/{id}' => ['CompetencyController', 'destroy'],
    ];
    
    // Match route
    foreach ($routes as $route => $handler) {
        list($routeMethod, $routePath) = explode(':', $route);
        
        // Convert route pattern to regex
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
    
    // Route not found
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
