<?php

require_once __DIR__ . '/../config/database.php';

class NotificationController {
    private $db;
    private $collection;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getDatabase();
        $this->collection = $this->db->notifications;
    }

    /**
     * Get all notifications for a user
     * GET /api/v1/notifications?userId={userId}
     */
    public function index() {
        try {
            // Get userId from query parameter
            $userId = $_GET['userId'] ?? null;

            if (!$userId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'userId is required']);
                return;
            }

            // Fetch notifications for the user, sorted by timestamp (newest first)
            $notifications = $this->collection->find(
                ['userId' => $userId],
                ['sort' => ['timestamp' => -1]]
            )->toArray();

            // Convert MongoDB ObjectId to string
            foreach ($notifications as &$notification) {
                $notification['id'] = (string) $notification['_id'];
                unset($notification['_id']);
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching notifications: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Create a new notification
     * POST /api/v1/notifications
     */
    public function store() {
        try {
            // Get request body
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate required fields
            if (!isset($data['userId']) || !isset($data['type']) || !isset($data['title']) || !isset($data['message'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: userId, type, title, message'
                ]);
                return;
            }

            // Prepare notification document
            $notification = [
                'userId' => $data['userId'],
                'type' => $data['type'],
                'title' => $data['title'],
                'message' => $data['message'],
                'status' => $data['status'] ?? null,
                'read' => $data['read'] ?? false,
                'timestamp' => $data['timestamp'] ?? date('c'),
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ];

            // Insert into database
            $result = $this->collection->insertOne($notification);

            if ($result->getInsertedCount() > 0) {
                $notification['id'] = (string) $result->getInsertedId();
                unset($notification['_id']);

                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Notification created successfully',
                    'data' => $notification
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create notification'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error creating notification: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Mark a notification as read
     * PUT /api/v1/notifications/{id}/read
     */
    public function markAsRead($id) {
        try {
            // Get request body
            $data = json_decode(file_get_contents('php://input'), true);

            // Check if ID is a valid MongoDB ObjectId
            if (!preg_match('/^[a-f\d]{24}$/i', $id)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid notification ID format'
                ]);
                return;
            }

            // Update notification
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => [
                    'read' => $data['read'] ?? true,
                    'updatedAt' => date('c')
                ]]
            );

            if ($result->getModifiedCount() > 0 || $result->getMatchedCount() > 0) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Notification marked as read'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Notification not found'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating notification: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Mark all notifications as read for a user
     * PUT /api/v1/notifications/mark-all-read
     */
    public function markAllAsRead() {
        try {
            // Get request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['userId'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'userId is required'
                ]);
                return;
            }

            // Update all notifications for the user
            $result = $this->collection->updateMany(
                ['userId' => $data['userId'], 'read' => false],
                ['$set' => [
                    'read' => true,
                    'updatedAt' => date('c')
                ]]
            );

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'All notifications marked as read',
                'modifiedCount' => $result->getModifiedCount()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating notifications: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Clear all notifications for a user
     * DELETE /api/v1/notifications/clear-all
     */
    public function clearAll() {
        try {
            // Get request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['userId'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'userId is required'
                ]);
                return;
            }

            // Delete all notifications for the user
            $result = $this->collection->deleteMany(['userId' => $data['userId']]);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'All notifications cleared',
                'deletedCount' => $result->getDeletedCount()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error clearing notifications: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get new notifications since a timestamp
     * GET /api/v1/notifications/new?userId={userId}&since={timestamp}
     */
    public function getNew() {
        try {
            // Get query parameters
            $userId = $_GET['userId'] ?? null;
            $since = $_GET['since'] ?? null;

            if (!$userId || !$since) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'userId and since parameters are required'
                ]);
                return;
            }

            // Fetch new notifications
            $notifications = $this->collection->find(
                [
                    'userId' => $userId,
                    'timestamp' => ['$gt' => $since]
                ],
                ['sort' => ['timestamp' => -1]]
            )->toArray();

            // Convert MongoDB ObjectId to string
            foreach ($notifications as &$notification) {
                $notification['id'] = (string) $notification['_id'];
                unset($notification['_id']);
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching new notifications: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Delete a specific notification
     * DELETE /api/v1/notifications/{id}
     */
    public function destroy($id) {
        try {
            // Check if ID is a valid MongoDB ObjectId
            if (!preg_match('/^[a-f\d]{24}$/i', $id)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid notification ID format'
                ]);
                return;
            }

            // Delete notification
            $result = $this->collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);

            if ($result->getDeletedCount() > 0) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Notification deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Notification not found'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error deleting notification: ' . $e->getMessage()
            ]);
        }
    }
}
