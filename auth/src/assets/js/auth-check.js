

const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

async function checkAuthentication(requiredRole = null) {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.location.href = window.location.origin + '/CAATE-ITRMS/auth/src/pages/login.html';
}

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

    window.location.href = window.location.origin + '/CAATE-ITRMS/auth/src/pages/login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const pageRole = document.body.getAttribute('data-required-role');

    checkAuthentication(pageRole);

    const user = getCurrentUser();
    if (user) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.name;
        });

        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });
    }

    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        const pageRole = document.body.getAttribute('data-required-role');
        checkAuthentication(pageRole);
    }
});

window.addEventListener('beforeunload', function () {
});
