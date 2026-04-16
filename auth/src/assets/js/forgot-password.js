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
    }, 8000); // Changed from 5000 to 8000 (8 seconds)
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAuthentication");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validate email
        if (!email) {
            showToast('Please enter your email address', 'error');
            document.getElementById("email").focus();
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            document.getElementById("email").focus();
            return;
        }

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const response = await fetch(
                API_BASE_URL + "/api/v1/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await response.json();

            if (data.success) {
                // Show success toast
                showToast(data.message || 'If an account exists with this email, a password reset link has been sent.', 'success');

                // Clear the form
                form.reset();

                // Redirect to login after 8 seconds (matching toast duration)
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 8000);
            } else {
                showToast(data.error || 'An error occurred. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Reset Link";
            }
        } catch (error) {
            console.error("Error:", error);
            showToast('Connection error. Please check if the server is running.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Reset Link";
        }
    });
});
