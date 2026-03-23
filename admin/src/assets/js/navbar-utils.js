function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!token || !userRole || !userId) {
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'admin') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    return true;
}

async function loadAdminProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            try {
                const userData = JSON.parse(cachedData);
                updateNavbarUserInfo(userData);
            } catch (e) {
                console.warn('Failed to parse cached user data');
            }
        }

        const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            let adminData = result.data || result.admin || result;

            const mappedData = {
                _id: adminData._id,
                name: adminData.name,
                email: adminData.email,
                username: adminData.username,
                role: adminData.role,
                firstName: adminData.firstName,
                middleName: adminData.middleName,
                lastName: adminData.lastName,
                phone: adminData.phone,
                phoneNumber: adminData.phone,
                address: adminData.address,
                profileImage: adminData.profileImage || '../assets/images/DEFAULT_AVATAR.png'
            };

            updateNavbarUserInfo(mappedData);

            localStorage.setItem('userData', JSON.stringify(mappedData));
        } else {
            console.error('Failed to fetch admin data:', response.status);
        }
    } catch (error) {
        console.error('Error loading admin profile:', error);
    }
}

function updateNavbarUserInfo(data) {

    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {

        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
    }

    const profileImages = document.querySelectorAll('.navbar .avatar img');
    profileImages.forEach(img => {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
            img.src = data.profileImage;
        } else {
            img.src = '../assets/images/DEFAULT_AVATAR.png';
        }
        img.onerror = function () {
            this.src = '../assets/images/DEFAULT_AVATAR.png';
        };
    });
}

function initializeNavbar() {

    if (!checkAuthentication()) {
        return false;
    }

    loadAdminProfileForNavbar();
    return true;
}