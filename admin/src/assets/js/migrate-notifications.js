/**
 * Migration utility to transfer localStorage notifications to database
 * This should be run once after enabling the notification API
 */

async function migrateNotificationsToDatabase() {
    const API_BASE_URL = window.location.origin.includes('localhost')
        ? 'http://localhost/CAATE-ITRMS/backend/public'
        : '/CAATE-ITRMS/backend/public';

    try {
        // Get notifications from localStorage
        const stored = localStorage.getItem('admin_notifications');
        if (!stored) {
            return { success: true, message: 'No notifications to migrate', migrated: 0 };
        }

        const notifications = JSON.parse(stored);
        if (notifications.length === 0) {
            return { success: true, message: 'No notifications to migrate', migrated: 0 };
        }

        let migratedCount = 0;
        let failedCount = 0;

        // Migrate each notification
        for (const notification of notifications) {
            // Skip if it already has a MongoDB ObjectId format
            if (/^[a-f\d]{24}$/i.test(notification.id)) {
                continue;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: notification.userId,
                        type: notification.type,
                        title: notification.title,
                        message: notification.message,
                        status: notification.status,
                        read: notification.read,
                        timestamp: notification.timestamp,
                        createdAt: notification.createdAt || notification.timestamp
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        // Update the notification ID with the MongoDB ID
                        notification.id = result.data.id;
                        migratedCount++;
                    } else {
                        failedCount++;
                        console.error(`Failed to migrate notification: ${notification.title}`, result);
                    }
                } else {
                    failedCount++;
                    console.error(`Failed to migrate notification: ${notification.title}`, response.status);
                }
            } catch (error) {
                failedCount++;
                console.error(`Error migrating notification: ${notification.title}`, error);
            }
        }

        // Save updated notifications back to localStorage
        localStorage.setItem('admin_notifications', JSON.stringify(notifications));

        const message = `Migration complete: ${migratedCount} migrated, ${failedCount} failed`;

        return {
            success: true,
            message: message,
            migrated: migratedCount,
            failed: failedCount
        };
    } catch (error) {
        console.error('Migration error:', error);
        return {
            success: false,
            message: 'Migration failed: ' + error.message,
            migrated: 0
        };
    }
}

// Auto-run migration on page load if notifications exist in localStorage
document.addEventListener('DOMContentLoaded', function () {
    // Check if we should run migration
    const migrationRun = localStorage.getItem('notifications_migration_run');

    if (!migrationRun) {
        migrateNotificationsToDatabase().then(result => {
            if (result.success) {
                // Mark migration as complete
                localStorage.setItem('notifications_migration_run', 'true');
            }
        });
    }
});

// Export for manual use
if (typeof window !== 'undefined') {
    window.migrateNotificationsToDatabase = migrateNotificationsToDatabase;
}
