document.addEventListener('DOMContentLoaded', function () {
    loadAdmissions();
    loadCoursesForFilter(); // Load courses for filter dropdown

    const dateFilter = document.getElementById('admissionDateFilter');
    const searchInput = document.getElementById('admissionSearchInput');
    const statusFilter = document.getElementById('admissionStatusFilter');
    const courseFilter = document.getElementById('admissionCourseFilter');
    const resetBtn = document.getElementById('admissionResetBtn');

    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (courseFilter) {
        courseFilter.addEventListener('change', applyFilters);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';
            if (courseFilter) courseFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            loadAdmissions();
        });
    }

    // Add event listener for save edit button
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function () {
            const admissionId = document.getElementById('editAdmissionId').value;
            if (admissionId) {
                saveEditedAdmission(admissionId);
            }
        });
    }
});

let allAdmissions = [];

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

async function loadAdmissions() {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admissions`);
        const result = await response.json();

        if (result.success && result.data) {
            // Store data immediately first
            allAdmissions = result.data;
            console.log('Loaded admissions (before enrichment):', allAdmissions.length);

            // Then enrich with trainee data
            allAdmissions = await enrichAdmissionsWithTraineeData(result.data);
            console.log('Loaded admissions (after enrichment):', allAdmissions.length);
            console.log('Sample admission:', allAdmissions[0]);

            updateStatistics(allAdmissions);
            renderAdmissionsTable(allAdmissions);
        } else {
            console.error('Failed to load admissions:', result.message);
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading admissions:', error);
        showEmptyState();
    }
}

// Load courses for filter dropdown
async function loadCoursesForFilter() {
    const dropdown = document.getElementById('admissionCourseFilter');

    if (!dropdown) {
        return;
    }

    try {
        const apiUrl = `${config.api.baseUrl}/api/v1/courses`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
            // Keep the "All Courses" option
            dropdown.innerHTML = '<option value="">All Courses</option>';

            if (result.data.length > 0) {
                result.data.forEach((course) => {
                    const courseTitle = course.title || course.name || '';
                    if (courseTitle) {
                        const option = document.createElement('option');
                        option.value = courseTitle;
                        option.textContent = courseTitle;
                        dropdown.appendChild(option);
                    }
                });
            }

            dropdown.disabled = false;
        }
    } catch (error) {
        console.error('Error loading courses for filter:', error);
        // Keep the default "All Courses" option on error
    }
}

async function enrichAdmissionsWithTraineeData(admissions) {
    const enrichedAdmissions = await Promise.all(
        admissions.map(async (adm) => {
            // If trainee_id exists, fetch trainee details
            if (adm.trainee_id) {
                try {
                    const traineeResponse = await fetch(`${config.api.baseUrl}/api/v1/trainees/${adm.trainee_id}`);
                    const traineeResult = await traineeResponse.json();

                    if (traineeResult.success && traineeResult.data) {
                        // Add trainee data to admission object
                        return {
                            ...adm,
                            traineeData: traineeResult.data
                        };
                    }
                } catch (error) {
                    console.warn(`Failed to fetch trainee data for ${adm.trainee_id}:`, error);
                }
            }
            return adm;
        })
    );

    return enrichedAdmissions;
}

function updateStatistics(admissions) {
    const total = admissions.length;
    const approved = admissions.filter(adm => adm.status === 'approved').length;
    const pending = admissions.filter(adm => adm.status === 'pending').length;
    const cancelled = admissions.filter(adm => adm.status === 'cancelled').length;

    const cards = document.querySelectorAll('.card-body h3');
    if (cards[0]) cards[0].textContent = total;
    if (cards[1]) cards[1].textContent = approved;
    if (cards[2]) cards[2].textContent = pending;
    if (cards[3]) cards[3].textContent = cancelled;
}

function renderAdmissionsTable(admissions) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    if (admissions.length === 0) {
        showEmptyState();
        return;
    }

    tbody.innerHTML = admissions.map(adm => {
        const fullName = getFullName(adm);
        const traineeId = adm.trainee_id || adm.userData?.trainee_id || 'N/A';
        const course = adm.assessment_applied || adm.assessmentApplied || adm.course || adm.assessment_title || adm.assessmentTitle || 'N/A';
        const date = formatDate(adm.submitted_at || adm.admission_date || adm.created_at);
        const status = adm.status || 'pending';
        const statusBadge = getStatusBadge(status);
        const avatar = getAvatarHtml(adm);
        const admId = adm._id?.$oid || adm._id;

        return `
            <tr data-adm-id="${admId}">
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
                                href="javascript:void(0);" onclick="changeStatus('${admId}', 'approved')">
                                <i class="bx bx-check-circle me-2" style="color: #10b981 !important;"></i>Approved</a>
                            </li>
                            <li><a class="dropdown-item" style="color: #ffc107 !important;" 
                                href="javascript:void(0);" onclick="changeStatus('${admId}', 'pending')">
                                <i class="bx bx-time-five me-2" style="color: #ffc107 !important;"></i>Pending</a>
                            </li>
                            <li><a class="dropdown-item text-danger" 
                                href="javascript:void(0);" onclick="changeStatus('${admId}', 'cancelled')">
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
                                onclick="viewDetails('${admId}')">
                                <i class="bx bx-show me-2"></i>View Details</a>
                            </li>
                            <li><a class="dropdown-item" href="javascript:void(0);" 
                                onclick="editDetails('${admId}')">
                                <i class="bx bx-edit me-2"></i>Edit Details</a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="javascript:void(0);" 
                                onclick="deleteAdmission('${admId}')">
                                <i class="bx bx-trash me-2"></i>Delete Record</a>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getFullName(adm) {
    // Check for trainee data from trainees collection
    if (adm.traineeData) {
        const parts = [
            adm.traineeData.first_name,
            adm.traineeData.middle_name,
            adm.traineeData.last_name,
            adm.traineeData.second_name,
            adm.traineeData.suffix
        ].filter(Boolean);

        if (parts.length > 0) {
            return parts.join(' ');
        }
    }

    // Check for applicant_name (from admissions collection)
    if (adm.applicant_name) {
        return adm.applicant_name;
    }

    if (adm.name) {
        const parts = [
            adm.name.first_name || adm.name.firstName,
            adm.name.middle_name || adm.name.middleName,
            adm.name.surname || adm.name.last_name
        ].filter(Boolean);
        return parts.join(' ') || 'Unknown';
    }
    if (adm.full_name) {
        return adm.full_name;
    }
    return 'Unknown';
}

function getAvatarHtml(adm) {
    // Get profile image from traineeData (trainees collection) first
    const profileImage = adm.traineeData?.profile_image || adm.userData?.profile_image || adm.picture || adm.profile_image;
    const fullName = getFullName(adm);
    const initials = getInitials(adm);

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

function getInitials(adm) {
    const fullName = getFullName(adm);
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
                            No admission records available
                        </h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">
                            There are currently no admissions to review.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}

async function changeStatus(admId, newStatus) {
    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admissions/${admId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (result.success) {
            await loadAdmissions();
            showSuccess('Status updated successfully');
        } else {
            showError('Failed to update status: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showError('Error updating status');
    }
}

function viewDetails(admId) {
    console.log('View details for admission:', admId);
    // TODO: Implement view details modal
}

function editDetails(admId) {
    const adm = allAdmissions.find(a => (a._id?.$oid || a._id) === admId);
    if (!adm) {
        showError('Admission not found');
        return;
    }

    // Load courses for the dropdown
    loadCoursesForEditModal();

    // Populate the edit modal with admission data
    populateEditModal(adm);

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editDetailsModal'));
    editModal.show();
}

// Load courses for edit modal dropdown
async function loadCoursesForEditModal() {
    const dropdown = document.getElementById('editAssessmentApplied');

    if (!dropdown) {
        return;
    }

    try {
        const apiUrl = `${config.api.baseUrl}/api/v1/courses`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
            dropdown.innerHTML = '<option value="">Select an assessment...</option>';

            if (result.data.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No courses available';
                option.disabled = true;
                dropdown.appendChild(option);
            } else {
                result.data.forEach((course) => {
                    const courseTitle = course.title || course.name || '';
                    if (courseTitle) {
                        const option = document.createElement('option');
                        option.value = courseTitle;
                        option.textContent = courseTitle;
                        dropdown.appendChild(option);
                    }
                });
            }

            dropdown.disabled = false;
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Function to populate edit modal with admission data
function populateEditModal(admission) {
    // Store admission ID
    document.getElementById('editAdmissionId').value = admission._id?.$oid || admission._id;

    // Store original data for change detection
    window.originalAdmissionData = JSON.parse(JSON.stringify(admission));

    // Trainee ID - handle both traineeId and trainee_id (readonly field)
    const traineeId = admission.traineeId || admission.trainee_id || '';
    document.getElementById('editTraineeId').value = traineeId;

    // Reference Number - handle both referenceNumber and reference_number
    const referenceNumber = admission.referenceNumber || admission.reference_number || '';
    document.getElementById('editReferenceNumber').value = referenceNumber;

    // Applicant Information - handle both camelCase and snake_case
    document.getElementById('editApplicantName').value = admission.applicantName || admission.applicant_name || '';
    document.getElementById('editTelNumber').value = admission.telNumber || admission.tel_number || '';
    document.getElementById('editAssessmentApplied').value = admission.assessmentApplied || admission.assessment_applied || '';
    document.getElementById('editOrNumber').value = admission.orNumber || admission.or_number || '';
    document.getElementById('editDateIssued').value = admission.dateIssued || admission.date_issued || '';

    // Processing Officer Section - handle both camelCase and snake_case
    document.getElementById('editAssessmentCenter').value = admission.assessmentCenter || admission.assessment_center || '';

    // Submitted Requirements - handle both camelCase and snake_case
    const submittedReqs = admission.submittedRequirements || admission.submitted_requirements || [];
    document.getElementById('editReq1').checked = submittedReqs.includes('Accomplished Self-Assessment Guide');
    document.getElementById('editReq2').checked = submittedReqs.includes('Three (3) pieces colored passport size pictures');

    // Remarks
    const remarks = admission.remarks || [];
    document.getElementById('editRemark1').checked = remarks.includes('Bring own Personal Protective Equipment');
    document.getElementById('editRemark2').checked = remarks.includes('Others. Pls. specify');

    // Assessment Date and Time - handle both camelCase and snake_case
    document.getElementById('editAssessmentDate').value = admission.assessmentDate || admission.assessment_date || '';
    document.getElementById('editAssessmentTime').value = admission.assessmentTime || admission.assessment_time || '';

    // Signatures - Printed Names and Dates - handle both camelCase and snake_case
    document.getElementById('editProcessingOfficerPrintedName').value =
        admission.processingOfficerPrintedName || admission.processing_officer_printed_name || '';
    document.getElementById('editProcessingOfficerDate').value =
        admission.processingOfficerDate || admission.processing_officer_date || '';
    document.getElementById('editApplicantPrintedName').value =
        admission.applicantPrintedName || admission.applicant_printed_name || '';
    document.getElementById('editApplicantDate').value =
        admission.applicantDate || admission.applicant_date || '';

    // Status
    document.getElementById('editStatus').value = admission.status || 'pending';

    // Submitted At - handle both camelCase and snake_case
    const submittedAt = admission.submittedAt || admission.submitted_at || admission.created_at;
    document.getElementById('editSubmittedAt').value = formatDateForDisplay(submittedAt);
}

// Function to format date for display
function formatDateForDisplay(dateValue) {
    if (!dateValue) return 'N/A';

    try {
        let date;
        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else if (dateValue.$numberLong) {
            date = new Date(parseInt(dateValue.$numberLong));
        } else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'N/A';
    }
}

async function saveEditedAdmission(admId) {
    const admissionId = document.getElementById('editAdmissionId').value || admId;

    if (!admissionId) {
        showError('Admission ID not found');
        return;
    }

    // Collect edited data
    const editedData = {
        trainee_id: document.getElementById('editTraineeId').value || '',
        reference_number: document.getElementById('editReferenceNumber').value || '',
        applicant_name: document.getElementById('editApplicantName').value || '',
        tel_number: document.getElementById('editTelNumber').value || '',
        assessment_applied: document.getElementById('editAssessmentApplied').value || '',
        or_number: document.getElementById('editOrNumber').value || '',
        date_issued: document.getElementById('editDateIssued').value || '',
        assessment_center: document.getElementById('editAssessmentCenter').value || '',
        assessment_date: document.getElementById('editAssessmentDate').value || '',
        assessment_time: document.getElementById('editAssessmentTime').value || '',
        processing_officer_printed_name: document.getElementById('editProcessingOfficerPrintedName').value || '',
        processing_officer_date: document.getElementById('editProcessingOfficerDate').value || '',
        applicant_printed_name: document.getElementById('editApplicantPrintedName').value || '',
        applicant_date: document.getElementById('editApplicantDate').value || '',
        status: document.getElementById('editStatus').value || 'pending'
    };

    // Submitted Requirements
    editedData.submitted_requirements = [];
    if (document.getElementById('editReq1').checked) {
        editedData.submitted_requirements.push('Accomplished Self-Assessment Guide');
    }
    if (document.getElementById('editReq2').checked) {
        editedData.submitted_requirements.push('Three (3) pieces colored passport size pictures');
    }

    // Remarks
    editedData.remarks = [];
    if (document.getElementById('editRemark1').checked) {
        editedData.remarks.push('Bring own Personal Protective Equipment');
    }
    if (document.getElementById('editRemark2').checked) {
        editedData.remarks.push('Others. Pls. specify');
    }

    // Handle file uploads for picture
    const pictureInput = document.getElementById('editPicture');
    if (pictureInput && pictureInput.files && pictureInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            editedData.picture = e.target.result;
        };
        reader.readAsDataURL(pictureInput.files[0]);
    }

    // Handle file uploads for signatures
    const processingOfficerSigInput = document.getElementById('editProcessingOfficerSignature');
    if (processingOfficerSigInput && processingOfficerSigInput.files && processingOfficerSigInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            editedData.processing_officer_signature = e.target.result;
        };
        reader.readAsDataURL(processingOfficerSigInput.files[0]);
    }

    const applicantSigInput = document.getElementById('editApplicantSignature');
    if (applicantSigInput && applicantSigInput.files && applicantSigInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            editedData.applicant_signature = e.target.result;
        };
        reader.readAsDataURL(applicantSigInput.files[0]);
    }

    // Change detection
    if (window.originalAdmissionData) {
        let hasChanges = false;
        for (const key in editedData) {
            if (key === 'submitted_requirements' || key === 'remarks') {
                const originalValue = JSON.stringify(window.originalAdmissionData[key] || []);
                const newValue = JSON.stringify(editedData[key] || []);
                if (originalValue !== newValue) {
                    hasChanges = true;
                    break;
                }
            } else {
                const originalValue = String(window.originalAdmissionData[key] || '').trim();
                const newValue = String(editedData[key] || '').trim();
                if (originalValue !== newValue) {
                    hasChanges = true;
                    break;
                }
            }
        }

        if (!hasChanges) {
            showInfo('No changes were made to the admission');
            return;
        }
    }

    // Add updated timestamp
    editedData.updated_at = new Date().toISOString();

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admissions/${admissionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedData)
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Admission updated successfully');

            const modal = bootstrap.Modal.getInstance(document.getElementById('editDetailsModal'));
            if (modal) {
                modal.hide();
            }

            await loadAdmissions();
        } else {
            showError('Failed to update admission: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating admission:', error);
        showError('Failed to update admission: ' + error.message);
    }
}

function formatDateForInput(dateValue) {
    if (!dateValue) return '';

    try {
        let date;
        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else if (dateValue.$numberLong) {
            date = new Date(parseInt(dateValue.$numberLong));
        } else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return '';
    }
}

async function deleteAdmission(admId) {
    if (!confirm('Are you sure you want to delete this admission record?')) {
        return;
    }

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admissions/${admId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            await loadAdmissions();
            showSuccess('Admission record deleted successfully');
        } else {
            showError('Failed to delete admission: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting admission:', error);
        showError('Error deleting admission');
    }
}

function applyFilters() {
    const searchInput = document.getElementById('admissionSearchInput');
    const statusFilter = document.getElementById('admissionStatusFilter');
    const courseFilter = document.getElementById('admissionCourseFilter');
    const dateFilter = document.getElementById('admissionDateFilter');

    const searchTerm = searchInput?.value.toLowerCase().trim() || '';
    const statusValue = statusFilter?.value || '';
    const courseValue = courseFilter?.value || '';
    const dateValue = dateFilter?.value || '';

    const filtered = allAdmissions.filter(adm => {
        const fullName = getFullName(adm).toLowerCase();
        const traineeId = String(adm.trainee_id || adm.traineeData?.trainee_id || '').toLowerCase();
        const matchesSearch = !searchTerm || fullName.includes(searchTerm) || traineeId.includes(searchTerm);

        const matchesStatus = !statusValue || adm.status === statusValue;

        const course = adm.assessment_applied || adm.assessmentApplied || adm.course || adm.assessment_title || adm.assessmentTitle || '';
        const matchesCourse = !courseValue || course.includes(courseValue);

        const matchesDate = !dateValue || formatDateForFilter(adm.submitted_at || adm.admission_date || adm.created_at) === dateValue;

        return matchesSearch && matchesStatus && matchesCourse && matchesDate;
    });

    renderAdmissionsTable(filtered);
}

function formatDateForFilter(dateValue) {
    if (!dateValue) return '';

    try {
        let date;
        if (dateValue.$date) {
            date = new Date(dateValue.$date);
        } else if (dateValue.$numberLong) {
            date = new Date(parseInt(dateValue.$numberLong));
        } else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return '';
    }
}

function filterAdmissionsByDate(dateString) {
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