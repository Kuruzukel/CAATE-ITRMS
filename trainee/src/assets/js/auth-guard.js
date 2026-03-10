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

    console.log('Trainee Auth Guard - Debug info:', {
        token: token ? 'exists' : 'missing',
        userRole: userRole,
        userId: userId,
        userData: userData ? 'exists' : 'missing',
        currentUrl: window.location.href
    });

    if (!token || !userRole) {
        console.log('Trainee Auth Guard - Missing token or userRole, redirecting to login');
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(window.location.origin + '/CAATE-ITRMS/auth/src/pages/login.html');
        return;
    }

    // Check if user has correct role for this page (trainee)
    if (userRole !== 'trainee') {
        console.log('Trainee Auth Guard - User role is not trainee:', userRole);
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            console.log('Trainee Auth Guard - Redirecting admin to admin dashboard');
            window.location.replace(baseUrl + '/admin/src/pages/dashboard.html');
        } else {
            console.log('Trainee Auth Guard - Unknown role, clearing storage and redirecting to login');
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    } else {
        console.log('Trainee Auth Guard - Access granted for trainee user');
    }
})();