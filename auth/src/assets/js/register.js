/**
 * CAATE Register Page JavaScript
 * Handles registration form functionality, password visibility toggle, and validation
 */

// Password validation function
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('formAuthentication');

    // Password toggle for password field
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');

    if (togglePasswordBtn && passwordInput && togglePasswordIcon) {
        togglePasswordBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const currentType = passwordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';

            passwordInput.setAttribute('type', newType);

            // Toggle icon
            if (newType === 'text') {
                togglePasswordIcon.classList.remove('bx-hide');
                togglePasswordIcon.classList.add('bx-show');
            } else {
                togglePasswordIcon.classList.remove('bx-show');
                togglePasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Password toggle for confirm password field
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleConfirmPasswordIcon = document.getElementById('toggleConfirmPasswordIcon');

    if (toggleConfirmPasswordBtn && confirmPasswordInput && toggleConfirmPasswordIcon) {
        toggleConfirmPasswordBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const currentType = confirmPasswordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';

            confirmPasswordInput.setAttribute('type', newType);

            // Toggle icon
            if (newType === 'text') {
                toggleConfirmPasswordIcon.classList.remove('bx-hide');
                toggleConfirmPasswordIcon.classList.add('bx-show');
            } else {
                toggleConfirmPasswordIcon.classList.remove('bx-show');
                toggleConfirmPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsCheckbox = document.getElementById('terms-conditions');

            // Check if passwords match
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match. Please try again.');
                return false;
            }

            // Validate password strength
            if (!validatePassword(password)) {
                e.preventDefault();
                alert('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
                return false;
            }

            // Check if terms are accepted
            if (!termsCheckbox.checked) {
                e.preventDefault();
                alert('Please agree to the privacy policy and terms to continue.');
                return false;
            }

            // If all validations pass, form will submit
        });

        // Real-time password match validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        confirmPasswordInput.addEventListener('input', function () {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;

            if (confirmPassword && password !== confirmPassword) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
