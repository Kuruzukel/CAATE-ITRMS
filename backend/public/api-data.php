<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/config/database.php';

try {
    $db = getMongoConnection();
    
    // Get collection parameter
    $collection = isset($_GET['collection']) ? $_GET['collection'] : 'all';
    
    $response = [];
    
    if ($collection === 'all' || $collection === 'users') {
        $users = $db->users->find()->toArray();
        $response['users'] = array_map(function($user) {
            return [
                'id' => (string)$user['_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'phone' => $user['phone'] ?? '',
                'created_at' => $user['created_at']->toDateTime()->format('Y-m-d H:i:s')
            ];
        }, $users);
    }
    
    if ($collection === 'all' || $collection === 'courses') {
        $courses = $db->courses->find()->toArray();
        $response['courses'] = array_map(function($course) {
            return [
                'id' => (string)$course['_id'],
                'course_code' => $course['course_code'],
                'title' => $course['title'],
                'description' => $course['description'],
                'duration' => $course['duration'],
                'fee' => $course['fee'],
                'status' => $course['status']
            ];
        }, $courses);
    }
    
    if ($collection === 'all' || $collection === 'trainees') {
        $trainees = $db->trainees->find()->toArray();
        $response['trainees'] = array_map(function($trainee) {
            return [
                'id' => (string)$trainee['_id'],
                'student_id' => $trainee['student_id'],
                'first_name' => $trainee['first_name'],
                'last_name' => $trainee['last_name'],
                'email' => $trainee['email'],
                'phone' => $trainee['phone'],
                'address' => $trainee['address'],
                'status' => $trainee['status']
            ];
        }, $trainees);
    }
    
    if ($collection === 'all' || $collection === 'enrollments') {
        $enrollments = $db->enrollments->find()->toArray();
        $response['enrollments'] = array_map(function($enrollment) {
            return [
                'id' => (string)$enrollment['_id'],
                'trainee_id' => $enrollment['trainee_id'],
                'course_id' => $enrollment['course_id'],
                'enrollment_date' => $enrollment['enrollment_date']->toDateTime()->format('Y-m-d'),
                'status' => $enrollment['status'],
                'payment_status' => $enrollment['payment_status']
            ];
        }, $enrollments);
    }
    
    if ($collection === 'all' || $collection === 'inventory') {
        $inventory = $db->inventory->find()->toArray();
        $response['inventory'] = array_map(function($item) {
            return [
                'id' => (string)$item['_id'],
                'item_code' => $item['item_code'],
                'name' => $item['name'],
                'category' => $item['category'],
                'type' => $item['type'],
                'quantity' => $item['quantity'],
                'unit' => $item['unit'],
                'price' => $item['price'],
                'status' => $item['status']
            ];
        }, $inventory);
    }
    
    if ($collection === 'all' || $collection === 'applications') {
        $applications = $db->applications->find()->toArray();
        $response['applications'] = array_map(function($app) {
            return [
                'id' => (string)$app['_id'],
                'first_name' => $app['first_name'],
                'last_name' => $app['last_name'],
                'email' => $app['email'],
                'phone' => $app['phone'],
                'course_interest' => $app['course_interest'],
                'status' => $app['status']
            ];
        }, $applications);
    }
    
    if ($collection === 'all' || $collection === 'graduates') {
        $graduates = $db->graduates->find()->toArray();
        $response['graduates'] = array_map(function($grad) {
            return [
                'id' => (string)$grad['_id'],
                'trainee_id' => $grad['trainee_id'],
                'student_name' => $grad['student_name'],
                'course_name' => $grad['course_name'],
                'graduation_date' => $grad['graduation_date']->toDateTime()->format('Y-m-d'),
                'certificate_number' => $grad['certificate_number']
            ];
        }, $graduates);
    }
    
    // Add statistics
    $response['statistics'] = [
        'total_users' => $db->users->countDocuments(),
        'total_trainees' => $db->trainees->countDocuments(),
        'total_courses' => $db->courses->countDocuments(),
        'total_enrollments' => $db->enrollments->countDocuments(),
        'total_inventory' => $db->inventory->countDocuments(),
        'total_applications' => $db->applications->countDocuments(),
        'total_graduates' => $db->graduates->countDocuments()
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $response
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
