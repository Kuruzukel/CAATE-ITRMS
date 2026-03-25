// Application Form JavaScript

console.log('Application Form JS loaded - Version: 2026-03-16 - District removed, Province input, Zip number');

// API Configuration - Use global API_BASE_URL if available
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

// Load courses for assessment title dropdown
async function loadCoursesForDropdown() {
    const dropdown = document.getElementById('assessmentTitle');
    const loadingIndicator = document.getElementById('assessmentTitleLoading');
    const errorIndicator = document.getElementById('assessmentTitleError');

    try {
        // Show loading
        if (loadingIndicator) loadingIndicator.classList.remove('d-none');
        if (errorIndicator) errorIndicator.classList.add('d-none');

        // Fetch courses from competencies API
        const response = await fetch(`${window.API_BASE_URL}/api/v1/competencies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            // Clear existing options except the first one
            dropdown.innerHTML = '<option value="">Select an assessment...</option>';

            // Add course options
            result.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.title || 'Untitled Course';
                option.textContent = course.title || 'Untitled Course';
                dropdown.appendChild(option);
            });

            // Hide loading
            if (loadingIndicator) loadingIndicator.classList.add('d-none');
        } else {
            throw new Error('No assessments found');
        }
    } catch (error) {
        console.error('Error loading assessments for dropdown:', error);

        // Show error
        if (loadingIndicator) loadingIndicator.classList.add('d-none');
        if (errorIndicator) errorIndicator.classList.remove('d-none');

        // Add a fallback option
        dropdown.innerHTML = `
            <option value="">Select an assessment...</option>
            <option value="Manual Entry">Manual Entry (Type your assessment)</option>
        `;
    }
}

// Initialize course loading when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadCoursesForDropdown();
});

// Picture upload handler
document.getElementById('picture').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            this.value = '';
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should not exceed 2MB');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById('picturePreview');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');

            preview.src = event.target.result;
            placeholder.style.display = 'none';
            previewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
});

// Picture action buttons
document.addEventListener('DOMContentLoaded', function () {
    // View picture button
    document.getElementById('viewPictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const preview = document.getElementById('picturePreview');
        if (preview.src) {
            // Create modal to view full image
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Picture Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${preview.src}" class="img-fluid" style="max-height: 70vh;">
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();

            // Remove modal from DOM when hidden
            modal.addEventListener('hidden.bs.modal', function () {
                document.body.removeChild(modal);
            });
        }
    });

    // Remove picture button
    document.getElementById('removePictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const pictureInput = document.getElementById('picture');
        const placeholder = document.getElementById('picturePlaceholder');
        const previewContainer = document.getElementById('picturePreviewContainer');
        const preview = document.getElementById('picturePreview');

        // Clear the input
        pictureInput.value = '';

        // Reset display
        preview.src = '';
        previewContainer.style.display = 'none';
        placeholder.style.display = 'flex';
    });
});

// Signature canvas functionality
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Function to get correct coordinates accounting for canvas scaling
function getCanvasCoordinates(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// Function to resize canvas to match display size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set drawing properties
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// Initialize canvas size
resizeCanvas();

// Resize canvas when window resizes
window.addEventListener('resize', resizeCanvas);

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const coords = getCanvasCoordinates(e, canvas);
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch, canvas);
    isDrawing = true;
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch, canvas);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('touchend', () => isDrawing = false);

// Clear signature
document.querySelector('.btn-clear').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reapply drawing properties after clearing
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
});

// Calculate age from birthdate
document.getElementById('birthDate').addEventListener('change', function () {
    const birthDate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    document.getElementById('age').value = age >= 0 ? age : '';
});

// Work Experience Row Functions
function addWorkRow() {
    const tbody = document.getElementById('workExperienceBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="workCompany[]" autocomplete="off"></td>
        <td><input type="text" name="workPosition[]" autocomplete="off"></td>
        <td><input type="text" name="workDates[]" placeholder="MM/YYYY - MM/YYYY" autocomplete="off"></td>
        <td><input type="text" name="workSalary[]" autocomplete="off"></td>
        <td><input type="text" name="workStatus[]" autocomplete="off"></td>
        <td><input type="number" name="workYears[]" step="0.1" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeWorkRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeWorkRow(btn) {
    const tbody = document.getElementById('workExperienceBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

// Training Row Functions
function addTrainingRow() {
    const tbody = document.getElementById('trainingBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="trainingTitle[]" autocomplete="off"></td>
        <td><input type="text" name="trainingVenue[]" autocomplete="off"></td>
        <td><input type="text" name="trainingDates[]" placeholder="MM/YYYY - MM/YYYY" autocomplete="off"></td>
        <td><input type="number" name="trainingHours[]" autocomplete="off"></td>
        <td><input type="text" name="trainingConductedBy[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeTrainingRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeTrainingRow(btn) {
    const tbody = document.getElementById('trainingBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

// Licensure Row Functions
function addLicensureRow() {
    const tbody = document.getElementById('licensureBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="licensureTitle[]" autocomplete="off"></td>
        <td><input type="number" name="licensureYear[]" min="1900" max="2100" autocomplete="off"></td>
        <td><input type="text" name="licensureVenue[]" autocomplete="off"></td>
        <td><input type="text" name="licensureRating[]" autocomplete="off"></td>
        <td><input type="text" name="licensureRemarks[]" autocomplete="off"></td>
        <td><input type="date" name="licensureExpiry[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeLicensureRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeLicensureRow(btn) {
    const tbody = document.getElementById('licensureBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

// Competency Row Functions
function addCompetencyRow() {
    const tbody = document.getElementById('competencyBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="competencyTitle[]" autocomplete="off"></td>
        <td><input type="text" name="competencyLevel[]" autocomplete="off"></td>
        <td><input type="text" name="competencySector[]" autocomplete="off"></td>
        <td><input type="text" name="competencyCert[]" autocomplete="off"></td>
        <td><input type="date" name="competencyIssuance[]" autocomplete="off"></td>
        <td><input type="date" name="competencyExpiry[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeCompetencyRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeCompetencyRow(btn) {
    const tbody = document.getElementById('competencyBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

// Check if signature canvas has content
function hasSignature() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data.some(channel => channel !== 0);
}

// Form validation and submission
document.getElementById('applicationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Show confirmation modal
    showConfirmationModal();
});

function showConfirmationModal() {
    // Show layout overlay
    const layoutOverlay = document.getElementById('layoutOverlay');
    if (layoutOverlay) {
        layoutOverlay.classList.add('active');
    }

    // Show confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // Add event listener for modal dismissal
    const modalElement = document.getElementById('confirmationModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
        // Hide layout overlay
        if (layoutOverlay) {
            layoutOverlay.classList.remove('active');
        }
    }, { once: true });

    // Add click event to overlay to close modal
    if (layoutOverlay) {
        layoutOverlay.addEventListener('click', () => {
            modal.hide();
        }, { once: true });
    }

    modal.show();
}

// Handle confirmed submission
document.addEventListener('DOMContentLoaded', function () {
    const confirmBtn = document.getElementById('confirmSubmitBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            handleConfirmedSubmit();
        });
    }
});

function handleConfirmedSubmit() {
    const form = document.getElementById('applicationForm');

    // Hide confirmation modal
    const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    if (confirmationModal) {
        confirmationModal.hide();
    }

    // Hide layout overlay
    const layoutOverlay = document.getElementById('layoutOverlay');
    if (layoutOverlay) {
        layoutOverlay.classList.remove('active');
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Submitting...';

    // Collect form data
    const formData = new FormData(form);
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

    // Add userId from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
        data.userId = userId;
    }

    // Add signature as base64
    const canvas = document.getElementById('signatureCanvas');
    if (canvas && hasSignature()) {
        data.signature = canvas.toDataURL();
    }

    // Add timestamp and status
    data.submittedAt = new Date().toISOString();
    data.status = 'pending';

    // Submit to database
    fetch(`${window.API_BASE_URL}/api/v1/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                // Show success toast
                showToast('Application submitted successfully! You will receive a confirmation email shortly.', 'success');

                // Reset form
                form.reset();

                // Clear signature
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Clear picture preview
                const preview = document.getElementById('picturePreview');
                const placeholder = document.getElementById('picturePlaceholder');
                const previewContainer = document.getElementById('picturePreviewContainer');
                preview.src = '';
                previewContainer.style.display = 'none';
                placeholder.style.display = 'flex';

                // Clear localStorage draft
                localStorage.removeItem('applicationFormDraft');
            } else {
                throw new Error(result.message || 'Failed to submit application');
            }
        })
        .catch(error => {
            console.error('Application submission error:', error);
            showToast(error.message || 'An error occurred while submitting the application', 'error');
        })
        .finally(() => {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

// Form reset handler
document.getElementById('applicationForm').addEventListener('reset', function (e) {
    if (!confirm('Are you sure you want to reset the form? All data will be lost.')) {
        e.preventDefault();
        return;
    }

    // Clear signature
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clear picture preview
    const preview = document.getElementById('picturePreview');
    const placeholder = document.getElementById('picturePlaceholder');
    const previewContainer = document.getElementById('picturePreviewContainer');
    preview.src = '';
    previewContainer.style.display = 'none';
    placeholder.style.display = 'flex';

    // Clear age field
    document.getElementById('age').value = '';
});

// Auto-save to localStorage (optional feature)
function autoSave() {
    const formData = new FormData(document.getElementById('applicationForm'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('applicationFormDraft', JSON.stringify(data));
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Load saved data on page load (optional)
window.addEventListener('load', function () {
    const savedData = localStorage.getItem('applicationFormDraft');
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById('applicationForm');

        for (let key in data) {
            const field = form.elements[key];
            if (field && field.type !== 'file') {
                // Handle radio buttons properly
                if (field.type === 'radio') {
                    // Only check the radio button if the saved value matches this radio's value
                    if (field.value === data[key]) {
                        field.checked = true;
                    }
                } else if (field.length) {
                    // Handle radio button groups (NodeList)
                    for (let i = 0; i < field.length; i++) {
                        if (field[i].type === 'radio' && field[i].value === data[key]) {
                            field[i].checked = true;
                        } else if (field[i].type !== 'radio') {
                            field[i].value = data[key];
                        }
                    }
                } else {
                    // Handle other input types
                    field.value = data[key];
                }
            }
        }
    }
});

// Confirmation functions for modals
function confirmResetApplication() {
    document.getElementById('applicationForm').reset();
    // Close modal
    const resetModal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
    resetModal.hide();
    // Show success message
    alert('Form has been reset successfully!');
}

function confirmSubmitApplication() {
    const form = document.getElementById('applicationForm');
    // You can add form validation here
    // For now, we'll just submit the form
    form.submit();
    // Close modal
    const submitModal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
    submitModal.hide();
}

function confirmPrintApplication() {
    // Close modal first
    const printModal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    printModal.hide();
    // Wait for modal to close, then print
    setTimeout(() => {
        window.print();
    }, 300);
}

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        // Create toast container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(newContainer);
        return showToast(message, type); // Retry with new container
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon}"></i>
        <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Menu toggle is handled by main.js - no need to duplicate here
document.addEventListener('DOMContentLoaded', function () {
    // Load courses for the assessment title dropdown
    loadCoursesForDropdown();

    // Initialize Philippine address dropdowns
    initializePhilippineAddressDropdowns();

    // Clear any problematic localStorage data that might auto-select radio buttons
    // Uncomment the line below if you want to clear all saved form data
    // localStorage.removeItem('applicationFormDraft');

    // Ensure all radio buttons start unchecked
    const assessmentRadios = document.querySelectorAll('input[name="assessmentType"]');
    assessmentRadios.forEach(radio => {
        radio.checked = false;
    });

    // Application form specific initialization can go here
});

// Philippine Address Dropdowns - DISABLED: All fields are now input fields
function initializePhilippineAddressDropdowns() {
    console.log('Philippine address dropdowns disabled - all fields are now input fields');
    // All address fields (region, province, city, barangay, district) are now input fields
    // No dropdown functionality needed

    // Add single digit enforcement for district field
    const districtField = document.getElementById('district');
    if (districtField) {
        // Prevent invalid keypress
        districtField.addEventListener('keypress', function (e) {
            // Allow only digits 1-9, backspace, delete, tab, escape, enter
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
            const isNumber = /[1-9]/.test(e.key);

            // If field already has a value and user tries to type another character
            if (this.value.length >= 1 && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }

            // Only allow digits 1-9
            if (!isNumber && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }

            // Don't allow 0
            if (e.key === '0') {
                e.preventDefault();
                return;
            }
        });

        // Clean up input on paste or other input events
        districtField.addEventListener('input', function (e) {
            let value = e.target.value;

            // Remove any non-digit characters
            value = value.replace(/[^1-9]/g, '');

            // Keep only the first digit
            if (value.length > 1) {
                value = value.charAt(0);
            }

            // Update the field value
            e.target.value = value;
        });

        // Prevent paste of invalid content
        districtField.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const validDigit = paste.match(/[1-9]/);
            if (validDigit) {
                this.value = validDigit[0];
            }
        });
    }

    // Add text-only validation for Barangay, City, and Province fields
    const textOnlyFields = ['barangay', 'city', 'province'];

    textOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Allow only letters, spaces, hyphens, apostrophes, and periods
            field.addEventListener('keypress', function (e) {
                const char = String.fromCharCode(e.which);
                const allowedPattern = /[a-zA-Z\s\-'\.]/;

                if (!allowedPattern.test(char) && e.which !== 8 && e.which !== 0) {
                    e.preventDefault();
                }
            });

            // Clean up any invalid characters on input
            field.addEventListener('input', function (e) {
                // Remove any characters that are not letters, spaces, hyphens, apostrophes, or periods
                const cleanValue = e.target.value.replace(/[^a-zA-Z\s\-'\.]/g, '');
                if (e.target.value !== cleanValue) {
                    e.target.value = cleanValue;
                }
            });
        }
    });

    // Phone number formatting for TEL, MOBILE, and FAX fields
    function formatPhoneNumber(value, type) {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');

        if (type === 'mobile') {
            // Mobile format: 0969 696 9696 (11 digits)
            if (digits.length <= 4) {
                return digits;
            } else if (digits.length <= 7) {
                return digits.slice(0, 4) + ' ' + digits.slice(4);
            } else if (digits.length <= 11) {
                return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
            }
            return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
        } else {
            // TEL and FAX format: (02) 123-4567
            if (digits.length <= 2) {
                return digits.length > 0 ? '(' + digits : '';
            } else if (digits.length <= 5) {
                return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
            } else if (digits.length <= 9) {
                return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 5) + '-' + digits.slice(5, 9);
            }
            return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 5) + '-' + digits.slice(5, 9);
        }
    }

    // Apply phone formatting to TEL, MOBILE, and FAX fields
    const phoneFields = [
        { id: 'tel', type: 'landline' },
        { id: 'mobile', type: 'mobile' },
        { id: 'fax', type: 'landline' }
    ];

    phoneFields.forEach(({ id, type }) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', function (e) {
                const cursorPosition = e.target.selectionStart;
                const oldValue = e.target.value;
                const newValue = formatPhoneNumber(oldValue, type);

                if (oldValue !== newValue) {
                    e.target.value = newValue;

                    // Adjust cursor position
                    let newCursorPosition = cursorPosition;
                    if (newValue.length > oldValue.length) {
                        newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
                    }
                    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            });

            // Handle keypress to allow only digits and control keys
            field.addEventListener('keypress', function (e) {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 46) {
                    e.preventDefault();
                }
            });
        }
    });
}
