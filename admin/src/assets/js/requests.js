/* Requests Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Fix passive event listeners for better performance
    if (typeof EventTarget !== 'undefined') {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
            if (passiveEvents.includes(type)) {
                if (typeof options === 'object' && options !== null) {
                    if (!('passive' in options)) {
                        options.passive = true;
                    }
                } else {
                    options = { passive: true, capture: typeof options === 'boolean' ? options : false };
                }
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // Update copyright year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Load appointments from database
    loadAppointments();
    loadStatistics();

    // Service Category and Type Filtering
    const serviceCategories = {
        'skincare': [
            { value: 'facial-treatment', text: 'Facial Treatment' },
            { value: 'skin-care-treatment', text: 'Skin Care Treatment' },
            { value: 'advanced-skin-care', text: 'Advanced Skin Care' },
            { value: 'collagen-treatment', text: 'Collagen Treatment' },
            { value: 'facial-peeling', text: 'Facial Peeling' }
        ],
        'haircare': [
            { value: 'hair-spa-treatment', text: 'Hair Spa Treatment' },
            { value: 'hairloss-treatment', text: 'Hairloss Treatment' }
        ],
        'nailcare': [
            { value: 'nail-care-service', text: 'Nail Care Service' }
        ],
        'bodytreatment': [
            { value: 'body-massage', text: 'Body Massage' }
        ],
        'aesthetic': [
            { value: 'permanent-makeup', text: 'Permanent Makeup' },
            { value: 'eyelash-extension', text: 'Eyelash Extension' },
            { value: 'eyebrow-threading', text: 'Eyebrow Threading' },
            { value: 'eyebrow-microblading', text: 'Eyebrow Microblading' },
            { value: 'aesthetic-consultation', text: 'Aesthetic Consultation' }
        ]
    };

    const filterServiceCategory = document.getElementById('filterServiceCategory');
    const filterServiceType = document.getElementById('filterServiceType');

    if (filterServiceCategory && filterServiceType) {
        // Initialize with all service types on page load
        Object.values(serviceCategories).flat().forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            filterServiceType.appendChild(option);
        });

        // Listen for category changes
        filterServiceCategory.addEventListener('change', function () {
            const selectedCategory = this.value;

            // Clear current service type options
            filterServiceType.innerHTML = '<option value="">All Service Types</option>';

            if (selectedCategory && serviceCategories[selectedCategory]) {
                // Add service types for selected category
                serviceCategories[selectedCategory].forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            } else {
                // Show all service types if no category selected
                Object.values(serviceCategories).flat().forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            }
        });
    }

    // Menu toggle is handled by main.js
});

// Load appointments from database
async function loadAppointments() {
    // Show loader before fetching data
    showTableLoader();

    // Add a timeout fallback
    const timeoutId = setTimeout(() => {
        displayAppointments([]);
    }, 10000); // 10 second timeout

    try {
        const apiUrl = '/CAATE-ITRMS/backend/public/api/v1/appointments';

        const response = await fetch(apiUrl);
        clearTimeout(timeoutId); // Clear timeout if request completes

        const result = await response.json();

        if (result.success && result.data) {
            displayAppointments(result.data);
        } else {
            displayAppointments([]);
        }
    } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        console.error('Error loading appointments:', error);
        displayAppointments([]);
    }
}

// Show loader in table
function showTableLoader() {
    const tbody = document.querySelector('.table-border-bottom-0');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr id="tableLoader">
            <td colspan="7" class="text-center" style="padding: 60px 20px;">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading appointments data...</p>
            </td>
        </tr>
    `;
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments/statistics');
        const result = await response.json();

        if (result.success && result.data) {
            updateStatistics(result.data);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Update statistics cards
function updateStatistics(stats) {
    const statsCards = document.querySelectorAll('.card-body h3');
    if (statsCards.length >= 4) {
        statsCards[0].textContent = stats.total || 0;
        statsCards[1].textContent = stats.confirmed || 0;
        statsCards[2].textContent = stats.pending || 0;
        statsCards[3].textContent = stats.cancelled || 0;
    }
}

// Display appointments in table
function displayAppointments(appointments) {
    const tbody = document.querySelector('.table-border-bottom-0');
    if (!tbody) return;

    // Hide loader
    const loader = document.getElementById('tableLoader');
    if (loader) {
        loader.remove();
    }

    // Clear existing rows
    tbody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-calendar-x" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No appointments found</h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">The appointments database collection is empty or no items match your filters.</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7;">Try adjusting your filters or wait for new appointment requests.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    appointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        tbody.appendChild(row);
    });
}

// Create appointment row
function createAppointmentRow(appointment) {
    const tr = document.createElement('tr');

    // Get initials for avatar
    const firstName = appointment.firstName || '';
    const lastName = appointment.lastName || '';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'NA';

    // Full name
    const fullName = [
        appointment.firstName,
        appointment.secondName,
        appointment.middleName,
        appointment.lastName,
        appointment.suffix
    ].filter(Boolean).join(' ');

    // Format service category
    const serviceCategory = formatServiceCategory(appointment.serviceCategory);
    const serviceType = formatServiceType(appointment.serviceType);

    // Format date and time
    const dateTime = formatDateTime(appointment.preferredDate, appointment.preferredTime);

    // Status badge
    const statusBadge = getStatusBadge(appointment.status);

    tr.innerHTML = `
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar avatar-sm me-3"
                    style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                    ${initials}
                </div>
                <strong>${fullName}</strong>
            </div>
        </td>
        <td>${appointment.email || 'N/A'}</td>
        <td>${appointment.contactNumber || 'N/A'}</td>
        <td>
            <strong>${serviceCategory}</strong><br>
            <small class="text-muted">${serviceType}</small>
        </td>
        <td>${dateTime}</td>
        <td>${statusBadge}</td>
        <td>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bx bx-refresh"></i> Change Status
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" style="color: #28a745 !important;"
                            href="javascript:void(0);" onclick="updateStatus('${appointment._id}', 'Approved')"><i
                                class="bx bx-check-circle me-2"
                                style="color: #28a745 !important;"></i>Approve</a>
                    </li>
                    <li><a class="dropdown-item" style="color: #ffc107 !important;"
                            href="javascript:void(0);" onclick="updateStatus('${appointment._id}', 'Pending')"><i
                                class="bx bx-time-five me-2"
                                style="color: #ffc107 !important;"></i>Pending</a>
                    </li>
                    <li><a class="dropdown-item text-danger"
                            href="javascript:void(0);" onclick="updateStatus('${appointment._id}', 'Cancelled')"><i
                                class="bx bx-block me-2"></i>Cancelled</a>
                    </li>
                </ul>
                <button type="button" class="btn btn-sm dropdown-toggle-split"
                    data-bs-toggle="dropdown" aria-expanded="false"
                    style="background: none; border: none; color: white;">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="javascript:void(0);"
                            onclick="viewDetails('${appointment._id}')"><i
                                class="bx bx-show me-2"></i>View Details</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0);"
                            onclick="editDetails('${appointment._id}')"><i
                                class="bx bx-edit me-2"></i>Edit Details</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0);"
                            onclick="deleteAppointment('${appointment._id}')"><i
                                class="bx bx-trash me-2"></i>Delete Record</a>
                    </li>
                </ul>
            </div>
        </td>
    `;

    return tr;
}

// Helper functions
function formatServiceCategory(category) {
    const categories = {
        'skincare': 'Skin Care',
        'haircare': 'Hair Care',
        'nailcare': 'Nail Care',
        'bodytreatment': 'Body Treatment',
        'aesthetic': 'Aesthetic Services'
    };
    return categories[category] || category;
}

function formatServiceType(type) {
    if (!type) return 'N/A';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatDateTime(date, time) {
    if (!date || !time) {
        return '<span class="text-muted">Not set</span>';
    }

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    return `<strong>${formattedDate}</strong><br><small class="text-muted">${formattedTime}</small>`;
}

function getStatusBadge(status) {
    const badges = {
        'Approved': '<span class="badge bg-success">Approved</span>',
        'Pending': '<span class="badge bg-warning">Pending</span>',
        'Cancelled': '<span class="badge bg-danger">Cancelled</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

// Update appointment status
async function updateStatus(id, status) {
    try {
        const response = await fetch(`/CAATE-ITRMS/backend/public/api/v1/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (result.success) {
            // Reload appointments
            loadAppointments();
            loadStatistics();
        } else {
            alert('Failed to update status: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
    }
}

// Delete appointment
async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) {
        return;
    }

    try {
        const response = await fetch(`/CAATE-ITRMS/backend/public/api/v1/appointments/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Reload appointments
            loadAppointments();
            loadStatistics();
        } else {
            alert('Failed to delete appointment: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
    }
}

// View details (placeholder)
function viewDetails(id) {
    // Implement view details modal
}

// Edit details (placeholder)
function editDetails(id) {
    // Implement edit details modal
}


// Delete confirmation functionality
const deleteConfirmInput = document.getElementById('deleteConfirmInput');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

if (deleteConfirmInput && confirmDeleteBtn) {
    deleteConfirmInput.addEventListener('input', function () {
        if (this.value === 'DELETE') {
            confirmDeleteBtn.disabled = false;
        } else {
            confirmDeleteBtn.disabled = true;
        }
    });

    // Reset input when modal is closed
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('hidden.bs.modal', function () {
            deleteConfirmInput.value = '';
            confirmDeleteBtn.disabled = true;
        });
    }

    // Handle delete confirmation
    confirmDeleteBtn.addEventListener('click', function () {
        // Add your delete logic here
        alert('Record deleted successfully!');
        // Close modal
        const modal = bootstrap.Modal.getInstance(deleteModal);
        modal.hide();
    });
}
