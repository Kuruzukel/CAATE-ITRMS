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

function formatDate(dateValue) {
    if (!dateValue) return 'N/A';

    try {
        let date;
        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else {
            date = new Date(dateValue);
        }

        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'N/A';
    }
}

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

    // Personal Information
    document.getElementById('viewFullName').textContent = getFullName(app);
    document.getElementById('viewTraineeId').textContent = app.userData?.trainee_id || 'N/A';
    document.getElementById('viewEmail').textContent = app.contact?.email || app.userData?.email || 'N/A';
    document.getElementById('viewMobile').textContent = app.contact?.mobile || app.userData?.contact_no || 'N/A';
    document.getElementById('viewTel').textContent = app.contact?.tel || 'N/A';

    // Assessment Information
    document.getElementById('viewAssessmentTitle').textContent = app.assessment_title || 'N/A';
    document.getElementById('viewSchoolName').textContent = app.school_name || 'N/A';
    document.getElementById('viewApplicationDate').textContent = formatDate(app.application_date || app.submitted_at);
    document.getElementById('viewAssessmentType').textContent = app.assessment_type || 'N/A';
    document.getElementById('viewClientType').textContent = app.client_type || 'N/A';

    // Address
    const address = app.mailing_address || {};
    const fullAddress = [
        address.number_street,
        address.barangay,
        address.city,
        address.province,
        address.region
    ].filter(Boolean).join(', ') || 'N/A';
    document.getElementById('viewAddress').textContent = fullAddress;

    // Personal Details
    document.getElementById('viewSex').textContent = app.sex ? app.sex.charAt(0).toUpperCase() + app.sex.slice(1) : 'N/A';
    document.getElementById('viewAge').textContent = app.age || 'N/A';
    document.getElementById('viewCivilStatus').textContent = app.civil_status ? app.civil_status.charAt(0).toUpperCase() + app.civil_status.slice(1) : 'N/A';
    document.getElementById('viewBirthDate').textContent = app.birth_date || 'N/A';
    document.getElementById('viewBirthPlace').textContent = app.birth_place || 'N/A';
    document.getElementById('viewEducation').textContent = app.education || 'N/A';
    document.getElementById('viewEmploymentStatus').textContent = app.employment_status || 'N/A';

    // Parent Information
    document.getElementById('viewMotherName').textContent = app.mothers_name || 'N/A';
    document.getElementById('viewFatherName').textContent = app.fathers_name || 'N/A';

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

    // Store original data for comparison
    window.originalApplicationData = JSON.parse(JSON.stringify(app));

    // Store application ID
    document.getElementById('editApplicationId').value = appId;

    // Personal Information
    document.getElementById('editFirstName').value = app.name?.first_name || '';
    document.getElementById('editMiddleName').value = app.name?.middle_name || '';
    document.getElementById('editLastName').value = app.name?.surname || '';

    // Optional name fields (only set if elements exist)
    const secondNameEl = document.getElementById('editSecondName');
    if (secondNameEl) secondNameEl.value = app.name?.second_name || '';

    const middleInitialEl = document.getElementById('editMiddleInitial');
    if (middleInitialEl) middleInitialEl.value = app.name?.middle_initial || '';

    const nameExtensionEl = document.getElementById('editNameExtension');
    if (nameExtensionEl) nameExtensionEl.value = app.name?.name_extension || '';

    document.getElementById('editEmail').value = app.contact?.email || '';
    document.getElementById('editMobile').value = app.contact?.mobile || '';
    document.getElementById('editTel').value = app.contact?.tel || '';

    // Assessment Information
    document.getElementById('editAssessmentTitle').value = app.assessment_title || '';
    document.getElementById('editSchoolName').value = app.school_name || '';
    document.getElementById('editApplicationDate').value = app.application_date || '';
    document.getElementById('editAssessmentType').value = app.assessment_type || '';

    // Address
    const address = app.mailing_address || {};
    document.getElementById('editStreet').value = address.number_street || '';
    document.getElementById('editBarangay').value = address.barangay || '';
    document.getElementById('editCity').value = address.city || '';
    document.getElementById('editProvince').value = address.province || '';
    document.getElementById('editRegion').value = address.region || '';

    // Personal Details
    document.getElementById('editSex').value = app.sex || '';
    document.getElementById('editAge').value = app.age || '';
    document.getElementById('editCivilStatus').value = app.civil_status || '';
    document.getElementById('editBirthDate').value = app.birth_date || '';
    document.getElementById('editEducation').value = app.education || '';
    document.getElementById('editEmploymentStatus').value = app.employment_status || '';

    // Parent Information
    document.getElementById('editMotherName').value = app.mothers_name || '';
    document.getElementById('editFatherName').value = app.fathers_name || '';

    // Additional fields
    document.getElementById('editBirthPlace').value = app.birth_place || '';
    document.getElementById('editClientType').value = app.client_type || '';
    document.getElementById('editFax').value = app.contact?.fax || '';
    document.getElementById('editOtherContact').value = app.contact?.other_contact || '';
    document.getElementById('editReferenceNumber').value = app.reference_number || '';
    document.getElementById('editUli').value = app.uli || '';
    document.getElementById('editSchoolAddress').value = app.school_address || '';
    document.getElementById('editDistrict').value = address.district || '';
    document.getElementById('editZip').value = address.zip || '';

    // Status
    document.getElementById('editStatus').value = app.status || 'pending';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editDetailsModal'));
    modal.show();
}

async function saveEditedApplication() {
    const appId = document.getElementById('editApplicationId').value;

    if (!appId) {
        showError('Application ID not found');
        return;
    }

    // Collect updated data
    const updatedData = {
        name: {
            first_name: document.getElementById('editFirstName').value,
            middle_name: document.getElementById('editMiddleName').value,
            surname: document.getElementById('editLastName').value
        },
        contact: {
            email: document.getElementById('editEmail').value,
            mobile: document.getElementById('editMobile').value,
            tel: document.getElementById('editTel').value
        },
        assessment_title: document.getElementById('editAssessmentTitle').value,
        school_name: document.getElementById('editSchoolName').value,
        application_date: document.getElementById('editApplicationDate').value,
        assessment_type: document.getElementById('editAssessmentType').value,
        mailing_address: {
            number_street: document.getElementById('editStreet').value,
            barangay: document.getElementById('editBarangay').value,
            city: document.getElementById('editCity').value,
            province: document.getElementById('editProvince').value,
            region: document.getElementById('editRegion').value
        },
        sex: document.getElementById('editSex').value,
        age: parseInt(document.getElementById('editAge').value) || null,
        civil_status: document.getElementById('editCivilStatus').value,
        birth_date: document.getElementById('editBirthDate').value,
        birth_place: document.getElementById('editBirthPlace').value,
        education: document.getElementById('editEducation').value,
        employment_status: document.getElementById('editEmploymentStatus').value,
        mothers_name: document.getElementById('editMotherName').value,
        fathers_name: document.getElementById('editFatherName').value,
        client_type: document.getElementById('editClientType').value,
        reference_number: document.getElementById('editReferenceNumber').value,
        uli: document.getElementById('editUli').value,
        school_address: document.getElementById('editSchoolAddress').value,
        status: document.getElementById('editStatus').value
    };

    // Add optional name fields if they exist
    const secondNameEl = document.getElementById('editSecondName');
    if (secondNameEl) updatedData.name.second_name = secondNameEl.value;

    const middleInitialEl = document.getElementById('editMiddleInitial');
    if (middleInitialEl) updatedData.name.middle_initial = middleInitialEl.value;

    const nameExtensionEl = document.getElementById('editNameExtension');
    if (nameExtensionEl) updatedData.name.name_extension = nameExtensionEl.value;

    // Add fax and other_contact to contact object
    updatedData.contact.fax = document.getElementById('editFax').value;
    updatedData.contact.other_contact = document.getElementById('editOtherContact').value;

    // Add district and zip to mailing_address
    updatedData.mailing_address.district = document.getElementById('editDistrict').value;
    updatedData.mailing_address.zip = document.getElementById('editZip').value;

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications/${appId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Application updated successfully');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editDetailsModal'));
            modal.hide();

            // Reload applications
            await loadApplications();
        } else {
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
