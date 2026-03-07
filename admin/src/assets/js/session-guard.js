/**
 * Session Guard - Prevents back button access after logout
 * Include this script on all protected pages
 */

(function () {
    'use strict';

    // Prevent back button cache access
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            // Page was loaded from bfcache (back/forward cache)
            window.location.reload();
        }
    });

    // Re-validate session when page becomes visible
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                // No token found, redirect to login
                const baseUrl = window.location.origin + '/CAATE-ITRMS';
                window.location.href = baseUrl + '/auth/src/pages/login.html';
            }
        }
    });

    // Prevent caching on unload
    window.addEventListener('beforeunload', function () {
        // This helps ensure the page isn't cached
    });

    // Check authentication on load
    window.addEventListener('load', function () {
        const token = localStorage.getItem('authToken');
        if (!token) {
            const baseUrl = window.location.origin + '/CAATE-ITRMS';
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
    });
})();
