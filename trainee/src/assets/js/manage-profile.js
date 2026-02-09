// Manage Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeProfileTabs();
    initializeAvatarUpload();
    initializeFormValidation();
    initializePasswordStrength();
    initializeProfileForm();
});

// Tab management
function initializeProfileTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Avatar upload functionality
function initializeAvatarUpload() {
    const avatarUpload = document.querySelector('.avatar-upload');
    const avatarInput = document.querySelector('#avatar-input');
    const profileAvatar = document.querySelector('.profile-avatar img');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');

    if (!avatarUpload || !avatarInput) return;

    avatarUpload.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file && validateImageFile(file)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (profileAvatar) {
                    profileAvatar.src = e.target.result;
                    profileAvatar.style.display = 'block';
                }
                if (avatarPlaceholder) {
                    avatarPlaceholder.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

function validateImageFile(file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
        showNotification('Image size must be less than 2MB', 'error');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        showNotification('Only JPG and PNG images are allowed', 'error');
        return false;
    }

    return true;
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this);
            }
        });
    });
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

    // Password validation
    if (fieldName === 'current_password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters';
        }
    }

    if (fieldName === 'new_password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'New password must be at least 8 characters';
        }
    }

    if (fieldName === 'confirm_password' && value) {
        const newPassword = document.querySelector('input[name="new_password"]');
        if (newPassword && value !== newPassword.value) {
            isValid = false;
            errorMessage = 'Passwords do not match';
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

function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Password strength indicator
function initializePasswordStrength() {
    const newPasswordInput = document.querySelector('input[name="new_password"]');
    const strengthIndicator = document.querySelector('.password-strength');

    if (!newPasswordInput || !strengthIndicator) return;

    newPasswordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrength(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Special character');

    const levels = ['weak', 'fair', 'good', 'strong'];
    const level = score <= 1 ? 'weak' : score <= 2 ? 'fair' : score <= 3 ? 'good' : 'strong';

    return { score, level, feedback };
}

function updatePasswordStrength(strength) {
    const strengthIndicator = document.querySelector('.password-strength');
    const strengthBar = strengthIndicator.querySelector('.strength-bar');
    const strengthText = strengthIndicator.querySelector('.strength-text');

    // Update bar
    strengthBar.className = `strength-bar strength-${strength.level}`;

    // Update text
    const labels = {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
    };

    strengthText.textContent = labels[strength.level];
    strengthText.className = `strength-text strength-${strength.level}`;
}

// Profile form initialization
function initializeProfileForm() {
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

    // Initialize date inputs
    const birthdateInput = document.querySelector('input[name="birthdate"]');
    if (birthdateInput) {
        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        birthdateInput.max = today;

        // Calculate age when birthdate changes
        birthdateInput.addEventListener('change', function () {
            const birthDate = new Date(this.value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            const ageInput = document.querySelector('input[name="age"]');
            if (ageInput) {
                ageInput.value = age;
            }
        });
    }
}

// Form submission
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Saving...';

    // Get form data
    const formData = new FormData(form);
    const formType = form.getAttribute('data-form-type') || 'profile';

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Show success message
        const messages = {
            profile: 'Profile updated successfully!',
            password: 'Password changed successfully!',
            preferences: 'Preferences saved successfully!'
        };

        showNotification(messages[formType] || 'Changes saved successfully!', 'success');

        // Update last modified info
        updateLastModified();

    }, 1500);
}

function updateLastModified() {
    const lastModified = document.querySelector('.info-value[data-field="last-modified"]');
    if (lastModified) {
        const now = new Date();
        lastModified.textContent = now.toLocaleDateString() + ' at ' + now.toLocaleTimeString();
    }
}

// Activity tracking
function addActivity(title, type = 'update') {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';

    const icons = {
        update: 'bx-edit',
        login: 'bx-log-in',
        password: 'bx-key',
        upload: 'bx-upload'
    };

    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="bx ${icons[type] || icons.update}"></i>
        </div>
        <div class="activity-content">
            <div class="activity-title">${title}</div>
            <div class="activity-time">Just now</div>
        </div>
    `;

    // Add to top of list
    activityList.insertBefore(activityItem, activityList.firstChild);

    // Keep only last 5 activities
    const activities = activityList.querySelectorAll('.activity-item');
    if (activities.length > 5) {
        activities[activities.length - 1].remove();
    }
}

// Progress updates
function updateProgress(courseId, progress) {
    const progressItem = document.querySelector(`[data-course="${courseId}"]`);
    if (!progressItem) return;

    const progressFill = progressItem.querySelector('.progress-fill');
    const progressPercentage = progressItem.querySelector('.progress-percentage');

    if (progressFill) {
        progressFill.style.width = progress + '%';
    }

    if (progressPercentage) {
        progressPercentage.textContent = progress + '%';
    }
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

// Initialize profile data
function loadProfileData() {
    // This would typically load data from an API
    // For now, we'll simulate with sample data
    const sampleData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        birthdate: '1995-06-15',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
    };

    // Populate form fields
    Object.keys(sampleData).forEach(key => {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = sampleData[key];
        }
    });
}

// Export functions for external use
window.ProfileManager = {
    updateProgress,
    addActivity,
    showNotification,
    loadProfileData
};
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