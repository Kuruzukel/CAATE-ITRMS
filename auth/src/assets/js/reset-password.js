const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : type === 'warning' ? 'Warning!' : 'Info'}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 8000);
}

// Get token and email from URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        token: urlParams.get('token'),
        email: urlParams.get('email')
    };
}

// Verify token on page load
async function verifyToken() {
    const { token, email } = getUrlParams();

    if (!token || !email) {
        showToast('Invalid reset link. Please request a new password reset.', 'error');
        setTimeout(() => {
            window.location.href = 'forgot-password.html';
        }, 3000);
        return false;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data = await response.json();

        if (!data.success) {
            showToast(data.error || 'Invalid or expired reset link.', 'error');
            setTimeout(() => {
                window.location.href = 'forgot-password.html';
            }, 3000);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying token:', error);
        showToast('Connection error. Please try again.', 'error');
        return false;
    }
}

// Password toggle functionality
function setupPasswordToggles() {
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleNewPasswordIcon = document.getElementById('toggleNewPasswordIcon');
    const toggleConfirmPasswordIcon = document.getElementById('toggleConfirmPasswordIcon');

    if (toggleNewPassword && newPasswordInput) {
        toggleNewPassword.addEventListener('click', function (e) {
            e.preventDefault();
            const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            newPasswordInput.setAttribute('type', type);
            toggleNewPasswordIcon.classList.toggle('bx-hide');
            toggleNewPasswordIcon.classList.toggle('bx-show');
        });
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function (e) {
            e.preventDefault();
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPasswordIcon.classList.toggle('bx-hide');
            toggleConfirmPasswordIcon.classList.toggle('bx-show');
        });
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    // Verify token first
    const isValid = await verifyToken();
    if (!isValid) return;

    // Setup password toggles
    setupPasswordToggles();

    const form = document.getElementById("formResetPassword");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const { token, email } = getUrlParams();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = "Resetting...";

        try {
            const response = await fetch(
                API_BASE_URL + "/api/v1/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: token,
                        email: email,
                        newPassword: newPassword
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                showToast('Password reset successful! Redirecting to login...', 'success');
                form.reset();

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
            } else {
                showToast(data.error || 'Failed to reset password. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = "Reset Password";
            }
        } catch (error) {
            console.error("Error:", error);
            showToast('Connection error. Please check if the server is running.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = "Reset Password";
        }
    });
});
