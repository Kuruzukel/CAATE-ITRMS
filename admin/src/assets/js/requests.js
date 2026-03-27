let appointmentsData = [];

const serviceCategories = {
    'skincare': [
        { value: 'facial-treatment', text: 'Facial Treatment' },
        { value: 'skin-analysis', text: 'Skin Analysis' },
        { value: 'acne-treatment', text: 'Acne Treatment' },
        { value: 'anti-aging', text: 'Anti-Aging Treatment' },
        { value: 'brightening', text: 'Skin Brightening' },
        { value: 'skin-care-treatment', text: 'Skin Care Treatment' },
        { value: 'advanced-skin-care', text: 'Advanced Skin Care' },
        { value: 'collagen-treatment', text: 'Collagen Treatment' },
        { value: 'facial-peeling', text: 'Facial Peeling' }
    ],
    'haircare': [
        { value: 'hair-loss-therapy', text: 'Hair Loss Therapy' },
        { value: 'scalp-treatment', text: 'Scalp Treatment' },
        { value: 'hair-spa', text: 'Hair Spa' },
        { value: 'keratin-treatment', text: 'Keratin Treatment' },
        { value: 'hair-spa-treatment', text: 'Hair Spa Treatment' },
        { value: 'hairloss-treatment', text: 'Hairloss Treatment' }
    ],
    'nailcare': [
        { value: 'gel-manicure', text: 'Gel Manicure' },
        { value: 'nail-extension', text: 'Nail Extension' },
        { value: 'pedicure', text: 'Pedicure' },
        { value: 'nail-art', text: 'Nail Art' },
        { value: 'hand-spa', text: 'Hand Spa' },
        { value: 'foot-spa', text: 'Foot Spa' },
        { value: 'nail-care-service', text: 'Nail Care Service' }
    ],
    'bodytreatment': [
        { value: 'body-scrub', text: 'Body Scrub' },
        { value: 'waxing', text: 'Waxing' },
        { value: 'body-massage', text: 'Body Massage' },
        { value: 'slimming-treatment', text: 'Slimming Treatment' }
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

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    loadAppointments();
    loadStatistics();

    const filterServiceCategory = document.getElementById('filterServiceCategory');
    const filterServiceType = document.getElementById('filterServiceType');

    if (filterServiceCategory && filterServiceType) {

        Object.values(serviceCategories).flat().forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            filterServiceType.appendChild(option);
        });

        filterServiceCategory.addEventListener('change', function () {
            const selectedCategory = this.value;

            filterServiceType.innerHTML = '<option value="">All Service Types</option>';

            if (selectedCategory && serviceCategories[selectedCategory]) {

                serviceCategories[selectedCategory].forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            } else {

                Object.values(serviceCategories).flat().forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            }

            applyFilters();
        });

        filterServiceType.addEventListener('change', applyFilters);
    }

    const filterSearchInput = document.getElementById('filterSearchInput');
    if (filterSearchInput) {
        filterSearchInput.addEventListener('input', applyFilters);
    }

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', applyFilters);
    }

    const filterDate = document.getElementById('filterDate');
    if (filterDate) {
        filterDate.addEventListener('change', applyFilters);
    }

    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {

            if (filterSearchInput) filterSearchInput.value = '';
            if (filterServiceCategory) filterServiceCategory.value = '';
            if (filterServiceType) {
                filterServiceType.innerHTML = '<option value="">All Service Types</option>';

                Object.values(serviceCategories).flat().forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            }
            if (filterStatus) filterStatus.value = '';
            if (filterDate) filterDate.value = '';

            applyFilters();
        });
    }

    const editServiceCategory = document.getElementById('editServiceCategory');
    const editServiceType = document.getElementById('editServiceType');

    if (editServiceCategory && editServiceType) {

        editServiceCategory.addEventListener('change', function () {
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
    }

    const addServiceCategory = document.getElementById('addAppointmentServiceCategory');
    const addServiceType = document.getElementById('addAppointmentServiceType');

    if (addServiceCategory && addServiceType) {

        addServiceCategory.addEventListener('change', function () {
            const selectedCategory = this.value;

            addServiceType.innerHTML = '<option value="">Select a service type</option>';

            if (selectedCategory && serviceCategories[selectedCategory]) {

                serviceCategories[selectedCategory].forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    addServiceType.appendChild(option);
                });
            }
        });
    }

    const saveNewAppointmentBtn = document.getElementById('saveNewAppointmentBtn');
    if (saveNewAppointmentBtn) {
        saveNewAppointmentBtn.addEventListener('click', handleSaveNewAppointment);
    }

    const addAppointmentDate = document.getElementById('addAppointmentDate');
    if (addAppointmentDate) {
        addAppointmentDate.addEventListener('change', updateAvailableTimeSlotsForAdd);
    }

    const editPreferredDate = document.getElementById('editPreferredDate');
    if (editPreferredDate) {
        editPreferredDate.addEventListener('change', updateAvailableTimeSlotsForEdit);
    }

    const calendarModal = document.getElementById('calendarModal');
    if (calendarModal) {
        calendarModal.addEventListener('shown.bs.modal', function () {

            const dateInput = document.getElementById('addAppointmentDate');
            const timeSelect = document.getElementById('addAppointmentTime');

            if (dateInput && timeSelect) {

                if (dateInput.value) {
                    updateAvailableTimeSlotsForAdd();
                } else {

                    timeSelect.innerHTML = '<option value="">Select a time</option>';
                    allTimeSlots.forEach(slot => {
                        const option = document.createElement('option');
                        option.value = slot.value;
                        option.textContent = slot.text;
                        timeSelect.appendChild(option);
                    });
                }
            }
        });
    }

    const editAppointmentModal = document.getElementById('editAppointmentModal');
    if (editAppointmentModal) {
        editAppointmentModal.addEventListener('shown.bs.modal', function () {

            const dateInput = document.getElementById('editPreferredDate');
            if (dateInput && dateInput.value) {
                updateAvailableTimeSlotsForEdit();
            }
        });
    }

});

async function loadAppointments() {

    showTableLoader();

    const timeoutId = setTimeout(() => {
        appointmentsData = [];
        displayAppointments([]);
    }, 10000);

    try {
        const apiUrl = '/CAATE-ITRMS/backend/public/api/v1/appointments';

        const response = await fetch(apiUrl);
        clearTimeout(timeoutId);

        const result = await response.json();

        if (result.success && result.data) {
            appointmentsData = result.data;
            displayAppointments(result.data);
        } else {
            appointmentsData = [];
            displayAppointments([]);
        }
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error loading appointments:', error);
        appointmentsData = [];
        displayAppointments([]);
    }
}

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

function updateStatistics(stats) {
    const statsCards = document.querySelectorAll('.card-body h3');
    if (statsCards.length >= 4) {
        statsCards[0].textContent = stats.total || 0;
        statsCards[1].textContent = stats.confirmed || 0;
        statsCards[2].textContent = stats.pending || 0;
        statsCards[3].textContent = stats.cancelled || 0;
    }
}

function displayAppointments(appointments) {
    const tbody = document.querySelector('.table-border-bottom-0');
    if (!tbody) return;

    const loader = document.getElementById('tableLoader');
    if (loader) {
        loader.remove();
    }

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

function createAppointmentRow(appointment) {
    const tr = document.createElement('tr');

    tr.setAttribute('data-appointment', JSON.stringify(appointment));
    tr.setAttribute('data-id', appointment._id);

    const firstName = appointment.firstName || '';
    const lastName = appointment.lastName || '';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'NA';

    const fullName = [
        appointment.firstName,
        appointment.secondName,
        appointment.middleName,
        appointment.lastName,
        appointment.suffix
    ].filter(Boolean).join(' ');

    const serviceCategory = formatServiceCategory(appointment.serviceCategory);
    const serviceType = formatServiceType(appointment.serviceType);

    const dateTime = formatDateTime(appointment.preferredDate, appointment.preferredTime);

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

    const statusCell = row.querySelector('.status-cell');
    const originalStatusHTML = statusCell ? statusCell.innerHTML : '';

    if (statusCell) {
        statusCell.innerHTML = getStatusBadge(status);
    }

    const appointmentData = JSON.parse(row.getAttribute('data-appointment'));
    const originalStatus = appointmentData.status;
    appointmentData.status = status;
    row.setAttribute('data-appointment', JSON.stringify(appointmentData));

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

            loadStatistics();
        } else {

            if (statusCell) {
                statusCell.innerHTML = originalStatusHTML;
            }
            appointmentData.status = originalStatus;
            row.setAttribute('data-appointment', JSON.stringify(appointmentData));

            showToast('Failed to update status: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {

        if (statusCell) {
            statusCell.innerHTML = originalStatusHTML;
        }
        appointmentData.status = originalStatus;
        row.setAttribute('data-appointment', JSON.stringify(appointmentData));

        console.error('Error updating status:', error);
        showToast('Failed to update status. Please try again.', 'error');
    }
}

let currentDeletingAppointmentRow = null;

function deleteAppointment(element) {

    const row = element.closest('tr');
    if (!row) {
        console.error('Could not find row for delete');
        showToast('Invalid appointment', 'error');
        return;
    }

    const appointmentData = row.getAttribute('data-appointment');
    if (!appointmentData) {
        console.error('No appointment data found in row');
        showToast('Invalid appointment data', 'error');
        return;
    }

    try {
        const appointment = JSON.parse(appointmentData);

        currentDeletingAppointmentRow = row;

        const fullName = [
            appointment.firstName,
            appointment.secondName,
            appointment.middleName,
            appointment.lastName,
            appointment.suffix
        ].filter(Boolean).join(' ');

        document.getElementById('deleteAppointmentName').textContent = fullName;

        const modal = new bootstrap.Modal(document.getElementById('deleteAppointmentModal'));
        modal.show();
    } catch (error) {
        console.error('Error parsing appointment data:', error);
        showToast('Failed to load appointment details', 'error');
    }
}

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

            currentDeletingAppointmentRow.remove();
            currentDeletingAppointmentRow = null;

            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAppointmentModal'));
            modal.hide();

            loadStatistics();
        } else {
            showToast('Failed to delete appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        showToast('Failed to delete appointment. Please try again.', 'error');
    }
}

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

function displayAppointmentDetails(appointment) {

    document.getElementById('viewFirstName').value = appointment.firstName || '';
    document.getElementById('viewSecondName').value = appointment.secondName || '';
    document.getElementById('viewMiddleName').value = appointment.middleName || '';
    document.getElementById('viewLastName').value = appointment.lastName || '';
    document.getElementById('viewSuffix').value = appointment.suffix || '';
    document.getElementById('viewEmail').value = appointment.email || '';
    document.getElementById('viewContactNumber').value = appointment.contactNumber || '';

    const categoryMap = {
        'skincare': 'Skin Care',
        'haircare': 'Hair Care',
        'nailcare': 'Nail Care',
        'bodytreatment': 'Body Treatment',
        'aesthetic': 'Aesthetic Services'
    };
    document.getElementById('viewServiceCategory').value = categoryMap[appointment.serviceCategory] || appointment.serviceCategory || '';
    document.getElementById('viewServiceType').value = formatServiceType(appointment.serviceType) || '';

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
    document.getElementById('viewAdminNotes').value = appointment.adminNotes || 'No admin notes';

    const modal = new bootstrap.Modal(document.getElementById('viewAppointmentModal'));
    modal.show();
}

let currentEditingAppointmentRow = null;
let originalAppointmentData = null;

function displayEditForm(appointment, row) {
    currentEditingAppointmentRow = row;

    originalAppointmentData = JSON.parse(JSON.stringify(appointment));

    document.getElementById('editFirstName').value = appointment.firstName || '';
    document.getElementById('editSecondName').value = appointment.secondName || '';
    document.getElementById('editMiddleName').value = appointment.middleName || '';
    document.getElementById('editLastName').value = appointment.lastName || '';
    document.getElementById('editSuffix').value = appointment.suffix || '';
    document.getElementById('editEmail').value = appointment.email || '';
    document.getElementById('editContactNumber').value = appointment.contactNumber || '';

    const editServiceCategory = document.getElementById('editServiceCategory');
    const editServiceType = document.getElementById('editServiceType');

    editServiceCategory.value = appointment.serviceCategory || '';

    editServiceType.innerHTML = '<option value="">Select a service type</option>';

    if (appointment.serviceCategory && serviceCategories[appointment.serviceCategory]) {
        const services = serviceCategories[appointment.serviceCategory];

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            editServiceType.appendChild(option);
        });

        if (appointment.serviceType) {
            editServiceType.value = appointment.serviceType;

            if (!editServiceType.value || editServiceType.value === '') {

                const option = document.createElement('option');
                option.value = appointment.serviceType;
                option.textContent = formatServiceType(appointment.serviceType);
                option.selected = true;
                editServiceType.appendChild(option);
            }
        }
    }

    document.getElementById('editPreferredDate').value = appointment.preferredDate || '';
    document.getElementById('editStatus').value = appointment.status || 'Pending';
    document.getElementById('editRegistrationType').value = appointment.registrationType || '';
    document.getElementById('editSpecialNotes').value = appointment.specialNotes || '';
    document.getElementById('editAdminNotes').value = appointment.adminNotes || '';

    const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
    modal.show();

    modal._element.addEventListener('shown.bs.modal', async function () {
        const dateInput = document.getElementById('editPreferredDate');
        if (dateInput && dateInput.value) {
            await updateAvailableTimeSlotsForEdit();

            const timeSelect = document.getElementById('editPreferredTime');
            if (timeSelect && appointment.preferredTime) {
                timeSelect.value = appointment.preferredTime;
            }
        }
    }, { once: true });
}

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

    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('hidden.bs.modal', function () {
            deleteConfirmInput.value = '';
            confirmDeleteBtn.disabled = true;
        });
    }

    confirmDeleteBtn.addEventListener('click', function () {

        alert('Record deleted successfully!');

        const modal = bootstrap.Modal.getInstance(deleteModal);
        modal.hide();
    });
}

async function saveAppointmentChanges() {
    if (!currentEditingAppointmentRow) {
        showToast('No appointment selected for editing', 'error');
        return;
    }

    const id = currentEditingAppointmentRow.getAttribute('data-id');

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

    let hasChanges = false;
    for (const key in updatedData) {
        const originalValue = originalAppointmentData[key] || '';
        const updatedValue = updatedData[key] || '';

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

    const availability = await checkTimeSlotAvailability(
        updatedData.preferredDate,
        updatedData.preferredTime,
        id
    );

    if (!availability.available) {
        showToast(`This time slot is already booked. Please select a different time.`, 'error');
        document.getElementById('editPreferredTime').focus();
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

            const modal = bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal'));
            modal.hide();

            updateRowWithNewData(currentEditingAppointmentRow, updatedData);

            currentEditingAppointmentRow = null;
            originalAppointmentData = null;

            loadStatistics();
        } else {
            showToast('Failed to update appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        showToast('Failed to update appointment. Please try again.', 'error');
    }
}

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
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }
}

function updateAppointmentRow(appointmentId, updatedData) {

    const rows = document.querySelectorAll('.table-border-bottom-0 tr');

    for (const row of rows) {

        const buttons = row.querySelectorAll('[onclick*="' + appointmentId + '"]');

        if (buttons.length > 0) {
            const cells = row.cells;

            if (updatedData.status) {
                cells[5].innerHTML = getStatusBadge(updatedData.status);
            }

            if (updatedData.firstName) {

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

                cells[1].textContent = updatedData.email || 'N/A';

                cells[2].textContent = updatedData.contactNumber || 'N/A';

                const serviceCategory = formatServiceCategory(updatedData.serviceCategory);
                const serviceType = formatServiceType(updatedData.serviceType);
                cells[3].innerHTML = `
                    <strong>${serviceCategory}</strong><br>
                    <small class="text-muted">${serviceType}</small>
                `;

                const dateTime = formatDateTime(updatedData.preferredDate, updatedData.preferredTime);
                cells[4].innerHTML = dateTime;

                cells[5].innerHTML = getStatusBadge(updatedData.status);
            }

            break;
        }
    }
}

function updateRowWithNewData(row, data) {
    const cells = row.cells;

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

    cells[1].textContent = data.email || 'N/A';

    cells[2].textContent = data.contactNumber || 'N/A';

    const serviceCategory = formatServiceCategory(data.serviceCategory);
    const serviceType = formatServiceType(data.serviceType);
    cells[3].innerHTML = `<strong>${serviceCategory}</strong><br><small class="text-muted">${serviceType}</small>`;

    cells[4].innerHTML = formatDateTime(data.preferredDate, data.preferredTime);

    cells[5].innerHTML = getStatusBadge(data.status);

    const appointmentData = JSON.parse(row.getAttribute('data-appointment'));
    Object.assign(appointmentData, data);
    row.setAttribute('data-appointment', JSON.stringify(appointmentData));
}

const allTimeSlots = [
    { value: '09:00', text: '09:00 AM' },
    { value: '10:00', text: '10:00 AM' },
    { value: '11:00', text: '11:00 AM' },
    { value: '13:00', text: '01:00 PM' },
    { value: '14:00', text: '02:00 PM' },
    { value: '15:00', text: '03:00 PM' },
    { value: '16:00', text: '04:00 PM' }
];

async function checkTimeSlotAvailability(date, time, excludeAppointmentId = null) {
    try {

        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments');
        const result = await response.json();

        if (result.success && result.data) {

            const conflictingAppointments = result.data.filter(appointment => {

                if (excludeAppointmentId && appointment._id === excludeAppointmentId) {
                    return false;
                }

                return appointment.preferredDate === date &&
                    appointment.preferredTime === time &&
                    appointment.status !== 'Cancelled';
            });

            return {
                available: conflictingAppointments.length === 0,
                conflictCount: conflictingAppointments.length
            };
        }

        return { available: true, conflictCount: 0 };
    } catch (error) {
        console.error('Error checking time slot availability:', error);
        return { available: true, conflictCount: 0 };
    }
}

async function getBookedTimeSlots(date, excludeAppointmentId = null) {
    try {
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments');
        const result = await response.json();

        if (result.success && result.data) {

            const bookedSlots = result.data
                .filter(appointment => {

                    if (excludeAppointmentId && appointment._id === excludeAppointmentId) {
                        return false;
                    }
                    return appointment.preferredDate === date &&
                        appointment.status !== 'Cancelled';
                })
                .map(appointment => appointment.preferredTime);

            return bookedSlots;
        }

        return [];
    } catch (error) {
        console.error('Error fetching booked time slots:', error);
        return [];
    }
}

async function updateAvailableTimeSlotsForAdd() {
    const dateInput = document.getElementById('addAppointmentDate');
    const timeSelect = document.getElementById('addAppointmentTime');

    if (!dateInput || !timeSelect) return;

    const selectedDate = dateInput.value;

    if (!selectedDate) {

        timeSelect.innerHTML = '<option value="">Select a time</option>';
        allTimeSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.text;
            timeSelect.appendChild(option);
        });
        return;
    }

    timeSelect.innerHTML = '<option value="">Loading available times...</option>';
    timeSelect.disabled = true;

    const bookedSlots = await getBookedTimeSlots(selectedDate);

    timeSelect.innerHTML = '<option value="">Select a time</option>';

    let availableCount = 0;
    allTimeSlots.forEach(slot => {

        if (!bookedSlots.includes(slot.value)) {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.text;
            timeSelect.appendChild(option);
            availableCount++;
        }
    });

    timeSelect.disabled = false;

    if (availableCount === 0) {
        showToast('All time slots are booked for this date. Please select another date.', 'warning');
        timeSelect.innerHTML = '<option value="">No available time slots</option>';
    }
}

async function updateAvailableTimeSlotsForEdit() {
    const dateInput = document.getElementById('editPreferredDate');
    const timeSelect = document.getElementById('editPreferredTime');

    if (!dateInput || !timeSelect || !currentEditingAppointmentRow) {
        return;
    }

    const selectedDate = dateInput.value;
    const currentAppointmentId = currentEditingAppointmentRow.getAttribute('data-id');

    if (!selectedDate) {

        timeSelect.innerHTML = '<option value="">Select a time</option>';
        allTimeSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.text;
            timeSelect.appendChild(option);
        });
        return;
    }

    const currentSelection = timeSelect.value;

    timeSelect.innerHTML = '<option value="">Loading available times...</option>';
    timeSelect.disabled = true;

    try {

        const bookedSlots = await getBookedTimeSlots(selectedDate, currentAppointmentId);

        timeSelect.innerHTML = '<option value="">Select a time</option>';

        let availableCount = 0;
        allTimeSlots.forEach(slot => {

            if (!bookedSlots.includes(slot.value)) {
                const option = document.createElement('option');
                option.value = slot.value;
                option.textContent = slot.text;
                timeSelect.appendChild(option);
                availableCount++;
            }
        });

        if (currentSelection && !bookedSlots.includes(currentSelection)) {
            timeSelect.value = currentSelection;
        }

        timeSelect.disabled = false;

        if (availableCount === 0) {
            showToast('All time slots are booked for this date. Please select another date.', 'warning');
            timeSelect.innerHTML = '<option value="">No available time slots</option>';
        }

    } catch (error) {
        console.error('Error updating time slots:', error);
        timeSelect.innerHTML = '<option value="">Error loading times</option>';
        timeSelect.disabled = false;
        showToast('Error loading available time slots', 'error');
    }
}

async function handleSaveNewAppointment() {
    const btn = document.getElementById('saveNewAppointmentBtn');
    const originalText = btn.innerHTML;

    const firstName = document.getElementById('addAppointmentFirstName').value.trim();
    const secondName = document.getElementById('addAppointmentSecondName').value.trim();
    const middleName = document.getElementById('addAppointmentMiddleName').value.trim();
    const lastName = document.getElementById('addAppointmentLastName').value.trim();
    const suffix = document.getElementById('addAppointmentSuffix').value.trim();
    const contactNumber = document.getElementById('addAppointmentPhone').value.trim();
    const email = document.getElementById('addAppointmentEmail').value.trim();
    const serviceCategory = document.getElementById('addAppointmentServiceCategory').value;
    const serviceType = document.getElementById('addAppointmentServiceType').value;
    const preferredDate = document.getElementById('addAppointmentDate').value;
    const preferredTime = document.getElementById('addAppointmentTime').value;
    const status = document.getElementById('addAppointmentStatus').value;
    const registrationType = document.getElementById('addAppointmentRegistrationType').value;
    const specialNotes = document.getElementById('addAppointmentSpecialNotes').value.trim();
    const adminNotes = document.getElementById('addAppointmentNotes').value.trim();

    if (!firstName) {
        showToast('First Name is required', 'error');
        document.getElementById('addAppointmentFirstName').focus();
        return;
    }

    if (!contactNumber) {
        showToast('Phone Number is required', 'error');
        document.getElementById('addAppointmentPhone').focus();
        return;
    }

    if (!email) {
        showToast('Email Address is required', 'error');
        document.getElementById('addAppointmentEmail').focus();
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address', 'error');
        document.getElementById('addAppointmentEmail').focus();
        return;
    }

    if (!serviceCategory) {
        showToast('Service Category is required', 'error');
        document.getElementById('addAppointmentServiceCategory').focus();
        return;
    }

    if (!serviceType) {
        showToast('Service Type is required', 'error');
        document.getElementById('addAppointmentServiceType').focus();
        return;
    }

    if (!preferredDate) {
        showToast('Preferred Date is required', 'error');
        document.getElementById('addAppointmentDate').focus();
        return;
    }

    if (!preferredTime) {
        showToast('Preferred Time is required', 'error');
        document.getElementById('addAppointmentTime').focus();
        return;
    }

    const availability = await checkTimeSlotAvailability(preferredDate, preferredTime);
    if (!availability.available) {
        showToast(`This time slot is already booked. Please select a different time.`, 'error');
        document.getElementById('addAppointmentTime').focus();
        return;
    }

    const appointmentData = {
        firstName,
        secondName,
        middleName,
        lastName,
        suffix,
        contactNumber,
        email,
        serviceCategory,
        serviceType,
        preferredDate,
        preferredTime,
        status,
        registrationType,
        specialNotes,
        adminNotes
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Saving...';

    try {
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Appointment created successfully!', 'success');

            const modal = bootstrap.Modal.getInstance(document.getElementById('calendarModal'));
            modal.hide();

            resetAddAppointmentForm();

            loadAppointments();
            loadStatistics();
        } else {
            showToast('Failed to create appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        showToast('Failed to create appointment. Please try again.', 'error');
    } finally {

        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function resetAddAppointmentForm() {
    document.getElementById('addAppointmentFirstName').value = '';
    document.getElementById('addAppointmentSecondName').value = '';
    document.getElementById('addAppointmentMiddleName').value = '';
    document.getElementById('addAppointmentLastName').value = '';
    document.getElementById('addAppointmentSuffix').value = '';
    document.getElementById('addAppointmentPhone').value = '';
    document.getElementById('addAppointmentEmail').value = '';
    document.getElementById('addAppointmentServiceCategory').value = '';
    document.getElementById('addAppointmentServiceType').innerHTML = '<option value="">Select a service type</option>';
    document.getElementById('addAppointmentDate').value = '';
    document.getElementById('addAppointmentTime').value = '';
    document.getElementById('addAppointmentStatus').value = 'Pending';
    document.getElementById('addAppointmentRegistrationType').value = '';
    document.getElementById('addAppointmentSpecialNotes').value = '';
    document.getElementById('addAppointmentNotes').value = '';
}

const addAppointmentPhone = document.getElementById('addAppointmentPhone');
if (addAppointmentPhone) {
    addAppointmentPhone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 4 && value.length <= 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        } else if (value.length > 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
        }

        e.target.value = value;
    });
}

const editContactNumber = document.getElementById('editContactNumber');
if (editContactNumber) {
    editContactNumber.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 4 && value.length <= 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        } else if (value.length > 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
        }

        e.target.value = value;
    });
}

function applyFilters() {
    const filterSearchInput = document.getElementById('filterSearchInput');
    const filterServiceCategory = document.getElementById('filterServiceCategory');
    const filterServiceType = document.getElementById('filterServiceType');
    const filterStatus = document.getElementById('filterStatus');
    const filterDate = document.getElementById('filterDate');

    const searchTerm = filterSearchInput ? filterSearchInput.value.toLowerCase().trim() : '';
    const selectedCategory = filterServiceCategory ? filterServiceCategory.value : '';
    const selectedServiceType = filterServiceType ? filterServiceType.value : '';
    const selectedStatus = filterStatus ? filterStatus.value : '';
    const selectedDate = filterDate ? filterDate.value : '';

    let filteredData = appointmentsData.filter(appointment => {

        if (selectedCategory && appointment.serviceCategory !== selectedCategory) {
            return false;
        }

        if (selectedServiceType && appointment.serviceType !== selectedServiceType) {
            return false;
        }

        if (selectedStatus && appointment.status !== selectedStatus) {
            return false;
        }

        if (selectedDate && appointment.preferredDate !== selectedDate) {
            return false;
        }

        return true;
    });

    displayAppointments(filteredData);

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
    const tbody = document.querySelector('.table-border-bottom-0');
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
    const tbody = document.querySelector('.table-border-bottom-0');
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
            row.style.transform = 'scale(1.01)';
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