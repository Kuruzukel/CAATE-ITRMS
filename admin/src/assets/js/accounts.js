const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public/api/v1';

let traineesData = [];

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

const upper = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
const lower = 'abcdefghijkmnopqrstuvwxyz';
const digits = '123456789';
const special = '!@#_$';

function generateRandomPassword(length = 12) {
    const characters = upper + lower + digits + special;
    let password = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return password;
}

document.addEventListener('DOMContentLoaded', function () {

    window.adminNavbarInitialized = true;

    if (!checkAuthentication()) {
        return;
    }

    loadTrainees();
    loadStatistics();

    setupFilters();

    const toggleViewPassword = document.getElementById('toggleViewPassword');
    const viewPasswordInput = document.getElementById('viewTraineePassword');
    const viewPasswordIcon = document.getElementById('viewPasswordIcon');

    if (toggleViewPassword && viewPasswordInput && viewPasswordIcon) {
        toggleViewPassword.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isPassword = viewPasswordInput.getAttribute('type') === 'password';
            viewPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');

            if (isPassword) {
                viewPasswordIcon.classList.remove('bx-hide');
                viewPasswordIcon.classList.add('bx-show');
            } else {
                viewPasswordIcon.classList.remove('bx-show');
                viewPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    const toggleAddPassword = document.getElementById('toggleAddPassword');
    const addPasswordInput = document.getElementById('addTraineePassword');
    const addPasswordIcon = document.getElementById('addPasswordIcon');

    if (toggleAddPassword && addPasswordInput && addPasswordIcon) {
        toggleAddPassword.addEventListener('click', function () {

            if (addPasswordInput.type === 'password') {
                addPasswordInput.type = 'text';
                addPasswordIcon.classList.remove('bx-hide');
                addPasswordIcon.classList.add('bx-show');
            } else {
                addPasswordInput.type = 'password';
                addPasswordIcon.classList.remove('bx-show');
                addPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    function generateRandomPassword(length = 12) {
        const upper = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghijkmnopqrstuvwxyz';
        const digits = '123456789';
        const special = '!@#_$';
        const characters = upper + lower + digits + special;

        let password = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return password;
    }

    const generateAddPassword = document.getElementById('generateAddPassword');
    if (generateAddPassword && addPasswordInput) {
        generateAddPassword.addEventListener('click', function () {
            const newPassword = generateRandomPassword(12);
            addPasswordInput.value = newPassword;
            addPasswordInput.type = 'text';
            addPasswordIcon.classList.remove('bx-hide');
            addPasswordIcon.classList.add('bx-show');
        });
    }

    const toggleEditPassword = document.getElementById('toggleEditPassword');
    const editPasswordInput = document.getElementById('editTraineePassword');
    const editPasswordIcon = document.getElementById('editPasswordIcon');

    if (toggleEditPassword && editPasswordInput && editPasswordIcon) {
        toggleEditPassword.addEventListener('click', function () {

            if (editPasswordInput.type === 'password') {
                editPasswordInput.type = 'text';
                editPasswordIcon.classList.remove('bx-hide');
                editPasswordIcon.classList.add('bx-show');
            } else {
                editPasswordInput.type = 'password';
                editPasswordIcon.classList.remove('bx-show');
                editPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    const addTraineeModal = document.getElementById('addTraineeModal');
    if (addTraineeModal) {
        addTraineeModal.addEventListener('hidden.bs.modal', function () {
            const addButton = addTraineeModal.querySelector('.btn-primary');
            if (addButton) {
                addButton.disabled = false;
                addButton.innerHTML = 'Add Trainee';
                addButton.blur();
                addButton.classList.remove('active', 'focus');

                setTimeout(() => {
                    addButton.blur();
                }, 100);
            }

            const form = document.getElementById('addTraineeForm');
            if (form) {
                form.reset();
            }

            const traineeIdInput = document.getElementById('addTraineeId');
            if (traineeIdInput) {
                traineeIdInput.value = '';
            }
        });

        addTraineeModal.addEventListener('show.bs.modal', async function () {
            const traineeIdInput = document.getElementById('addTraineeId');
            if (traineeIdInput) {

                traineeIdInput.value = 'Generating...';

                const newId = await generateTraineeId();
                traineeIdInput.value = newId;
            }
        });
    }

    const editTraineeModal = document.getElementById('editTraineeModal');
    if (editTraineeModal) {
        editTraineeModal.addEventListener('hidden.bs.modal', function () {
            const saveButton = editTraineeModal.querySelector('.btn-primary');
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = 'Save Changes';
                saveButton.blur();
                saveButton.classList.remove('active', 'focus');

                setTimeout(() => {
                    saveButton.blur();
                }, 100);
            }
        });
    }
});

function showTableLoader() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center" style="padding: 60px 20px;">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading trainees data...</p>
            </td>
        </tr>
    `;
}

async function loadTrainees() {

    showTableLoader();

    try {
        // Fetch trainees, applications, registrations, and admissions in parallel
        const [traineesResponse, applicationsResponse, registrationsResponse, admissionsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/trainees`),
            fetch(`${API_BASE_URL}/applications`),
            fetch(`${API_BASE_URL}/registrations`),
            fetch(`${API_BASE_URL}/admissions`)
        ]);

        const traineesResult = await traineesResponse.json();
        const applicationsResult = applicationsResponse.ok ? await applicationsResponse.json() : { success: false, data: [] };
        const registrationsResult = registrationsResponse.ok ? await registrationsResponse.json() : { success: false, data: [] };
        const admissionsResult = admissionsResponse.ok ? await admissionsResponse.json() : { success: false, data: [] };

        if (traineesResult.success) {
            const trainees = traineesResult.data;
            const applications = applicationsResult.success ? applicationsResult.data : [];
            const registrations = registrationsResult.success ? registrationsResult.data : [];
            const admissions = admissionsResult.success ? admissionsResult.data : [];

            console.log('Total trainees:', trainees.length);
            console.log('Total registrations:', registrations.length);
            console.log('Sample trainee:', trainees[0]);
            console.log('Sample registration:', registrations[0]);

            // Log all registration IDs for debugging
            console.log('All registration user IDs and trainee IDs:');
            registrations.forEach(reg => {
                const regUserId = reg.userId?.$oid || reg.userId || reg.user_id?.$oid || reg.user_id;
                const regTraineeId = reg.traineeId || reg.trainee_id;
                console.log(`  Registration: userId=${regUserId}, traineeId=${regTraineeId}, name=${reg.firstName} ${reg.lastName}`);
            });

            // Merge applications, registrations, and admissions into trainee data
            traineesData = trainees.map(trainee => {
                const traineeId = trainee._id?.$oid || trainee._id;
                const userId = trainee.user_id?.$oid || trainee.user_id;
                const traineeIdString = trainee.trainee_id; // Like TRN-2026-009

                // Find related applications
                const traineeApplications = applications.filter(app => {
                    const appUserId = app.user_id?.$oid || app.user_id;
                    const appTraineeId = app.trainee_id;
                    return appUserId === userId || appUserId === traineeId || appTraineeId === traineeIdString;
                }).map(app => ({
                    date: app.submittedAt || app.application_date || app.submitted_at || app.created_at || app.createdAt || app.date,
                    status: app.status,
                    course: app.assessment_title || app.course
                }));

                // Find related registrations (enrollments)
                const traineeRegistrations = registrations.filter(reg => {
                    const regUserId = reg.userId?.$oid || reg.userId || reg.user_id?.$oid || reg.user_id;
                    const regTraineeId = reg.traineeId || reg.trainee_id;

                    // Enhanced matching logic
                    const userIdMatch = regUserId === userId || regUserId === traineeId;
                    const traineeIdMatch = regTraineeId === traineeIdString;

                    // Also check if registration's userId matches trainee's _id as string
                    const regUserIdString = String(regUserId || '');
                    const traineeIdAsString = String(traineeId || '');
                    const userIdStringMatch = regUserIdString === traineeIdAsString;

                    return userIdMatch || traineeIdMatch || userIdStringMatch;
                }).map(reg => ({
                    date: reg.submittedAt || reg.registration_date || reg.submitted_at || reg.created_at || reg.createdAt || reg.date,
                    status: reg.status,
                    course: reg.selectedCourse || reg.courseQualification
                }));

                // Find related admissions
                const traineeAdmissions = admissions.filter(adm => {
                    const admUserId = adm.user_id?.$oid || adm.user_id;
                    const admTraineeId = adm.trainee_id;
                    return admUserId === userId || admUserId === traineeId || admTraineeId === traineeIdString;
                }).map(adm => ({
                    date: adm.admission_date || adm.submitted_at || adm.created_at || adm.createdAt || adm.date,
                    status: adm.status,
                    course: adm.course
                }));

                if (traineeRegistrations.length > 0) {
                    console.log(`Trainee ${traineeIdString} (ID: ${traineeId}) has ${traineeRegistrations.length} registrations:`, traineeRegistrations);
                    // Log the raw registration data to see the date format
                    const rawRegs = registrations.filter(reg => {
                        const regUserId = reg.userId?.$oid || reg.userId || reg.user_id?.$oid || reg.user_id;
                        const regTraineeId = reg.traineeId || reg.trainee_id;
                        const userIdMatch = regUserId === userId || regUserId === traineeId;
                        const traineeIdMatch = regTraineeId === traineeIdString;
                        const regUserIdString = String(regUserId || '');
                        const traineeIdAsString = String(traineeId || '');
                        const userIdStringMatch = regUserIdString === traineeIdAsString;
                        return userIdMatch || traineeIdMatch || userIdStringMatch;
                    });
                    console.log(`Raw registration data for ${traineeIdString}:`, rawRegs);
                } else {
                    console.log(`Trainee ${traineeIdString} (ID: ${traineeId}) has NO registrations. Checked against:`, {
                        userId,
                        traineeId,
                        traineeIdString
                    });
                }

                return {
                    ...trainee,
                    applications: traineeApplications,
                    enrollments: traineeRegistrations,
                    admissions: traineeAdmissions
                };
            });

            console.log('Trainees with data merged:', traineesData.length);
            console.log('Sample trainee with enrollments:', traineesData.find(t => t.enrollments && t.enrollments.length > 0));

            renderTrainees(traineesData);
        } else {
            console.error('Failed to load trainees:', traineesResult.error);
            showEmptyState('Failed to load trainees data');
        }
    } catch (error) {
        console.error('Error loading trainees:', error);
        showEmptyState('Error connecting to server. Please check if the backend is running.');
    }
}

function showEmptyState(message) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center" style="padding: 60px 20px;">
                <div style="color: #697a8d;">
                    <i class="bx bx-error-circle" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px; color: #ff3e1d;"></i>
                    <h5 style="margin-bottom: 10px; color: #697a8d;">Connection Error</h5>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">${message}</p>
                </div>
            </td>
        </tr>
    `;
}

async function loadStatistics() {
    try {

        const response = await fetch(`${API_BASE_URL}/trainees/statistics`);

        if (!response.ok) {
            return;
        }

        const result = await response.json();

        let registrationCount = 0;
        try {
            const regResponse = await fetch(`${API_BASE_URL}/registrations`);
            if (regResponse.ok) {
                const regResult = await regResponse.json();
                if (regResult.success && regResult.data) {
                    registrationCount = regResult.data.length;
                }
            }
        } catch (regError) {
            console.error('Error fetching registration count:', regError);
        }

        let applicationCount = 0;
        try {
            const appResponse = await fetch(`${API_BASE_URL}/applications`);
            if (appResponse.ok) {
                const appResult = await appResponse.json();
                if (appResult.success && appResult.data) {
                    applicationCount = appResult.data.filter(app => app.status === 'approved').length;
                }
            }
        } catch (appError) {
            console.error('Error fetching application count:', appError);
        }

        let admissionCount = 0;
        try {
            const admResponse = await fetch(`${API_BASE_URL}/admissions`);
            if (admResponse.ok) {
                const admResult = await admResponse.json();
                if (admResult.success && admResult.data) {
                    admissionCount = admResult.data.filter(adm => adm.status === 'approved').length;
                }
            }
        } catch (admError) {
            console.error('Error fetching admission count:', admError);
        }

        if (result.success) {

            const statsWithRegistration = {
                ...result.data,
                totalRegistration: registrationCount,
                totalApplication: applicationCount,
                totalAdmission: admissionCount
            };
            updateStatistics(statsWithRegistration);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

function clearAllHighlights() {
    const tbody = document.querySelector('.table tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.boxShadow = '';
            row.style.border = '';
            row.style.borderLeft = '';
            row.style.borderRadius = '';
            row.style.background = '';
            row.style.transition = '';
            row.style.transform = '';
            row.style.outline = '';
            row.style.outlineOffset = '';
            row.style.zIndex = '';
        });
    }
}

function renderTrainees(trainees) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const loader = document.getElementById('tableLoader');
    if (loader) {
        loader.remove();
    }

    tbody.innerHTML = '';

    if (trainees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-user-x" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No accounts existing in here</h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">The trainee database collection is empty.</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7;">Click "Add New Trainee" to create your first account.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    trainees.forEach((trainee, index) => {
        const row = createTraineeRow(trainee, index + 1);
        tbody.appendChild(row);
    });
}

function createTraineeRow(trainee, index) {
    const tr = document.createElement('tr');

    let fullName = '';
    let hasName = false;

    if (trainee.first_name || trainee.last_name) {
        hasName = true;
        fullName = trainee.first_name || '';
        if (trainee.second_name) {
            fullName += (fullName ? ' ' : '') + trainee.second_name;
        }
        if (trainee.middle_name) {
            fullName += (fullName ? ' ' : '') + trainee.middle_name;
        }
        if (trainee.last_name) {
            fullName += (fullName ? ' ' : '') + trainee.last_name;
        }
        if (trainee.suffix) {
            fullName += (fullName ? ' ' : '') + trainee.suffix;
        }
        fullName = fullName.trim();
    }

    const firstInitial = (trainee.first_name && trainee.first_name.charAt(0)) || (trainee.username && trainee.username.charAt(0)) || '?';
    const lastInitial = (trainee.last_name && trainee.last_name.charAt(0)) || (trainee.username && trainee.username.charAt(1)) || '?';
    const initials = `${firstInitial}${lastInitial}`;

    const displayId = trainee.trainee_id || `TRN-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`;

    const displayUsername = trainee.username || '<span class="text-muted">N/A</span>';

    const displayName = hasName ? fullName : '<span class="text-muted">N/A</span>';

    const profileImage = trainee.profile_image;

    let avatarHtml;
    if (profileImage) {
        avatarHtml = `
            <div class="avatar avatar-sm me-3">
                <img src="${profileImage}" 
                     alt="${fullName}" 
                     class="rounded-circle" 
                     style="width: 38px; height: 38px; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="avatar-fallback" 
                     style="display: none; background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                     backdrop-filter: blur(10px) saturate(180%); 
                     -webkit-backdrop-filter: blur(10px) saturate(180%); 
                     border: 1px solid rgba(54, 145, 191, 0.4); 
                     box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                     color: white; 
                     align-items: center; 
                     justify-content: center; 
                     border-radius: 50%; 
                     width: 38px; 
                     height: 38px; 
                     font-weight: 600;">
                    ${initials}
                </div>
            </div>`;
    } else {
        avatarHtml = `
            <div class="avatar avatar-sm me-3"
                style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                backdrop-filter: blur(10px) saturate(180%); 
                -webkit-backdrop-filter: blur(10px) saturate(180%); 
                border: 1px solid rgba(54, 145, 191, 0.4); 
                box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                color: white; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                border-radius: 50%; 
                width: 38px; 
                height: 38px; 
                font-weight: 600;">
                ${initials}
            </div>`;
    }

    tr.innerHTML = `
        <td>
            <div class="d-flex align-items-center">
                ${avatarHtml}
                <div>
                    <strong>${displayName}</strong>
                </div>
            </div>
        </td>
        <td><strong>${displayId}</strong></td>
        <td>${displayUsername}</td>
        <td>${trainee.email}</td>
        <td>${trainee.phone || '<span class="text-muted">N/A</span>'}</td>
        <td>
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="javascript:void(0);" onclick="viewTrainee('${trainee._id}')">
                        <i class="bx bx-show me-1"></i> View Details
                    </a>
                    <a class="dropdown-item" href="javascript:void(0);" onclick="editTrainee('${trainee._id}')">
                        <i class="bx bx-edit-alt me-1"></i> Edit Details
                    </a>
                    <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteTrainee('${trainee._id}')">
                        <i class="bx bx-trash me-1"></i> Delete
                    </a>
                </div>
            </div>
        </td>
    `;

    return tr;
}

function getAvatarColor(index) {
    const colors = [
        'bg-label-primary',
        'bg-label-warning',
        'bg-label-danger',
        'bg-label-success',
        'bg-label-info'
    ];

    return colors[index % colors.length];
}

function updateStatistics(stats) {

    const totalElement = document.getElementById('totalTraineesCount');
    if (totalElement) {
        const totalValue = stats.total || 0;
        totalElement.textContent = totalValue.toLocaleString();
    }

    const registrationElement = document.getElementById('totalRegistrationCount');
    if (registrationElement) {
        const registrationValue = stats.totalRegistration || 0;
        registrationElement.textContent = registrationValue.toLocaleString();
    }

    const applicationElement = document.getElementById('totalApplicationCount');
    if (applicationElement) {
        const applicationValue = stats.totalApplication || 0;
        applicationElement.textContent = applicationValue.toLocaleString();
    }

    const admissionElement = document.getElementById('totalAdmissionCount');
    if (admissionElement) {
        const admissionValue = stats.totalAdmission || 0;
        admissionElement.textContent = admissionValue.toLocaleString();
    }
}

window.viewTrainee = function viewTrainee(id) {

    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    document.getElementById('viewTraineeId').value = trainee.trainee_id || trainee._id || '';
    document.getElementById('viewTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('viewTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('viewTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('viewTraineeLastName').value = trainee.last_name || '';
    document.getElementById('viewTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('viewTraineeEmail').value = trainee.email || '';
    document.getElementById('viewTraineeUsername').value = trainee.username || '';
    document.getElementById('viewTraineePhone').value = trainee.phone || '';

    const passwordField = document.getElementById('viewTraineePassword');
    if (passwordField) {
        passwordField.value = trainee.password || '';

        passwordField.setAttribute('type', 'password');
        const viewPasswordIcon = document.getElementById('viewPasswordIcon');
        if (viewPasswordIcon) {
            viewPasswordIcon.classList.remove('bx-show');
            viewPasswordIcon.classList.add('bx-hide');
        }
    }

    const modal = new bootstrap.Modal(document.getElementById('viewTraineeModal'));
    modal.show();
}

window.editTrainee = function editTrainee(id) {

    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    window.originalTraineeData = {
        trainee_id: trainee.trainee_id || '',
        first_name: trainee.first_name || '',
        second_name: trainee.second_name || '',
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name || '',
        suffix: trainee.suffix || '',
        email: trainee.email || '',
        username: trainee.username || '',
        phone: trainee.phone || ''
    };

    document.getElementById('editTraineeId').value = trainee.trainee_id || '';
    document.getElementById('editTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('editTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('editTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('editTraineeLastName').value = trainee.last_name || '';
    document.getElementById('editTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('editTraineeEmail').value = trainee.email;
    document.getElementById('editTraineeUsername').value = trainee.username || '';
    document.getElementById('editTraineePhone').value = trainee.phone;
    document.getElementById('editTraineePassword').value = '';

    document.getElementById('editTraineeForm').setAttribute('data-trainee-id', trainee._id);

    const modal = new bootstrap.Modal(document.getElementById('editTraineeModal'));
    modal.show();
}

window.deleteTrainee = async function deleteTrainee(id) {

    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    document.getElementById('deleteTraineeName').textContent = `${trainee.first_name} ${trainee.last_name}`;
    document.getElementById('deleteTraineeId').value = traineeId;

    const modal = new bootstrap.Modal(document.getElementById('deleteTraineeModal'));
    modal.show();
}

window.confirmDeleteTrainee = async function confirmDeleteTrainee() {
    const id = document.getElementById('deleteTraineeId').value;

    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {

            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTraineeModal'));
            modal.hide();

            showSuccess('Trainee deleted successfully');
            loadTrainees();
            loadStatistics();
        } else {
            showError(result.error || 'Failed to delete trainee');
        }
    } catch (error) {
        console.error('Error deleting trainee:', error);
        showError('Error connecting to server');
    }
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

window.saveEditTrainee = async function saveEditTrainee() {
    const submitBtn = document.querySelector('#editTraineeModal .btn-primary');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';

    const mongoId = document.getElementById('editTraineeForm').getAttribute('data-trainee-id');
    const studentId = document.getElementById('editTraineeId').value.trim();
    const firstName = document.getElementById('editTraineeFirstName').value.trim();
    const secondName = document.getElementById('editTraineeSecondName').value.trim();
    const middleName = document.getElementById('editTraineeMiddleName').value.trim();
    const lastName = document.getElementById('editTraineeLastName').value.trim();
    const suffix = document.getElementById('editTraineeSuffix').value.trim();
    const email = document.getElementById('editTraineeEmail').value.trim();
    const username = document.getElementById('editTraineeUsername').value.trim();
    const phone = document.getElementById('editTraineePhone').value.trim();
    const password = document.getElementById('editTraineePassword').value;

    if (window.originalTraineeData) {
        const hasChanges =
            studentId !== window.originalTraineeData.trainee_id ||
            firstName !== window.originalTraineeData.first_name ||
            secondName !== window.originalTraineeData.second_name ||
            middleName !== window.originalTraineeData.middle_name ||
            lastName !== window.originalTraineeData.last_name ||
            suffix !== window.originalTraineeData.suffix ||
            email !== window.originalTraineeData.email ||
            username !== window.originalTraineeData.username ||
            phone !== window.originalTraineeData.phone ||
            password !== '';

        if (!hasChanges) {
            showToast('No changes were made to the trainee', 'info');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            return;
        }
    }

    if (!studentId || !firstName || !lastName || !email || !phone) {
        showError('Please fill in all required fields');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const namePattern = /^[A-Za-z\s\-']+$/;
    if (!namePattern.test(firstName)) {
        showError('First name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (secondName && !namePattern.test(secondName)) {
        showError('Second name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (middleName && !namePattern.test(middleName)) {
        showError('Middle name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (!namePattern.test(lastName)) {
        showError('Last name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
        showError('Mobile number should only contain numbers');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('Please enter a valid email address');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    if (password && password.length < 6) {
        showError('Password must be at least 6 characters long');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const hasChanges =
        window.originalTraineeData.trainee_id !== studentId ||
        window.originalTraineeData.first_name !== firstName ||
        window.originalTraineeData.second_name !== secondName ||
        window.originalTraineeData.middle_name !== middleName ||
        window.originalTraineeData.last_name !== lastName ||
        window.originalTraineeData.suffix !== suffix ||
        window.originalTraineeData.email !== email ||
        window.originalTraineeData.username !== username ||
        window.originalTraineeData.phone !== phone ||
        password !== '';

    if (!hasChanges) {
        showToast('No changes were made to the trainee', 'info');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const updateData = {
        trainee_id: studentId,
        first_name: firstName,
        second_name: secondName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        email: email,
        username: username,
        phone: phone
    };

    if (password) {
        updateData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${mongoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Trainee updated successfully');

            const traineeIndex = traineesData.findIndex(t => String(t._id) === mongoId);
            if (traineeIndex !== -1) {

                traineesData[traineeIndex] = {
                    ...traineesData[traineeIndex],
                    ...updateData,
                    _id: mongoId
                };

                const tbody = document.querySelector('.table tbody');
                if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    if (rows[traineeIndex]) {
                        const updatedRow = createTraineeRow(traineesData[traineeIndex], traineeIndex + 1);
                        rows[traineeIndex].replaceWith(updatedRow);
                    }
                }
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('editTraineeModal'));
            modal.hide();

            loadStatistics();

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        } else {
            showError(result.error || 'Failed to update trainee');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (error) {
        console.error('Error updating trainee:', error);
        showError('Error connecting to server');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function generateTraineeId() {
    try {

        const currentYear = new Date().getFullYear();

        const response = await fetch(`${API_BASE_URL}/trainees`);
        const result = await response.json();

        if (result.success) {
            const trainees = result.data;
            console.log('Total trainees found:', trainees.length);

            let maxNumber = 0;
            const traineePattern = /^TRN-\d{4}-(\d+)$/;

            trainees.forEach(trainee => {
                if (trainee.trainee_id) {
                    const match = trainee.trainee_id.match(traineePattern);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        console.log(`Found trainee ID: ${trainee.trainee_id}, number: ${num}`);
                        if (num > maxNumber) {
                            maxNumber = num;
                        }
                    }
                }
            });

            console.log('Highest number found:', maxNumber);

            const nextNumber = maxNumber + 1;
            const paddedNumber = String(nextNumber).padStart(3, '0');
            const newId = `TRN-${currentYear}-${paddedNumber}`;

            console.log('Generated new trainee ID:', newId);
            return newId;
        } else {

            console.log('API call failed, using default ID');
            return `TRN-${currentYear}-001`;
        }
    } catch (error) {
        console.error('Error generating trainee ID:', error);

        const currentYear = new Date().getFullYear();
        return `TRN-${currentYear}-001`;
    }
}

window.saveNewTrainee = async function saveNewTrainee() {

    const addButton = document.querySelector('#addTraineeModal .btn-primary');
    const originalText = addButton.innerHTML;

    addButton.disabled = true;
    addButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Adding...';

    let id = document.getElementById('addTraineeId').value.trim();
    if (!id) {
        id = await generateTraineeId();
        document.getElementById('addTraineeId').value = id;
    }

    const username = document.getElementById('addTraineeUsername').value.trim();
    const firstName = document.getElementById('addTraineeFirstName').value.trim();
    const secondName = document.getElementById('addTraineeSecondName').value.trim();
    const middleName = document.getElementById('addTraineeMiddleName').value.trim();
    const lastName = document.getElementById('addTraineeLastName').value.trim();
    const suffix = document.getElementById('addTraineeSuffix').value.trim();
    const email = document.getElementById('addTraineeEmail').value.trim();
    const phone = document.getElementById('addTraineePhone').value.trim();
    const password = document.getElementById('addTraineePassword').value;

    if (!id || !firstName || !lastName || !email || !phone) {
        showError('Please fill in all required fields');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const idPattern = /^TRN-\d{4}-\d{3}$/;
    if (!idPattern.test(id)) {
        showError('Invalid trainee ID format. Expected format: TRN-YYYY-XXX');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(firstName)) {
        showError('First name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (secondName && !namePattern.test(secondName)) {
        showError('Second name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (middleName && !namePattern.test(middleName)) {
        showError('Middle name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (!namePattern.test(lastName)) {
        showError('Last name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
        showError('Mobile number should only contain numbers');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('Please enter a valid email address');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    if (password && password.length < 6) {
        showError('Password must be at least 6 characters long');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const newTraineeData = {
        trainee_id: id,
        first_name: firstName,
        second_name: secondName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        email: email,
        phone: phone
    };

    if (username) {
        newTraineeData.username = username;
    }

    if (password) {
        newTraineeData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/trainees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTraineeData)
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const errorText = doc.body.textContent || text;

            showError('Server error: ' + errorText.substring(0, 200));
            addButton.disabled = false;
            addButton.innerHTML = originalText;
            return;
        }

        const result = await response.json();

        if (result.success) {
            showSuccess('Trainee added successfully');

            const modal = bootstrap.Modal.getInstance(document.getElementById('addTraineeModal'));
            modal.hide();

            document.getElementById('addTraineeForm').reset();

            loadTrainees();
            loadStatistics();

            addButton.disabled = false;
            addButton.innerHTML = originalText;
        } else {
            showError(result.error || 'Failed to add trainee');
            addButton.disabled = false;
            addButton.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error adding trainee:', error);
        showError('Error connecting to server. Please check console for details.');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const registrationFilter = document.getElementById('registrationFilter');
    const applicationFilter = document.getElementById('applicationFilter');
    const admissionFilter = document.getElementById('admissionFilter');
    const resetButton = document.getElementById('resetFilters');

    if (searchInput) {
        searchInput.addEventListener('input', function () {

            if (searchInput.value.trim() === '') {
                resetFilters();
            } else {
                applyFilters();
            }
        });
    }

    if (registrationFilter) {
        registrationFilter.addEventListener('change', applyFilters);
    }

    if (applicationFilter) {
        applicationFilter.addEventListener('change', applyFilters);
    }

    if (admissionFilter) {
        admissionFilter.addEventListener('change', applyFilters);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const registrationDate = document.getElementById('registrationFilter')?.value || '';
    const applicationDate = document.getElementById('applicationFilter')?.value || '';
    const admissionDate = document.getElementById('admissionFilter')?.value || '';

    if (!searchTerm && !registrationDate && !applicationDate && !admissionDate) {
        clearAllHighlights();
        renderTrainees(traineesData);
        return;
    }

    if (searchTerm && !registrationDate && !applicationDate && !admissionDate) {

        renderTrainees(traineesData);

        setTimeout(() => {
            clearAllHighlights();
            highlightSearchResults(searchTerm);
        }, 50);
        return;
    }

    let filteredTrainees = traineesData;

    if (searchTerm) {
        filteredTrainees = filteredTrainees.filter(trainee => {

            let fullName = trainee.first_name || '';
            if (trainee.second_name) fullName += ' ' + trainee.second_name;
            if (trainee.middle_name) fullName += ' ' + trainee.middle_name;
            fullName += ' ' + (trainee.last_name || '');
            if (trainee.suffix) fullName += ' ' + trainee.suffix;
            fullName = fullName.toLowerCase();

            const studentId = (trainee.trainee_id || '').toLowerCase();
            const email = (trainee.email || '').toLowerCase();

            return fullName.includes(searchTerm) ||
                studentId.includes(searchTerm) ||
                email.includes(searchTerm);
        });
    }

    if (registrationDate) {
        console.log('Filtering by registration date:', registrationDate);
        filteredTrainees = filteredTrainees.filter(trainee => {
            const hasMatch = trainee.enrollments && trainee.enrollments.some(e => {
                if (e.date) {
                    console.log('Raw date value from enrollment:', e.date, 'Type:', typeof e.date);
                    const enrollDate = parseMongoDate(e.date);
                    const filterDate = new Date(registrationDate);
                    console.log(`Comparing registration date ${enrollDate.toDateString()} (valid: ${!isNaN(enrollDate.getTime())}) with filter ${filterDate.toDateString()}`);

                    // Check if date is valid
                    if (isNaN(enrollDate.getTime())) {
                        console.warn('Invalid date parsed from:', e.date);
                        return false;
                    }

                    // Compare only year, month, and day (ignore time)
                    return enrollDate.getFullYear() === filterDate.getFullYear() &&
                        enrollDate.getMonth() === filterDate.getMonth() &&
                        enrollDate.getDate() === filterDate.getDate();
                }
                return false;
            });
            if (hasMatch) {
                console.log('Match found for trainee:', trainee.trainee_id, trainee.enrollments);
            }
            return hasMatch;
        });
        console.log('Filtered trainees after registration filter:', filteredTrainees.length);
    }

    if (applicationDate) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return trainee.applications && trainee.applications.some(a => {
                if (a.date) {
                    const appDate = parseMongoDate(a.date);
                    const filterDate = new Date(applicationDate);
                    // Compare only year, month, and day (ignore time)
                    return appDate.getFullYear() === filterDate.getFullYear() &&
                        appDate.getMonth() === filterDate.getMonth() &&
                        appDate.getDate() === filterDate.getDate();
                }
                return false;
            });
        });
    }

    if (admissionDate) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return trainee.admissions && trainee.admissions.some(a => {
                if (a.date) {
                    const admDate = parseMongoDate(a.date);
                    const filterDate = new Date(admissionDate);
                    // Compare only year, month, and day (ignore time)
                    return admDate.getFullYear() === filterDate.getFullYear() &&
                        admDate.getMonth() === filterDate.getMonth() &&
                        admDate.getDate() === filterDate.getDate();
                }
                return false;
            });
        });
    }

    renderTrainees(filteredTrainees);
}

function parseMongoDate(dateValue) {
    if (!dateValue) return new Date(0);

    try {
        // Handle MongoDB date object with $date
        if (dateValue.$date) {
            if (typeof dateValue.$date === 'string') {
                return new Date(dateValue.$date);
            } else if (typeof dateValue.$date === 'number') {
                return new Date(dateValue.$date);
            } else if (dateValue.$date.$numberLong) {
                return new Date(parseInt(dateValue.$date.$numberLong));
            }
        }

        // Handle MongoDB long number
        if (dateValue.$numberLong) {
            return new Date(parseInt(dateValue.$numberLong));
        }

        // Handle ISO string
        if (typeof dateValue === 'string') {
            const parsed = new Date(dateValue);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }

        // Handle timestamp number
        if (typeof dateValue === 'number') {
            return new Date(dateValue);
        }

        // Handle Date object
        if (dateValue instanceof Date) {
            return dateValue;
        }

        // Last resort: try to convert to string and parse
        const parsed = new Date(String(dateValue));
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }

        console.warn('Could not parse date:', dateValue);
        return new Date(0);
    } catch (error) {
        console.error('Error parsing date:', dateValue, error);
        return new Date(0);
    }
}

function highlightSearchResults(searchTerm) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let firstMatch = null;

    rows.forEach(row => {

        row.style.boxShadow = '';
        row.style.border = '';
        row.style.borderLeft = '';
        row.style.borderRadius = '';
        row.style.background = '';
        row.style.transition = '';
        row.style.transform = '';
        row.style.outline = '';
        row.style.outlineOffset = '';
        row.style.zIndex = '';

        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(searchTerm)) {

            row.style.position = 'relative';
            row.style.boxShadow = '0 8px 24px rgba(22, 56, 86, 0.5), 0 4px 12px rgba(54, 145, 191, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            row.style.outline = '2px solid rgba(54, 145, 191, 0.6)';
            row.style.outlineOffset = '2px';
            row.style.borderRadius = '10px';
            row.style.background = 'linear-gradient(135deg, rgba(54, 145, 191, 0.08) 0%, rgba(50, 85, 150, 0.08) 100%)';
            row.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            row.style.zIndex = '10';

            if (!firstMatch) {
                firstMatch = row;
            }
        }
    });

    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    const registrationFilter = document.getElementById('registrationFilter');
    const applicationFilter = document.getElementById('applicationFilter');
    const admissionFilter = document.getElementById('admissionFilter');

    if (registrationFilter) registrationFilter.value = '';
    if (applicationFilter) applicationFilter.value = '';
    if (admissionFilter) admissionFilter.value = '';

    clearAllHighlights();

    renderTrainees(traineesData);
}

document.addEventListener('DOMContentLoaded', function () {
    const bulkUploadBtn = document.getElementById('bulkUploadBtn');
    const bulkUploadModal = new bootstrap.Modal(document.getElementById('bulkUploadModal'));
    const bulkUploadFile = document.getElementById('bulkUploadFile');
    const confirmBulkUpload = document.getElementById('confirmBulkUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadPreviewBody = document.getElementById('uploadPreviewBody');
    const uploadRecordCount = document.getElementById('uploadRecordCount');

    let uploadedData = [];

    if (bulkUploadBtn) {
        bulkUploadBtn.addEventListener('click', function () {
            bulkUploadModal.show();
        });
    }

    if (bulkUploadFile) {
        bulkUploadFile.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'csv') {
                parseCSVFile(file);
            } else if (fileExtension === 'json') {
                parseJSONFile(file);
            } else {
                showToast('Invalid file format. Please upload CSV or JSON file.', 'error');
            }
        });
    }

    function parseCSVFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    showToast('CSV file is empty or invalid.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
                const validFields = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone', 'password'];

                const missingFields = requiredFields.filter(field => !headers.includes(field));
                if (missingFields.length > 0) {
                    showToast(`CSV file is missing required fields: ${missingFields.join(', ')}. Expected format: trainee_id, username, first_name, second_name, middle_name, last_name, suffix, email, phone, password`, 'error');
                    resetBulkUploadForm();
                    return;
                }

                const invalidFields = headers.filter(header => !validFields.includes(header));
                if (invalidFields.length > 0) {
                    showToast(`CSV file contains invalid fields: ${invalidFields.join(', ')}. Valid fields are: ${validFields.join(', ')}`, 'error');
                    resetBulkUploadForm();
                    return;
                }

                uploadedData = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const trainee = {};

                    headers.forEach((header, index) => {
                        trainee[header] = values[index] || '';
                    });

                    const rowMissingFields = requiredFields.filter(field => !trainee[field] || trainee[field].trim() === '');
                    if (rowMissingFields.length > 0) {
                        showToast(`Row ${i + 1} is missing required fields: ${rowMissingFields.join(', ')}`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    uploadedData.push(trainee);
                }

                displayUploadPreview();
            } catch (error) {
                showToast('Error parsing CSV file. Please check the file format.', 'error');
                resetBulkUploadForm();
            }
        };
        reader.readAsText(file);
    }

    function parseJSONFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);

                if (!Array.isArray(data)) {
                    showToast('JSON file must contain an array of trainee objects.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                if (data.length === 0) {
                    showToast('JSON file is empty.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
                const validFields = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone', 'password'];

                for (let i = 0; i < data.length; i++) {
                    const trainee = data[i];

                    if (typeof trainee !== 'object' || trainee === null) {
                        showToast(`Item ${i + 1} in JSON file is not a valid object.`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    const missingFields = requiredFields.filter(field => !trainee[field] || trainee[field].toString().trim() === '');
                    if (missingFields.length > 0) {
                        showToast(`Item ${i + 1} is missing required fields: ${missingFields.join(', ')}. Expected format: Array of objects with fields: trainee_id, username, first_name, second_name, middle_name, last_name, suffix, email, phone, password`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    const objectFields = Object.keys(trainee);
                    const invalidFields = objectFields.filter(field => !validFields.includes(field));
                    if (invalidFields.length > 0) {
                        showToast(`Item ${i + 1} contains invalid fields: ${invalidFields.join(', ')}. Valid fields are: ${validFields.join(', ')}`, 'error');
                        resetBulkUploadForm();
                        return;
                    }
                }

                uploadedData = data;
                displayUploadPreview();
            } catch (error) {
                showToast('Error parsing JSON file. Please check the file format and ensure it contains valid JSON.', 'error');
                resetBulkUploadForm();
            }
        };
        reader.readAsText(file);
    }

    function displayUploadPreview() {
        if (uploadedData.length === 0) {
            uploadPreview.style.display = 'none';
            confirmBulkUpload.disabled = true;
            return;
        }

        uploadPreviewBody.innerHTML = '';

        const currentYear = new Date().getFullYear();

        uploadedData.forEach((trainee, index) => {
            const fullName = [
                trainee.first_name,
                trainee.second_name,
                trainee.middle_name,
                trainee.last_name,
                trainee.suffix
            ].filter(Boolean).join(' ');

            const previewId = trainee.trainee_id || `TRN-${currentYear}-${String(index + 1).padStart(3, '0')}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${previewId}</td>
                <td>${fullName || 'N/A'}</td>
                <td>${trainee.email || 'N/A'}</td>
                <td>${trainee.phone || 'N/A'}</td>
            `;
            uploadPreviewBody.appendChild(row);
        });

        uploadRecordCount.textContent = uploadedData.length;
        uploadPreview.style.display = 'block';
        confirmBulkUpload.disabled = false;
    }

    if (confirmBulkUpload) {
        confirmBulkUpload.addEventListener('click', async function () {
            if (uploadedData.length === 0) return;

            confirmBulkUpload.disabled = true;
            confirmBulkUpload.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';

            try {
                let successCount = 0;
                let errorCount = 0;

                for (const trainee of uploadedData) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/trainees`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(trainee)
                        });

                        if (response.ok) {
                            successCount++;
                        } else {
                            errorCount++;
                        }
                    } catch (error) {
                        errorCount++;
                    }
                }

                if (successCount > 0) {
                    showToast(`Successfully uploaded ${successCount} trainee(s).`, 'success');
                    loadTrainees();
                    loadStatistics();
                }

                if (errorCount > 0) {
                    showToast(`Failed to upload ${errorCount} trainee(s).`, 'warning');
                }

                bulkUploadModal.hide();
                resetBulkUploadForm();
            } catch (error) {
                console.error('Error during bulk upload:', error);
                showToast('Error during bulk upload.', 'error');
            } finally {
                confirmBulkUpload.disabled = false;
                confirmBulkUpload.innerHTML = '<i class="bx bx-upload"></i> Upload Trainees';
            }
        });
    }

    function resetBulkUploadForm() {
        bulkUploadFile.value = '';
        uploadedData = [];
        uploadPreview.style.display = 'none';
        confirmBulkUpload.disabled = true;
    }

    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async function () {

            exportCsvBtn.disabled = true;
            const originalText = exportCsvBtn.innerHTML;
            exportCsvBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Fetching data...';

            try {

                const response = await fetch(`${API_BASE_URL}/trainees`);

                if (!response.ok) {
                    throw new Error('Failed to fetch trainees data');
                }

                const data = await response.json();
                const allTrainees = data.data || [];

                if (allTrainees.length === 0) {
                    showToast('No data to export.', 'warning');
                    return;
                }

                const headers = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone'];
                const csvContent = [
                    headers.join(','),
                    ...allTrainees.map(trainee =>
                        headers.map(header => {
                            const value = trainee[header] || '';

                            const stringValue = value.toString();
                            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                                return `"${stringValue.replace(/"/g, '""')}"`;
                            }
                            return stringValue;
                        }).join(',')
                    )
                ].join('\n');

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `trainees_export_${timestamp}.csv`;

                downloadFile(csvContent, filename, 'text/csv');
                showToast(`Successfully exported ${allTrainees.length} trainee(s) to CSV.`, 'success');
            } catch (error) {
                console.error('Error exporting CSV:', error);
                showToast('Error exporting data. Please try again.', 'error');
            } finally {

                exportCsvBtn.disabled = false;
                exportCsvBtn.innerHTML = originalText;
            }
        });
    }

    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', async function () {

            exportJsonBtn.disabled = true;
            const originalText = exportJsonBtn.innerHTML;
            exportJsonBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Fetching data...';

            try {

                const response = await fetch(`${API_BASE_URL}/trainees`);

                if (!response.ok) {
                    throw new Error('Failed to fetch trainees data');
                }

                const data = await response.json();
                const allTrainees = data.data || [];

                if (allTrainees.length === 0) {
                    showToast('No data to export.', 'warning');
                    return;
                }

                const jsonContent = JSON.stringify(allTrainees, null, 2);

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `trainees_export_${timestamp}.json`;

                downloadFile(jsonContent, filename, 'application/json');
                showToast(`Successfully exported ${allTrainees.length} trainee(s) to JSON.`, 'success');
            } catch (error) {
                console.error('Error exporting JSON:', error);
                showToast('Error exporting data. Please try again.', 'error');
            } finally {

                exportJsonBtn.disabled = false;
                exportJsonBtn.innerHTML = originalText;
            }
        });
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});