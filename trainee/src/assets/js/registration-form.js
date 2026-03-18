/**
 * Registration Form Handler
 * Handles form submission and database operations for the registration form
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

        // Show info toast
        this.showToast('Please confirm your registration details before submitting.', 'info');

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
                // Show success modal
                this.showSuccessModal();
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
                // Show success modal
                this.showSuccessModal();
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
        const requiredFields = [
            'lastName',
            'firstName',
            'sex',
            'civilStatus'
        ];

        const missingFields = [];

        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            this.showToast('Please fill in all required fields: ' + missingFields.join(', '), 'error');
            return false;
        }

        return true;
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
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
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

/**
 * Toggle disability sections based on PWD checkbox
 */
function toggleDisabilitySections() {
    const pwdCheckbox = document.getElementById('pwdCheckbox');
    const disabilitySection = document.getElementById('disabilitySection');
    const disabilityCauseSection = document.getElementById('disabilityCauseSection');

    if (pwdCheckbox && disabilitySection && disabilityCauseSection) {
        if (pwdCheckbox.checked) {
            disabilitySection.style.display = 'block';
            disabilityCauseSection.style.display = 'block';
        } else {
            disabilitySection.style.display = 'none';
            disabilityCauseSection.style.display = 'none';

            // Clear all disability checkboxes when hiding sections
            const disabilityCheckboxes = document.querySelectorAll('input[name="disabilityType"], input[name="disabilityCause"]');
            disabilityCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }
}

/**
 * Toggle scholarship section based on Scholar checkbox
 */
function toggleScholarshipSection() {
    const scholarCheckbox = document.getElementById('scholarCheckbox');
    const scholarshipSection = document.getElementById('scholarshipSection');

    if (scholarCheckbox && scholarshipSection) {
        if (scholarCheckbox.checked) {
            scholarshipSection.style.display = 'block';
        } else {
            scholarshipSection.style.display = 'none';

            // Clear scholarship textarea when hiding section
            const scholarshipTextarea = document.querySelector('textarea[name="scholarshipType"]');
            if (scholarshipTextarea) {
                scholarshipTextarea.value = '';
            }
        }
    }
}