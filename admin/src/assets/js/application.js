document.addEventListener('DOMContentLoaded', function () {
    loadApplications();
    loadAssessmentTitleDropdowns();
    setupMobileFieldFormatting();
    loadTraineesCache();
    setupAddApplicationTraineeLookup();

    const dateFilter = document.getElementById('applicationDateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function () {
            const selectedDate = this.value;
            filterApplicationsByDate(selectedDate || null);
        });
    }

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

    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEditedApplication);
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteApplication);
    }

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
let assessmentTitleOptions = [];
let traineesCache = [];

function formatMobileNumber(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 4) {
        return digits;
    }

    if (digits.length <= 7) {
        return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }

    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function setupMobileFieldFormatting() {
    ['addMobile', 'editMobile'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || field.dataset.mobileFormatterAttached === 'true') {
            return;
        }

        field.dataset.mobileFormatterAttached = 'true';
        field.maxLength = 13;

        field.addEventListener('input', function () {
            const formattedValue = formatMobileNumber(this.value);
            if (this.value !== formattedValue) {
                this.value = formattedValue;
            }
        });

        field.addEventListener('paste', function () {
            setTimeout(() => {
                this.value = formatMobileNumber(this.value);
            }, 0);
        });

        field.value = formatMobileNumber(field.value);
    });
}

async function loadTraineesCache() {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/trainees`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            traineesCache = result.data;
        }
    } catch (error) {
        console.error('Error loading trainees:', error);
    }
}

function findTraineeByTraineeId(traineeId) {
    const normalizedId = String(traineeId || '').trim().toLowerCase();
    if (!normalizedId) {
        return null;
    }

    return traineesCache.find(trainee =>
        String(trainee.trainee_id || '').trim().toLowerCase() === normalizedId
    ) || null;
}

function populateAddApplicationTraineeDetails(trainee) {
    if (!trainee) {
        return;
    }

    const firstName = trainee.first_name || '';
    const middleName = trainee.middle_name || '';
    const surname = trainee.last_name || '';
    const middleInitial = middleName ? middleName.charAt(0).toUpperCase() : '';

    const addFirstName = document.getElementById('addFirstName');
    const addMiddleName = document.getElementById('addMiddleName');
    const addMiddleInitial = document.getElementById('addMiddleInitial');
    const addSurname = document.getElementById('addSurname');
    const addEmail = document.getElementById('addEmail');

    if (addFirstName) addFirstName.value = firstName;
    if (addMiddleName) addMiddleName.value = middleName;
    if (addMiddleInitial) addMiddleInitial.value = middleInitial;
    if (addSurname) addSurname.value = surname;
    if (addEmail && trainee.email) addEmail.value = trainee.email;
}

function setupAddApplicationTraineeLookup() {
    const traineeIdField = document.getElementById('addTraineeId');
    if (!traineeIdField || traineeIdField.dataset.lookupAttached === 'true') {
        return;
    }

    traineeIdField.dataset.lookupAttached = 'true';

    traineeIdField.addEventListener('change', function () {
        if (this.classList.contains('is-invalid')) {
            this.classList.remove('is-invalid');
        }
    });

    traineeIdField.addEventListener('blur', function () {
        if (this.classList.contains('is-invalid')) {
            this.classList.remove('is-invalid');
        }
    });
}

async function loadAssessmentTitleDropdowns() {
    try {
        assessmentTitleOptions = await fetchCourseTitles();
    } catch (error) {
        console.error('Error loading assessment titles:', error);
        assessmentTitleOptions = [];
    }

    populateAssessmentTitleSelect('addAssessmentTitle');
    populateAssessmentTitleSelect('editAssessmentTitle');
}

async function fetchCourseTitles() {
    const apiResponse = await fetch(`${config.api.baseUrl}/api/v1/courses`);
    const apiResult = await apiResponse.json();

    if (apiResult.success && Array.isArray(apiResult.data) && apiResult.data.length > 0) {
        return normalizeCourseTitles(apiResult.data);
    }

    const fallbackResponse = await fetch(`${window.location.origin}/CAATE-ITRMS/backend/public/CAATE-ITRMS.courses.json`);
    const fallbackData = await fallbackResponse.json();

    if (!Array.isArray(fallbackData) || fallbackData.length === 0) {
        throw new Error(apiResult.message || 'Failed to load courses');
    }

    return normalizeCourseTitles(fallbackData);
}

function normalizeCourseTitles(courses) {
    return courses
        .map(item => item?.title?.trim())
        .filter(Boolean)
        .filter((title, index, array) => array.indexOf(title) === index)
        .sort((a, b) => a.localeCompare(b));
}

function populateAssessmentTitleSelect(selectId, selectedValue = '') {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = selectedValue || select.value || '';
    const options = [...assessmentTitleOptions];

    if (currentValue && !options.includes(currentValue)) {
        options.unshift(currentValue);
    }

    select.innerHTML = '<option value="">Select assessment title</option>';

    options.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.textContent = title;
        select.appendChild(option);
    });

    select.value = currentValue;
}

async function loadApplications() {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/applications`);
        const result = await response.json();

        if (result.success && result.data) {
            allApplications = result.data;

            updateStatistics(allApplications);

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
        const traineeId = app.trainee_id || app.userData?.trainee_id || 'N/A';
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
    const profileImage = app.userData?.profile_image || app.picture;
    const fullName = getFullName(app);
    const initials = getInitials(app);

    if (profileImage) {
        let imageSrc = profileImage;

        if (!profileImage.startsWith('data:image') && !profileImage.startsWith('http')) {
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

        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else if (dateValue.$numberLong) {
            date = new Date(parseInt(dateValue.$numberLong));
        } else if (typeof dateValue === 'string') {
            date = new Date(dateValue);
        } else if (typeof dateValue === 'number') {
            date = new Date(dateValue);
        } else if (dateValue instanceof Date) {
            date = dateValue;
        } else {
            date = new Date(dateValue);
        }

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

function testChangeDetection() {
    const surnameField = document.getElementById('editSurname');
    const originalValue = surnameField.value;
    surnameField.value = originalValue + ' '; // Add a space

    console.log('Test: Added space to surname field');
    console.log('Original:', originalValue);
    console.log('New:', surnameField.value);

    document.getElementById('saveEditBtn').click();
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
    const data = getNormalizedApplicationData(app);

    document.getElementById('viewTraineeId').value = data.traineeId || 'N/A';
    document.getElementById('viewReferenceNumber').value = data.referenceNumber || 'N/A';
    document.getElementById('viewUli').value = data.uli || 'N/A';

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

    document.getElementById('viewSchoolName').textContent = data.schoolName || 'N/A';
    document.getElementById('viewSchoolAddress').textContent = data.schoolAddress || 'N/A';

    document.getElementById('viewAssessmentTitle').textContent = data.assessmentTitle || 'N/A';
    document.getElementById('viewApplicationDate').textContent = formatDate(data.applicationDate);
    document.getElementById('viewAssessmentType').textContent = formatAssessmentType(data.assessmentType);
    document.getElementById('viewClientType').textContent = formatClientType(data.clientType);

    document.getElementById('viewSurname').textContent = data.name.surname || 'N/A';
    document.getElementById('viewFirstName').textContent = data.name.firstName || 'N/A';
    document.getElementById('viewMiddleName').textContent = data.name.middleName || 'N/A';
    document.getElementById('viewMiddleInitial').textContent = data.name.middleInitial || 'N/A';
    document.getElementById('viewSecondName').textContent = data.name.secondName || 'N/A';
    document.getElementById('viewNameExtension').textContent = data.name.nameExtension || 'N/A';

    document.getElementById('viewNumberStreet').textContent = data.address.numberStreet || 'N/A';
    document.getElementById('viewBarangay').textContent = data.address.barangay || 'N/A';
    document.getElementById('viewDistrict').textContent = data.address.district || 'N/A';
    document.getElementById('viewCity').textContent = data.address.city || 'N/A';
    document.getElementById('viewProvince').textContent = data.address.province || 'N/A';
    document.getElementById('viewRegion').textContent = data.address.region || 'N/A';
    document.getElementById('viewZip').textContent = data.address.zip || 'N/A';

    document.getElementById('viewMotherName').textContent = data.motherName || 'N/A';
    document.getElementById('viewFatherName').textContent = data.fatherName || 'N/A';

    document.getElementById('viewSex').textContent = data.sex ? data.sex.charAt(0).toUpperCase() + data.sex.slice(1) : 'N/A';
    document.getElementById('viewCivilStatus').textContent = data.civilStatus ? data.civilStatus.charAt(0).toUpperCase() + data.civilStatus.slice(1) : 'N/A';
    document.getElementById('viewEmploymentStatus').textContent = data.employmentStatus || 'N/A';
    document.getElementById('viewAge').textContent = data.age || 'N/A';
    document.getElementById('viewBirthDate').textContent = data.birthDate || 'N/A';
    document.getElementById('viewBirthPlace').textContent = data.birthPlace || 'N/A';
    document.getElementById('viewEducation').textContent = data.education || 'N/A';

    document.getElementById('viewTel').textContent = data.contact.tel || 'N/A';
    document.getElementById('viewMobile').textContent = data.contact.mobile || 'N/A';
    document.getElementById('viewFax').textContent = data.contact.fax || 'N/A';
    document.getElementById('viewEmail').textContent = data.contact.email || 'N/A';
    document.getElementById('viewOtherContact').textContent = data.contact.otherContact || 'N/A';

    document.getElementById('viewWorkExperience').innerHTML = renderViewSectionItems(
        data.workExperience,
        'No work experience recorded',
        'Work Experience',
        [
            { label: 'Company', key: 'company', columnClass: 'col-md-6' },
            { label: 'Position', key: 'position', columnClass: 'col-md-6' },
            { label: 'Inclusive Dates', key: 'inclusive_dates', columnClass: 'col-md-6' },
            { label: 'Monthly Salary', key: 'monthly_salary', columnClass: 'col-md-6' },
            { label: 'Status of Appointment', key: 'status_of_appointment', columnClass: 'col-md-6' },
            { label: 'Years of Experience', key: 'years_of_experience', columnClass: 'col-md-6' }
        ]
    );

    document.getElementById('viewTrainingSeminars').innerHTML = renderViewSectionItems(
        data.trainingSeminars,
        'No training or seminars recorded',
        'Training/Seminar',
        [
            { label: 'Title', key: 'title', columnClass: 'col-md-6' },
            { label: 'Venue', key: 'venue', columnClass: 'col-md-6' },
            { label: 'Inclusive Dates', key: 'inclusive_dates', columnClass: 'col-md-6' },
            { label: 'Number of Hours', key: 'number_of_hours', columnClass: 'col-md-6' },
            { label: 'Conducted By', key: 'conducted_by', columnClass: 'col-md-6' }
        ]
    );

    document.getElementById('viewLicensureExams').innerHTML = renderViewSectionItems(
        data.licensureExams,
        'No licensure examinations recorded',
        'Licensure Examination',
        [
            { label: 'Title', key: 'title', columnClass: 'col-md-6' },
            { label: 'Year Taken', key: 'year_taken', columnClass: 'col-md-6' },
            { label: 'Examination Venue', key: 'examination_venue', columnClass: 'col-md-6' },
            { label: 'Rating', key: 'rating', columnClass: 'col-md-6' },
            { label: 'Remarks', key: 'remarks', columnClass: 'col-md-6' },
            { label: 'Expiry Date', key: 'expiry_date', columnClass: 'col-md-6' }
        ]
    );

    document.getElementById('viewCompetencyAssessments').innerHTML = renderViewSectionItems(
        data.competencyAssessments,
        'No competency assessments recorded',
        'Competency Assessment',
        [
            { label: 'Title', key: 'title', columnClass: 'col-md-6' },
            { label: 'Qualification Level', key: 'qualification_level', columnClass: 'col-md-6' },
            { label: 'Industry Sector', key: 'industry_sector', columnClass: 'col-md-6' },
            { label: 'Certificate Number', key: 'certificate_number', columnClass: 'col-md-6' },
            { label: 'Date of Issuance', key: 'date_of_issuance', columnClass: 'col-md-6' },
            { label: 'Expiration Date', key: 'expiration_date', columnClass: 'col-md-6' }
        ]
    );

    const statusBadge = getStatusBadge(app.status);
    document.getElementById('viewStatus').innerHTML = statusBadge;
    document.getElementById('viewSubmittedAt').textContent = formatDate(data.submittedAt);
    document.getElementById('viewUpdatedAt').textContent = formatDate(data.updatedAt);

    const modal = new bootstrap.Modal(document.getElementById('viewProfileModal'));
    modal.show();
}

function getApplicationValue(app, keys, defaultValue = '') {
    for (const key of keys) {
        const value = app?.[key];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return defaultValue;
}

function getNestedApplicationValue(source, keys, defaultValue = '') {
    for (const key of keys) {
        const value = source?.[key];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return defaultValue;
}

function getApplicationNameData(app) {
    const name = app?.name || {};
    return {
        surname: getNestedApplicationValue(name, ['surname', 'last_name'], getApplicationValue(app, ['surname', 'last_name'])),
        firstName: getNestedApplicationValue(name, ['first_name', 'firstName'], getApplicationValue(app, ['first_name', 'firstName', 'firstname'])),
        middleName: getNestedApplicationValue(name, ['middle_name', 'middleName'], getApplicationValue(app, ['middle_name', 'middleName'])),
        middleInitial: getNestedApplicationValue(name, ['middle_initial', 'middleInitial'], getApplicationValue(app, ['middle_initial', 'middleInitial'])),
        secondName: getNestedApplicationValue(name, ['second_name', 'secondName', 'secondname'], getApplicationValue(app, ['second_name', 'secondName', 'secondname'])),
        nameExtension: getNestedApplicationValue(name, ['name_extension', 'nameExtension'], getApplicationValue(app, ['name_extension', 'nameExtension']))
    };
}

function getApplicationAddressData(app) {
    const address = app?.mailing_address || {};
    return {
        numberStreet: getNestedApplicationValue(address, ['number_street', 'numberStreet', 'mailingNumber'], getApplicationValue(app, ['number_street', 'numberStreet', 'mailingNumber'])),
        barangay: getNestedApplicationValue(address, ['barangay'], getApplicationValue(app, ['barangay'])),
        district: getNestedApplicationValue(address, ['district'], getApplicationValue(app, ['district'])),
        city: getNestedApplicationValue(address, ['city', 'cityMunicipality'], getApplicationValue(app, ['city', 'cityMunicipality'])),
        province: getNestedApplicationValue(address, ['province'], getApplicationValue(app, ['province'])),
        region: getNestedApplicationValue(address, ['region'], getApplicationValue(app, ['region'])),
        zip: getNestedApplicationValue(address, ['zip'], getApplicationValue(app, ['zip']))
    };
}

function getApplicationContactData(app) {
    const contact = app?.contact || {};
    return {
        tel: getNestedApplicationValue(contact, ['tel'], getApplicationValue(app, ['tel'])),
        mobile: getNestedApplicationValue(contact, ['mobile'], getApplicationValue(app, ['mobile'])),
        fax: getNestedApplicationValue(contact, ['fax'], getApplicationValue(app, ['fax'])),
        email: getNestedApplicationValue(contact, ['email'], getApplicationValue(app, ['email'])),
        otherContact: getNestedApplicationValue(contact, ['other_contact', 'otherContact'], getApplicationValue(app, ['other_contact', 'otherContact']))
    };
}

function getNormalizedApplicationData(app) {
    return {
        traineeId: getApplicationValue(app, ['trainee_id', 'traineeId'], getNestedApplicationValue(app?.userData || {}, ['trainee_id'])),
        referenceNumber: getApplicationValue(app, ['reference_number', 'referenceNumber']),
        uli: getApplicationValue(app, ['uli']),
        schoolName: getApplicationValue(app, ['school_name', 'schoolName']),
        schoolAddress: getApplicationValue(app, ['school_address', 'schoolAddress']),
        assessmentTitle: getApplicationValue(app, ['assessment_title', 'assessmentTitle']),
        applicationDate: getApplicationValue(app, ['application_date', 'applicationDate', 'submitted_at', 'submittedAt']),
        assessmentType: getApplicationValue(app, ['assessment_type', 'assessmentType']),
        clientType: getApplicationValue(app, ['client_type', 'clientType']),
        motherName: getApplicationValue(app, ['mothers_name', 'mothersName', 'motherName']),
        fatherName: getApplicationValue(app, ['fathers_name', 'fathersName', 'fatherName']),
        sex: getApplicationValue(app, ['sex']),
        civilStatus: getApplicationValue(app, ['civil_status', 'civilStatus']),
        employmentStatus: getApplicationValue(app, ['employment_status', 'employmentStatus']),
        age: getApplicationValue(app, ['age']),
        birthDate: getApplicationValue(app, ['birth_date', 'birthDate']),
        birthPlace: getApplicationValue(app, ['birth_place', 'birthPlace']),
        education: getApplicationValue(app, ['education']),
        status: getApplicationValue(app, ['status'], 'pending'),
        submittedAt: getApplicationValue(app, ['submitted_at', 'submittedAt']),
        updatedAt: getApplicationValue(app, ['updated_at', 'updatedAt']),
        workExperience: normalizeApplicationCollection(getApplicationValue(app, ['work_experience', 'workExperience'], [])),
        trainingSeminars: normalizeApplicationCollection(getApplicationValue(app, ['training_seminars', 'trainingSeminars'], [])),
        licensureExams: normalizeApplicationCollection(getApplicationValue(app, ['licensure_exams', 'licensureExams'], [])),
        competencyAssessments: normalizeApplicationCollection(getApplicationValue(app, ['competency_assessments', 'competencyAssessments'], [])),
        name: getApplicationNameData(app),
        address: getApplicationAddressData(app),
        contact: getApplicationContactData(app)
    };
}

function normalizeApplicationCollection(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    return [];
}

function editDetails(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (!app) {
        showError('Application not found');
        return;
    }
    const data = getNormalizedApplicationData(app);

    window.originalApplicationData = {
        reference_number: data.referenceNumber || '',
        trainee_id: data.traineeId || '',
        uli: data.uli || '',
        school_name: data.schoolName || '',
        school_address: data.schoolAddress || '',
        assessment_title: data.assessmentTitle || '',
        application_date: data.applicationDate || '',
        assessment_type: data.assessmentType || '',
        client_type: data.clientType || '',
        surname: data.name.surname || '',
        first_name: data.name.firstName || '',
        middle_name: data.name.middleName || '',
        middle_initial: data.name.middleInitial || '',
        second_name: data.name.secondName || '',
        name_extension: data.name.nameExtension || '',
        number_street: data.address.numberStreet || '',
        barangay: data.address.barangay || '',
        district: data.address.district || '',
        city: data.address.city || '',
        province: data.address.province || '',
        region: data.address.region || '',
        zip: data.address.zip || '',
        mothers_name: data.motherName || '',
        fathers_name: data.fatherName || '',
        sex: data.sex || '',
        civil_status: data.civilStatus || '',
        employment_status: data.employmentStatus || '',
        age: data.age || '',
        birth_date: data.birthDate || '',
        birth_place: data.birthPlace || '',
        education: data.education || '',
        tel: data.contact.tel || '',
        mobile: data.contact.mobile || '',
        fax: data.contact.fax || '',
        email: data.contact.email || '',
        other_contact: data.contact.otherContact || '',
        status: data.status || 'pending',
        work_experience: JSON.stringify(data.workExperience),
        training_seminars: JSON.stringify(data.trainingSeminars),
        licensure_exams: JSON.stringify(data.licensureExams),
        competency_assessments: JSON.stringify(data.competencyAssessments)
    };

    document.getElementById('editApplicationId').value = appId;

    document.getElementById('editTraineeId').value = data.traineeId || '';
    document.getElementById('editReferenceNumber').value = data.referenceNumber || '';
    document.getElementById('editUli').value = data.uli || '';

    document.getElementById('editSchoolName').value = data.schoolName || '';
    document.getElementById('editSchoolAddress').value = data.schoolAddress || '';

    if (!assessmentTitleOptions.length) {
        loadAssessmentTitleDropdowns().finally(() => {
            populateAssessmentTitleSelect('editAssessmentTitle', data.assessmentTitle || '');
        });
    } else {
        populateAssessmentTitleSelect('editAssessmentTitle', data.assessmentTitle || '');
    }
    document.getElementById('editApplicationDate').value = data.applicationDate || '';
    document.getElementById('editAssessmentType').value = data.assessmentType || '';
    document.getElementById('editClientType').value = data.clientType || '';

    document.getElementById('editSurname').value = data.name.surname || '';
    document.getElementById('editFirstName').value = data.name.firstName || '';
    document.getElementById('editMiddleName').value = data.name.middleName || '';
    document.getElementById('editMiddleInitial').value = data.name.middleInitial || '';
    document.getElementById('editSecondName').value = data.name.secondName || '';
    document.getElementById('editNameExtension').value = data.name.nameExtension || '';

    document.getElementById('editNumberStreet').value = data.address.numberStreet || '';
    document.getElementById('editBarangay').value = data.address.barangay || '';
    document.getElementById('editDistrict').value = data.address.district || '';
    document.getElementById('editCity').value = data.address.city || '';
    document.getElementById('editProvince').value = data.address.province || '';
    document.getElementById('editRegion').value = data.address.region || '';
    document.getElementById('editZip').value = data.address.zip || '';

    document.getElementById('editMotherName').value = data.motherName || '';
    document.getElementById('editFatherName').value = data.fatherName || '';

    document.getElementById('editSex').value = data.sex || '';
    document.getElementById('editCivilStatus').value = data.civilStatus || '';
    document.getElementById('editEmploymentStatus').value = data.employmentStatus || '';
    document.getElementById('editAge').value = data.age || '';
    document.getElementById('editBirthDate').value = data.birthDate || '';
    document.getElementById('editBirthPlace').value = data.birthPlace || '';
    document.getElementById('editEducation').value = data.education || '';

    document.getElementById('editTel').value = data.contact.tel || '';
    document.getElementById('editMobile').value = formatMobileNumber(data.contact.mobile || '');
    document.getElementById('editFax').value = data.contact.fax || '';
    document.getElementById('editEmail').value = data.contact.email || '';
    document.getElementById('editOtherContact').value = data.contact.otherContact || '';

    populateWorkExperience(data.workExperience);

    populateTrainingSeminars(data.trainingSeminars);

    populateLicensureExams(data.licensureExams);

    populateCompetencyAssessments(data.competencyAssessments);

    document.getElementById('editStatus').value = data.status || 'pending';
    document.getElementById('editSubmittedAt').value = formatDate(data.submittedAt);
    document.getElementById('editLastUpdated').value = formatDate(data.updatedAt);

    const modal = new bootstrap.Modal(document.getElementById('editDetailsModal'));
    modal.show();
}

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

function getScopedFieldValue(item, fieldName) {
    const field = item.querySelector(`[name="${fieldName}"]`);
    return field ? field.value.trim() : '';
}

function hasAnyValue(values) {
    return values.some(value => value !== '' && value !== null && value !== undefined);
}

function getTrimmedSelectorValue(item, selector) {
    return item.querySelector(selector)?.value?.trim() || '';
}

function renderViewSectionItems(items, emptyMessage, titlePrefix, fields) {
    if (!Array.isArray(items) || items.length === 0) {
        return `<p class="text-white-50">${emptyMessage}</p>`;
    }

    return items.map((item, index) => `
        <div class="card mb-3 view-detail-card">
            <div class="card-body p-3">
                <h6 class="text-white mb-3 view-detail-title">${titlePrefix} ${index + 1}</h6>
                <div class="row">
                    ${fields.map(field => `
                        <div class="${field.columnClass || 'col-md-4'} mb-3 view-detail-item">
                            <div class="view-detail-row">
                                <label class="form-label text-white view-detail-label">${field.label}:</label>
                                <p class="form-control-plaintext text-white view-detail-value">${item?.[field.key] || 'N/A'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

async function saveEditedApplication() {
    const appId = document.getElementById('editApplicationId').value;

    if (!appId) {
        showError('Application ID not found');
        return;
    }

    const validationErrors = validateRequiredFields();

    if (validationErrors.length > 0) {
        const errorMessage = `Please fill in the following required fields:<br>${validationErrors.join('<br>')}`;
        showError(errorMessage);
        highlightInvalidFields(validationErrors);
        return;
    }

    const updatedData = {
        trainee_id: document.getElementById('editTraineeId').value,
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

    const workExperiences = [];
    const workItems = document.querySelectorAll('.work-experience-item');
    workItems.forEach((item) => {
        const rowIndex = item.dataset.index;
        const company = getScopedFieldValue(item, `work_company_${rowIndex}`);
        const position = getScopedFieldValue(item, `work_position_${rowIndex}`);
        const dates = getScopedFieldValue(item, `work_dates_${rowIndex}`);
        const salary = getScopedFieldValue(item, `work_salary_${rowIndex}`);
        const status = getScopedFieldValue(item, `work_status_${rowIndex}`);
        const years = getScopedFieldValue(item, `work_years_${rowIndex}`);

        if (hasAnyValue([company, position, dates, salary, status, years])) {
            workExperiences.push({
                company,
                position,
                inclusive_dates: dates,
                monthly_salary: salary,
                status_of_appointment: status,
                years_of_experience: parseInt(years) || 0
            });
        }
    });
    updatedData.work_experience = workExperiences;

    const trainingSeminars = [];
    const trainingItems = document.querySelectorAll('.training-seminar-item');
    trainingItems.forEach((item) => {
        const rowIndex = item.dataset.index;
        const title = getScopedFieldValue(item, `training_title_${rowIndex}`);
        const venue = getScopedFieldValue(item, `training_venue_${rowIndex}`);
        const dates = getScopedFieldValue(item, `training_dates_${rowIndex}`);
        const hours = getScopedFieldValue(item, `training_hours_${rowIndex}`);
        const conductor = getScopedFieldValue(item, `training_conductor_${rowIndex}`);

        if (hasAnyValue([title, venue, dates, hours, conductor])) {
            trainingSeminars.push({
                title,
                venue,
                inclusive_dates: dates,
                number_of_hours: parseInt(hours) || 0,
                conducted_by: conductor
            });
        }
    });
    updatedData.training_seminars = trainingSeminars;

    const licensureExams = [];
    const examItems = document.querySelectorAll('.licensure-exam-item');
    examItems.forEach((item) => {
        const rowIndex = item.dataset.index;
        const title = getScopedFieldValue(item, `exam_title_${rowIndex}`);
        const year = getScopedFieldValue(item, `exam_year_${rowIndex}`);
        const venue = getScopedFieldValue(item, `exam_venue_${rowIndex}`);
        const rating = getScopedFieldValue(item, `exam_rating_${rowIndex}`);
        const remarks = getScopedFieldValue(item, `exam_remarks_${rowIndex}`);
        const expiry = getScopedFieldValue(item, `exam_expiry_${rowIndex}`);

        if (hasAnyValue([title, year, venue, rating, remarks, expiry])) {
            licensureExams.push({
                title,
                year_taken: year === '' ? null : parseInt(year) || 0,
                examination_venue: venue,
                rating,
                remarks,
                expiry_date: expiry
            });
        }
    });
    updatedData.licensure_exams = licensureExams;

    const competencyAssessments = [];
    const compItems = document.querySelectorAll('.competency-assessment-item');
    compItems.forEach((item) => {
        const rowIndex = item.dataset.index;
        const title = getScopedFieldValue(item, `comp_title_${rowIndex}`);
        const level = getScopedFieldValue(item, `comp_level_${rowIndex}`);
        const sector = getScopedFieldValue(item, `comp_sector_${rowIndex}`);
        const cert = getScopedFieldValue(item, `comp_cert_${rowIndex}`);
        const issue = getScopedFieldValue(item, `comp_issue_${rowIndex}`);
        const expiry = getScopedFieldValue(item, `comp_expiry_${rowIndex}`);

        if (hasAnyValue([title, level, sector, cert, issue, expiry])) {
            competencyAssessments.push({
                title,
                qualification_level: level,
                industry_sector: sector,
                certificate_number: cert,
                date_of_issuance: issue,
                expiration_date: expiry
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

            const modal = bootstrap.Modal.getInstance(document.getElementById('editDetailsModal'));
            if (modal) {
                document.getElementById('saveEditBtn').blur();
                modal.hide();
            }

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

    document.getElementById('deleteApplicationId').value = appId;

    document.getElementById('deleteFullName').textContent = getFullName(app);
    document.getElementById('deleteTraineeId').textContent = app.trainee_id || app.userData?.trainee_id || 'N/A';
    document.getElementById('deleteCourse').textContent = app.assessment_title || 'N/A';
    document.getElementById('deleteApplicationDate').textContent = formatDate(app.application_date || app.submitted_at);

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

            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();

            document.getElementById('deleteConfirmText').value = '';

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
        const traineeId = String(app.trainee_id || app.userData?.trainee_id || '').toLowerCase();
        const matchesSearch = !searchTerm || fullName.includes(searchTerm) || traineeId.includes(searchTerm);

        const matchesStatus = !statusValue || app.status === statusValue;

        const matchesCourse = !courseValue || (app.assessment_title || '').toLowerCase().includes(courseValue.toLowerCase());

        const matchesDate = !dateValue || formatDateForFilter(app.application_date || app.submitted_at) === dateValue;

        return matchesSearch && matchesStatus && matchesCourse && matchesDate;
    });

    renderApplicationsTable(filtered);

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

function showInfo(message) {
    showToast(message, 'info');
}

function showWarning(message) {
    showToast(message, 'warning');
}

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
        { id: 'editSex', name: 'Sex' },
        { id: 'editCivilStatus', name: 'Civil Status' },
        { id: 'editEmploymentStatus', name: 'Employment Status' },
        { id: 'editMobile', name: 'Mobile' },
        { id: 'editEmail', name: 'Email' }
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !element.value.trim()) {
            errors.push(field.name);
        }
    });

    const emailField = document.getElementById('editEmail');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            errors.push('Valid Email address');
        }
    }

    const mobileField = document.getElementById('editMobile');
    if (mobileField && mobileField.value.trim()) {
        const mobileRegex = /^09\d{9}$/;
        if (!mobileRegex.test(mobileField.value.trim().replace(/[^0-9]/g, ''))) {
            errors.push('Valid Mobile number (09XX XXX XXXX)');
        }
    }

    return errors;
}

function highlightInvalidFields(fieldNames) {
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

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
                if (fieldNames[0] === fieldName) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
        }
    });

    setTimeout(() => {
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    }, 5000);
}

document.getElementById('exportCsvBtn')?.addEventListener('click', function () {
    exportToCSV();
});

document.getElementById('exportJsonBtn')?.addEventListener('click', function () {
    exportToJSON();
});

document.getElementById('addApplicationBtn')?.addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('addApplicationModal'));
    modal.show();
    if (!assessmentTitleOptions.length) {
        loadAssessmentTitleDropdowns();
    } else {
        populateAssessmentTitleSelect('addAssessmentTitle');
    }

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

                if (this.type === 'radio') {
                    if (this.name === 'addSex') {
                        document.getElementById('addSexGroup')?.classList.remove('is-invalid');
                    }
                    if (this.name === 'addCivilStatus') {
                        document.getElementById('addCivilStatusGroup')?.classList.remove('is-invalid');
                    }
                    if (this.name === 'addEmploymentStatus') {
                        document.getElementById('addEmploymentStatusGroup')?.classList.remove('is-invalid');
                    }
                }
            });
        });
    }, 100);
});

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
        app.trainee_id || app.userData?.trainee_id || 'N/A',
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
        const errors = [];

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

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) {
                console.error(`Field not found: ${field.id}`);
                errors.push(field.name);
            } else if (!element.value || !element.value.trim()) {
                errors.push(field.name);
            }
        });

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

        const email = document.getElementById('addEmail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            highlightInvalidAddFields(['Email']);
            return;
        }

        const mobile = document.getElementById('addMobile').value.trim().replace(/[^0-9]/g, '');
        const mobileRegex = /^09\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            showError('Please enter a valid mobile number (09XX XXX XXXX)');
            highlightInvalidAddFields(['Mobile']);
            return;
        }

        if (!traineesCache.length) {
            await loadTraineesCache();
        }

        const traineeId = document.getElementById('addTraineeId').value.trim();
        const existingTrainee = findTraineeByTraineeId(traineeId);

        if (existingTrainee) {
            showError(`Trainee ID "${traineeId}" already exists in the trainee database`);
            highlightInvalidAddFields(['Trainee ID']);
            return;
        }

        if (traineeId) {
            const duplicateTrainee = allApplications.find(app =>
                String(app.trainee_id || app.userData?.trainee_id || '').toLowerCase() === traineeId.toLowerCase()
            );

            if (duplicateTrainee) {
                showError(`Trainee ID "${traineeId}" already exists in the system`);
                highlightInvalidAddFields(['Trainee ID']);
                return;
            }
        }

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

        const formData = {
            userId: '',
            traineeId: traineeId,
            trainee_id: traineeId,
            referenceNumber: referenceNumber,
            reference_number: referenceNumber,
            uliNumber: document.getElementById('addUli').value,
            uli: document.getElementById('addUli').value,
            schoolName: document.getElementById('addSchoolName').value,
            school_name: document.getElementById('addSchoolName').value,
            schoolAddress: document.getElementById('addSchoolAddress').value,
            school_address: document.getElementById('addSchoolAddress').value,
            assessmentTitle: document.getElementById('addAssessmentTitle').value,
            assessment_title: document.getElementById('addAssessmentTitle').value,
            applicationDate: document.getElementById('addApplicationDate').value,
            application_date: document.getElementById('addApplicationDate').value,
            assessmentType: document.getElementById('addAssessmentType').value,
            assessment_type: document.getElementById('addAssessmentType').value,
            clientType: document.getElementById('addClientType').value,
            client_type: document.getElementById('addClientType').value,
            surname: document.getElementById('addSurname').value,
            firstName: document.getElementById('addFirstName').value,
            middleName: document.getElementById('addMiddleName').value,
            middleInitial: document.getElementById('addMiddleInitial').value,
            secondname: document.getElementById('addSecondName').value,
            nameExtension: document.getElementById('addNameExtension').value,
            name: {
                surname: document.getElementById('addSurname').value,
                first_name: document.getElementById('addFirstName').value,
                middle_name: document.getElementById('addMiddleName').value,
                middle_initial: document.getElementById('addMiddleInitial').value,
                second_name: document.getElementById('addSecondName').value,
                name_extension: document.getElementById('addNameExtension').value
            },
            numberStreet: document.getElementById('addNumberStreet').value,
            mailing_address: {
                number_street: document.getElementById('addNumberStreet').value,
                barangay: document.getElementById('addBarangay').value,
                district: document.getElementById('addDistrict').value,
                city: document.getElementById('addCity').value,
                province: document.getElementById('addProvince').value,
                region: document.getElementById('addRegion').value,
                zip: document.getElementById('addZip').value
            },
            barangay: document.getElementById('addBarangay').value,
            district: document.getElementById('addDistrict').value,
            city: document.getElementById('addCity').value,
            province: document.getElementById('addProvince').value,
            region: document.getElementById('addRegion').value,
            zip: document.getElementById('addZip').value,
            motherName: document.getElementById('addMotherName').value,
            mothers_name: document.getElementById('addMotherName').value,
            fatherName: document.getElementById('addFatherName').value,
            fathers_name: document.getElementById('addFatherName').value,
            sex: document.querySelector('input[name="addSex"]:checked')?.value || '',
            civilStatus: document.querySelector('input[name="addCivilStatus"]:checked')?.value || '',
            civil_status: document.querySelector('input[name="addCivilStatus"]:checked')?.value || '',
            employmentStatus: document.querySelector('input[name="addEmploymentStatus"]:checked')?.value || '',
            employment_status: document.querySelector('input[name="addEmploymentStatus"]:checked')?.value || '',
            age: parseInt(document.getElementById('addAge').value) || 0,
            birthDate: document.getElementById('addBirthDate').value,
            birth_date: document.getElementById('addBirthDate').value,
            birthPlace: document.getElementById('addBirthPlace').value,
            birth_place: document.getElementById('addBirthPlace').value,
            education: document.getElementById('addEducation').value,
            tel: document.getElementById('addTel').value,
            mobile: document.getElementById('addMobile').value,
            fax: document.getElementById('addFax').value,
            email: document.getElementById('addEmail').value,
            otherContact: document.getElementById('addOtherContact').value,
            contact: {
                tel: document.getElementById('addTel').value,
                mobile: document.getElementById('addMobile').value,
                fax: document.getElementById('addFax').value,
                email: document.getElementById('addEmail').value,
                other_contact: document.getElementById('addOtherContact').value
            },
            status: document.getElementById('addStatus').value,
            submittedAt: new Date().toISOString(),
            submitted_at: new Date().toISOString()
        };

        const workExperiences = [];
        document.querySelectorAll('#addWorkExperienceContainer .work-experience-item').forEach(item => {
            const company = getTrimmedSelectorValue(item, '.work-company');
            const position = getTrimmedSelectorValue(item, '.work-position');
            const dates = getTrimmedSelectorValue(item, '.work-dates');
            const salary = getTrimmedSelectorValue(item, '.work-salary');
            const status = getTrimmedSelectorValue(item, '.work-status');
            const years = getTrimmedSelectorValue(item, '.work-years');

            if (hasAnyValue([company, position, dates, salary, status, years])) {
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

        const trainingSeminars = [];
        document.querySelectorAll('#addTrainingSeminarContainer .training-seminar-item').forEach(item => {
            const title = getTrimmedSelectorValue(item, '.training-title');
            const venue = getTrimmedSelectorValue(item, '.training-venue');
            const dates = getTrimmedSelectorValue(item, '.training-dates');
            const hours = getTrimmedSelectorValue(item, '.training-hours');
            const conductedBy = getTrimmedSelectorValue(item, '.training-conductor');

            if (hasAnyValue([title, venue, dates, hours, conductedBy])) {
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

        const licensureExams = [];
        document.querySelectorAll('#addLicensureExamContainer .licensure-exam-item').forEach(item => {
            const title = getTrimmedSelectorValue(item, '.licensure-title');
            const year = getTrimmedSelectorValue(item, '.licensure-year');
            const venue = getTrimmedSelectorValue(item, '.licensure-venue');
            const rating = getTrimmedSelectorValue(item, '.licensure-rating');
            const remarks = getTrimmedSelectorValue(item, '.licensure-remarks');
            const expiry = getTrimmedSelectorValue(item, '.licensure-expiry');

            if (hasAnyValue([title, year, venue, rating, remarks, expiry])) {
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

        const competencyAssessments = [];
        document.querySelectorAll('#addCompetencyAssessmentContainer .competency-assessment-item').forEach(item => {
            const title = getTrimmedSelectorValue(item, '.competency-title');
            const level = getTrimmedSelectorValue(item, '.competency-level');
            const sector = getTrimmedSelectorValue(item, '.competency-sector');
            const certNumber = getTrimmedSelectorValue(item, '.competency-cert');
            const issuance = getTrimmedSelectorValue(item, '.competency-issued');
            const expiration = getTrimmedSelectorValue(item, '.competency-expiry');

            if (hasAnyValue([title, level, sector, certNumber, issuance, expiration])) {
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

        const pictureFile = document.getElementById('addPicture')?.files[0];
        const signatureFile = document.getElementById('addSignature')?.files[0];

        if (pictureFile) {
            formData.picture = await fileToBase64(pictureFile);
        }

        if (signatureFile) {
            formData.signature = await fileToBase64(signatureFile);
        }

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

            const modal = bootstrap.Modal.getInstance(document.getElementById('addApplicationModal'));
            modal.hide();

            document.getElementById('addApplicationForm').reset();

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

function highlightInvalidAddFields(fieldNames) {
    document.querySelectorAll('#addApplicationModal .is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

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

    const radioGroupMap = {
        'Sex': 'addSexGroup',
        'Civil Status': 'addCivilStatusGroup',
        'Employment Status': 'addEmploymentStatusGroup'
    };

    fieldNames.forEach(fieldName => {
        const radioGroupId = radioGroupMap[fieldName];
        if (radioGroupId) {
            const radioGroup = document.getElementById(radioGroupId);
            if (radioGroup) {
                radioGroup.classList.add('is-invalid');
                if (fieldNames[0] === fieldName) {
                    radioGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }

        const fieldId = fieldMap[fieldName];
        if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('is-invalid');
                if (fieldNames[0] === fieldName) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
        }
    });

}

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
