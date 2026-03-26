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
        searchInput.addEventListener('input', applyFilters);
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
                <td colspan="6" class="text-center py-4">
                    <i class="bx bx-info-circle" style="font-size: 3rem; color: #8592a3;"></i>
                    <p class="mt-2 text-muted">No applications found</p>
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
                <td colspan="6" class="text-center py-4">
                    <i class="bx bx-info-circle" style="font-size: 3rem; color: #8592a3;"></i>
                    <p class="mt-2 text-muted">No applications found</p>
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
            alert(`Application status changed to ${newStatus}`);
        } else {
            alert('Failed to update status: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
}

function viewDetails(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (app) {
        // TODO: Implement view details modal
        alert('View details functionality - to be implemented');
    }
}

function editDetails(appId) {
    const app = allApplications.find(a => (a._id?.$oid || a._id) === appId);
    if (app) {
        // TODO: Implement edit details modal
        alert('Edit details functionality - to be implemented');
    }
}

function deleteApplication(appId) {
    if (confirm('Are you sure you want to delete this application?')) {
        // TODO: Implement delete functionality
        alert('Delete functionality - to be implemented');
    }
}

function applyFilters() {
    const searchInput = document.querySelector('input[placeholder="Name or Trainee ID"]');
    const statusFilter = document.querySelector('select[class*="form-select"]');
    const courseFilter = document.querySelectorAll('select[class*="form-select"]')[1];
    const dateFilter = document.getElementById('applicationDateFilter');

    const searchTerm = searchInput?.value.toLowerCase() || '';
    const statusValue = statusFilter?.value || '';
    const courseValue = courseFilter?.value || '';
    const dateValue = dateFilter?.value || '';

    const filtered = allApplications.filter(app => {
        const fullName = getFullName(app).toLowerCase();
        const traineeId = (app.userData?.trainee_id || '').toLowerCase();
        const matchesSearch = !searchTerm || fullName.includes(searchTerm) || traineeId.includes(searchTerm);

        const matchesStatus = !statusValue || app.status === statusValue;

        const matchesCourse = !courseValue || (app.assessment_title || '').toLowerCase().includes(courseValue.toLowerCase());

        const matchesDate = !dateValue || formatDateForFilter(app.application_date || app.submitted_at) === dateValue;

        return matchesSearch && matchesStatus && matchesCourse && matchesDate;
    });

    renderApplicationsTable(filtered);
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
