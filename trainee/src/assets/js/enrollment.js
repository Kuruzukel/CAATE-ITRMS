// Enrollment Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize enrollment form
    initializeEnrollmentForm();
    initializeSteps();
    initializeCourseSelection();
    initializeDocumentUpload();
    initializeFormValidation();
});

// Step management
let currentStep = 1;
const totalSteps = 4;

function initializeSteps() {
    updateStepDisplay();

    // Add navigation event listeners
    document.addEventListener('click', function (e) {
        if (e.target.matches('.btn-next')) {
            nextStep();
        } else if (e.target.matches('.btn-prev')) {
            prevStep();
        }
    });
}

function nextStep() {
    if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
        scrollToTop();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        scrollToTop();
    }
}

function updateStepDisplay() {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });

    // Show/hide form sections
    const sections = document.querySelectorAll('.form-step');
    sections.forEach((section, index) => {
        section.style.display = (index + 1 === currentStep) ? 'block' : 'none';
    });

    // Update navigation buttons
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');

    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Course selection
function initializeCourseSelection() {
    const courseOptions = document.querySelectorAll('.course-option');

    courseOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove selected class from all options
            courseOptions.forEach(opt => opt.classList.remove('selected'));

            // Add selected class to clicked option
            this.classList.add('selected');

            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }

            // Update enrollment summary
            updateEnrollmentSummary();
        });
    });
}

// Document upload functionality
function initializeDocumentUpload() {
    const uploadArea = document.querySelector('.document-upload');
    const fileInput = document.querySelector('#document-files');
    const uploadedFiles = document.querySelector('.uploaded-files');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');

        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener('change', function () {
        handleFileUpload(this.files);
    });
}

function handleFileUpload(files) {
    const uploadedFiles = document.querySelector('.uploaded-files');
    if (!uploadedFiles) return;

    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            addFileToList(file);
        }
    });
}

function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
        showNotification('File size must be less than 5MB', 'error');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
        return false;
    }

    return true;
}

function addFileToList(file) {
    const uploadedFiles = document.querySelector('.uploaded-files');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    fileItem.innerHTML = `
        <div class="file-info">
            <i class="bx bx-file file-icon"></i>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button type="button" class="remove-file" onclick="removeFile(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    uploadedFiles.appendChild(fileItem);
}

function removeFile(button) {
    button.closest('.file-item').remove();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form validation
function initializeFormValidation() {
    const form = document.querySelector('#enrollment-form');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            submitEnrollment();
        }
    });
}

function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-step:nth-child(${currentStep})`);
    if (!currentSection) return true;

    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Age validation
    if (fieldName === 'age' && value) {
        const age = parseInt(value);
        if (age < 16 || age > 100) {
            isValid = false;
            errorMessage = 'Age must be between 16 and 100';
        }
    }

    // Show/hide error
    showFieldError(field, isValid ? '' : errorMessage);

    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (message) {
        field.classList.add('error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function validateForm() {
    const form = document.querySelector('#enrollment-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Check if course is selected
    const selectedCourse = document.querySelector('input[name="course"]:checked');
    if (!selectedCourse) {
        showNotification('Please select a course', 'error');
        isValid = false;
    }

    return isValid;
}

// Enrollment summary
function updateEnrollmentSummary() {
    const selectedCourse = document.querySelector('input[name="course"]:checked');
    const summaryElement = document.querySelector('.enrollment-summary');

    if (!selectedCourse || !summaryElement) return;

    const courseOption = selectedCourse.closest('.course-option');
    const courseName = courseOption.querySelector('.course-name').textContent;
    const courseDuration = courseOption.querySelector('.course-duration').textContent;

    // Update summary display
    const summaryContent = `
        <div class="summary-title">Enrollment Summary</div>
        <div class="summary-item">
            <span class="summary-label">Selected Course:</span>
            <span class="summary-value">${courseName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Duration:</span>
            <span class="summary-value">${courseDuration}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Status:</span>
            <span class="summary-value">Pending Approval</span>
        </div>
    `;

    summaryElement.innerHTML = summaryContent;
}

// Form submission
function submitEnrollment() {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Submitting...';

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Show success message
        showNotification('Enrollment submitted successfully! You will receive a confirmation email shortly.', 'success');

        // Optionally redirect or reset form
        // window.location.href = '/trainee/dashboard';
    }, 2000);
}

// Initialize enrollment form
function initializeEnrollmentForm() {
    // Auto-fill current date
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];

    dateInputs.forEach(input => {
        if (input.name === 'application_date') {
            input.value = today;
        }
    });

    // Initialize form interactions
    initializeFormInteractions();
}

function initializeFormInteractions() {
    // Auto-format phone number
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            this.value = value;
        });
    }

    // Auto-capitalize names
    const nameInputs = document.querySelectorAll('input[name*="name"]');
    nameInputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\b\w/g, l => l.toUpperCase());
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="bx ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button type="button" class="notification-close" onclick="this.parentElement.remove()">
            <i class="bx bx-x"></i>
        </button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'bx-check-circle',
        error: 'bx-error-circle',
        warning: 'bx-error',
        info: 'bx-info-circle'
    };
    return icons[type] || icons.info;
}
// Menu toggle functionality (extracted from HTML)
function initializeMenuToggle() {
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const layoutMenu = document.getElementById('layout-menu');
    const layoutOverlay = document.querySelector('.layout-overlay');
    const layoutContainer = document.querySelector('.layout-container');

    if (menuToggleBtn && layoutMenu) {
        menuToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container to expand content
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Also toggle when clicking the overlay
    if (layoutOverlay && layoutMenu) {
        layoutOverlay.addEventListener('click', function () {
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }
}

// Initialize menu toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMenuToggle();
});