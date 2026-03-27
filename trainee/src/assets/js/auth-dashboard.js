

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

    const pageRole = 'trainee'; // This is trainee dashboard
    if (userRole !== pageRole) {
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

if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';
}

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
        await fetch(`${window.API_BASE_URL}/api/v1/auth/logout`, {
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
        return; // Stop execution if not authenticated
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

    loadUserDataForDisplay();

    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});

function loadUserDataForDisplay() {
    const user = getCurrentUser();
    if (user) {
        let displayName = 'Trainee';

        const firstName = user.firstName || user.first_name || '';
        const secondName = user.secondName || user.second_name || '';
        const middleName = user.middleName || user.middle_name || '';
        const lastName = user.lastName || user.last_name || '';
        const suffix = user.suffix || '';

        const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
        const fullName = nameParts.join(' ').trim();

        if (fullName && fullName !== '') {
            displayName = fullName;
        } else if (user.name && user.name.trim()) {
            displayName = user.name.trim();
        } else if (user.username && user.username.trim()) {
            displayName = user.username.trim();
        }

        document.querySelectorAll('.user-name').forEach(el => {
            if (el) el.textContent = displayName;
        });

        document.querySelectorAll('.user-email').forEach(el => {
            if (el) el.textContent = user.email || '';
        });

        const profileImage = user.profile_image || user.profileImage || '';
        if (profileImage) {
            document.querySelectorAll('.avatar img').forEach(img => {
                if (img) {
                    img.src = profileImage;
                    img.onerror = function () {
                        this.src = '../assets/images/DEFAULT_AVATAR.png';
                    };
                }
            });
        }

        window.currentTraineeDisplayName = displayName;
    }
}
