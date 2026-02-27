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
appointmentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

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
            // Show success message
            alert('Appointment booked successfully! Your appointment status is Pending. We will contact you shortly to confirm.');

            // Reset form
            appointmentForm.reset();
            serviceTypeSelect.disabled = true;
            serviceTypeSelect.innerHTML = '<option value="">Select a service type</option>';

            // Optionally redirect to confirmation page
            // window.location.href = 'appointment-confirmation.html';
        } else {
            alert('Error booking appointment: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to book appointment. Please try again later.');
    }
});

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
