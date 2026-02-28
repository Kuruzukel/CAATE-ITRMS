/* Requests Page Script */

// Service Category and Type Mapping (Global scope)
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

    // Store appointment data in the row for quick access
    tr.setAttribute('data-appointment', JSON.stringify(appointment));
    tr.setAttribute('data-id', appointment._id);

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
        <td class="status-cell">${statusBadge}</td>
        <td>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bx bx-refresh"></i> Change Status
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" style="color: #28a745 !important;"
                            href="javascript:void(0);" onclick="updateStatus(this, 'Approved')"><i
                                class="bx bx-check-circle me-2"
                                style="color: #28a745 !important;"></i>Approve</a>
                    </li>
                    <li><a class="dropdown-item" style="color: #ffc107 !important;"
                            href="javascript:void(0);" onclick="updateStatus(this, 'Pending')"><i
                                class="bx bx-time-five me-2"
                                style="color: #ffc107 !important;"></i>Pending</a>
                    </li>
                    <li><a class="dropdown-item text-danger"
                            href="javascript:void(0);" onclick="updateStatus(this, 'Cancelled')"><i
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
                            onclick="viewDetails(this)"><i
                                class="bx bx-show me-2"></i>View Details</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0);"
                            onclick="editDetails(this)"><i
                                class="bx bx-edit me-2"></i>Edit Details</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0);"
                            onclick="deleteAppointment(this)"><i
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
async function updateStatus(element, status) {
    const row = element.closest('tr');
    if (!row) {
        showToast('Could not find appointment row', 'error');
        return;
    }

    const id = row.getAttribute('data-id');
    if (!id) {
        showToast('Invalid appointment ID', 'error');
        return;
    }

    // OPTIMISTIC UPDATE: Update UI immediately before API call
    const statusCell = row.querySelector('.status-cell');
    const originalStatusHTML = statusCell ? statusCell.innerHTML : '';

    if (statusCell) {
        statusCell.innerHTML = getStatusBadge(status);
    }

    // Update the stored appointment data immediately
    const appointmentData = JSON.parse(row.getAttribute('data-appointment'));
    const originalStatus = appointmentData.status;
    appointmentData.status = status;
    row.setAttribute('data-appointment', JSON.stringify(appointmentData));

    // Show success toast immediately
    const statusMessages = {
        'Approved': 'Appointment approved successfully!',
        'Pending': 'Appointment status changed to pending',
        'Cancelled': 'Appointment cancelled successfully',
        'Completed': 'Appointment marked as completed'
    };
    showToast(statusMessages[status] || 'Status updated successfully', 'success');

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
            // Update statistics in background
            loadStatistics();
        } else {
            // ROLLBACK: Revert UI changes if API call failed
            if (statusCell) {
                statusCell.innerHTML = originalStatusHTML;
            }
            appointmentData.status = originalStatus;
            row.setAttribute('data-appointment', JSON.stringify(appointmentData));

            showToast('Failed to update status: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        // ROLLBACK: Revert UI changes if API call failed
        if (statusCell) {
            statusCell.innerHTML = originalStatusHTML;
        }
        appointmentData.status = originalStatus;
        row.setAttribute('data-appointment', JSON.stringify(appointmentData));

        console.error('Error updating status:', error);
        showToast('Failed to update status. Please try again.', 'error');
    }
}

// Delete appointment
let currentDeletingAppointmentRow = null;

function deleteAppointment(element) {
    // Get the row from the element
    const row = element.closest('tr');
    if (!row) {
        console.error('Could not find row for delete');
        showToast('Invalid appointment', 'error');
        return;
    }

    // Get appointment data from row
    const appointmentData = row.getAttribute('data-appointment');
    if (!appointmentData) {
        console.error('No appointment data found in row');
        showToast('Invalid appointment data', 'error');
        return;
    }

    try {
        const appointment = JSON.parse(appointmentData);

        // Store the row for later use
        currentDeletingAppointmentRow = row;

        // Build full name for display
        const fullName = [
            appointment.firstName,
            appointment.secondName,
            appointment.middleName,
            appointment.lastName,
            appointment.suffix
        ].filter(Boolean).join(' ');

        document.getElementById('deleteAppointmentName').textContent = fullName;

        // Show delete confirmation modal
        const modal = new bootstrap.Modal(document.getElementById('deleteAppointmentModal'));
        modal.show();
    } catch (error) {
        console.error('Error parsing appointment data:', error);
        showToast('Failed to load appointment details', 'error');
    }
}

// Confirm delete appointment
async function confirmDeleteAppointment() {
    if (!currentDeletingAppointmentRow) {
        showToast('No appointment selected for deletion', 'error');
        return;
    }

    const id = currentDeletingAppointmentRow.getAttribute('data-id');
    if (!id) {
        showToast('Invalid appointment ID', 'error');
        return;
    }

    try {
        const response = await fetch(`/CAATE-ITRMS/backend/public/api/v1/appointments/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Appointment deleted successfully', 'success');

            // Remove the row from the table (no full reload)
            currentDeletingAppointmentRow.remove();
            currentDeletingAppointmentRow = null;

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAppointmentModal'));
            modal.hide();

            // Reload statistics only
            loadStatistics();
        } else {
            showToast('Failed to delete appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        showToast('Failed to delete appointment. Please try again.', 'error');
    }
}

// View details
async function viewDetails(element) {
    const row = element.closest('tr');
    if (!row) {
        showToast('Could not find appointment row', 'error');
        return;
    }

    const appointmentDataStr = row.getAttribute('data-appointment');
    if (!appointmentDataStr) {
        showToast('Appointment data not found', 'error');
        console.error('Row missing data-appointment attribute:', row);
        return;
    }

    try {
        const appointment = JSON.parse(appointmentDataStr);
        displayAppointmentDetails(appointment);
    } catch (error) {
        showToast('Error loading appointment data', 'error');
        console.error('Error parsing appointment data:', error);
    }
}

// Edit details
async function editDetails(element) {
    const row = element.closest('tr');
    if (!row) {
        showToast('Could not find appointment row', 'error');
        return;
    }

    const appointmentDataStr = row.getAttribute('data-appointment');
    if (!appointmentDataStr) {
        showToast('Appointment data not found', 'error');
        console.error('Row missing data-appointment attribute:', row);
        return;
    }

    try {
        const appointment = JSON.parse(appointmentDataStr);
        displayEditForm(appointment, row);
    } catch (error) {
        showToast('Error loading appointment data', 'error');
        console.error('Error parsing appointment data:', error);
    }
}

// Display appointment details in modal (helper function)
function displayAppointmentDetails(appointment) {
    // Populate view modal fields
    document.getElementById('viewFirstName').value = appointment.firstName || '';
    document.getElementById('viewSecondName').value = appointment.secondName || '';
    document.getElementById('viewMiddleName').value = appointment.middleName || '';
    document.getElementById('viewLastName').value = appointment.lastName || '';
    document.getElementById('viewSuffix').value = appointment.suffix || '';
    document.getElementById('viewEmail').value = appointment.email || '';
    document.getElementById('viewContactNumber').value = appointment.contactNumber || '';

    // Format service category and type
    const categoryMap = {
        'skincare': 'Skin Care',
        'haircare': 'Hair Care',
        'nailcare': 'Nail Care',
        'bodytreatment': 'Body Treatment',
        'aesthetic': 'Aesthetic Services'
    };
    document.getElementById('viewServiceCategory').value = categoryMap[appointment.serviceCategory] || appointment.serviceCategory || '';
    document.getElementById('viewServiceType').value = formatServiceType(appointment.serviceType) || '';

    // Format date
    if (appointment.preferredDate) {
        const dateObj = new Date(appointment.preferredDate);
        document.getElementById('viewPreferredDate').value = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('viewPreferredDate').value = 'Not set';
    }

    // Format time
    if (appointment.preferredTime) {
        const [hours, minutes] = appointment.preferredTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        document.getElementById('viewPreferredTime').value = `${hour12}:${minutes} ${ampm}`;
    } else {
        document.getElementById('viewPreferredTime').value = 'Not set';
    }

    document.getElementById('viewStatus').value = appointment.status || 'Pending';
    document.getElementById('viewSpecialNotes').value = appointment.specialNotes || 'No special notes';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewAppointmentModal'));
    modal.show();
}

// Display edit form in modal (helper function)
let currentEditingAppointmentRow = null;
let originalAppointmentData = null;

function displayEditForm(appointment, row) {
    currentEditingAppointmentRow = row;

    // Store original data for comparison
    originalAppointmentData = JSON.parse(JSON.stringify(appointment));

    // Populate edit modal fields
    document.getElementById('editFirstName').value = appointment.firstName || '';
    document.getElementById('editSecondName').value = appointment.secondName || '';
    document.getElementById('editMiddleName').value = appointment.middleName || '';
    document.getElementById('editLastName').value = appointment.lastName || '';
    document.getElementById('editSuffix').value = appointment.suffix || '';
    document.getElementById('editEmail').value = appointment.email || '';
    document.getElementById('editContactNumber').value = appointment.contactNumber || '';

    // Set service category first
    const editServiceCategory = document.getElementById('editServiceCategory');
    const editServiceType = document.getElementById('editServiceType');
    editServiceCategory.value = appointment.serviceCategory || '';

    // Populate service types based on category
    editServiceType.innerHTML = '<option value="">Select a service type</option>';

    if (appointment.serviceCategory && serviceCategories[appointment.serviceCategory]) {
        serviceCategories[appointment.serviceCategory].forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            editServiceType.appendChild(option);
        });

        // Set the service type value AFTER populating options
        if (appointment.serviceType) {
            editServiceType.value = appointment.serviceType;
        }
    }

    document.getElementById('editPreferredDate').value = appointment.preferredDate || '';
    document.getElementById('editPreferredTime').value = appointment.preferredTime || '';
    document.getElementById('editStatus').value = appointment.status || 'Pending';
    document.getElementById('editRegistrationType').value = appointment.registrationType || '';
    document.getElementById('editSpecialNotes').value = appointment.specialNotes || '';
    document.getElementById('editAdminNotes').value = appointment.adminNotes || '';

    // Remove old event listener and add new one (prevent duplicates)
    const newEditServiceCategory = editServiceCategory.cloneNode(true);
    editServiceCategory.parentNode.replaceChild(newEditServiceCategory, editServiceCategory);

    // Setup service category change handler for edit modal
    newEditServiceCategory.addEventListener('change', function () {
        const selectedCategory = this.value;
        editServiceType.innerHTML = '<option value="">Select a service type</option>';

        if (selectedCategory && serviceCategories[selectedCategory]) {
            serviceCategories[selectedCategory].forEach(service => {
                const option = document.createElement('option');
                option.value = service.value;
                option.textContent = service.text;
                editServiceType.appendChild(option);
            });
        }
    });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
    modal.show();
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

// Save appointment changes
async function saveAppointmentChanges() {
    if (!currentEditingAppointmentRow) {
        showToast('No appointment selected for editing', 'error');
        return;
    }

    const id = currentEditingAppointmentRow.getAttribute('data-id');

    // Get form data
    const updatedData = {
        firstName: document.getElementById('editFirstName').value.trim(),
        secondName: document.getElementById('editSecondName').value.trim(),
        middleName: document.getElementById('editMiddleName').value.trim(),
        lastName: document.getElementById('editLastName').value.trim(),
        suffix: document.getElementById('editSuffix').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        contactNumber: document.getElementById('editContactNumber').value.trim(),
        serviceCategory: document.getElementById('editServiceCategory').value,
        serviceType: document.getElementById('editServiceType').value,
        preferredDate: document.getElementById('editPreferredDate').value,
        preferredTime: document.getElementById('editPreferredTime').value,
        status: document.getElementById('editStatus').value,
        registrationType: document.getElementById('editRegistrationType').value,
        specialNotes: document.getElementById('editSpecialNotes').value.trim(),
        adminNotes: document.getElementById('editAdminNotes').value.trim()
    };

    console.log('Form data collected:', updatedData);

    // Check if any changes were made FIRST
    let hasChanges = false;
    for (const key in updatedData) {
        const originalValue = originalAppointmentData[key] || '';
        const updatedValue = updatedData[key] || '';

        // Normalize values for comparison (trim and convert to string)
        const normalizedOriginal = String(originalValue).trim();
        const normalizedUpdated = String(updatedValue).trim();

        if (normalizedOriginal !== normalizedUpdated) {
            hasChanges = true;
            break;
        }
    }

    if (!hasChanges) {
        showToast('No changes detected', 'info');
        return;
    }

    // Validate ONLY truly required fields (marked with red asterisk *)
    // Required: First Name, Phone Number, Email, Service Category, Service Type, Preferred Date, Preferred Time
    // Optional/If Applicable: Second Name, Middle Name, Last Name, Suffix, Registration Type, Special Notes, Admin Notes

    const missingFields = [];
    if (!updatedData.firstName) missingFields.push('First Name');
    if (!updatedData.email) missingFields.push('Email');
    if (!updatedData.contactNumber) missingFields.push('Phone Number');
    if (!updatedData.serviceCategory) missingFields.push('Service Category');
    if (!updatedData.serviceType) missingFields.push('Service Type');
    if (!updatedData.preferredDate) missingFields.push('Preferred Date');
    if (!updatedData.preferredTime) missingFields.push('Preferred Time');

    if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        showToast('Please fill in all required fields: ' + missingFields.join(', '), 'warning');
        return;
    }

    try {
        const response = await fetch(`/CAATE-ITRMS/backend/public/api/v1/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Appointment updated successfully!', 'success');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal'));
            modal.hide();

            // Update only the specific row instead of reloading all data
            updateRowWithNewData(currentEditingAppointmentRow, updatedData);

            // Reset variables
            currentEditingAppointmentRow = null;
            originalAppointmentData = null;

            // Update statistics
            loadStatistics();
        } else {
            showToast('Failed to update appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        showToast('Failed to update appointment. Please try again.', 'error');
    }
}

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-circle' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 2.5 seconds
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 2500);
}

// Close toast notification
function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }
}

// Update a specific appointment row without reloading the entire table
function updateAppointmentRow(appointmentId, updatedData) {
    // Find the row with this appointment ID
    const rows = document.querySelectorAll('.table-border-bottom-0 tr');

    for (const row of rows) {
        // Check if this row contains the appointment ID in any onclick attribute
        const buttons = row.querySelectorAll('[onclick*="' + appointmentId + '"]');

        if (buttons.length > 0) {
            const cells = row.cells;

            // If status was updated, update the status badge (column 5)
            if (updatedData.status) {
                cells[5].innerHTML = getStatusBadge(updatedData.status);
            }

            // If full data was provided, update all cells
            if (updatedData.firstName) {
                // Update name (column 0)
                const firstName = updatedData.firstName || '';
                const lastName = updatedData.lastName || '';
                const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'NA';

                const fullName = [
                    updatedData.firstName,
                    updatedData.secondName,
                    updatedData.middleName,
                    updatedData.lastName,
                    updatedData.suffix
                ].filter(Boolean).join(' ');

                cells[0].innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-3"
                            style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                            ${initials}
                        </div>
                        <strong>${fullName}</strong>
                    </div>
                `;

                // Update email (column 1)
                cells[1].textContent = updatedData.email || 'N/A';

                // Update contact number (column 2)
                cells[2].textContent = updatedData.contactNumber || 'N/A';

                // Update service (column 3)
                const serviceCategory = formatServiceCategory(updatedData.serviceCategory);
                const serviceType = formatServiceType(updatedData.serviceType);
                cells[3].innerHTML = `
                    <strong>${serviceCategory}</strong><br>
                    <small class="text-muted">${serviceType}</small>
                `;

                // Update date & time (column 4)
                const dateTime = formatDateTime(updatedData.preferredDate, updatedData.preferredTime);
                cells[4].innerHTML = dateTime;

                // Update status (column 5)
                cells[5].innerHTML = getStatusBadge(updatedData.status);
            }

            break;
        }
    }
}

// Update row with new data
function updateRowWithNewData(row, data) {
    const cells = row.cells;

    // Update name cell (column 0)
    const fullName = [data.firstName, data.secondName, data.middleName, data.lastName, data.suffix].filter(Boolean).join(' ');
    const initials = ((data.firstName || '').charAt(0) + (data.lastName || '').charAt(0)).toUpperCase() || 'NA';
    cells[0].innerHTML = `
        <div class="d-flex align-items-center">
            <div class="avatar avatar-sm me-3"
                style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                ${initials}
            </div>
            <strong>${fullName}</strong>
        </div>
    `;

    // Update email (column 1)
    cells[1].textContent = data.email || 'N/A';

    // Update contact number (column 2)
    cells[2].textContent = data.contactNumber || 'N/A';

    // Update service (column 3)
    const serviceCategory = formatServiceCategory(data.serviceCategory);
    const serviceType = formatServiceType(data.serviceType);
    cells[3].innerHTML = `<strong>${serviceCategory}</strong><br><small class="text-muted">${serviceType}</small>`;

    // Update date & time (column 4)
    cells[4].innerHTML = formatDateTime(data.preferredDate, data.preferredTime);

    // Update status (column 5)
    cells[5].innerHTML = getStatusBadge(data.status);

    // Update stored data
    const appointmentData = JSON.parse(row.getAttribute('data-appointment'));
    Object.assign(appointmentData, data);
    row.setAttribute('data-appointment', JSON.stringify(appointmentData));
}
