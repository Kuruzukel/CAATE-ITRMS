/* Change Password Functionality */

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

    // Form submission
    document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Hide previous alerts
        document.getElementById('successAlert').classList.add('d-none');
        document.getElementById('errorAlert').classList.add('d-none');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            document.getElementById('confirmPasswordError').classList.remove('d-none');
            document.getElementById('confirmPassword').classList.add('is-invalid');
            return;
        }

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Simulate success
            const success = true; // Change to false to test error state

            if (success) {
                document.getElementById('successAlert').classList.remove('d-none');
                document.getElementById('changePasswordForm').reset();
                document.getElementById('strengthBar').className = 'password-strength-bar';
                document.getElementById('strengthText').textContent = '';
                document.getElementById('submitBtn').disabled = true;

                // Reset requirements
                ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
                    updateRequirement(id, false);
                });

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'manage-profile.html';
                }, 2000);
            } else {
                document.getElementById('errorMessage').textContent = 'Current password is incorrect.';
                document.getElementById('errorAlert').classList.remove('d-none');
                document.getElementById('currentPassword').classList.add('is-invalid');
                document.getElementById('currentPasswordError').classList.remove('d-none');
            }
        }, 500);
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});