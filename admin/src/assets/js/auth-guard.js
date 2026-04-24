(function () {
    'use strict';

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(window.location.origin + '/CAATE-ITRMS/auth/src/pages/login.html');
        return;
    }

    if (userRole !== 'admin') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.replace(baseUrl + '/trainee/src/pages/dashboard.html');
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    }

    // Track login activity
    const lastLoginNotified = sessionStorage.getItem('loginNotified');
    if (!lastLoginNotified) {
        // Wait for notification manager to be ready
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(async () => {
                if (window.notificationManager) {
                    await window.notificationManager.notifyLogin();
                    sessionStorage.setItem('loginNotified', 'true');
                }
            }, 1000);
        });
    }
})();
