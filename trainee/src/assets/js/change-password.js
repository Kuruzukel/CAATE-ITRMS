/* Change Password Functionality - Trainee */

// API Configuration
const API_BASE_URL = (typeof config !== 'undefined' && config.api)
    ? config.api.baseURL
    : '/CAATE-ITRMS/backend/public';

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('bx-hide');
        icon.classList.add('bx-show');
    } else {
        field.type = 'password';
        icon.classList.remove('bx-show');
        icon.classList.add('bx-hide');
    }
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update requirement indicators
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-lowercase', requirements.lowercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-special', requirements.special);

    // Calculate strength
    Object.values(requirements).forEach(met => {
        if (met) strength++;
    });

    return { strength, requirements };
}

// Update requirement indicator
function updateRequirement(id, met) {
    const element = document.getElementById(id);
    const icon = element.querySelector('i');

    if (met) {
        element.classList.remove('requirement-unmet');
        element.classList.add('requirement-met');
        icon.classList.remove('bx-x-circle');
        icon.classList.add('bx-check-circle');
    } else {
        element.classList.remove('requirement-met');
        element.classList.add('requirement-unmet');
        icon.classList.remove('bx-check-circle');
        icon.classList.add('bx-x-circle');
    }
}

// Update strength bar
function updateStrengthBar(strength) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    strengthBar.className = 'password-strength-bar';

    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ef4444';
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#10b981';
    }
}

// Validate form
function validateForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');

    const { strength, requirements } = checkPasswordStrength(newPassword);
    const allRequirementsMet = Object.values(requirements).every(met => met);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
    const currentPasswordFilled = currentPassword !== '';

    // Enable submit button only if all conditions are met
    submitBtn.disabled = !(currentPasswordFilled && allRequirementsMet && passwordsMatch);

    return { allRequirementsMet, passwordsMatch };
}

// Show toast notification
function showToast(message, type = 'success') {
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

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Password strength checking
    document.getElementById('newPassword').addEventListener('input', function () {
        const password = this.value;
        if (password) {
            const { strength } = checkPasswordStrength(password);
            updateStrengthBar(strength);
        } else {
            document.getElementById('strengthBar').className = 'password-strength-bar';
            document.getElementById('strengthText').textContent = '';
        }
        validateForm();
    });

    document.getElementById('confirmPassword').addEventListener('input', validateForm);
    document.getElementById('currentPassword').addEventListener('input', validateForm);

    // Form submission - show confirmation modal
    document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Show confirmation modal
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmChangePasswordModal'));
        confirmModal.show();
    });

    // Handle confirmation button click
    document.getElementById('confirmPasswordChangeBtn').addEventListener('click', async function () {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const submitBtn = document.getElementById('submitBtn');
        const confirmBtn = this;

        // Close the modal
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmChangePasswordModal'));
        confirmModal.hide();

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-1"></i> Changing Password...';

        // Disable confirm button
        confirmBtn.disabled = true;

        try {
            // Get user info for trainee-specific API call
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            const userRole = localStorage.getItem('userRole');

            if (!token || !userId || userRole !== 'trainee') {
                throw new Error('Authentication required. Please log in again.');
            }

            // Call trainee-specific API endpoint
            const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success toast
                showToast('Your password has been changed successfully', 'success');

                // Reset form
                document.getElementById('changePasswordForm').reset();
                document.getElementById('strengthBar').className = 'password-strength-bar';
                document.getElementById('strengthText').textContent = '';

                // Reset requirements
                ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
                    updateRequirement(id, false);
                });

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = '../../../auth/src/pages/login.html';
                }, 2000);
            } else {
                // Show error toast
                showToast(data.error || 'Failed to change password', 'error');

                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bx bx-check me-1"></i> Change Password';
                confirmBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showToast(error.message || 'Network error. Please try again.', 'error');

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bx bx-check me-1"></i> Change Password';
            confirmBtn.disabled = false;
        }
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});