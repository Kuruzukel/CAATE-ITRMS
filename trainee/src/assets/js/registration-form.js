/**
 * Registration Form Handler
 * Handles form submission and database operations for the registration form
 * Updated: 2026-03-18 - Simplified validation messages
 */

'use strict';

class RegistrationFormHandler {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = null;
        this.originalBtnText = '';
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Registration form not found');
            return;
        }

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        if (this.submitBtn) {
            this.originalBtnText = this.submitBtn.innerHTML;
        }

        this.setupEventListeners();
        this.setupULIInputs();
    }

    setupEventListeners() {
        // Form submission handler - show confirmation modal first
        this.form.addEventListener('submit', (e) => this.showConfirmationModal(e));

        // Confirmation modal submit handler
        const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
        if (confirmSubmitBtn) {
            confirmSubmitBtn.addEventListener('click', () => this.handleConfirmedSubmit());
        }

        // Real-time validation for birth information fields
        this.setupBirthFieldValidation();

        // Real-time validation for employment and education fields
        this.setupEmploymentEducationValidation();
    }

    setupBirthFieldValidation() {
        const birthMonth = document.getElementById('birthMonth');
        const birthDay = document.getElementById('birthDay');
        const birthYear = document.getElementById('birthYear');
        const age = document.getElementById('age');
        const contactNo = document.getElementById('contactNo');

        // Birth Month validation
        if (birthMonth) {
            birthMonth.addEventListener('blur', () => {
                const value = parseInt(birthMonth.value);
                if (birthMonth.value && (value < 1 || value > 12)) {
                    this.showFieldError(birthMonth, 'Month must be between 1 and 12');
                } else {
                    this.clearFieldError(birthMonth);
                }
            });
        }

        // Birth Day validation
        if (birthDay) {
            birthDay.addEventListener('blur', () => {
                const value = parseInt(birthDay.value);
                if (birthDay.value && (value < 1 || value > 31)) {
                    this.showFieldError(birthDay, 'Day must be between 1 and 31');
                } else {
                    this.clearFieldError(birthDay);
                }
            });
        }

        // Birth Year validation
        if (birthYear) {
            birthYear.addEventListener('blur', () => {
                const value = parseInt(birthYear.value);
                const currentYear = new Date().getFullYear();
                if (birthYear.value && (value < 1900 || value > currentYear)) {
                    this.showFieldError(birthYear, `Year must be between 1900 and ${currentYear}`);
                } else {
                    this.clearFieldError(birthYear);
                }
            });
        }

        // Age validation
        if (age) {
            age.addEventListener('blur', () => {
                const value = parseInt(age.value);
                if (age.value && (value < 1 || value > 120)) {
                    this.showFieldError(age, 'Age must be between 1 and 120');
                } else {
                    this.clearFieldError(age);
                }
            });
        }

        // Contact Number validation
        if (contactNo) {
            contactNo.addEventListener('blur', () => {
                if (!contactNo.value || contactNo.value.trim() === '') {
                    this.showFieldError(contactNo, 'Contact number is required');
                } else {
                    this.clearFieldError(contactNo);
                }
            });
        }
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class to field
        field.classList.add('is-invalid');

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;

        // Insert error message after the field
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        // Remove error class
        field.classList.remove('is-invalid');

        // Remove error message
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupEmploymentEducationValidation() {
        // Employment Status validation
        const employmentStatusInputs = document.querySelectorAll('input[name="employmentStatus"]');
        const employmentTypeInputs = document.querySelectorAll('input[name="employmentType"]');
        const educationInputs = document.querySelectorAll('input[name="education"]');
        const clientClassificationInputs = document.querySelectorAll('input[name="clientClassification"]');

        // Employment Status change handler
        employmentStatusInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('employmentStatus');

                // Show/hide employment type requirement based on selection
                const selectedValue = document.querySelector('input[name="employmentStatus"]:checked')?.value;
                const employmentTypeSection = document.querySelector('input[name="employmentType"]')?.closest('.mt-3');

                if (selectedValue === 'wage' || selectedValue === 'underemployed') {
                    if (employmentTypeSection) {
                        employmentTypeSection.style.opacity = '1';
                        employmentTypeSection.style.pointerEvents = 'auto';
                    }
                } else {
                    if (employmentTypeSection) {
                        employmentTypeSection.style.opacity = '0.5';
                        employmentTypeSection.style.pointerEvents = 'none';
                    }
                    // Clear employment type selection if not needed
                    employmentTypeInputs.forEach(typeInput => {
                        typeInput.checked = false;
                    });
                    this.clearRadioGroupRedBorder('employmentType');
                }
            });
        });

        // Employment Type validation
        employmentTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('employmentType');
            });
        });

        // Education validation
        educationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('education');
            });
        });

        // Sex validation
        const sexInputs = document.querySelectorAll('input[name="sex"]');
        sexInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('sex');
            });
        });

        // Civil Status validation
        const civilStatusInputs = document.querySelectorAll('input[name="civilStatus"]');
        civilStatusInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('civilStatus');
            });
        });

        // Client Classification validation
        clientClassificationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('clientClassification');
            });
        });
    }

    showRadioGroupRedBorder(groupName) {
        // Remove existing red borders
        this.clearRadioGroupRedBorder(groupName);

        // Add red border to all radio buttons in the group
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.add('radio-required-error');
        });
    }

    clearRadioGroupRedBorder(groupName) {
        // Remove red border class from all inputs in the group
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.remove('radio-required-error');
        });
    }

    showRadioGroupError(groupName, message) {
        // Remove existing error
        this.clearRadioGroupError(groupName);

        // Find the radio group container
        const firstInput = document.querySelector(`input[name="${groupName}"]`);
        if (!firstInput) return;

        let container = firstInput.closest('.card-body') || firstInput.closest('.col-md-4') || firstInput.closest('.mb-3');
        if (!container) return;

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback radio-group-error';
        errorDiv.style.display = 'block';
        errorDiv.textContent = message;
        errorDiv.setAttribute('data-group', groupName);

        // Add error styling to all inputs in the group
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.add('is-invalid');
        });

        // Insert error message at the end of the container
        container.appendChild(errorDiv);
    }

    clearRadioGroupError(groupName) {
        // Remove error class from all inputs in the group
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Remove error message
        const errorDiv = document.querySelector(`.radio-group-error[data-group="${groupName}"]`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupULIInputs() {
        // Auto-move to next ULI input
        const uliInputs = document.querySelectorAll('.uli-input');
        uliInputs.forEach((input, index) => {
            input.addEventListener('input', function () {
                if (this.value.length === 1 && index < uliInputs.length - 1) {
                    uliInputs[index + 1].focus();
                }
            });
        });
    }

    showConfirmationModal(e) {
        e.preventDefault();

        // Collect and validate form data first
        const formData = this.collectFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        // Store form data for later submission
        this.pendingFormData = formData;

        // Show confirmation modal
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));

        // Add event listener for modal dismissal
        const modalElement = document.getElementById('confirmationModal');
        modalElement.addEventListener('hidden.bs.modal', () => {
            // Only show cancellation toast if form wasn't actually submitted
            if (this.pendingFormData && !this.formSubmitted) {
                this.showToast('Registration submission cancelled.', 'warning');
            }
            this.formSubmitted = false; // Reset flag
        }, { once: true });

        modal.show();
    }

    async handleConfirmedSubmit() {
        // Set flag to indicate form is being submitted
        this.formSubmitted = true;

        // Hide confirmation modal
        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        if (confirmationModal) {
            confirmationModal.hide();
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Submit to database using stored form data
            const response = await this.submitToDatabase(this.pendingFormData);

            if (response.success) {
                // Show success toast
                this.showToast('Registration submitted successfully! You will receive a confirmation email shortly.', 'success');

                // Reset form
                this.form.reset();
            } else {
                throw new Error(response.message || 'Failed to submit registration');
            }

        } catch (error) {
            console.error('Registration submission error:', error);
            this.showErrorMessage(error.message || 'An error occurred while submitting the registration');
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Show loading state
        this.setLoadingState(true);

        try {
            // Collect form data
            const formData = this.collectFormData();

            // Validate required fields
            if (!this.validateForm(formData)) {
                this.setLoadingState(false);
                return;
            }

            // Submit to database
            const response = await this.submitToDatabase(formData);

            if (response.success) {
                // Reset form
                this.form.reset();
            } else {
                throw new Error(response.message || 'Failed to submit registration');
            }

        } catch (error) {
            console.error('Registration submission error:', error);
            this.showErrorMessage(error.message || 'An error occurred while submitting the registration');
        } finally {
            this.setLoadingState(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Collect ULI number from individual inputs
        const uliInputs = document.querySelectorAll('.uli-input');
        let uliNumber = '';
        uliInputs.forEach((input, index) => {
            uliNumber += input.value || '';
            if (index === 2 || index === 4 || index === 7 || index === 12) {
                uliNumber += '-';
            }
        });
        data.uliNumber = uliNumber;

        // Collect checkbox arrays properly
        const checkboxGroups = ['clientClassification', 'disabilityType', 'disabilityCause'];
        checkboxGroups.forEach(group => {
            const checkboxes = document.querySelectorAll(`input[name="${group}"]:checked`);
            data[group] = Array.from(checkboxes).map(cb => cb.value);
        });

        // Add timestamp and status
        data.submittedAt = new Date().toISOString();
        data.status = 'pending';

        return data;
    }

    validateForm(data) {
        let isValid = true;

        // Clear all previous errors
        this.clearAllErrors();

        const requiredFields = [
            // Personal Information
            'firstName',
            'numberStreet',
            'barangay',
            'district',
            'cityMunicipality',
            'province',
            'region',
            'emailFacebook',
            'contactNo',
            'nationality',
            // Personal Details (radio groups)
            'sex',
            'civilStatus',
            'employmentStatus',
            'education',
            // Birth Information
            'birthMonth',
            'birthDay',
            'birthYear',
            'age',
            'birthCity',
            'birthProvince',
            'birthRegion',
            // Parent/Guardian
            'parentName',
            'parentAddress',
            // Course
            'courseQualification'
        ];

        const missingFields = [];
        const fieldLabels = {
            'firstName': 'First Name',
            'numberStreet': 'Number, Street',
            'barangay': 'Barangay',
            'district': 'District',
            'cityMunicipality': 'City/Municipality',
            'province': 'Province',
            'region': 'Region',
            'emailFacebook': 'Email Address/Facebook Account',
            'contactNo': 'Contact Number',
            'nationality': 'Nationality',
            'sex': 'Sex',
            'civilStatus': 'Civil Status',
            'employmentStatus': 'Employment Status',
            'employmentType': 'Employment Type',
            'birthMonth': 'Month of Birth',
            'birthDay': 'Day of Birth',
            'birthYear': 'Year of Birth',
            'age': 'Age',
            'birthCity': 'Birth City/Municipality',
            'birthProvince': 'Birth Province',
            'birthRegion': 'Birth Region',
            'education': 'Educational Attainment',
            'parentName': 'Parent/Guardian Name',
            'parentAddress': 'Parent/Guardian Address',
            'courseQualification': 'Course/Qualification Name',
            'clientClassification': 'Learner/Trainee/Student Classification'
        };

        // Check basic required fields
        requiredFields.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                missingFields.push(fieldLabels[field] || field);

                // Show red border for radio groups (no notification boxes)
                if (field === 'sex' || field === 'civilStatus' || field === 'employmentStatus' || field === 'education') {
                    this.showRadioGroupRedBorder(field);
                    isValid = false;
                }

                // Show error for text inputs
                const inputElement = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
                if (inputElement && (inputElement.type === 'text' || inputElement.type === 'number' || inputElement.type === 'email' || inputElement.tagName === 'TEXTAREA')) {
                    this.showFieldError(inputElement, `${fieldLabels[field]} is required`);
                    isValid = false;
                }
            }
        });

        // Check if at least one Client Classification is selected
        const clientClassifications = document.querySelectorAll('input[name="clientClassification"]:checked');
        if (clientClassifications.length === 0) {
            this.showRadioGroupRedBorder('clientClassification');
            isValid = false;
        }

        // Check if Employment Type is required based on Employment Status
        if (data.employmentStatus && (data.employmentStatus === 'wage' || data.employmentStatus === 'underemployed')) {
            if (!data.employmentType || data.employmentType.toString().trim() === '') {
                this.showRadioGroupRedBorder('employmentType');
                isValid = false;
            }
        }

        // Client Classification is now optional - no validation required

        // Additional validation for birth information
        if (data.birthMonth && (data.birthMonth < 1 || data.birthMonth > 12)) {
            this.showToast('Month of Birth must be between 1 and 12', 'error');
            return false;
        }

        if (data.birthDay && (data.birthDay < 1 || data.birthDay > 31)) {
            this.showToast('Day of Birth must be between 1 and 31', 'error');
            return false;
        }

        const currentYear = new Date().getFullYear();
        if (data.birthYear && (data.birthYear < 1900 || data.birthYear > currentYear)) {
            this.showToast(`Year of Birth must be between 1900 and ${currentYear}`, 'error');
            return false;
        }

        if (data.age && (data.age < 1 || data.age > 120)) {
            this.showToast('Age must be between 1 and 120', 'error');
            return false;
        }

        if (missingFields.length > 0) {
            // Updated: Show simple error message instead of listing all fields
            console.log('Validation failed - showing simple message');
            this.showToast('Please complete all required fields.', 'error');
            return false;
        }

        return isValid;
    }

    clearAllErrors() {
        // Clear all field errors
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });

        // Clear all error messages
        document.querySelectorAll('.invalid-feedback, .radio-group-error').forEach(error => {
            error.remove();
        });

        // Clear radio button red borders
        document.querySelectorAll('.radio-required-error').forEach(radio => {
            radio.classList.remove('radio-required-error');
        });

        // Clear enhanced error styling
        document.querySelectorAll('.card-body').forEach(cardBody => {
            cardBody.style.backgroundColor = '';
        });
    }

    async submitToDatabase(data) {
        try {
            console.log('Submitting registration data:', data);

            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('Database submission error:', error);
            throw error;
        }
    }

    setLoadingState(loading) {
        if (!this.submitBtn) return;

        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Submitting...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
        }
    }

    showSuccessModal() {
        // Modal removed - no longer showing success modal
    }

    showToast(message, type = 'success') {
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

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const handler = new RegistrationFormHandler();

    // Add test function to window for debugging
    window.testToast = function (message = 'Test notification', type = 'success') {
        handler.showToast(message, type);
    };
});

