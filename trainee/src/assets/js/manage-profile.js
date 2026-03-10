/* Manage Profile Page Script - Trainee */

// API Configuration
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    console.log('Auth check - Trainee Page:', { token: !!token, userRole, userId });

    if (!token || !userRole || !userId) {
        console.log('Missing authentication data, redirecting to login');
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'trainee') {
        console.log('User role is not trainee:', userRole);
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    console.log('Authentication passed for trainee user');
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }

    initializePhotoUpload();
    loadTraineeProfile();
    initializeEditForm();
});

// Load trainee profile data from database
async function loadTraineeProfile() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        const userData = localStorage.getItem('userData');

        console.log('Debug - localStorage data:', {
            token: token ? 'exists' : 'missing',
            userId: userId,
            userRole: userRole,
            userData: userData ? 'exists' : 'missing'
        });

        if (!token) {
            console.log('No auth token found, redirecting to login');
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        if (!userRole || userRole !== 'trainee') {
            console.log('Invalid user role:', userRole);
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // If userId is not available, try to get it from userData
        let actualUserId = userId;
        if (!actualUserId && userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                actualUserId = parsedUserData.id || parsedUserData._id;
                if (actualUserId) {
                    localStorage.setItem('userId', actualUserId);
                }
            } catch (e) {
                console.error('Error parsing userData:', e);
            }
        }

        if (!actualUserId) {
            console.log('No user ID found, redirecting to login');
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        console.log('Fetching trainee profile for userId:', actualUserId);

        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${actualUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Unauthorized, redirecting to login');
                localStorage.clear();
                window.location.href = '../../../auth/src/pages/login.html';
                return;
            }
            throw new Error(`HTTP ${response.status}: Failed to fetch trainee profile`);
        }

        const result = await response.json();
        const traineeData = result.data;

        console.log('Trainee profile loaded successfully:', traineeData);

        // Update profile overview
        updateProfileOverview(traineeData);

        // Update personal information
        updatePersonalInformation(traineeData);

        // Update enrollment information if available
        if (traineeData.enrollments) {
            updateEnrollmentInformation(traineeData.enrollments);
        }

        // Update completed courses if available
        if (traineeData.completedCourses) {
            updateCompletedCourses(traineeData.completedCourses);
        }

    } catch (error) {
        console.error('Error loading trainee profile:', error);
        showNotification('Failed to load profile data: ' + error.message, 'error');
    }
}

// Update profile overview section
function updateProfileOverview(data) {
    // Full name
    const fullNameElement = document.querySelector('.col-lg-8 .row:nth-child(1) .col-md-6:nth-child(1) .form-control-plaintext');
    if (fullNameElement) {
        fullNameElement.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A';
    }

    // Role badge
    const roleBadge = document.querySelector('.col-lg-8 .row:nth-child(1) .col-md-6:nth-child(2) .badge');
    if (roleBadge) {
        roleBadge.textContent = 'Trainee';
        roleBadge.className = 'badge bg-info';
    }

    // Email
    const emailElement = document.querySelector('.col-lg-8 .row:nth-child(2) .col-md-6:nth-child(1) .form-control-plaintext');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    // Account status
    const statusBadge = document.querySelector('.col-lg-8 .row:nth-child(2) .col-md-6:nth-child(2) .badge');
    if (statusBadge) {
        const status = data.status || 'active';
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusBadge.className = status === 'active' ? 'badge bg-success' : 'badge bg-danger';
    }

    // Last login
    const lastLoginElement = document.querySelector('.col-lg-8 .row:nth-child(3) .col-md-6:nth-child(1) .form-control-plaintext');
    if (lastLoginElement && data.lastLogin) {
        lastLoginElement.textContent = formatDateTime(data.lastLogin);
    }

    // Trainee ID
    const traineeIdElement = document.querySelector('.col-lg-8 .row:nth-child(3) .col-md-6:nth-child(2) .form-control-plaintext');
    if (traineeIdElement) {
        traineeIdElement.textContent = data.traineeId || 'N/A';
    }

    // Profile image
    const profileImage = document.getElementById('profileImage');
    if (profileImage && data.profileImage) {
        profileImage.src = data.profileImage;
    }

    // Update navbar user info
    updateNavbarUserInfo(data);
}

// Update personal information section
function updatePersonalInformation(data) {
    // First name
    const firstNameInput = document.querySelector('.card-body .row:nth-child(1) .col-md-6:nth-child(1) input');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    // Last name
    const lastNameInput = document.querySelector('.card-body .row:nth-child(1) .col-md-6:nth-child(2) input');
    if (lastNameInput) {
        lastNameInput.value = data.lastName || '';
    }

    // Phone number
    const phoneInput = document.querySelector('.card-body .row:nth-child(2) .col-md-6:nth-child(1) input');
    if (phoneInput) {
        phoneInput.value = data.phoneNumber || '';
    }

    // Date of birth
    const dobInput = document.querySelector('.card-body .row:nth-child(2) .col-md-6:nth-child(2) input');
    if (dobInput && data.dateOfBirth) {
        dobInput.value = formatDate(data.dateOfBirth);
    }

    // Address
    const addressTextarea = document.querySelector('.card-body .row:nth-child(3) textarea');
    if (addressTextarea) {
        addressTextarea.value = data.address || '';
    }

    // Update edit modal fields if they exist
    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editPhone = document.getElementById('editPhone');
    const editDob = document.getElementById('editDob');
    const editAddress = document.getElementById('editAddress');

    if (editFirstName) editFirstName.value = data.firstName || '';
    if (editLastName) editLastName.value = data.lastName || '';
    if (editPhone) editPhone.value = data.phoneNumber || '';
    if (editDob && data.dateOfBirth) editDob.value = data.dateOfBirth.split('T')[0];
    if (editAddress) editAddress.value = data.address || '';
}

// Update enrollment information table
function updateEnrollmentInformation(enrollments) {
    const tbody = document.querySelector('.row.mb-4:nth-child(3) .table tbody');
    if (!tbody || !Array.isArray(enrollments) || enrollments.length === 0) return;

    tbody.innerHTML = '';

    enrollments.forEach(enrollment => {
        const row = document.createElement('tr');
        const progress = enrollment.progress || 0;
        const statusClass = enrollment.status === 'completed' ? 'bg-success' : 'bg-success';
        const progressBarClass = enrollment.status === 'completed' ? 'bg-success' : 'bg-primary';

        row.innerHTML = `
            <td><strong>${enrollment.courseName || 'N/A'}</strong></td>
            <td>${formatDate(enrollment.enrollmentDate)}</td>
            <td>${enrollment.duration || 'N/A'}</td>
            <td><span class="badge ${statusClass}">${enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Active'}</span></td>
            <td>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar ${progressBarClass}" role="progressbar"
                        style="width: ${progress}%;" aria-valuenow="${progress}"
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">${progress}% Complete</small>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update completed courses section
function updateCompletedCourses(completedCourses) {
    const coursesContainer = document.querySelector('.row:last-child .card-body .row');
    if (!coursesContainer || !Array.isArray(completedCourses) || completedCourses.length === 0) return;

    // Update badge count
    const countBadge = document.querySelector('.row:last-child .card-header .badge');
    if (countBadge) {
        countBadge.textContent = `${completedCourses.length} Completed Course${completedCourses.length !== 1 ? 's' : ''}`;
    }

    coursesContainer.innerHTML = '';

    completedCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-6 mb-4';

        courseCard.innerHTML = `
            <div class="card border shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex align-items-start mb-3">
                        <div class="flex-shrink-0 me-3">
                            <img src="${course.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop'}"
                                alt="${course.courseName}" class="rounded-circle"
                                style="width: 60px; height: 60px; object-fit: cover; border: 3px solid #10b981;">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${course.courseName || 'N/A'}</h6>
                            <small class="text-muted">${course.courseCode || 'N/A'}</small>
                        </div>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted d-block">Completion Date</small>
                        <strong>${formatDate(course.completionDate)}</strong>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted d-block">Certificate Number</small>
                        <strong>${course.certificateNumber || 'N/A'}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Final Grade</small>
                        <span class="badge bg-success">${course.finalGrade || 'N/A'}</span>
                    </div>
                    ${course.certificateUrl ? `
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="window.open('${course.certificateUrl}', '_blank')">
                            <i class="bx bx-download me-1"></i> Download Certificate
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        coursesContainer.appendChild(courseCard);
    });
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        userName.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Trainee';
    }
}

// Initialize edit form
function initializeEditForm() {
    const saveButton = document.querySelector('#editInformationModal .btn-primary');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function () {
        await saveProfileChanges();
    });
}

// Save profile changes
async function saveProfileChanges() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        const editFirstName = document.getElementById('editFirstName');
        const editLastName = document.getElementById('editLastName');
        const editPhone = document.getElementById('editPhone');
        const editDob = document.getElementById('editDob');
        const editAddress = document.getElementById('editAddress');

        const updatedData = {
            firstName: editFirstName ? editFirstName.value : '',
            lastName: editLastName ? editLastName.value : '',
            phoneNumber: editPhone ? editPhone.value : '',
            dateOfBirth: editDob ? editDob.value : '',
            address: editAddress ? editAddress.value : ''
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
        if (modal) modal.hide();

        // Reload profile data
        await loadTraineeProfile();

        showNotification('Profile updated successfully!', 'success');

    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Failed to update profile', 'error');
    }
}

// Photo upload functionality
function initializePhotoUpload() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');

    if (!changePhotoBtn || !profileImageInput || !profileImage) return;

    changePhotoBtn.addEventListener('click', function () {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please select a valid image file (JPG or PNG)', 'error');
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('File size must be less than 2MB', 'error');
            return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onload = function (event) {
            profileImage.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Upload to server
        await uploadProfileImage(file);
    });
}

// Upload profile image
async function uploadProfileImage(file) {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        showNotification('Photo updated successfully!', 'success');

    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Failed to upload photo', 'error');
    }
}

// Utility functions
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleDateString('en-US', options).replace(',', ' -');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'info') {
    // Simple alert for now - can be replaced with toast notification
    if (type === 'error') {
        alert('Error: ' + message);
    } else {
        alert(message);
    }
}
