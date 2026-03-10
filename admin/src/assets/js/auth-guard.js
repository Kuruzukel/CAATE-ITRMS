/**
 * Authentication Guard - MUST be loaded first in <head>
 * This file provides immediate authentication check before page renders
 */
(function () {
    'use strict';

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');

    console.log('Admin Auth Guard - Debug info:', {
        token: token ? 'exists' : 'missing',
        userRole: userRole,
        userId: userId,
        userData: userData ? 'exists' : 'missing',
        currentUrl: window.location.href
    });

    if (!token || !userRole) {
        console.log('Admin Auth Guard - Missing token or userRole, redirecting to login');
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(window.location.origin + '/CAATE-ITRMS/auth/src/pages/login.html');
        return;
    }

    // Check if user has correct role for this page (admin)
    if (userRole !== 'admin') {
        console.log('Admin Auth Guard - User role is not admin:', userRole);
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            console.log('Admin Auth Guard - Redirecting trainee to trainee dashboard');
            window.location.replace(baseUrl + '/trainee/src/pages/dashboard.html');
        } else {
            console.log('Admin Auth Guard - Unknown role, clearing storage and redirecting to login');
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    } else {
        console.log('Admin Auth Guard - Access granted for admin user');
    }
})();