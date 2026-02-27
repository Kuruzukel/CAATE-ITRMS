// Service Type Options based on Category
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

// DOM Elements
const serviceCategorySelect = document.getElementById('serviceCategory');
const serviceTypeSelect = document.getElementById('serviceType');
const appointmentForm = document.getElementById('appointmentForm');
const preferredDateInput = document.getElementById('preferredDate');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
preferredDateInput.setAttribute('min', today);

// Safari date input placeholder fix
function handleDatePlaceholder() {
    const dateInput = preferredDateInput;

    // Create a wrapper for the placeholder
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

// Initialize placeholder handling
handleDatePlaceholder();

// Handle Service Category Change
serviceCategorySelect.addEventListener('change', function () {
    const selectedCategory = this.value;

    // Clear and reset service type dropdown
    serviceTypeSelect.innerHTML = '<option value="">Select a service type</option>';

    if (selectedCategory && serviceTypes[selectedCategory]) {
        // Enable and populate service type dropdown
        serviceTypeSelect.disabled = false;

        serviceTypes[selectedCategory].forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            serviceTypeSelect.appendChild(option);
        });
    } else {
        // Disable if no category selected
        serviceTypeSelect.disabled = true;
    }
});

// Form Submission Handler
appointmentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Validate First Name
    const firstNameInput = document.getElementById('firstName');
    if (!firstNameInput.value.trim()) {
        showToast('First Name is required. Please enter your first name.', 'error');
        highlightError(firstNameInput);
        return;
    }

    // Validate Phone Number
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

    // Validate Email
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

    // Validate Service Category
    const serviceCategoryInput = document.getElementById('serviceCategory');
    if (!serviceCategoryInput.value) {
        showToast('Service Category is required. Please select a service category.', 'error');
        highlightError(serviceCategoryInput);
        return;
    }

    // Validate Service Type
    const serviceTypeInput = document.getElementById('serviceType');
    if (!serviceTypeInput.value) {
        showToast('Service Type is required. Please select a service type.', 'error');
        highlightError(serviceTypeInput);
        return;
    }

    // Validate Preferred Date
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

    // Validate Preferred Time
    const timeInput = document.getElementById('preferredTime');
    if (!timeInput.value) {
        showToast('Preferred Time is required. Please select your appointment time.', 'error');
        highlightError(timeInput);
        return;
    }

    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = {};

    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });

    // Populate confirmation modal
    populateConfirmationModal(appointmentData);

    // Show confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmModal.show();
});

// Helper function to highlight error fields
function highlightError(element) {
    element.focus();
    element.style.borderColor = '#f56565';
    element.classList.add('shake-error');

    setTimeout(() => {
        element.classList.remove('shake-error');
        element.style.borderColor = '';
    }, 600);
}

// Populate confirmation modal with form data
function populateConfirmationModal(data) {
    // Full name
    const fullName = [
        data.firstName,
        data.secondName,
        data.middleName,
        data.lastName,
        data.suffix
    ].filter(Boolean).join(' ');
    document.getElementById('confirmFullName').value = fullName;

    // Contact info
    document.getElementById('confirmEmail').value = data.email;
    document.getElementById('confirmPhone').value = data.contactNumber;

    // Service details
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

    // Appointment schedule
    const dateObj = new Date(data.preferredDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('confirmDate').value = formattedDate;

    // Format time
    const [hours, minutes] = data.preferredTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    document.getElementById('confirmTime').value = formattedTime;

    // Special notes
    if (data.specialNotes && data.specialNotes.trim()) {
        document.getElementById('notesSection').style.display = 'block';
        document.getElementById('confirmNotes').value = data.specialNotes;
    } else {
        document.getElementById('notesSection').style.display = 'none';
    }
}

// Handle confirmation submit
document.getElementById('confirmSubmitBtn').addEventListener('click', async function () {
    const btn = this;
    const originalText = btn.innerHTML;

    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = {};

    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });

    // Add status
    appointmentData.status = 'Pending';
    appointmentData.submittedAt = new Date().toISOString();

    try {
        // Send data to backend API
        const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        const result = await response.json();

        if (result.success) {
            // Close confirmation modal
            const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
            confirmModal.hide();

            // Show success toast
            showToast('Appointment booked successfully! We will contact you shortly to confirm.', 'success');

            // Reset form
            appointmentForm.reset();
            serviceTypeSelect.disabled = true;
            serviceTypeSelect.innerHTML = '<option value="">Select a service type</option>';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Error booking appointment: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to book appointment. Please try again later.', 'error');
    } finally {
        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

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

// Phone number formatting
const contactNumberInput = document.getElementById('contactNumber');
contactNumberInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');

    // Limit to 11 digits for Philippine numbers
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // Format: 09XX XXX XXXX
    if (value.length > 4 && value.length <= 7) {
        value = value.slice(0, 4) + ' ' + value.slice(4);
    } else if (value.length > 7) {
        value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
    }

    e.target.value = value;
});

// Navbar scroll effect
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

// Form validation feedback
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

// Email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailPattern.test(this.value)) {
        this.style.borderColor = 'var(--error)';
    } else if (this.value) {
        this.style.borderColor = 'var(--success)';
    }
});
