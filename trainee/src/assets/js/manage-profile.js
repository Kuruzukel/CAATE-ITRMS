/* Manage Profile Page Script - Trainee */

// API Configuration
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!token || !userRole || !userId) {
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'trainee') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

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
        const userData = localStorage.getItem('userData');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // Try to get user data from localStorage first
        let traineeData = null;
        if (userData) {
            try {
                traineeData = JSON.parse(userData);
            } catch (e) {
                // Error parsing userData
            }
        }

        // If we have user data from localStorage, use it
        if (traineeData) {
            updateProfileOverview(traineeData);
            updatePersonalInformation(traineeData);
            return;
        }

        // Otherwise, try to fetch from API with fallback strategy
        try {
            // Try general users endpoint first
            let response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Try trainee-specific endpoint
                response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}`, {
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
            } else {
                throw new Error('Failed to fetch from API');
            }

        } catch (apiError) {
            // Fallback: use data from localStorage
            if (userData) {
                try {
                    const traineeData = JSON.parse(userData);
                    updateProfileOverview(traineeData);
                    updatePersonalInformation(traineeData);
                } catch (e) {
                    showNotification('Failed to load profile data', 'error');
                }
            } else {
                showNotification('Failed to load profile data', 'error');
            }
        }

    } catch (error) {
        // Fallback: use data from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const traineeData = JSON.parse(userData);
                updateProfileOverview(traineeData);
                updatePersonalInformation(traineeData);
            } catch (e) {
                showNotification('Failed to load profile data', 'error');
            }
        } else {
            showNotification('Failed to load profile data', 'error');
        }
    }
}

// Update profile overview section
function updateProfileOverview(data) {
    // Full name - use name field from database
    const fullNameElement = document.getElementById('profileFullName');
    if (fullNameElement) {
        fullNameElement.textContent = data.name || 'N/A';
    }

    // Role badge - automatically Trainee for trainee accounts
    const roleBadge = document.getElementById('profileRole');
    if (roleBadge) {
        roleBadge.textContent = 'Trainee';
        roleBadge.className = 'badge bg-info';
    }

    // Email - fetch from database
    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    // Account status - static Active
    const statusBadge = document.getElementById('profileStatus');
    if (statusBadge) {
        statusBadge.textContent = 'Active';
        statusBadge.className = 'badge bg-success';
    }



    // Trainee ID
    const traineeIdElement = document.getElementById('profileTraineeId');
    if (traineeIdElement) {
        traineeIdElement.textContent = data.traineeId || data.studentId || 'N/A';
    }

    // Profile image - use uploaded image if available, otherwise default avatar
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
            profileImage.src = data.profileImage;
        } else {
            profileImage.src = '../assets/images/DEFAULT_AVATAR.png';
        }
    }

    // Update navbar user info
    updateNavbarUserInfo(data);
}

// Update personal information section
function updatePersonalInformation(data) {
    // First name
    const firstNameInput = document.getElementById('personalFirstName');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    // Middle name
    const middleNameInput = document.getElementById('personalMiddleName');
    if (middleNameInput) {
        middleNameInput.value = data.middleName || '';
    }

    // Last name
    const lastNameInput = document.getElementById('personalLastName');
    if (lastNameInput) {
        lastNameInput.value = data.lastName || '';
    }

    // Phone number
    const phoneInput = document.getElementById('personalPhone');
    if (phoneInput) {
        phoneInput.value = data.phoneNumber || data.phone || '';
    }

    // Date of birth
    const dobInput = document.getElementById('personalDob');
    if (dobInput && data.dateOfBirth) {
        dobInput.value = formatDate(data.dateOfBirth);
    }

    // Address
    const addressTextarea = document.getElementById('personalAddress');
    if (addressTextarea) {
        addressTextarea.value = data.address || '';
    }

    // Update edit modal fields if they exist
    const editFirstName = document.getElementById('editFirstName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editPhone = document.getElementById('editPhone');
    const editDob = document.getElementById('editDob');
    const editAddress = document.getElementById('editAddress');

    if (editFirstName) editFirstName.value = data.firstName || '';
    if (editMiddleName) editMiddleName.value = data.middleName || '';
    if (editLastName) editLastName.value = data.lastName || '';
    if (editPhone) editPhone.value = data.phoneNumber || data.phone || '';
    if (editDob && data.dateOfBirth) editDob.value = data.dateOfBirth.split('T')[0];
    if (editAddress) editAddress.value = data.address || '';
}

// Update enrollment information table
function updateEnrollmentInformation(enrollments) {
    const tbody = document.getElementById('enrollmentTable');
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
    const coursesContainer = document.getElementById('completedCoursesContainer');
    if (!coursesContainer || !Array.isArray(completedCourses) || completedCourses.length === 0) return;

    // Update badge count
    const countBadge = document.getElementById('completedCoursesCount');
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

    // Update academic summary
    updateAcademicSummary(completedCourses);
}

// Update academic performance summary
function updateAcademicSummary(completedCourses) {
    const summaryElement = document.getElementById('academicSummary');
    if (!summaryElement || !Array.isArray(completedCourses)) return;

    const totalCourses = completedCourses.length;
    let totalHours = 0;
    let totalGrades = 0;
    let gradeCount = 0;

    completedCourses.forEach(course => {
        if (course.hours) {
            totalHours += parseInt(course.hours) || 0;
        }
        if (course.finalGrade) {
            const grade = parseFloat(course.finalGrade.replace('%', ''));
            if (!isNaN(grade)) {
                totalGrades += grade;
                gradeCount++;
            }
        }
    });

    const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(1) + '%' : 'N/A';

    summaryElement.innerHTML = `
        Total Completed Courses: <strong class="text-white">${totalCourses}</strong> |
        Average Grade: <strong class="text-white">${averageGrade}</strong> |
        Total Training Hours: <strong class="text-white">${totalHours} Hours</strong>
    `;
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        // Use name field from database first
        let displayName = data.name || 'Trainee';
        userName.textContent = displayName;
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
        const editMiddleName = document.getElementById('editMiddleName');
        const editLastName = document.getElementById('editLastName');
        const editPhone = document.getElementById('editPhone');
        const editDob = document.getElementById('editDob');
        const editAddress = document.getElementById('editAddress');

        const updatedData = {
            firstName: editFirstName ? editFirstName.value : '',
            middleName: editMiddleName ? editMiddleName.value : '',
            lastName: editLastName ? editLastName.value : '',
            phoneNumber: editPhone ? editPhone.value : '',
            dateOfBirth: editDob ? editDob.value : '',
            address: editAddress ? editAddress.value : ''
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
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

        // Preview the uploaded image
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

        const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/profile-image`, {
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
