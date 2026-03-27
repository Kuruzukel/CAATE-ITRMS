(function immediateAuthCheck() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        localStorage.clear();
        sessionStorage.clear();
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        window.location.replace(baseUrl + '/auth/src/pages/login.html');
        return;
    }

    const pageRole = 'admin';
    if (userRole !== pageRole) {
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

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

function checkAuthentication(requiredRole = null) {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        redirectToLogin();
        return false;
    }

    if (requiredRole && userRole !== requiredRole) {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            redirectToLogin();
        }
        return false;
    }
    return true;
}

function redirectToLogin() {

    localStorage.clear();
    sessionStorage.clear();

    const baseUrl = window.location.origin + '/CAATE-ITRMS';

    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

async function logout() {
    const token = localStorage.getItem('authToken');

    localStorage.clear();
    sessionStorage.clear();

    try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    window.history.pushState(null, '', window.location.href);

    const baseUrl = window.location.origin + '/CAATE-ITRMS';

    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

(function preventBackButtonAccess() {

    const pageRole = document.body.getAttribute('data-required-role');
    if (!checkAuthentication(pageRole)) {
        return;
    }

    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', function (event) {
        window.history.pushState(null, '', window.location.href);

        const token = localStorage.getItem('authToken');
        if (!token) {
            event.preventDefault();
            event.stopPropagation();
            redirectToLogin();
            return false;
        }

        const pageRole = document.body.getAttribute('data-required-role');
        if (!checkAuthentication(pageRole)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted || performance.navigation.type === 2) {

            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
                return;
            }

            window.location.reload();
        }
    });

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
                return;
            }
            const pageRole = document.body.getAttribute('data-required-role');
            checkAuthentication(pageRole);
        }
    });

    window.addEventListener('focus', function () {
        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    const pageRole = document.body.getAttribute('data-required-role');
    checkAuthentication(pageRole);

    if (localStorage.getItem('rememberedPass')) {
        localStorage.removeItem('rememberedPass');
    }

    const user = getCurrentUser();
    if (user) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    }

    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});

function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

async function logout() {
    const token = localStorage.getItem('authToken');

    try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    const baseUrl = window.location.origin + '/CAATE-ITRMS';

    window.history.pushState(null, '', window.location.href);
    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

(function () {
    'use strict';

    const token = localStorage.getItem('authToken');
    if (!token) {
        redirectToLogin();
        return;
    }

    function preventBackButton() {
        window.history.pushState(null, '', window.location.href);
    }

    preventBackButton();

    window.addEventListener('popstate', function (event) {
        preventBackButton();

        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });

    window.addEventListener('pageshow', function (event) {

        if (event.persisted) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
            } else {

                window.location.reload();
            }
        }
    });

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
            }
        }
    });

    window.addEventListener('focus', function () {
        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    const pageRole = document.body.getAttribute('data-required-role');
    checkAuthentication(pageRole);

    const user = getCurrentUser();
    if (user) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    }

    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});