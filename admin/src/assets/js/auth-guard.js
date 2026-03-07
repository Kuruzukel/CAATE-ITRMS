/**
 * Authentication Guard - MUST be loaded first in <head>
 * This file provides immediate authentication check before page renders
 */
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

    // Check if user has correct role for this page (admin)
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
})();
