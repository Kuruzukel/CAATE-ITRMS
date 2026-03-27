
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

    if (userRole !== 'trainee') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.replace(baseUrl + '/admin/src/pages/dashboard.html');
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    }
})();
