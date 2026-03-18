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
        // Form submission handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
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
            this.showErrorMessage('Please fill in all required fields: ' + missingFields.join(', '));
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
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }

    showErrorMessage(message) {
        // Create or update error alert
        let errorAlert = document.getElementById('errorAlert');

        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.id = 'errorAlert';
            errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
            errorAlert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';

            errorAlert.innerHTML = `
                <i class="bx bx-error-circle me-2"></i>
                <span id="errorMessage"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

            document.body.appendChild(errorAlert);
        }

        document.getElementById('errorMessage').textContent = message;
        errorAlert.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorAlert) {
                errorAlert.classList.remove('show');
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new RegistrationFormHandler();
});