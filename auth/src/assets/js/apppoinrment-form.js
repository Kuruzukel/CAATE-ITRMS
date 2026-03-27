const serviceTypes = {
    skincare: [
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
    haircare: [
        { value: 'hair-loss-therapy', text: 'Hair Loss Therapy' },
        { value: 'scalp-treatment', text: 'Scalp Treatment' },
        { value: 'hair-spa', text: 'Hair Spa' },
        { value: 'keratin-treatment', text: 'Keratin Treatment' },
        { value: 'hair-spa-treatment', text: 'Hair Spa Treatment' },
        { value: 'hairloss-treatment', text: 'Hairloss Treatment' }
    ],
    nailcare: [
        { value: 'gel-manicure', text: 'Gel Manicure' },
        { value: 'nail-extension', text: 'Nail Extension' },
        { value: 'pedicure', text: 'Pedicure' },
        { value: 'nail-art', text: 'Nail Art' },
        { value: 'hand-spa', text: 'Hand Spa' },
        { value: 'foot-spa', text: 'Foot Spa' },
        { value: 'nail-care-service', text: 'Nail Care Service' }
    ],
    bodytreatment: [
        { value: 'body-scrub', text: 'Body Scrub' },
        { value: 'waxing', text: 'Waxing' },
        { value: 'body-massage', text: 'Body Massage' },
        { value: 'slimming-treatment', text: 'Slimming Treatment' }
    ],
    aesthetic: [
        { value: 'permanent-makeup', text: 'Permanent Makeup' },
        { value: 'eyelash-extension', text: 'Eyelash Extension' },
        { value: 'eyebrow-threading', text: 'Eyebrow Threading' },
        { value: 'eyebrow-microblading', text: 'Eyebrow Microblading' },
        { value: 'aesthetic-consultation', text: 'Aesthetic Consultation' }
    ]
};

async function checkTimeSlotAvailability(date, time) {
    try {
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments');
        const result = await response.json();

        if (result.success && result.data) {
            const conflictingAppointments = result.data.filter(appointment => {
                return appointment.preferredDate === date &&
                    appointment.preferredTime === time &&
                    appointment.status !== 'Cancelled'; // Don't count cancelled appointments
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

const serviceCategorySelect = document.getElementById('serviceCategory');
const serviceTypeSelect = document.getElementById('serviceType');
const appointmentForm = document.getElementById('appointmentForm');
const preferredDateInput = document.getElementById('preferredDate');
const preferredTimeSelect = document.getElementById('preferredTime');

const allTimeSlots = [
    { value: '09:00', text: '09:00 AM' },
    { value: '10:00', text: '10:00 AM' },
    { value: '11:00', text: '11:00 AM' },
    { value: '13:00', text: '01:00 PM' },
    { value: '14:00', text: '02:00 PM' },
    { value: '15:00', text: '03:00 PM' },
    { value: '16:00', text: '04:00 PM' }
];

async function getBookedTimeSlots(date) {
    try {
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments');
        const result = await response.json();

        if (result.success && result.data) {
            const bookedSlots = result.data
                .filter(appointment =>
                    appointment.preferredDate === date &&
                    appointment.status !== 'Cancelled'
                )
                .map(appointment => appointment.preferredTime);

            return bookedSlots;
        }

        return [];
    } catch (error) {
        console.error('Error fetching booked time slots:', error);
        return [];
    }
}

async function updateAvailableTimeSlots() {
    const selectedDate = preferredDateInput.value;

    if (!selectedDate) {
        preferredTimeSelect.innerHTML = '<option value="">Select a time</option>';
        allTimeSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.text;
            preferredTimeSelect.appendChild(option);
        });
        return;
    }

    preferredTimeSelect.innerHTML = '<option value="">Loading available times...</option>';
    preferredTimeSelect.disabled = true;

    const bookedSlots = await getBookedTimeSlots(selectedDate);

    preferredTimeSelect.innerHTML = '<option value="">Select a time</option>';

    let availableCount = 0;
    allTimeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;

        if (bookedSlots.includes(slot.value)) {
            option.textContent = `${slot.text} (Booked)`;
            option.disabled = true;
            option.style.color = '#999';
        } else {
            option.textContent = slot.text;
            availableCount++;
        }

        preferredTimeSelect.appendChild(option);
    });

    preferredTimeSelect.disabled = false;

    if (availableCount === 0) {
        showToast('All time slots are booked for this date. Please select another date.', 'warning');
        preferredTimeSelect.innerHTML = '<option value="">No available time slots</option>';
    }
}

preferredDateInput.addEventListener('change', updateAvailableTimeSlots);

const today = new Date().toISOString().split('T')[0];
preferredDateInput.setAttribute('min', today);

function handleDatePlaceholder() {
    const dateInput = preferredDateInput;

    if (!dateInput.value) {
        dateInput.classList.add('date-empty');
    }

    dateInput.addEventListener('focus', function () {
        this.classList.remove('date-empty');
    });

    dateInput.addEventListener('blur', function () {
        if (!this.value) {
            this.classList.add('date-empty');
        }
    });

    dateInput.addEventListener('change', function () {
        if (this.value) {
            this.classList.remove('date-empty');
        } else {
            this.classList.add('date-empty');
        }
    });
}

handleDatePlaceholder();

serviceCategorySelect.addEventListener('change', function () {
    const selectedCategory = this.value;

    serviceTypeSelect.innerHTML = '<option value="">Select a service type</option>';

    if (selectedCategory && serviceTypes[selectedCategory]) {
        serviceTypeSelect.disabled = false;

        serviceTypes[selectedCategory].forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            serviceTypeSelect.appendChild(option);
        });
    } else {
        serviceTypeSelect.disabled = true;
    }
});

appointmentForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const firstNameInput = document.getElementById('firstName');
    if (!firstNameInput.value.trim()) {
        showToast('First Name is required. Please enter your first name.', 'error');
        highlightError(firstNameInput);
        return;
    }

    const phoneInput = document.getElementById('contactNumber');
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    if (!phoneInput.value.trim()) {
        showToast('Phone Number is required. Please enter your contact number.', 'error');
        highlightError(phoneInput);
        return;
    }
    if (phoneValue.length !== 11) {
        showToast('Phone number must be exactly 11 digits (e.g., 09XX XXX XXXX)', 'error');
        highlightError(phoneInput);
        return;
    }

    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showToast('Email Address is required. Please enter your email.', 'error');
        highlightError(emailInput);
        return;
    }
    if (!emailPattern.test(emailInput.value)) {
        showToast('Please enter a valid email address (e.g., name@example.com)', 'error');
        highlightError(emailInput);
        return;
    }

    const serviceCategoryInput = document.getElementById('serviceCategory');
    if (!serviceCategoryInput.value) {
        showToast('Service Category is required. Please select a service category.', 'error');
        highlightError(serviceCategoryInput);
        return;
    }

    const serviceTypeInput = document.getElementById('serviceType');
    if (!serviceTypeInput.value) {
        showToast('Service Type is required. Please select a service type.', 'error');
        highlightError(serviceTypeInput);
        return;
    }

    const dateInput = document.getElementById('preferredDate');
    if (!dateInput.value) {
        showToast('Preferred Date is required. Please select your appointment date.', 'error');
        highlightError(dateInput);
        return;
    }

    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showToast('Please select a future date for your appointment.', 'error');
        highlightError(dateInput);
        return;
    }

    const timeInput = document.getElementById('preferredTime');
    if (!timeInput.value) {
        showToast('Preferred Time is required. Please select your appointment time.', 'error');
        highlightError(timeInput);
        return;
    }

    const availability = await checkTimeSlotAvailability(dateInput.value, timeInput.value);
    if (!availability.available) {
        showToast('This time slot is already booked. Please select a different time.', 'error');
        highlightError(timeInput);
        return;
    }

    const formData = new FormData(appointmentForm);
    const appointmentData = {};

    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });

    populateConfirmationModal(appointmentData);

    openModal('confirmationModal');
});

function highlightError(element) {
    element.focus();
    element.style.borderColor = '#f56565';
    element.classList.add('shake-error');

    setTimeout(() => {
        element.classList.remove('shake-error');
        element.style.borderColor = '';
    }, 600);
}

function populateConfirmationModal(data) {
    const fullName = [
        data.firstName,
        data.secondName,
        data.middleName,
        data.lastName,
        data.suffix
    ].filter(Boolean).join(' ');
    document.getElementById('confirmFullName').value = fullName;

    document.getElementById('confirmEmail').value = data.email;
    document.getElementById('confirmPhone').value = data.contactNumber;

    const categoryMap = {
        'skincare': 'Skin Care',
        'haircare': 'Hair Care',
        'nailcare': 'Nail Care',
        'bodytreatment': 'Body Treatment',
        'aesthetic': 'Aesthetic Services'
    };
    document.getElementById('confirmCategory').value = categoryMap[data.serviceCategory] || data.serviceCategory;

    const serviceTypeText = data.serviceType.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    document.getElementById('confirmServiceType').value = serviceTypeText;

    const dateObj = new Date(data.preferredDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('confirmDate').value = formattedDate;

    const [hours, minutes] = data.preferredTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    document.getElementById('confirmTime').value = formattedTime;

    if (data.specialNotes && data.specialNotes.trim()) {
        document.getElementById('notesSection').style.display = 'block';
        document.getElementById('confirmNotes').value = data.specialNotes;
    } else {
        document.getElementById('notesSection').style.display = 'none';
    }
}

document.getElementById('confirmSubmitBtn').addEventListener('click', async function () {
    const btn = this;
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    const formData = new FormData(appointmentForm);
    const appointmentData = {};

    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });

    appointmentData.status = 'Pending';
    appointmentData.submittedAt = new Date().toISOString();

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
            closeModal('confirmationModal');

            showToast('Appointment submitted! Check your email for approval status.', 'success');

            appointmentForm.reset();
            serviceTypeSelect.disabled = true;
            serviceTypeSelect.innerHTML = '<option value="">Select a service type</option>';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Error booking appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to book appointment. Please try again later.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    toast.innerHTML = `
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

const contactNumberInput = document.getElementById('contactNumber');
contactNumberInput.addEventListener('input', function (e) {
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

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

const inputs = appointmentForm.querySelectorAll('input[required], select[required], textarea[required]');

inputs.forEach(input => {
    input.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            this.style.borderColor = 'var(--error)';
        } else {
            this.style.borderColor = 'var(--success)';
        }
    });

    input.addEventListener('focus', function () {
        this.style.borderColor = 'var(--primary-blue)';
    });
});

const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailPattern.test(this.value)) {
        this.style.borderColor = 'var(--error)';
    } else if (this.value) {
        this.style.borderColor = 'var(--success)';
    }
});

const nameFields = ['firstName', 'secondName', 'middleName', 'lastName', 'suffix'];

nameFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('input', function (e) {
            if (fieldId === 'suffix') {
                this.value = this.value.replace(/[^A-Za-z.,\s]/g, '');
            } else {
                this.value = this.value.replace(/[^A-Za-z\s]/g, '');
            }
        });

        field.addEventListener('paste', function (e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (fieldId === 'suffix') {
                const cleanedText = pastedText.replace(/[^A-Za-z.,\s]/g, '');
                document.execCommand('insertText', false, cleanedText);
            } else {
                const cleanedText = pastedText.replace(/[^A-Za-z\s]/g, '');
                document.execCommand('insertText', false, cleanedText);
            }
        });
    }
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');

    document.body.classList.add('modal-open');

    setupModalCloseHandlers(modal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');

    document.body.classList.remove('modal-open');
}

function setupModalCloseHandlers(modal) {
    const closeBtn = modal.querySelector('.custom-modal-close');
    if (closeBtn) {
        closeBtn.onclick = function () {
            closeModal(modal.id);
        };
    }

    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    if (cancelBtn) {
        cancelBtn.onclick = function () {
            closeModal(modal.id);
        };
    }

    const backdrop = modal.querySelector('.custom-modal-backdrop');
    if (backdrop) {
        backdrop.onclick = function () {
            closeModal(modal.id);
        };
    }

    const escapeHandler = function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal(modal.id);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}
