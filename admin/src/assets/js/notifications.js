// Notification System for Admin Dashboard
var API_BASE_URL_NOTIFICATIONS = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Feature flag: Set to true when backend API is implemented
const USE_NOTIFICATIONS_API = true;

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.isDropdownOpen = false;
        this.userId = null;
        this.init();
    }

    init() {
        // Get user ID from localStorage
        this.userId = localStorage.getItem('userId');

        if (!this.userId) {
            console.error('User ID not found');
            return;
        }

        this.loadNotifications();
        this.setupEventListeners();
        this.startPolling();
    }

    setupEventListeners() {
        // Notification bell click
        const notificationBell = document.querySelector('.notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notificationDropdown');
            const bell = document.querySelector('.notification-bell');

            if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Mark all as read button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mark-all-read-btn')) {
                e.preventDefault();
                this.markAllAsRead();
            }
        });

        // Clear all notifications button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.clear-all-notifications-btn')) {
                e.preventDefault();
                this.clearAllNotifications();
            }
        });
    }

    toggleDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (!dropdown) return;

        this.isDropdownOpen = !this.isDropdownOpen;

        if (this.isDropdownOpen) {
            dropdown.style.display = 'block';
            this.loadNotifications();
        } else {
            dropdown.style.display = 'none';
        }
    }

    closeDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            this.isDropdownOpen = false;
        }
    }

    async loadNotifications() {
        try {
            // Load from localStorage (API not implemented yet)
            const stored = localStorage.getItem('admin_notifications');
            if (stored) {
                this.notifications = JSON.parse(stored);
            } else {
                this.notifications = [];
            }

            // If API is enabled and available, fetch from backend
            if (USE_NOTIFICATIONS_API) {
                if (this.userId) {
                    try {
                        const response = await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications?userId=${this.userId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            const result = await response.json();
                            if (result.success && result.data) {
                                this.notifications = result.data;
                            }
                        }
                    } catch (error) {
                        // Silently fail and use localStorage data
                        console.debug('API not available, using localStorage');
                    }
                }
            }

            // Calculate unread count
            this.unreadCount = this.notifications.filter(n => !n.read).length;

            this.updateBadge();
            this.renderNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
            this.unreadCount = 0;
            this.updateBadge();
            this.renderNotifications();
        }
    }

    updateBadge() {
        const badge = document.querySelector('.badge-notifications');
        if (badge) {
            badge.textContent = this.unreadCount;

            // Hide badge if no unread notifications
            if (this.unreadCount === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'block';
            }
        }

        // Update action buttons state
        this.updateActionButtons();
    }

    updateActionButtons() {
        const markAllReadBtn = document.querySelector('.mark-all-read-btn');
        const clearAllBtn = document.querySelector('.clear-all-notifications-btn');

        const hasNotifications = this.notifications.length > 0;
        const hasUnread = this.unreadCount > 0;

        if (markAllReadBtn) {
            markAllReadBtn.disabled = !hasUnread;
        }

        if (clearAllBtn) {
            clearAllBtn.disabled = !hasNotifications;
        }
    }

    renderNotifications() {
        const container = document.getElementById('notificationList');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="notification-empty">
                    <i class="bx bx-bell-off" style="font-size: 3rem; color: #a1acb8; margin-bottom: 1rem;"></i>
                    <p class="text-muted">No notifications yet</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedNotifications = [...this.notifications].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        container.innerHTML = sortedNotifications.map(notification =>
            this.renderNotificationItem(notification)
        ).join('');

        // Add click handlers for individual notifications
        container.querySelectorAll('.notification-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const notificationId = item.dataset.notificationId;
                this.markAsRead(notificationId);
            });
        });
    }

    renderNotificationItem(notification) {
        const icon = this.getNotificationIcon(notification.type, notification.status);
        const iconColor = this.getNotificationIconColor(notification.type, notification.status);
        const timeAgo = this.getTimeAgo(notification.timestamp);
        const readClass = notification.read ? 'read' : 'unread';
        const typeClass = `type-${notification.type}`;

        return `
            <div class="notification-item ${readClass}" data-notification-id="${notification.id}">
                <div class="notification-icon ${typeClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">
                        <i class="bx bx-time-five"></i> ${timeAgo}
                    </div>
                </div>
                ${!notification.read ? '<div class="notification-unread-dot"></div>' : ''}
            </div>
        `;
    }

    getNotificationIcon(type, status) {
        const icons = {
            'registration': 'bx bx-user-plus',
            'application': 'bx bx-file',
            'admission': 'bx bx-check-shield',
            'appointment': 'bx bx-calendar',
            'password': 'bx bx-lock',
            'login': 'bx bx-log-in',
            'logout': 'bx bx-log-out',
            'system': 'bx bx-info-circle'
        };

        return icons[type] || 'bx bx-bell';
    }

    getNotificationIconColor(type, status) {
        // Status-based colors
        if (status === 'approved') return 'rgba(16, 185, 129, 0.1)';
        if (status === 'pending') return 'rgba(245, 158, 11, 0.1)';
        if (status === 'cancelled' || status === 'rejected') return 'rgba(239, 68, 68, 0.1)';

        // Type-based colors
        const colors = {
            'registration': 'rgba(59, 130, 246, 0.1)',
            'application': 'rgba(139, 92, 246, 0.1)',
            'admission': 'rgba(16, 185, 129, 0.1)',
            'appointment': 'rgba(236, 72, 153, 0.1)',
            'password': 'rgba(245, 158, 11, 0.1)',
            'login': 'rgba(34, 197, 94, 0.1)',
            'logout': 'rgba(156, 163, 175, 0.1)',
            'system': 'rgba(59, 130, 246, 0.1)'
        };

        return colors[type] || 'rgba(161, 172, 184, 0.1)';
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notificationTime) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return notificationTime.toLocaleDateString();
    }

    async addNotification(notification) {
        const newNotification = {
            userId: this.userId,
            ...notification,
            id: this.generateId(),
            timestamp: notification.timestamp || new Date().toISOString(),
            read: false,
            createdAt: new Date().toISOString()
        };

        // Save to database if API is enabled
        if (USE_NOTIFICATIONS_API) {
            try {
                const response = await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newNotification)
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        newNotification.id = result.data.id;
                    }
                }
            } catch (error) {
                console.debug('API not available, using localStorage only');
            }
        }

        this.notifications.unshift(newNotification);
        this.unreadCount++;

        // Save to localStorage
        this.saveNotifications();
        this.updateBadge();

        if (this.isDropdownOpen) {
            this.renderNotifications();
        }

        // Show toast notification
        this.showToast(newNotification);
    }

    async markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);

            // Update in database if API is enabled and ID is a valid MongoDB ObjectId
            if (USE_NOTIFICATIONS_API && this.isValidMongoId(notificationId)) {
                try {
                    await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications/${notificationId}/read`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ read: true })
                    });
                } catch (error) {
                    console.debug('API not available, using localStorage only');
                }
            }

            this.saveNotifications();
            this.updateBadge();
            this.renderNotifications();
        }
    }

    isValidMongoId(id) {
        // Check if ID is a valid MongoDB ObjectId (24 hex characters)
        return /^[a-f\d]{24}$/i.test(id);
    }

    async markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;

        // Update all in database if API is enabled
        if (USE_NOTIFICATIONS_API) {
            try {
                await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications/mark-all-read`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: this.userId })
                });
            } catch (error) {
                console.debug('API not available, using localStorage only');
            }
        }

        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
    }

    clearAllNotifications() {
        this.showConfirmationModal(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications? This action cannot be undone.',
            async () => {
                // Delete all from database if API is enabled
                if (USE_NOTIFICATIONS_API) {
                    try {
                        await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications/clear-all`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId: this.userId })
                        });
                    } catch (error) {
                        console.debug('API not available, using localStorage only');
                    }
                }

                this.notifications = [];
                this.unreadCount = 0;
                this.saveNotifications();
                this.updateBadge();
                this.renderNotifications();
            }
        );
    }

    showConfirmationModal(title, message, onConfirm) {
        // Create modal overlay using Bootstrap modal structure
        const modalId = 'clearNotificationsModal';

        // Remove existing modal if any
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content" style="background-color: #2b3544; border: 1px solid #3d4f63;">
                        <div class="modal-header" style="border-bottom: 1px solid #3d4f63;">
                            <h5 class="modal-title" style="color: #fff;">${title}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger" style="background-color: rgba(220, 53, 69, 0.1); border-color: #dc3545; color: #ff6b6b;">
                                <i class="bx bx-error-circle me-2"></i>
                                <strong>Warning:</strong> ${message}
                            </div>
                        </div>
                        <div class="modal-footer" style="border-top: 1px solid #3d4f63;">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmClearBtn">
                                <i class="bx bx-trash me-1"></i> Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement);

        // Handle confirm button
        const confirmBtn = document.getElementById('confirmClearBtn');
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            modal.hide();
        });

        // Clean up modal after it's hidden
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });

        modal.show();
    }

    saveNotifications() {
        try {
            localStorage.setItem('admin_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showToast(notification) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        const typeClass = `type-${notification.type}`;

        toast.innerHTML = `
            <div class="toast-icon ${typeClass}">
                <i class="${this.getNotificationIcon(notification.type, notification.status)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="bx bx-x"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    startPolling() {
        // Only poll if API is enabled
        if (USE_NOTIFICATIONS_API) {
            // Poll for new notifications every 30 seconds
            setInterval(() => {
                this.checkForNewNotifications();
            }, 30000);
        }
    }

    async checkForNewNotifications() {
        if (!USE_NOTIFICATIONS_API) return;

        try {
            if (!this.userId) {
                return;
            }

            // Get the timestamp of the most recent notification
            const lastTimestamp = this.notifications.length > 0
                ? this.notifications[0].timestamp
                : new Date(0).toISOString();

            // Fetch new notifications since last check
            const response = await fetch(`${API_BASE_URL_NOTIFICATIONS}/api/v1/notifications/new?userId=${this.userId}&since=${lastTimestamp}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success && result.data && result.data.length > 0) {
                    // Add new notifications to the beginning
                    result.data.reverse().forEach(notification => {
                        this.notifications.unshift(notification);
                        if (!notification.read) {
                            this.unreadCount++;
                        }
                        // Show toast for new notification
                        this.showToast(notification);
                    });

                    this.saveNotifications();
                    this.updateBadge();

                    if (this.isDropdownOpen) {
                        this.renderNotifications();
                    }
                }
            }
        } catch (error) {
            console.debug('Error checking for new notifications:', error);
        }
    }

    // Public methods for external use
    async notifyRegistrationStatus(data) {
        await this.addNotification({
            type: 'registration',
            status: data.status,
            title: 'Registration Update',
            message: `${data.traineeName} registration is now ${data.status}`
        });
    }

    async notifyApplicationStatus(data) {
        await this.addNotification({
            type: 'application',
            status: data.status,
            title: 'Application Update',
            message: `${data.traineeName} application is now ${data.status}`
        });
    }

    async notifyAdmissionStatus(data) {
        await this.addNotification({
            type: 'admission',
            status: data.status,
            title: 'Admission Update',
            message: `${data.traineeName} admission is now ${data.status}`
        });
    }

    async notifyAppointmentStatus(data) {
        await this.addNotification({
            type: 'appointment',
            status: data.status,
            title: 'Appointment Update',
            message: `Appointment with ${data.traineeName} is now ${data.status}`
        });
    }

    async notifyPasswordChange() {
        await this.addNotification({
            type: 'password',
            status: 'success',
            title: 'Password Changed',
            message: 'Your password has been changed successfully'
        });
    }

    async notifyLogin() {
        const now = new Date();
        await this.addNotification({
            type: 'login',
            status: 'success',
            title: 'Login Activity',
            message: `You logged in at ${now.toLocaleString()}`
        });
    }

    async notifyLogout() {
        const now = new Date();
        await this.addNotification({
            type: 'logout',
            status: 'info',
            title: 'Logout Activity',
            message: `You logged out at ${now.toLocaleString()}`
        });
    }
}

// Initialize notification manager
let notificationManager;

document.addEventListener('DOMContentLoaded', function () {
    // Prevent double initialization
    if (window.notificationManager) {
        return;
    }

    notificationManager = new NotificationManager();

    // Make it globally accessible
    window.notificationManager = notificationManager;
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
