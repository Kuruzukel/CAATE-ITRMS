

if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';
}

let traineeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

async function loadTraineeProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userData = localStorage.getItem('userData');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return null;
        }

        if (traineeDataCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            updateNavbarWithData(traineeDataCache);
            return traineeDataCache;
        }

        let traineeData = null;
        if (userData) {
            try {
                traineeData = JSON.parse(userData);
                updateNavbarWithData(traineeData);
                return traineeData;
            } catch (e) {
            }
        }

        try {
            let response = await fetch(`${window.API_BASE_URL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                response = await fetch(`${window.API_BASE_URL}/api/v1/trainees/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                const result = await response.json();
                traineeData = result.data || result.user || result;

                console.log('Raw trainee data from API:', traineeData);

                const firstName = traineeData.firstName || traineeData.first_name || '';
                const secondName = traineeData.secondName || traineeData.second_name || '';
                const middleName = traineeData.middleName || traineeData.middle_name || '';
                const lastName = traineeData.lastName || traineeData.last_name || '';
                const suffix = traineeData.suffix || '';

                const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
                const fullName = nameParts.join(' ').trim();

                console.log('Extracted names:', { firstName, secondName, middleName, lastName, suffix, fullName });

                let displayName = 'Trainee';
                if (fullName && fullName !== '') {
                    displayName = fullName;
                } else if (traineeData.name && traineeData.name.trim()) {
                    displayName = traineeData.name.trim();
                } else if (traineeData.username || traineeData.trainee_id) {
                    displayName = (traineeData.username || traineeData.trainee_id || '').trim();
                }

                console.log('Final display name:', displayName);

                const mappedData = {
                    _id: traineeData._id || traineeData.id,
                    name: displayName,
                    email: traineeData.email || '',
                    username: traineeData.username || traineeData.trainee_id || '',
                    role: 'trainee',
                    firstName: firstName,
                    secondName: secondName,
                    middleName: middleName,
                    lastName: lastName,
                    suffix: suffix,
                    profileImage: traineeData.profileImage || traineeData.profile_image || null,
                    profile_image: traineeData.profile_image || traineeData.profileImage || null
                };

                traineeDataCache = mappedData;
                cacheTimestamp = Date.now();

                updateNavbarWithData(mappedData);
                return mappedData;

            } else {
                throw new Error('Failed to fetch from API');
            }

        } catch (apiError) {
            console.error('API fetch failed:', apiError);

            if (userData) {
                try {
                    const fallbackData = JSON.parse(userData);
                    const firstName = fallbackData.firstName || fallbackData.first_name || '';
                    const secondName = fallbackData.secondName || fallbackData.second_name || '';
                    const middleName = fallbackData.middleName || fallbackData.middle_name || '';
                    const lastName = fallbackData.lastName || fallbackData.last_name || '';
                    const suffix = fallbackData.suffix || '';

                    const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
                    const fullName = nameParts.join(' ').trim();

                    let displayName = 'Trainee';
                    if (fullName && fullName !== '') {
                        displayName = fullName;
                    } else if (fallbackData.name && fallbackData.name.trim()) {
                        displayName = fallbackData.name.trim();
                    } else if (fallbackData.username || fallbackData.trainee_id) {
                        displayName = (fallbackData.username || fallbackData.trainee_id).trim();
                    }

                    const mappedData = {
                        name: displayName,
                        email: fallbackData.email || '',
                        username: fallbackData.username || fallbackData.trainee_id || '',
                        role: 'trainee',
                        firstName: firstName,
                        secondName: secondName,
                        middleName: middleName,
                        lastName: lastName,
                        suffix: suffix,
                        profileImage: fallbackData.profileImage || fallbackData.profile_image || null,
                        profile_image: fallbackData.profile_image || fallbackData.profileImage || null
                    };
                    updateNavbarWithData(mappedData);
                    return mappedData;
                } catch (e) {
                    console.error('Failed to parse localStorage userData:', e);
                }
            }

            const defaultData = { name: 'Trainee', email: '', role: 'trainee' };
            updateNavbarWithData(defaultData);
            return defaultData;
        }

    } catch (error) {
        console.error('Error loading trainee profile for navbar:', error);

        const defaultData = { name: 'Trainee', email: '', role: 'trainee' };
        updateNavbarWithData(defaultData);
        return defaultData;
    }
}

function updateNavbarWithData(data) {
    try {
        let displayName = 'Trainee';

        const firstName = data.firstName || data.first_name || '';
        const secondName = data.secondName || data.second_name || '';
        const middleName = data.middleName || data.middle_name || '';
        const lastName = data.lastName || data.last_name || '';
        const suffix = data.suffix || '';

        const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
        const fullName = nameParts.join(' ').trim();

        if (fullName && fullName !== '') {
            displayName = fullName;
        } else if (data.name && data.name.trim()) {
            displayName = data.name.trim();
        } else if (data.username && data.username.trim()) {
            displayName = data.username.trim();
        }

        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = displayName;
            }
        });

        const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
        welcomeElements.forEach(element => {
            if (element) {
                element.textContent = displayName;
            }
        });

        const imagePath = data.profileImage || data.profile_image;
        window.updateTraineeProfileImages(imagePath);

        window.currentTraineeDisplayName = displayName;

    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

function checkTraineeAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'trainee') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    return true;
}

function initializeTraineeNavbar() {
    if (!checkTraineeAuthentication()) {
        return;
    }

    loadTraineeProfileForNavbar();

    overrideAuthDashboardUpdates();

    ensureMenuDropdownsWork();
}

function overrideAuthDashboardUpdates() {
    requestAnimationFrame(() => {
        loadTraineeProfileForNavbar();
    });

    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const userNameElements = document.querySelectorAll('.user-name');
                    userNameElements.forEach(element => {
                        if (element && (
                            element.textContent === 'dsad  sdasd' ||
                            element.textContent === 'dsad sdasd' ||
                            element.textContent.trim() === 'Trainee' ||
                            element.textContent.trim() === 'Loading...' ||
                            element.textContent.trim() === '' ||
                            element.textContent.includes('dsad')
                        )) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                requestAnimationFrame(() => {
                    loadTraineeProfileForNavbar();
                });
            }
        }, 50);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

window.refreshTraineeNavbar = function () {
    loadTraineeProfileForNavbar();
};

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initializeTraineeNavbar();
    }, 100);

    window.addEventListener('storage', function (e) {
        if (e.key === 'userData' && e.newValue) {
            try {
                const userData = JSON.parse(e.newValue);
                updateNavbarWithData(userData);
            } catch (error) {
                console.warn('Failed to parse updated user data');
            }
        }
    });
});

function ensureMenuDropdownsWork() {
    setTimeout(() => {

    }, 50);
}

window.refreshUserDisplayName = function () {
    loadTraineeProfileForNavbar();
};

window.updateUserDisplayName = function (displayName) {
    if (displayName && displayName.trim()) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = displayName.trim();
            }
        });

        const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
        welcomeElements.forEach(element => {
            if (element) {
                element.textContent = displayName.trim();
            }
        });

        window.currentTraineeDisplayName = displayName.trim();
    }
};

function fixPlaceholderText() {
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        if (element && (
            element.textContent === 'dsad  sdasd' ||
            element.textContent === 'dsad sdasd' ||
            element.textContent.includes('dsad')
        )) {
            element.textContent = 'Loading...';
            loadTraineeProfileForNavbar();
        }
    });
}

fixPlaceholderText();

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(fixPlaceholderText, 100);
});

window.forceRefreshUserName = function () {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);

            const firstName = user.firstName || user.first_name || '';
            const secondName = user.secondName || user.second_name || '';
            const middleName = user.middleName || user.middle_name || '';
            const lastName = user.lastName || user.last_name || '';
            const suffix = user.suffix || '';

            const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
            const fullName = nameParts.join(' ').trim();

            let displayName = 'Trainee';
            if (fullName && fullName !== '') {
                displayName = fullName;
            } else if (user.name && user.name.trim()) {
                displayName = user.name.trim();
            } else if (user.username && user.username.trim()) {
                displayName = user.username.trim();
            }

            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                if (element) {
                    element.textContent = displayName;
                }
            });

            const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
            welcomeElements.forEach(element => {
                if (element) {
                    element.textContent = displayName;
                }
            });

            window.currentTraineeDisplayName = displayName;

        } catch (e) {
            console.error('Error force refreshing user name:', e);
        }
    }
};
window.addEventListener('storage', function (e) {
    if (e.key === 'userData' && e.newValue) {
        setTimeout(() => {
            window.forceRefreshUserName();
        }, 100);
    }
});

window.addEventListener('profileUpdated', function (e) {
    setTimeout(() => {
        window.forceRefreshUserName();
    }, 100);
});
window.updateTraineeProfileImages = function (imagePath) {
    const profileImageSelectors = [
        '#profileImage',
        '.navbar .avatar img',
        '.dropdown-menu .avatar img',
        '.navbar-dropdown .avatar img',
        '.navbar img[src*="DEFAULT_AVATAR"]',
        '.navbar img[alt=""]',
        'img.w-px-40.h-auto.rounded-circle',
        '.navbar img.rounded-circle',
        '.dropdown-menu img.w-px-40',
        '.dropdown-menu img.rounded-circle',
        '.avatar img',
        'img[alt="Profile Picture"]'
    ];

    let totalUpdated = 0;
    profileImageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img) {
                if (imagePath &&
                    imagePath !== '../assets/images/DEFAULT_AVATAR.png' &&
                    imagePath !== 'DEFAULT_AVATAR.png' &&
                    !imagePath.includes('DEFAULT_AVATAR')) {

                    if (imagePath.startsWith('/CAATE-ITRMS/')) {
                        img.src = window.location.origin + imagePath;
                    } else if (imagePath.startsWith('http')) {
                        img.src = imagePath;
                    } else if (imagePath.startsWith('/')) {
                        img.src = window.location.origin + imagePath;
                    } else {
                        img.src = `${window.location.origin}/CAATE-ITRMS/backend/public/uploads/profiles/${imagePath}`;
                    }
                    totalUpdated++;
                } else {
                    img.src = '../assets/images/DEFAULT_AVATAR.png';
                }

                img.onerror = function () {
                    this.src = '../assets/images/DEFAULT_AVATAR.png';
                };
            }
        });
    });

};

window.addEventListener('profileImageUpdated', function (e) {
    if (e.detail && e.detail.imagePath) {
        window.updateTraineeProfileImages(e.detail.imagePath);
    }
});

window.addEventListener('storage', function (e) {
    if (e.key === 'userData' && e.newValue) {
        try {
            const userData = JSON.parse(e.newValue);
            if (userData.profileImage || userData.profile_image) {
                window.updateTraineeProfileImages(userData.profileImage || userData.profile_image);
            }
        } catch (error) {
            console.warn('Failed to parse updated user data for profile image');
        }
    }
});

window.addEventListener('profileImageUpdated', function (event) {
    if (event.detail && event.detail.imagePath) {
        window.updateTraineeProfileImages(event.detail.imagePath);
    }
});

window.addEventListener('storage', function (event) {
    if (event.key === 'userData' && event.newValue) {
        try {
            const userData = JSON.parse(event.newValue);
            const imagePath = userData.profileImage || userData.profile_image;
            if (imagePath) {
                window.updateTraineeProfileImages(imagePath);
            }
        } catch (e) {
            console.error('Failed to parse userData from storage event:', e);
        }
    }
});