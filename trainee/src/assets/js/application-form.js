// Application Form JavaScript

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

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should not exceed 5MB');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById('picturePreview');
            const placeholder = document.getElementById('picturePlaceholder');
            preview.src = event.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Signature canvas functionality
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    [lastX, lastY] = [x, y];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    [lastX, lastY] = [x, y];
});

canvas.addEventListener('touchend', () => isDrawing = false);

// Clear signature
document.querySelector('.btn-clear').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    // Validate required fields
    if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');

        // Scroll to first invalid field
        const firstInvalid = this.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
        }

        alert('Please fill in all required fields');
        return;
    }

    // Check if signature is drawn
    if (!hasSignature()) {
        alert('Please provide your signature');
        document.getElementById('signatureCanvas').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Check if picture is uploaded
    const picture = document.getElementById('picture');
    if (!picture.files.length) {
        alert('Please upload your picture');
        document.getElementById('picture').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // If all validations pass
    if (confirm('Are you sure you want to submit this application?')) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Submitting...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Application submitted successfully!');
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Optionally reset form or redirect
            // this.reset();
            // window.location.href = 'dashboard.html';
        }, 2000);

        // Here you would typically send the data to your backend
        // Example:
        // const formData = new FormData(this);
        // fetch('/api/submit-application', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert('Application submitted successfully!');
        //     window.location.href = 'dashboard.html';
        // })
        // .catch(error => {
        //     alert('Error submitting application. Please try again.');
        //     console.error('Error:', error);
        // });
    }
});

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
    preview.style.display = 'none';
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
    console.log('Form auto-saved');
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
                // Skip file inputs - they can't be programmatically set for security reasons
                field.value = data[key];
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

console.log('Application Form JS loaded successfully');
