async function viewDetails(element) {
    const row = element.closest('tr');
    if (!row) {
        showToast('Could not find appointment row', 'error');
        return;
    }

    const appointment = JSON.parse(row.getAttribute('data-appointment'));
    displayAppointmentDetails(appointment);
}

async function editDetails(element) {
    const row = element.closest('tr');
    if (!row) {
        showToast('Could not find appointment row', 'error');
        return;
    }

    const appointment = JSON.parse(row.getAttribute('data-appointment'));
    displayEditForm(appointment, row);
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
    document.getElementById('editServiceCategory').value = appointment.serviceCategory || '';

    const editServiceCategory = document.getElementById('editServiceCategory');
    const editServiceType = document.getElementById('editServiceType');

    if (appointment.serviceCategory && serviceCategories[appointment.serviceCategory]) {
        editServiceType.innerHTML = '<option value="">Select service type</option>';
        serviceCategories[appointment.serviceCategory].forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            if (service.value === appointment.serviceType) {
                option.selected = true;
            }
            editServiceType.appendChild(option);
        });
    }

    document.getElementById('editPreferredDate').value = appointment.preferredDate || '';
    document.getElementById('editPreferredTime').value = appointment.preferredTime || '';
    document.getElementById('editStatus').value = appointment.status || 'Pending';
    document.getElementById('editSpecialNotes').value = appointment.specialNotes || '';

    editServiceCategory.addEventListener('change', function () {
        const selectedCategory = this.value;
        editServiceType.innerHTML = '<option value="">Select service type</option>';

        if (selectedCategory && serviceCategories[selectedCategory]) {
            serviceCategories[selectedCategory].forEach(service => {
                const option = document.createElement('option');
                option.value = service.value;
                option.textContent = service.text;
                editServiceType.appendChild(option);
            });
        }
    });

    const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
    modal.show();
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
        specialNotes: document.getElementById('editSpecialNotes').value.trim()
    };

    let hasChanges = false;
    for (const key in updatedData) {
        const originalValue = originalAppointmentData[key] || '';
        const newValue = updatedData[key] || '';
        if (newValue !== originalValue) {
            hasChanges = true;
            break;
        }
    }

    if (!hasChanges) {
        showToast('No changes detected', 'info');
        return;
    }

    if (!updatedData.firstName || !updatedData.lastName || !updatedData.email ||
        !updatedData.contactNumber || !updatedData.serviceCategory || !updatedData.serviceType ||
        !updatedData.preferredDate || !updatedData.preferredTime) {
        showToast('Please fill in all required fields', 'warning');
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