document.addEventListener('DOMContentLoaded', function () {
    // Load applications from MongoDB
    loadApplications();

    // Date filter
    const dateFilter = document.getElementById('applicationDateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function () {
            const selectedDate = this.value;
            filterApplicationsByDate(selectedDate || null);
        });
    }

    // Search and filter inputs
    const searchInput = document.querySelector('input[placeholder="Name or Trainee ID"]');
    const statusFilter = document.querySelector('select[class*="form-select"]');
    const courseFilter = document.querySelectorAll('select[class*="form-select"]')[1];

    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 500));
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (courseFilter) {
        courseFilter.addEventListener('change', applyFilters);
    }

    // Reset button
    const resetBtn = document.querySelector('.btn-outline-secondary');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';
            if (courseFilter) courseFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            loadApplications();
        });
    }

    // Edit modal save button
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEditedApplication);
    }

    // Delete modal confirm button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteApplication);
    }

    // Add buttons for dynamic arrays (Edit Modal)
    const addWorkExpBtn = document.getElementById('addWorkExperienceBtn');
    if (addWorkExpBtn) {
        addWorkExpBtn.addEventListener('click', addWorkExperience);
    }

    const addTrainingBtn = document.getElementById('addTrainingSeminarBtn');
    if (addTrainingBtn) {
        addTrainingBtn.addEventListener('click', addTrainingSeminar);
    }

    const addLicensureBtn = document.getElementById('addLicensureExamBtn');
    if (addLicensureBtn) {
        addLicensureBtn.addEventListener('click', addLicensureExam);
    }

    const addCompetencyBtn = document.getElementById('addCompetencyAssessmentBtn');
    if (addCompetencyBtn) {
        addCompetencyBtn.addEventListener('click', addCompetencyAssessment);
    }

    // Add buttons for dynamic arrays (Add Modal)
    const addWorkExpBtnModal = document.getElementById('addWorkExperienceBtnModal');
    if (addWorkExpBtnModal) {
        addWorkExpBtnModal.addEventListener('click', addWorkExperienceToAddModal);
    }

    const addTrainingBtnModal = document.getElementById('addTrainingSeminarBtnModal');
    if (addTrainingBtnModal) {
        addTrainingBtnModal.addEventListener('click', addTrainingSeminarToAddModal);
    }

    const addLicensureBtnModal = document.getElementById('addLicensureExamBtnModal');
    if (addLicensureBtnModal) {
        addLicensureBtnModal.addEventListener('click', addLicensureExamToAddModal);
    }

    const addCompetencyBtnModal = document.getElementById('addCompetencyAssessmentBtnModal');
    if (addCompetencyBtnModal) {
        addCompetencyBtnModal.addEventListener('click', addCompetencyAssessmentToAddModal);
    }
});

let allApplications = [];

async function loadApplications() {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications`);
        const result = await response.json();

        if (result.success && result.data) {
            allApplications = result.data;

            // Data already includes userData from server-side join
            // No need to fetch user data separately

            // Update statistics
            updateStatistics(allApplications);

            // Render table
            renderApplicationsTable(allApplications);
        } else {
            console.error('Failed to load applications:', result.message);
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showEmptyState();
    }
}

function updateStatistics(applications) {
    const total = applications.length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const cancelled = applications.filter(app => app.status === 'cancelled').length;

    // Update cards
    const cards = document.querySelectorAll('.card-body h3');
    if (cards[0]) cards[0].textContent = total;
    if (cards[1]) cards[1].textContent = approved;
    if (cards[2]) cards[2].textContent = pending;
    if (cards[3]) cards[3].textContent = cancelled;
}

function renderApplicationsTable(applications) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    if (applications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-error-circle"
                            style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px; color: #697a8d;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">
                            No application records available
                        </h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">
                            There are currently no applications to review.
                        </p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = applications.map(app => {
        const fullName = getFullName(app);
        const traineeId = app.userData?.trainee_id || 'N/A';
        const course = app.assessment_title || 'N/A';
        const date = formatDate(app.application_date || app.submitted_at);
        const status = app.status || 'pending';
        const statusBadge = getStatusBadge(status);
        const avatar = getAvatarHtml(app);
        const appId = app._id?.$oid || app._id;

        return `
            <tr data-app-id="${appId}">
                <td>
                    <div class="d-flex align-items-center">
                        ${avatar}
                        <span>${fullName}</span>
                    </div>
                </td>
                <td><strong>${traineeId}</strong></td>
                <td>${course}</td>
                <td>${date}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-primary dropdown-toggle" 
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bx bx-refresh"></i> Change Status
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" style="color: #10b981 !important;" 
                                href="javascript:void(0);" onclick="changeStatus('${appId}', 'approved')">
                                <i class="bx bx-check-circle me-2" style="color: #10b981 !important;"></i>Approved</a>
                            </li>
                            <li><a class="dropdown-item" style="color: #ffc107 !important;" 
                                href="javascript:void(0);" onclick="changeStatus('${appId}', 'pending')">
                                <i class="bx bx-time-five me-2" style="color: #ffc107 !important;"></i>Pending</a>
                            </li>
                            <li><a class="dropdown-item text-danger" 
                                href="javascript:void(0);" onclick="changeStatus('${appId}', 'cancelled')">
                                <i class="bx bx-block me-2"></i>Cancelled</a>
                            </li>
                        </ul>
                        <button type="button" class="btn btn-sm dropdown-toggle-split" 
                            data-bs-toggle="dropdown" aria-expanded="false"
                            style="background: none; border: none; color: white;">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="javascript:void(0);" 
                                onclick="viewDetails('${appId}')">
                                <i class="bx bx-show me-2"></i>View Details</a>
                            </li>
                            <li><a class="dropdown-item" href="javascript:void(0);" 
                                onclick="editDetails('${appId}')">
                                <i class="bx bx-edit me-2"></i>Edit Details</a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="javascript:void(0);" 
                                onclick="deleteApplication('${appId}')">
                                <i class="bx bx-trash me-2"></i>Delete Record</a>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getFullName(app) {
    if (app.name) {
        const parts = [
            app.name.first_name,
            app.name.middle_name,
            app.name.surname
        ].filter(Boolean);
        return parts.join(' ') || 'Unknown';
    }
    return 'Unknown';
}

function getAvatarHtml(app) {
    // Priority: userData.profile_image (from trainees collection) > picture (from application form)
    const profileImage = app.userData?.profile_image || app.picture;
    const fullName = getFullName(app);
    const initials = getInitials(app);

    if (profileImage) {
        let imageSrc = profileImage;

        // If it's not a base64 image and not a full URL, construct the full URL
        if (!profileImage.startsWith('data:image') && !profileImage.startsWith('http')) {
            // Remove leading slash if present
            const cleanPath = profileImage.startsWith('/') ? profileImage.substring(1) : profileImage;
            imageSrc = `${window.location.origin}/${cleanPath}`;
        }

        return `
            <div class="avatar avatar-sm me-3">
                <img src="${imageSrc}" alt="${fullName}" class="rounded-circle" 
                    style="width: 38px; height: 38px; object-fit: cover;" 
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="avatar-fallback" style="display: none; background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                    ${initials}
                </div>
            </div>
        `;
    }

    // Fallback to initials
    return `
        <div class="avatar avatar-sm me-3"
            style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
            backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); 
            border: 1px solid rgba(54, 145, 191, 0.4); 
            box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
            color: white; display: flex; align-items: center; justify-content: center; 
            border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
            ${initials}
        </div>
    `;
}

function getInitials(app) {
    const fullName = getFullName(app);
    return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getStatusBadge(status) {
    const badges = {
        'approved': '<span class="badge bg-success">Approved</span>',
        'pending': '<span class="badge bg-warning">Pending</span>',
        'cancelled': '<span class="badge bg-danger">Cancelled</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

function formatAssessmentType(type) {
    const types = {
        'full': 'Full Qualification',
        'coc': 'COC',
        'renewal': 'Renewal'
    };
    return types[type] || type || 'N/A';
}

function formatClientType(type) {
    const types = {
        'tvet-graduating': 'TVET Graduating Student',
        'tvet-graduate': 'TVET Graduate',
        'industry-worker': 'Industry Worker',
        'k12': 'K-12',
        'owf': 'OWF'
    };
    return types[type] || type || 'N/A';
}

function formatDate(dateValue) {
    if (!dateValue) return 'N/A';

    try {
        let date;

        // Handle different MongoDB date formats
        if (dateValue.$date) {
            // MongoDB extended JSON format
            date = new Date(dateValue.$date);
        } else if (dateValue.$numberLong) {
            // MongoDB numberLong format
            date = new Date(parseInt(dateValue.$numberLong));
        } else if (typeof dateValue === 'string') {
            // String format
            date = new Date(dateValue);
        } else if (typeof dateValue === 'number') {
            // Timestamp format
            date = new Date(dateValue);
        } else if (dateValue instanceof Date) {
            // Already a Date object
            date = dateValue;
        } else {
            // Try direct conversion
            date = new Date(dateValue);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.warn('Date formatting error:', error, 'for value:', dateValue);
        return 'N/A';
    }
}

// Test function to verify API connectivity - add this to browser console
async function testAPI() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications`);
        const result = await response.json();
        console.log('API Test Result:', result);

        if (result.success && result.data) {
            console.log('Applications count:', result.data.length);
            console.log('Sample application:', result.data[0]);
        }
    } catch (error) {
        console.error('API Test Error:', error);
    }
}

// Test function to verify change detection - run in browser console
function testChangeDetection() {
    // Make a small change to test
    const surnameField = document.getElementById('editSurname');
    const originalValue = surnameField.value;
    surnameField.value = originalValue + ' '; // Add a space

    console.log('Test: Added space to surname field');
    console.log('Original:', originalValue);
    console.log('New:', surnameField.value);

    // Now try to save
    document.getElementById('saveEditBtn').click();
}

// Run this in browser console: testChangeDetection()

// Run this in browser console: testAPI()

function showEmptyState() {
    const tbody = document.querySelector('.table tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-error-circle"
                            style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px; color: #697a8d;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">
                            No application records available
                        </h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">
                            There are currently no applications to review.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}

async function changeStatus(appId, newStatus) {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications/${appId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (result.success) {
            // Reload applications
            await loadApplications();
            showSuccess('Status updated successfully');
        } else {
            showError('Failed to update status: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showError('Error updating status');
    }
}

function viewDetails(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (!app) {
        showError('Application not found');
        return;
    }

    // Reference & ULI
    document.getElementById('viewReferenceNumber').textContent = app.reference_number || 'N/A';
    document.getElementById('viewUli').textContent = app.uli || 'N/A';

    // Picture & Signature
    const pictureImg = document.getElementById('viewPicture');
    const noPictureText = document.getElementById('viewNoPicture');
    if (app.picture) {
        pictureImg.src = app.picture;
        pictureImg.style.display = 'block';
        noPictureText.style.display = 'none';
    } else {
        pictureImg.style.display = 'none';
        noPictureText.style.display = 'block';
    }

    const signatureImg = document.getElementById('viewSignature');
    const noSignatureText = document.getElementById('viewNoSignature');
    if (app.signature) {
        signatureImg.src = app.signature;
        signatureImg.style.display = 'block';
        noSignatureText.style.display = 'none';
    } else {
        signatureImg.style.display = 'none';
        noSignatureText.style.display = 'block';
    }

    // School Information
    document.getElementById('viewSchoolName').textContent = app.school_name || 'N/A';
    document.getElementById('viewSchoolAddress').textContent = app.school_address || 'N/A';

    // Assessment Information
    document.getElementById('viewAssessmentTitle').textContent = app.assessment_title || 'N/A';
    document.getElementById('viewApplicationDate').textContent = formatDate(app.application_date || app.submitted_at);
    document.getElementById('viewAssessmentType').textContent = formatAssessmentType(app.assessment_type);
    document.getElementById('viewClientType').textContent = formatClientType(app.client_type);

    // Personal Information
    document.getElementById('viewSurname').textContent = app.name?.surname || 'N/A';
    document.getElementById('viewFirstName').textContent = app.name?.first_name || 'N/A';
    document.getElementById('viewMiddleName').textContent = app.name?.middle_name || 'N/A';
    document.getElementById('viewMiddleInitial').textContent = app.name?.middle_initial || 'N/A';
    document.getElementById('viewSecondName').textContent = app.name?.second_name || 'N/A';
    document.getElementById('viewNameExtension').textContent = app.name?.name_extension || 'N/A';

    // Mailing Address
    const address = app.mailing_address || {};
    document.getElementById('viewNumberStreet').textContent = address.number_street || 'N/A';
    document.getElementById('viewBarangay').textContent = address.barangay || 'N/A';
    document.getElementById('viewDistrict').textContent = address.district || 'N/A';
    document.getElementById('viewCity').textContent = address.city || 'N/A';
    document.getElementById('viewProvince').textContent = address.province || 'N/A';
    document.getElementById('viewRegion').textContent = address.region || 'N/A';
    document.getElementById('viewZip').textContent = address.zip || 'N/A';

    // Parent Information
    document.getElementById('viewMotherName').textContent = app.mothers_name || 'N/A';
    document.getElementById('viewFatherName').textContent = app.fathers_name || 'N/A';

    // Personal Details
    document.getElementById('viewSex').textContent = app.sex ? app.sex.charAt(0).toUpperCase() + app.sex.slice(1) : 'N/A';
    document.getElementById('viewCivilStatus').textContent = app.civil_status ? app.civil_status.charAt(0).toUpperCase() + app.civil_status.slice(1) : 'N/A';
    document.getElementById('viewEmploymentStatus').textContent = app.employment_status || 'N/A';
    document.getElementById('viewAge').textContent = app.age || 'N/A';
    document.getElementById('viewBirthDate').textContent = app.birth_date || 'N/A';
    document.getElementById('viewBirthPlace').textContent = app.birth_place || 'N/A';
    document.getElementById('viewEducation').textContent = app.education || 'N/A';

    // Contact Information
    document.getElementById('viewTel').textContent = app.contact?.tel || 'N/A';
    document.getElementById('viewMobile').textContent = app.contact?.mobile || 'N/A';
    document.getElementById('viewFax').textContent = app.contact?.fax || 'N/A';
    document.getElementById('viewEmail').textContent = app.contact?.email || 'N/A';
    document.getElementById('viewOtherContact').textContent = app.contact?.other_contact || 'N/A';

    // Work Experience
    const workExpContainer = document.getElementById('viewWorkExperience');
    if (app.work_experience && app.work_experience.length > 0) {
        workExpContainer.innerHTML = app.work_experience.map((exp, index) => `
            <div class="card mb-2" style="background: rgba(255,255,255,0.05);">
                <div class="card-body p-3">
                    <h6 class="text-white mb-2">${index + 1}. ${exp.company || 'N/A'}</h6>
                    <p class="mb-1 text-white-50"><strong>Position:</strong> ${exp.position || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Inclusive Dates:</strong> ${exp.inclusive_dates || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Monthly Salary:</strong> ${exp.monthly_salary || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Status:</strong> ${exp.status_of_appointment || 'N/A'}</p>
                    <p class="mb-0 text-white-50"><strong>Years of Experience:</strong> ${exp.years_of_experience || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    } else {
        workExpContainer.innerHTML = '<p class="text-white-50">No work experience recorded</p>';
    }

    // Training & Seminars
    const trainingContainer = document.getElementById('viewTrainingSeminars');
    if (app.training_seminars && app.training_seminars.length > 0) {
        trainingContainer.innerHTML = app.training_seminars.map((training, index) => `
            <div class="card mb-2" style="background: rgba(255,255,255,0.05);">
                <div class="card-body p-3">
                    <h6 class="text-white mb-2">${index + 1}. ${training.title || 'N/A'}</h6>
                    <p class="mb-1 text-white-50"><strong>Venue:</strong> ${training.venue || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Inclusive Dates:</strong> ${training.inclusive_dates || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Number of Hours:</strong> ${training.number_of_hours || 'N/A'}</p>
                    <p class="mb-0 text-white-50"><strong>Conducted By:</strong> ${training.conducted_by || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    } else {
        trainingContainer.innerHTML = '<p class="text-white-50">No training or seminars recorded</p>';
    }

    // Licensure Examinations
    const licensureContainer = document.getElementById('viewLicensureExams');
    if (app.licensure_exams && app.licensure_exams.length > 0) {
        licensureContainer.innerHTML = app.licensure_exams.map((exam, index) => `
            <div class="card mb-2" style="background: rgba(255,255,255,0.05);">
                <div class="card-body p-3">
                    <h6 class="text-white mb-2">${index + 1}. ${exam.title || 'N/A'}</h6>
                    <p class="mb-1 text-white-50"><strong>Year Taken:</strong> ${exam.year_taken || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Venue:</strong> ${exam.examination_venue || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Rating:</strong> ${exam.rating || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Remarks:</strong> ${exam.remarks || 'N/A'}</p>
                    <p class="mb-0 text-white-50"><strong>Expiry Date:</strong> ${exam.expiry_date || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    } else {
        licensureContainer.innerHTML = '<p class="text-white-50">No licensure examinations recorded</p>';
    }

    // Competency Assessments
    const competencyContainer = document.getElementById('viewCompetencyAssessments');
    if (app.competency_assessments && app.competency_assessments.length > 0) {
        competencyContainer.innerHTML = app.competency_assessments.map((comp, index) => `
            <div class="card mb-2" style="background: rgba(255,255,255,0.05);">
                <div class="card-body p-3">
                    <h6 class="text-white mb-2">${index + 1}. ${comp.title || 'N/A'}</h6>
                    <p class="mb-1 text-white-50"><strong>Qualification Level:</strong> ${comp.qualification_level || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Industry Sector:</strong> ${comp.industry_sector || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Certificate Number:</strong> ${comp.certificate_number || 'N/A'}</p>
                    <p class="mb-1 text-white-50"><strong>Date of Issuance:</strong> ${comp.date_of_issuance || 'N/A'}</p>
                    <p class="mb-0 text-white-50"><strong>Expiration Date:</strong> ${comp.expiration_date || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    } else {
        competencyContainer.innerHTML = '<p class="text-white-50">No competency assessments recorded</p>';
    }

    // Status
    const statusBadge = getStatusBadge(app.status);
    document.getElementById('viewStatus').innerHTML = statusBadge;
    document.getElementById('viewSubmittedAt').textContent = formatDate(app.submitted_at);
    document.getElementById('viewUpdatedAt').textContent = formatDate(app.updated_at);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewProfileModal'));
    modal.show();
}

function editDetails(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (!app) {
        showError('Application not found');
        return;
    }

    // Store original data in flat structure like registration.js
    window.originalApplicationData = {
        reference_number: app.reference_number || '',
        uli: app.uli || '',
        school_name: app.school_name || '',
        school_address: app.school_address || '',
        assessment_title: app.assessment_title || '',
        application_date: app.application_date || '',
        assessment_type: app.assessment_type || '',
        client_type: app.client_type || '',
        surname: app.name?.surname || '',
        first_name: app.name?.first_name || '',
        middle_name: app.name?.middle_name || '',
        middle_initial: app.name?.middle_initial || '',
        second_name: app.name?.second_name || '',
        name_extension: app.name?.name_extension || '',
        number_street: app.mailing_address?.number_street || '',
        barangay: app.mailing_address?.barangay || '',
        district: app.mailing_address?.district || '',
        city: app.mailing_address?.city || '',
        province: app.mailing_address?.province || '',
        region: app.mailing_address?.region || '',
        zip: app.mailing_address?.zip || '',
        mothers_name: app.mothers_name || '',
        fathers_name: app.fathers_name || '',
        sex: app.sex || '',
        civil_status: app.civil_status || '',
        employment_status: app.employment_status || '',
        age: app.age || '',
        birth_date: app.birth_date || '',
        birth_place: app.birth_place || '',
        education: app.education || '',
        tel: app.contact?.tel || '',
        mobile: app.contact?.mobile || '',
        fax: app.contact?.fax || '',
        email: app.contact?.email || '',
        other_contact: app.contact?.other_contact || '',
        status: app.status || 'pending',
        // Add dynamic arrays as JSON strings for comparison
        work_experience: JSON.stringify(app.work_experience || []),
        training_seminars: JSON.stringify(app.training_seminars || []),
        licensure_exams: JSON.stringify(app.licensure_exams || []),
        competency_assessments: JSON.stringify(app.competency_assessments || [])
    };

    // Store application ID
    document.getElementById('editApplicationId').value = appId;
    console.log('Setting edit Application ID to:', appId);
    console.log('Application ID type:', typeof appId);

    // Reference & ULI
    document.getElementById('editReferenceNumber').value = app.reference_number || '';
    document.getElementById('editUli').value = app.uli || '';

    // School Information
    document.getElementById('editSchoolName').value = app.school_name || '';
    document.getElementById('editSchoolAddress').value = app.school_address || '';

    // Assessment Information
    document.getElementById('editAssessmentTitle').value = app.assessment_title || '';
    document.getElementById('editApplicationDate').value = app.application_date || '';
    document.getElementById('editAssessmentType').value = app.assessment_type || '';
    document.getElementById('editClientType').value = app.client_type || '';

    // Personal Information - Name fields
    document.getElementById('editSurname').value = app.name?.surname || '';
    document.getElementById('editFirstName').value = app.name?.first_name || '';
    document.getElementById('editMiddleName').value = app.name?.middle_name || '';
    document.getElementById('editMiddleInitial').value = app.name?.middle_initial || '';
    document.getElementById('editSecondName').value = app.name?.second_name || '';
    document.getElementById('editNameExtension').value = app.name?.name_extension || '';

    // Mailing Address
    const address = app.mailing_address || {};
    document.getElementById('editNumberStreet').value = address.number_street || '';
    document.getElementById('editBarangay').value = address.barangay || '';
    document.getElementById('editDistrict').value = address.district || '';
    document.getElementById('editCity').value = address.city || '';
    document.getElementById('editProvince').value = address.province || '';
    document.getElementById('editRegion').value = address.region || '';
    document.getElementById('editZip').value = address.zip || '';

    // Parent Information
    document.getElementById('editMotherName').value = app.mothers_name || '';
    document.getElementById('editFatherName').value = app.fathers_name || '';

    // Personal Details
    document.getElementById('editSex').value = app.sex || '';
    document.getElementById('editCivilStatus').value = app.civil_status || '';
    document.getElementById('editEmploymentStatus').value = app.employment_status || '';
    document.getElementById('editAge').value = app.age || '';
    document.getElementById('editBirthDate').value = app.birth_date || '';
    document.getElementById('editBirthPlace').value = app.birth_place || '';
    document.getElementById('editEducation').value = app.education || '';

    // Contact Information
    document.getElementById('editTel').value = app.contact?.tel || '';
    document.getElementById('editMobile').value = app.contact?.mobile || '';
    document.getElementById('editFax').value = app.contact?.fax || '';
    document.getElementById('editEmail').value = app.contact?.email || '';
    document.getElementById('editOtherContact').value = app.contact?.other_contact || '';

    // Work Experience
    populateWorkExperience(app.work_experience || []);

    // Training & Seminars
    populateTrainingSeminars(app.training_seminars || []);

    // Licensure Examinations
    populateLicensureExams(app.licensure_exams || []);

    // Competency Assessments
    populateCompetencyAssessments(app.competency_assessments || []);

    // Status
    document.getElementById('editStatus').value = app.status || 'pending';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editDetailsModal'));
    modal.show();
}

// Helper function to populate work experience
function populateWorkExperience(workExperiences) {
    const container = document.getElementById('editWorkExperienceContainer');
    container.innerHTML = '';

    workExperiences.forEach((exp, index) => {
        const expHtml = `
            <div class="work-experience-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Work Experience ${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeWorkExperience(${index})">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Company</label>
                            <input type="text" class="form-control" name="work_company_${index}" value="${exp.company || ''}" placeholder="Company name">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Position</label>
                            <input type="text" class="form-control" name="work_position_${index}" value="${exp.position || ''}" placeholder="Position">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Inclusive Dates</label>
                            <input type="text" class="form-control" name="work_dates_${index}" value="${exp.inclusive_dates || ''}" placeholder="e.g., 2020-2022">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Monthly Salary</label>
                            <input type="text" class="form-control" name="work_salary_${index}" value="${exp.monthly_salary || ''}" placeholder="Salary">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Status of Appointment</label>
                            <input type="text" class="form-control" name="work_status_${index}" value="${exp.status_of_appointment || ''}" placeholder="Status">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <label class="form-label">Years of Experience</label>
                            <input type="number" class="form-control" name="work_years_${index}" value="${exp.years_of_experience || ''}" placeholder="Years">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', expHtml);
    });
}

// Helper function to populate training seminars
function populateTrainingSeminars(trainings) {
    const container = document.getElementById('editTrainingSeminarsContainer');
    container.innerHTML = '';

    trainings.forEach((training, index) => {
        const trainingHtml = `
            <div class="training-seminar-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Training/Seminar ${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeTrainingSeminar(${index})">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control" name="training_title_${index}" value="${training.title || ''}" placeholder="Training title">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Venue</label>
                            <input type="text" class="form-control" name="training_venue_${index}" value="${training.venue || ''}" placeholder="Venue">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Inclusive Dates</label>
                            <input type="text" class="form-control" name="training_dates_${index}" value="${training.inclusive_dates || ''}" placeholder="e.g., Jan 2023">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Number of Hours</label>
                            <input type="number" class="form-control" name="training_hours_${index}" value="${training.number_of_hours || ''}" placeholder="Hours">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Conducted By</label>
                            <input type="text" class="form-control" name="training_conductor_${index}" value="${training.conducted_by || ''}" placeholder="Conducted by">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', trainingHtml);
    });
}

// Helper function to populate licensure exams
function populateLicensureExams(exams) {
    const container = document.getElementById('editLicensureExamsContainer');
    container.innerHTML = '';

    exams.forEach((exam, index) => {
        const examHtml = `
            <div class="licensure-exam-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Licensure Examination ${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeLicensureExam(${index})">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control" name="exam_title_${index}" value="${exam.title || ''}" placeholder="Exam title">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Year Taken</label>
                            <input type="number" class="form-control" name="exam_year_${index}" value="${exam.year_taken || ''}" placeholder="Year">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Examination Venue</label>
                            <input type="text" class="form-control" name="exam_venue_${index}" value="${exam.examination_venue || ''}" placeholder="Venue">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Rating</label>
                            <input type="text" class="form-control" name="exam_rating_${index}" value="${exam.rating || ''}" placeholder="Rating">
                        </div>
                        <div class="col-md-4 mb-2">
                            <label class="form-label">Remarks</label>
                            <input type="text" class="form-control" name="exam_remarks_${index}" value="${exam.remarks || ''}" placeholder="Remarks">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <label class="form-label">Expiry Date</label>
                            <input type="date" class="form-control" name="exam_expiry_${index}" value="${exam.expiry_date || ''}" placeholder="Expiry date">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', examHtml);
    });
}

// Helper function to populate competency assessments
function populateCompetencyAssessments(assessments) {
    const container = document.getElementById('editCompetencyAssessmentsContainer');
    container.innerHTML = '';

    assessments.forEach((assessment, index) => {
        const assessmentHtml = `
            <div class="competency-assessment-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Competency Assessment ${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeCompetencyAssessment(${index})">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control" name="comp_title_${index}" value="${assessment.title || ''}" placeholder="Assessment title">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Qualification Level</label>
                            <input type="text" class="form-control" name="comp_level_${index}" value="${assessment.qualification_level || ''}" placeholder="Level">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Industry Sector</label>
                            <input type="text" class="form-control" name="comp_sector_${index}" value="${assessment.industry_sector || ''}" placeholder="Sector">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Certificate Number</label>
                            <input type="text" class="form-control" name="comp_cert_${index}" value="${assessment.certificate_number || ''}" placeholder="Certificate #">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Date of Issuance</label>
                            <input type="date" class="form-control" name="comp_issue_${index}" value="${assessment.date_of_issuance || ''}" placeholder="Issue date">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Expiration Date</label>
                            <input type="date" class="form-control" name="comp_expiry_${index}" value="${assessment.expiration_date || ''}" placeholder="Expiry date">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', assessmentHtml);
    });
}

// Functions to remove items
function removeWorkExperience(index) {
    const item = document.querySelector(`.work-experience-item[data-index="${index}"]`);
    if (item) item.remove();
}

function removeTrainingSeminar(index) {
    const item = document.querySelector(`.training-seminar-item[data-index="${index}"]`);
    if (item) item.remove();
}

function removeLicensureExam(index) {
    const item = document.querySelector(`.licensure-exam-item[data-index="${index}"]`);
    if (item) item.remove();
}

function removeCompetencyAssessment(index) {
    const item = document.querySelector(`.competency-assessment-item[data-index="${index}"]`);
    if (item) item.remove();
}

// Functions to add new items
function addWorkExperience() {
    const container = document.getElementById('editWorkExperienceContainer');
    const index = container.querySelectorAll('.work-experience-item').length;

    const expHtml = `
        <div class="work-experience-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Work Experience ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeWorkExperience(${index})">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Company</label>
                        <input type="text" class="form-control" name="work_company_${index}" placeholder="Company name">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="work_position_${index}" placeholder="Position">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Inclusive Dates</label>
                        <input type="text" class="form-control" name="work_dates_${index}" placeholder="e.g., 2020-2022">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Monthly Salary</label>
                        <input type="text" class="form-control" name="work_salary_${index}" placeholder="Salary">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Status of Appointment</label>
                        <input type="text" class="form-control" name="work_status_${index}" placeholder="Status">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-2">
                        <label class="form-label">Years of Experience</label>
                        <input type="number" class="form-control" name="work_years_${index}" placeholder="Years">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', expHtml);
}

function addTrainingSeminar() {
    const container = document.getElementById('editTrainingSeminarsContainer');
    const index = container.querySelectorAll('.training-seminar-item').length;

    const trainingHtml = `
        <div class="training-seminar-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Training/Seminar ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeTrainingSeminar(${index})">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="training_title_${index}" placeholder="Training title">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Venue</label>
                        <input type="text" class="form-control" name="training_venue_${index}" placeholder="Venue">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Inclusive Dates</label>
                        <input type="text" class="form-control" name="training_dates_${index}" placeholder="e.g., Jan 2023">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Number of Hours</label>
                        <input type="number" class="form-control" name="training_hours_${index}" placeholder="Hours">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Conducted By</label>
                        <input type="text" class="form-control" name="training_conductor_${index}" placeholder="Conducted by">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', trainingHtml);
}

function addLicensureExam() {
    const container = document.getElementById('editLicensureExamsContainer');
    const index = container.querySelectorAll('.licensure-exam-item').length;

    const examHtml = `
        <div class="licensure-exam-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Licensure Examination ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeLicensureExam(${index})">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="exam_title_${index}" placeholder="Exam title">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Year Taken</label>
                        <input type="number" class="form-control" name="exam_year_${index}" placeholder="Year">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Examination Venue</label>
                        <input type="text" class="form-control" name="exam_venue_${index}" placeholder="Venue">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Rating</label>
                        <input type="text" class="form-control" name="exam_rating_${index}" placeholder="Rating">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Remarks</label>
                        <input type="text" class="form-control" name="exam_remarks_${index}" placeholder="Remarks">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-2">
                        <label class="form-label">Expiry Date</label>
                        <input type="date" class="form-control" name="exam_expiry_${index}" placeholder="Expiry date">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', examHtml);
}

function addCompetencyAssessment() {
    const container = document.getElementById('editCompetencyAssessmentsContainer');
    const index = container.querySelectorAll('.competency-assessment-item').length;

    const assessmentHtml = `
        <div class="competency-assessment-item card mb-3" style="background: rgba(255,255,255,0.05);" data-index="${index}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Competency Assessment ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeCompetencyAssessment(${index})">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="comp_title_${index}" placeholder="Assessment title">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Qualification Level</label>
                        <input type="text" class="form-control" name="comp_level_${index}" placeholder="Level">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Industry Sector</label>
                        <input type="text" class="form-control" name="comp_sector_${index}" placeholder="Sector">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Certificate Number</label>
                        <input type="text" class="form-control" name="comp_cert_${index}" placeholder="Certificate #">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Date of Issuance</label>
                        <input type="date" class="form-control" name="comp_issue_${index}" placeholder="Issue date">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label">Expiration Date</label>
                        <input type="date" class="form-control" name="comp_expiry_${index}" placeholder="Expiry date">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', assessmentHtml);
}

async function saveEditedApplication() {
    const appId = document.getElementById('editApplicationId').value;
    console.log('Edit Application ID from form:', appId);
    console.log('Application ID type:', typeof appId);

    if (!appId) {
        showError('Application ID not found');
        return;
    }

    // Validation - Check required fields
    console.log('Starting validation...');
    const validationErrors = validateRequiredFields();
    console.log('Validation errors:', validationErrors);

    if (validationErrors.length > 0) {
        const errorMessage = `Please fill in the following required fields:<br>${validationErrors.join('<br>')}`;
        console.log('Validation failed, showing error');
        showError(errorMessage);
        highlightInvalidFields(validationErrors);
        return;
    }
    console.log('Validation passed');

    // Collect updated data
    const updatedData = {
        reference_number: document.getElementById('editReferenceNumber').value,
        uli: document.getElementById('editUli').value,
        school_name: document.getElementById('editSchoolName').value,
        school_address: document.getElementById('editSchoolAddress').value,
        assessment_title: document.getElementById('editAssessmentTitle').value,
        application_date: document.getElementById('editApplicationDate').value,
        assessment_type: document.getElementById('editAssessmentType').value,
        client_type: document.getElementById('editClientType').value,
        name: {
            surname: document.getElementById('editSurname').value,
            first_name: document.getElementById('editFirstName').value,
            middle_name: document.getElementById('editMiddleName').value,
            middle_initial: document.getElementById('editMiddleInitial').value,
            second_name: document.getElementById('editSecondName').value,
            name_extension: document.getElementById('editNameExtension').value
        },
        mailing_address: {
            number_street: document.getElementById('editNumberStreet').value,
            barangay: document.getElementById('editBarangay').value,
            district: document.getElementById('editDistrict').value,
            city: document.getElementById('editCity').value,
            province: document.getElementById('editProvince').value,
            region: document.getElementById('editRegion').value,
            zip: document.getElementById('editZip').value
        },
        mothers_name: document.getElementById('editMotherName').value,
        fathers_name: document.getElementById('editFatherName').value,
        sex: document.getElementById('editSex').value,
        civil_status: document.getElementById('editCivilStatus').value,
        employment_status: document.getElementById('editEmploymentStatus').value,
        age: parseInt(document.getElementById('editAge').value) || 0,
        birth_date: document.getElementById('editBirthDate').value,
        birth_place: document.getElementById('editBirthPlace').value,
        education: document.getElementById('editEducation').value,
        contact: {
            tel: document.getElementById('editTel').value,
            mobile: document.getElementById('editMobile').value,
            fax: document.getElementById('editFax').value,
            email: document.getElementById('editEmail').value,
            other_contact: document.getElementById('editOtherContact').value
        },
        status: document.getElementById('editStatus').value
    };

    // Collect work experience
    const workExperiences = [];
    const workItems = document.querySelectorAll('.work-experience-item');
    workItems.forEach((item, index) => {
        const company = item.querySelector(`[name="work_company_${index}"]`)?.value;
        const position = item.querySelector(`[name="work_position_${index}"]`)?.value;
        const dates = item.querySelector(`[name="work_dates_${index}"]`)?.value;
        const salary = item.querySelector(`[name="work_salary_${index}"]`)?.value;
        const status = item.querySelector(`[name="work_status_${index}"]`)?.value;
        const years = item.querySelector(`[name="work_years_${index}"]`)?.value;

        if (company || position) {
            workExperiences.push({
                company: company || '',
                position: position || '',
                inclusive_dates: dates || '',
                monthly_salary: salary || '',
                status_of_appointment: status || '',
                years_of_experience: parseInt(years) || 0
            });
        }
    });
    updatedData.work_experience = workExperiences;

    // Collect training seminars
    const trainingSeminars = [];
    const trainingItems = document.querySelectorAll('.training-seminar-item');
    trainingItems.forEach((item, index) => {
        const title = item.querySelector(`[name="training_title_${index}"]`)?.value;
        const venue = item.querySelector(`[name="training_venue_${index}"]`)?.value;
        const dates = item.querySelector(`[name="training_dates_${index}"]`)?.value;
        const hours = item.querySelector(`[name="training_hours_${index}"]`)?.value;
        const conductor = item.querySelector(`[name="training_conductor_${index}"]`)?.value;

        if (title || venue) {
            trainingSeminars.push({
                title: title || '',
                venue: venue || '',
                inclusive_dates: dates || '',
                number_of_hours: parseInt(hours) || 0,
                conducted_by: conductor || ''
            });
        }
    });
    updatedData.training_seminars = trainingSeminars;

    // Collect licensure exams
    const licensureExams = [];
    const examItems = document.querySelectorAll('.licensure-exam-item');
    examItems.forEach((item, index) => {
        const title = item.querySelector(`[name="exam_title_${index}"]`)?.value;
        const year = item.querySelector(`[name="exam_year_${index}"]`)?.value;
        const venue = item.querySelector(`[name="exam_venue_${index}"]`)?.value;
        const rating = item.querySelector(`[name="exam_rating_${index}"]`)?.value;
        const remarks = item.querySelector(`[name="exam_remarks_${index}"]`)?.value;
        const expiry = item.querySelector(`[name="exam_expiry_${index}"]`)?.value;

        if (title || year) {
            licensureExams.push({
                title: title || '',
                year_taken: parseInt(year) || 0,
                examination_venue: venue || '',
                rating: rating || '',
                remarks: remarks || '',
                expiry_date: expiry || ''
            });
        }
    });
    updatedData.licensure_exams = licensureExams;

    // Collect competency assessments
    const competencyAssessments = [];
    const compItems = document.querySelectorAll('.competency-assessment-item');
    compItems.forEach((item, index) => {
        const title = item.querySelector(`[name="comp_title_${index}"]`)?.value;
        const level = item.querySelector(`[name="comp_level_${index}"]`)?.value;
        const sector = item.querySelector(`[name="comp_sector_${index}"]`)?.value;
        const cert = item.querySelector(`[name="comp_cert_${index}"]`)?.value;
        const issue = item.querySelector(`[name="comp_issue_${index}"]`)?.value;
        const expiry = item.querySelector(`[name="comp_expiry_${index}"]`)?.value;

        if (title || level) {
            competencyAssessments.push({
                title: title || '',
                qualification_level: level || '',
                industry_sector: sector || '',
                certificate_number: cert || '',
                date_of_issuance: issue || '',
                expiration_date: expiry || ''
            });
        }
    });
    updatedData.competency_assessments = competencyAssessments;

    console.log('Dynamic arrays collected:', {
        workExperiences: workExperiences.length,
        trainingSeminars: trainingSeminars.length,
        licensureExams: licensureExams.length,
        competencyAssessments: competencyAssessments.length
    });

    // Check for changes using simple string comparison like registration.js
    console.log('Starting change detection...');
    if (window.originalApplicationData) {
        console.log('Original data exists, comparing...');
        const currentData = {
            reference_number: document.getElementById('editReferenceNumber').value.trim(),
            uli: document.getElementById('editUli').value.trim(),
            school_name: document.getElementById('editSchoolName').value.trim(),
            school_address: document.getElementById('editSchoolAddress').value.trim(),
            assessment_title: document.getElementById('editAssessmentTitle').value.trim(),
            application_date: document.getElementById('editApplicationDate').value.trim(),
            assessment_type: document.getElementById('editAssessmentType').value.trim(),
            client_type: document.getElementById('editClientType').value.trim(),
            surname: document.getElementById('editSurname').value.trim(),
            first_name: document.getElementById('editFirstName').value.trim(),
            middle_name: document.getElementById('editMiddleName').value.trim(),
            middle_initial: document.getElementById('editMiddleInitial').value.trim(),
            second_name: document.getElementById('editSecondName').value.trim(),
            name_extension: document.getElementById('editNameExtension').value.trim(),
            number_street: document.getElementById('editNumberStreet').value.trim(),
            barangay: document.getElementById('editBarangay').value.trim(),
            district: document.getElementById('editDistrict').value.trim(),
            city: document.getElementById('editCity').value.trim(),
            province: document.getElementById('editProvince').value.trim(),
            region: document.getElementById('editRegion').value.trim(),
            zip: document.getElementById('editZip').value.trim(),
            mothers_name: document.getElementById('editMotherName').value.trim(),
            fathers_name: document.getElementById('editFatherName').value.trim(),
            sex: document.getElementById('editSex').value.trim(),
            civil_status: document.getElementById('editCivilStatus').value.trim(),
            employment_status: document.getElementById('editEmploymentStatus').value.trim(),
            age: document.getElementById('editAge').value.trim(),
            birth_date: document.getElementById('editBirthDate').value.trim(),
            birth_place: document.getElementById('editBirthPlace').value.trim(),
            education: document.getElementById('editEducation').value.trim(),
            tel: document.getElementById('editTel').value.trim(),
            mobile: document.getElementById('editMobile').value.trim(),
            fax: document.getElementById('editFax').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            other_contact: document.getElementById('editOtherContact').value.trim(),
            status: document.getElementById('editStatus').value.trim(),
            // Add dynamic arrays as JSON strings for comparison
            work_experience: JSON.stringify(workExperiences),
            training_seminars: JSON.stringify(trainingSeminars),
            licensure_exams: JSON.stringify(licensureExams),
            competency_assessments: JSON.stringify(competencyAssessments)
        };

        console.log('Current data collected, comparing...');
        console.log('Original data sample:', {
            work_experience: window.originalApplicationData.work_experience?.substring(0, 100) + '...',
            competency_assessments: window.originalApplicationData.competency_assessments?.substring(0, 100) + '...'
        });
        console.log('Current data sample:', {
            work_experience: currentData.work_experience?.substring(0, 100) + '...',
            competency_assessments: currentData.competency_assessments?.substring(0, 100) + '...'
        });

        let hasChanges = false;
        let changeCount = 0;
        for (const key in currentData) {
            const originalValue = String(window.originalApplicationData[key] || '');
            const currentValue = String(currentData[key] || '');

            if (originalValue !== currentValue) {
                console.log(`Change detected in ${key}: "${originalValue}" -> "${currentValue}"`);
                hasChanges = true;
                changeCount++;
                if (changeCount >= 5) {
                    console.log('... (more changes detected)');
                    break;
                }
            }
        }

        console.log('Has changes:', hasChanges);
        if (!hasChanges) {
            console.log('No changes detected, showing info message');
            showInfo('No changes were made to the application');
            return;
        }
    } else {
        console.log('No original data found, assuming changes');
    }
    console.log('Change detection completed, proceeding to save...');

    try {
        console.log('Saving application with ID:', appId);
        console.log('Data being sent to server:', updatedData);

        const response = await fetch(`${config.api.baseUrl}/api/v1/applications/${appId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (result.success) {
            showSuccess('Application updated successfully');

            // Close modal properly to avoid aria-hidden warning
            const modal = bootstrap.Modal.getInstance(document.getElementById('editDetailsModal'));
            if (modal) {
                // Remove focus from save button before hiding modal
                document.getElementById('saveEditBtn').blur();
                modal.hide();
            }

            // Reload applications
            await loadApplications();
        } else {
            console.error('Server error:', result);
            showError('Failed to update application: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating application:', error);
        showError('Failed to update application: ' + error.message);
    }
}

function deleteApplication(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (!app) {
        showError('Application not found');
        return;
    }

    // Store application ID for deletion
    document.getElementById('deleteApplicationId').value = appId;

    // Show application details in delete modal
    document.getElementById('deleteFullName').textContent = getFullName(app);
    document.getElementById('deleteTraineeId').textContent = app.userData?.trainee_id || 'N/A';
    document.getElementById('deleteCourse').textContent = app.assessment_title || 'N/A';
    document.getElementById('deleteApplicationDate').textContent = formatDate(app.application_date || app.submitted_at);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

async function confirmDeleteApplication() {
    const appId = document.getElementById('deleteApplicationId').value;
    const confirmText = document.getElementById('deleteConfirmText').value;

    if (confirmText.toLowerCase() !== 'delete') {
        showError('Please type "delete" to confirm');
        return;
    }

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications/${appId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Application deleted successfully');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();

            // Clear confirmation text
            document.getElementById('deleteConfirmText').value = '';

            // Reload applications
            await loadApplications();
        } else {
            showError('Failed to delete application: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        showError('Failed to delete application: ' + error.message);
    }
}

function applyFilters() {
    const searchInput = document.querySelector('input[placeholder="Name or Trainee ID"]');
    const statusFilter = document.querySelector('select[class*="form-select"]');
    const courseFilter = document.querySelectorAll('select[class*="form-select"]')[1];
    const dateFilter = document.getElementById('applicationDateFilter');

    const searchTerm = searchInput?.value.toLowerCase().trim() || '';
    const statusValue = statusFilter?.value || '';
    const courseValue = courseFilter?.value || '';
    const dateValue = dateFilter?.value || '';

    let filtered = allApplications.filter(app => {
        const fullName = getFullName(app).toLowerCase();
        const traineeId = (app.userData?.trainee_id || '').toLowerCase();
        const matchesSearch = !searchTerm || fullName.includes(searchTerm) || traineeId.includes(searchTerm);

        const matchesStatus = !statusValue || app.status === statusValue;

        const matchesCourse = !courseValue || (app.assessment_title || '').toLowerCase().includes(courseValue.toLowerCase());

        const matchesDate = !dateValue || formatDateForFilter(app.application_date || app.submitted_at) === dateValue;

        return matchesSearch && matchesStatus && matchesCourse && matchesDate;
    });

    renderApplicationsTable(filtered);

    // Highlight search results if search term exists
    if (searchTerm) {
        setTimeout(() => {
            clearAllHighlights();
            highlightSearchResults(searchTerm);
        }, 50);
    } else {
        clearAllHighlights();
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
            row.style.position = '';
        });
    }
}

function highlightSearchResults(searchTerm) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let firstMatch = null;

    rows.forEach(row => {
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDateForFilter(dateValue) {
    if (!dateValue) return '';

    try {
        let date;
        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else {
            date = new Date(dateValue);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return '';
    }
}

function filterApplicationsByDate(dateString) {
    applyFilters();
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

// Enhanced toast notification functions
function showInfo(message) {
    showToast(message, 'info');
}

function showWarning(message) {
    showToast(message, 'warning');
}

// Validation function for required fields
function validateRequiredFields() {
    const errors = [];
    const requiredFields = [
        { id: 'editSurname', name: 'Surname' },
        { id: 'editFirstName', name: 'First Name' },
        { id: 'editNumberStreet', name: 'Number & Street' },
        { id: 'editBarangay', name: 'Barangay' },
        { id: 'editCity', name: 'City/Municipality' },
        { id: 'editProvince', name: 'Province' },
        { id: 'editRegion', name: 'Region' },
        { id: 'editMobile', name: 'Mobile' },
        { id: 'editEmail', name: 'Email' }
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !element.value.trim()) {
            errors.push(field.name);
        }
    });

    // Email validation
    const emailField = document.getElementById('editEmail');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            errors.push('Valid Email address');
        }
    }

    // Mobile validation (basic format)
    const mobileField = document.getElementById('editMobile');
    if (mobileField && mobileField.value.trim()) {
        const mobileRegex = /^09\d{9}$/;
        if (!mobileRegex.test(mobileField.value.trim().replace(/[^0-9]/g, ''))) {
            errors.push('Valid Mobile number (09XX XXX XXXX)');
        }
    }

    return errors;
}

// Function to highlight invalid fields
function highlightInvalidFields(fieldNames) {
    // Remove previous highlights
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

    // Map field names to field IDs
    const fieldMap = {
        'Surname': 'editSurname',
        'First Name': 'editFirstName',
        'Number & Street': 'editNumberStreet',
        'Barangay': 'editBarangay',
        'City/Municipality': 'editCity',
        'Province': 'editProvince',
        'Region': 'editRegion',
        'Mobile': 'editMobile',
        'Email': 'editEmail',
        'Valid Email address': 'editEmail',
        'Valid Mobile number (09XX XXX XXXX)': 'editMobile'
    };

    fieldNames.forEach(fieldName => {
        const fieldId = fieldMap[fieldName];
        if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('is-invalid');
                // Scroll to first invalid field
                if (fieldNames[0] === fieldName) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
        }
    });

    // Remove highlights after 5 seconds
    setTimeout(() => {
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    }, 5000);
}



// Export CSV functionality
document.getElementById('exportCsvBtn')?.addEventListener('click', function () {
    exportToCSV();
});

// Export JSON functionality
document.getElementById('exportJsonBtn')?.addEventListener('click', function () {
    exportToJSON();
});

// Add Application Button
document.getElementById('addApplicationBtn')?.addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('addApplicationModal'));
    modal.show();

    // Add event listeners to remove error highlighting when user starts typing
    setTimeout(() => {
        const addModalFields = document.querySelectorAll('#addApplicationModal input, #addApplicationModal select, #addApplicationModal textarea');
        addModalFields.forEach(field => {
            field.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
            field.addEventListener('change', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }, 100);
});

// Save Application Button
document.getElementById('saveApplicationBtn')?.addEventListener('click', async function () {
    await saveNewApplication();
});

function exportToCSV() {
    if (allApplications.length === 0) {
        showError('No data to export');
        return;
    }

    const headers = ['Name', 'Trainee ID', 'Course', 'Date', 'Status', 'Reference Number', 'ULI', 'Email', 'Mobile'];
    const rows = allApplications.map(app => [
        getFullName(app),
        app.userData?.trainee_id || 'N/A',
        app.assessment_title || 'N/A',
        formatDate(app.application_date || app.submitted_at),
        app.status || 'pending',
        app.reference_number || 'N/A',
        app.uli || 'N/A',
        app.contact?.email || 'N/A',
        app.contact?.mobile || 'N/A'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Applications exported to CSV successfully');
}

function exportToJSON() {
    if (allApplications.length === 0) {
        showError('No data to export');
        return;
    }

    const dataStr = JSON.stringify(allApplications, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Applications exported to JSON successfully');
}

async function saveNewApplication() {
    try {
        // Initialize errors array first
        const errors = [];

        // Validate required fields
        const requiredFields = [
            { id: 'addNumberStreet', name: 'Number & Street' },
            { id: 'addBarangay', name: 'Barangay' },
            { id: 'addDistrict', name: 'District' },
            { id: 'addCity', name: 'City/Municipality' },
            { id: 'addProvince', name: 'Province' },
            { id: 'addRegion', name: 'Region' },
            { id: 'addZip', name: 'Zip Code' },
            { id: 'addTraineeId', name: 'Trainee ID' },
            { id: 'addSchoolName', name: 'School Name' },
            { id: 'addSchoolAddress', name: 'School Address' },
            { id: 'addAssessmentTitle', name: 'Assessment Title' },
            { id: 'addMotherName', name: "Mother's Name" },
            { id: 'addFatherName', name: "Father's Name" },
            { id: 'addAge', name: 'Age' },
            { id: 'addBirthDate', name: 'Birth Date' },
            { id: 'addBirthPlace', name: 'Birth Place' },
            { id: 'addEducation', name: 'Highest Educational Attainment' },
            { id: 'addFirstName', name: 'First Name' },
            { id: 'addMobile', name: 'Mobile' },
            { id: 'addEmail', name: 'Email' }
        ];

        // Check text/select fields
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) {
                console.error(`Field not found: ${field.id}`);
                errors.push(field.name);
            } else if (!element.value || !element.value.trim()) {
                errors.push(field.name);
            }
        });

        // Check for radio button required fields
        const sexChecked = document.querySelector('input[name="addSex"]:checked');
        const civilStatusChecked = document.querySelector('input[name="addCivilStatus"]:checked');
        const employmentStatusChecked = document.querySelector('input[name="addEmploymentStatus"]:checked');

        if (!sexChecked) {
            errors.push('Sex');
        }
        if (!civilStatusChecked) {
            errors.push('Civil Status');
        }
        if (!employmentStatusChecked) {
            errors.push('Employment Status');
        }

        if (errors.length > 0) {
            showError('Please complete all required fields.');
            highlightInvalidAddFields(errors.map(err => err));
            return;
        }

        // Email validation
        const email = document.getElementById('addEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            highlightInvalidAddFields(['Email']);
            return;
        }

        // Mobile validation (basic format)
        const mobile = document.getElementById('addMobile').value.trim().replace(/[^0-9]/g, '');
        const mobileRegex = /^09\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            showError('Please enter a valid mobile number (09XX XXX XXXX)');
            highlightInvalidAddFields(['Mobile']);
            return;
        }

        // Optional: Check for duplicate trainee_id (only if provided)
        const traineeId = document.getElementById('addTraineeId').value.trim();
        if (traineeId) {
            const duplicateTrainee = allApplications.find(app =>
                app.trainee_id && app.trainee_id.toLowerCase() === traineeId.toLowerCase()
            );

            if (duplicateTrainee) {
                showError(`Trainee ID "${traineeId}" already exists in the system`);
                highlightInvalidAddFields(['Trainee ID']);
                return;
            }
        }

        // Optional: Check for duplicate reference number (only if provided)
        const referenceNumber = document.getElementById('addReferenceNumber').value.trim();
        if (referenceNumber) {
            const duplicateReference = allApplications.find(app =>
                app.reference_number && app.reference_number.toLowerCase() === referenceNumber.toLowerCase()
            );

            if (duplicateReference) {
                showError(`Reference Number "${referenceNumber}" already exists in the system`);
                highlightInvalidAddFields(['Reference Number']);
                return;
            }
        }

        // Collect form data
        const formData = {
            trainee_id: traineeId,
            reference_number: referenceNumber,
            uli: document.getElementById('addUli').value,
            school_name: document.getElementById('addSchoolName').value,
            school_address: document.getElementById('addSchoolAddress').value,
            assessment_title: document.getElementById('addAssessmentTitle').value,
            application_date: document.getElementById('addApplicationDate').value,
            assessment_type: document.getElementById('addAssessmentType').value,
            client_type: document.getElementById('addClientType').value,
            name: {
                surname: document.getElementById('addSurname').value,
                first_name: document.getElementById('addFirstName').value,
                middle_name: document.getElementById('addMiddleName').value,
                middle_initial: document.getElementById('addMiddleInitial').value,
                second_name: document.getElementById('addSecondName').value,
                name_extension: document.getElementById('addNameExtension').value
            },
            mailing_address: {
                number_street: document.getElementById('addNumberStreet').value,
                barangay: document.getElementById('addBarangay').value,
                district: document.getElementById('addDistrict').value,
                city: document.getElementById('addCity').value,
                province: document.getElementById('addProvince').value,
                region: document.getElementById('addRegion').value,
                zip: document.getElementById('addZip').value
            },
            mothers_name: document.getElementById('addMotherName').value,
            fathers_name: document.getElementById('addFatherName').value,
            sex: document.querySelector('input[name="addSex"]:checked')?.value || '',
            civil_status: document.querySelector('input[name="addCivilStatus"]:checked')?.value || '',
            employment_status: document.querySelector('input[name="addEmploymentStatus"]:checked')?.value || '',
            age: parseInt(document.getElementById('addAge').value) || 0,
            birth_date: document.getElementById('addBirthDate').value,
            birth_place: document.getElementById('addBirthPlace').value,
            education: document.getElementById('addEducation').value,
            contact: {
                tel: document.getElementById('addTel').value,
                mobile: document.getElementById('addMobile').value,
                fax: document.getElementById('addFax').value,
                email: document.getElementById('addEmail').value,
                other_contact: document.getElementById('addOtherContact').value
            },
            status: document.getElementById('addStatus').value,
            submitted_at: new Date().toISOString()
        };

        // Collect work experience
        const workExperiences = [];
        document.querySelectorAll('#addWorkExperienceContainer .work-experience-item').forEach(item => {
            const company = item.querySelector('.work-company')?.value || '';
            const position = item.querySelector('.work-position')?.value || '';
            const dates = item.querySelector('.work-dates')?.value || '';
            const salary = item.querySelector('.work-salary')?.value || '';
            const status = item.querySelector('.work-status')?.value || '';
            const years = item.querySelector('.work-years')?.value || '';

            if (company || position || dates) {
                workExperiences.push({
                    company,
                    position,
                    inclusive_dates: dates,
                    monthly_salary: salary,
                    status_of_appointment: status,
                    years_of_experience: years
                });
            }
        });
        formData.work_experience = workExperiences;

        // Collect training seminars
        const trainingSeminars = [];
        document.querySelectorAll('#addTrainingSeminarContainer .training-seminar-item').forEach(item => {
            const title = item.querySelector('.training-title')?.value || '';
            const venue = item.querySelector('.training-venue')?.value || '';
            const dates = item.querySelector('.training-dates')?.value || '';
            const hours = item.querySelector('.training-hours')?.value || '';
            const conductedBy = item.querySelector('.training-conducted')?.value || '';

            if (title || venue || dates) {
                trainingSeminars.push({
                    title,
                    venue,
                    inclusive_dates: dates,
                    number_of_hours: hours,
                    conducted_by: conductedBy
                });
            }
        });
        formData.training_seminars = trainingSeminars;

        // Collect licensure exams
        const licensureExams = [];
        document.querySelectorAll('#addLicensureExamContainer .licensure-exam-item').forEach(item => {
            const title = item.querySelector('.licensure-title')?.value || '';
            const year = item.querySelector('.licensure-year')?.value || '';
            const venue = item.querySelector('.licensure-venue')?.value || '';
            const rating = item.querySelector('.licensure-rating')?.value || '';
            const remarks = item.querySelector('.licensure-remarks')?.value || '';
            const expiry = item.querySelector('.licensure-expiry')?.value || '';

            if (title || year || venue) {
                licensureExams.push({
                    title,
                    year_taken: year,
                    examination_venue: venue,
                    rating,
                    remarks,
                    expiry_date: expiry
                });
            }
        });
        formData.licensure_exams = licensureExams;

        // Collect competency assessments
        const competencyAssessments = [];
        document.querySelectorAll('#addCompetencyAssessmentContainer .competency-assessment-item').forEach(item => {
            const title = item.querySelector('.competency-title')?.value || '';
            const level = item.querySelector('.competency-level')?.value || '';
            const sector = item.querySelector('.competency-sector')?.value || '';
            const certNumber = item.querySelector('.competency-cert')?.value || '';
            const issuance = item.querySelector('.competency-issuance')?.value || '';
            const expiration = item.querySelector('.competency-expiration')?.value || '';

            if (title || level || sector) {
                competencyAssessments.push({
                    title,
                    qualification_level: level,
                    industry_sector: sector,
                    certificate_number: certNumber,
                    date_of_issuance: issuance,
                    expiration_date: expiration
                });
            }
        });
        formData.competency_assessments = competencyAssessments;

        // Handle file uploads (picture and signature)
        const pictureFile = document.getElementById('addPicture')?.files[0];
        const signatureFile = document.getElementById('addSignature')?.files[0];

        if (pictureFile) {
            formData.picture = await fileToBase64(pictureFile);
        }

        if (signatureFile) {
            formData.signature = await fileToBase64(signatureFile);
        }

        // Send to API
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Application added successfully');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addApplicationModal'));
            modal.hide();

            // Reset form
            document.getElementById('addApplicationForm').reset();

            // Reload applications
            await loadApplications();
        } else {
            showError('Failed to add application: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding application:', error);
        showError('Error adding application: ' + (error.message || 'Please check all fields and try again'));
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Function to highlight invalid fields in Add Application modal
function highlightInvalidAddFields(fieldNames) {
    // Remove previous highlights
    document.querySelectorAll('#addApplicationModal .is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

    // Map field names to field IDs
    const fieldMap = {
        'Trainee ID': 'addTraineeId',
        'Reference Number': 'addReferenceNumber',
        'ULI': 'addUli',
        'Surname': 'addSurname',
        'First Name': 'addFirstName',
        'Number & Street': 'addNumberStreet',
        'Barangay': 'addBarangay',
        'District': 'addDistrict',
        'City/Municipality': 'addCity',
        'Province': 'addProvince',
        'Region': 'addRegion',
        'Zip Code': 'addZip',
        'School Name': 'addSchoolName',
        'School Address': 'addSchoolAddress',
        'Assessment Title': 'addAssessmentTitle',
        "Mother's Name": 'addMotherName',
        "Father's Name": 'addFatherName',
        'Age': 'addAge',
        'Birth Date': 'addBirthDate',
        'Birth Place': 'addBirthPlace',
        'Highest Educational Attainment': 'addEducation',
        'Mobile': 'addMobile',
        'Email': 'addEmail'
    };

    fieldNames.forEach(fieldName => {
        const fieldId = fieldMap[fieldName];
        if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('is-invalid');
                // Scroll to first invalid field
                if (fieldNames[0] === fieldName) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
        }
    });

    // Don't remove highlights automatically - user must fix the fields
}


// Dynamic array functions for Add Modal
function addWorkExperienceToAddModal() {
    const container = document.getElementById('addWorkExperienceContainer');
    const count = container.querySelectorAll('.work-experience-item').length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'work-experience-item mb-3';
    newItem.innerHTML = `
        <div class="card" style="background: rgba(255,255,255,0.05);">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-white mb-0">Work Experience ${count}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.work-experience-item').remove()">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Company</label>
                        <input type="text" class="form-control work-company" placeholder="Enter company name">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Position</label>
                        <input type="text" class="form-control work-position" placeholder="Enter position">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Inclusive Dates</label>
                        <input type="text" class="form-control work-dates" placeholder="e.g., Jan 2020 - Dec 2021">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Monthly Salary</label>
                        <input type="text" class="form-control work-salary" placeholder="Enter salary">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Status of Appointment</label>
                        <input type="text" class="form-control work-status" placeholder="e.g., Permanent">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label text-white">Years of Experience</label>
                        <input type="text" class="form-control work-years" placeholder="Enter years">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

function addTrainingSeminarToAddModal() {
    const container = document.getElementById('addTrainingSeminarContainer');
    const count = container.querySelectorAll('.training-seminar-item').length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'training-seminar-item mb-3';
    newItem.innerHTML = `
        <div class="card" style="background: rgba(255,255,255,0.05);">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-white mb-0">Training/Seminar ${count}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.training-seminar-item').remove()">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Title</label>
                        <input type="text" class="form-control training-title" placeholder="Enter training title">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Venue</label>
                        <input type="text" class="form-control training-venue" placeholder="Enter venue">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Inclusive Dates</label>
                        <input type="text" class="form-control training-dates" placeholder="e.g., Jan 1-5, 2021">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Number of Hours</label>
                        <input type="text" class="form-control training-hours" placeholder="Enter hours">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Conducted By</label>
                        <input type="text" class="form-control training-conductor" placeholder="Enter conductor">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

function addLicensureExamToAddModal() {
    const container = document.getElementById('addLicensureExamContainer');
    const count = container.querySelectorAll('.licensure-exam-item').length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'licensure-exam-item mb-3';
    newItem.innerHTML = `
        <div class="card" style="background: rgba(255,255,255,0.05);">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-white mb-0">Licensure Examination ${count}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.licensure-exam-item').remove()">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Title</label>
                        <input type="text" class="form-control licensure-title" placeholder="Enter examination title">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Year Taken</label>
                        <input type="text" class="form-control licensure-year" placeholder="Enter year">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Examination Venue</label>
                        <input type="text" class="form-control licensure-venue" placeholder="Enter venue">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Rating</label>
                        <input type="text" class="form-control licensure-rating" placeholder="Enter rating">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Remarks</label>
                        <input type="text" class="form-control licensure-remarks" placeholder="e.g., Passed">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label text-white">Expiry Date</label>
                        <input type="date" class="form-control licensure-expiry">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

function addCompetencyAssessmentToAddModal() {
    const container = document.getElementById('addCompetencyAssessmentContainer');
    const count = container.querySelectorAll('.competency-assessment-item').length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'competency-assessment-item mb-3';
    newItem.innerHTML = `
        <div class="card" style="background: rgba(255,255,255,0.05);">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-white mb-0">Competency Assessment ${count}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.competency-assessment-item').remove()">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Title</label>
                        <input type="text" class="form-control competency-title" placeholder="Enter assessment title">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-white">Qualification Level</label>
                        <input type="text" class="form-control competency-level" placeholder="e.g., NC II">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Industry Sector</label>
                        <input type="text" class="form-control competency-sector" placeholder="Enter sector">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Certificate Number</label>
                        <input type="text" class="form-control competency-cert" placeholder="Enter certificate number">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label text-white">Date of Issuance</label>
                        <input type="date" class="form-control competency-issued">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label class="form-label text-white">Expiration Date</label>
                        <input type="date" class="form-control competency-expiry">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}
