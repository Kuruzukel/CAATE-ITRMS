const API_BASE_URL = (typeof config !== 'undefined' && config.api)
    ? config.api.baseUrl
    : '/CAATE-ITRMS/backend/public';

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

function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-lowercase', requirements.lowercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-special', requirements.special);

    Object.values(requirements).forEach(met => {
        if (met) strength++;
    });

    return { strength, requirements };
}

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

function validateForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');

    const { strength, requirements } = checkPasswordStrength(newPassword);
    const allRequirementsMet = Object.values(requirements).every(met => met);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
    const currentPasswordFilled = currentPassword !== '';
    const passwordsDifferent = currentPassword !== newPassword;

    submitBtn.disabled = !(currentPasswordFilled && allRequirementsMet && passwordsMatch && passwordsDifferent);

    return { allRequirementsMet, passwordsMatch };
}

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

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {

    const usernameField = document.getElementById('username');
    if (usernameField) {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                usernameField.value = user.username || '';
            } catch (e) {

            }
        }
    }

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

    document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (currentPassword === newPassword) {
            showToast('New password must be different from current password', 'error');
            return;
        }

        const confirmModal = new bootstrap.Modal(document.getElementById('confirmChangePasswordModal'));
        confirmModal.show();
    });

    document.getElementById('confirmPasswordChangeBtn').addEventListener('click', async function () {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const submitBtn = document.getElementById('submitBtn');
        const confirmBtn = this;

        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmChangePasswordModal'));
        confirmModal.hide();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-1"></i> Changing Password...';

        confirmBtn.disabled = true;

        try {

            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            const userRole = localStorage.getItem('userRole');

            if (!token || !userId || userRole !== 'admin') {
                throw new Error('Authentication required. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
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

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('Invalid server response');
            }

            if (response.ok && data.success) {

                showToast('Your password has been changed successfully', 'success');

                // Add notification for password change
                if (window.notificationManager) {
                    window.notificationManager.notifyPasswordChange();
                }

                document.getElementById('changePasswordForm').reset();
                document.getElementById('strengthBar').className = 'password-strength-bar';
                document.getElementById('strengthText').textContent = '';

                ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
                    updateRequirement(id, false);
                });

                setTimeout(() => {
                    window.location.href = '../../../auth/src/pages/login.html';
                }, 2000);
            } else {

                const errorMessage = data.error || `Server error (${response.status})`;
                showToast(errorMessage, 'error');

                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bx bx-check me-1"></i> Change Password';
                confirmBtn.disabled = false;
            }
        } catch (error) {
            showToast(`Network error: ${error.message}`, 'error');

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bx bx-check me-1"></i> Change Password';
        }
    });

});