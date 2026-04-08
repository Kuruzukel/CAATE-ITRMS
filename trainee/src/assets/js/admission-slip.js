// Toast notification function
function ensureToastContainer() {
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    container.classList.add('toast-container');
    return container;
}

function showToast(message, type = 'success') {
    const container = ensureToastContainer();

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

function setupSignatureCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getCanvasCoordinates(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
}

function clearSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
}

function confirmReset() {
    document.getElementById('admissionSlipForm').reset();
    clearSignature('signatureCanvas1');
    clearSignature('signatureCanvas2');

    const pictureInput = document.getElementById('picture');
    const placeholder = document.getElementById('picturePlaceholder');
    const previewContainer = document.getElementById('picturePreviewContainer');
    const preview = document.getElementById('picturePreview');

    if (pictureInput) pictureInput.value = '';
    if (preview) preview.src = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';

    const resetModal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
    if (resetModal) resetModal.hide();

    showToast('Form has been reset successfully!', 'success');
}

function confirmPrint() {
    const printModal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    if (printModal) printModal.hide();

    setTimeout(() => {
        window.print();
    }, 300);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admission Slip JS Loaded');

    // Ensure toast container exists
    ensureToastContainer();

    // Setup signature canvases
    setupSignatureCanvas('signatureCanvas1');
    setupSignatureCanvas('signatureCanvas2');

    // Phone number formatting function
    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 4) {
            return digits;
        } else if (digits.length <= 7) {
            return digits.slice(0, 4) + ' ' + digits.slice(4);
        } else if (digits.length <= 11) {
            return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
        }
        return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
    }

    // Setup phone number formatting for Tel. Number field
    const telField = document.getElementById('telNumber');
    if (telField) {
        telField.addEventListener('input', function (e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatPhoneNumber(oldValue);

            if (oldValue !== newValue) {
                e.target.value = newValue;

                let newCursorPosition = cursorPosition;
                if (newValue.length > oldValue.length) {
                    newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
                }
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });

        telField.addEventListener('keypress', function (e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 46) {
                e.preventDefault();
            }
        });
    }

    // Picture upload handler
    const pictureInput = document.getElementById('picture');
    if (pictureInput) {
        pictureInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showToast('Please upload an image file', 'error');
                    this.value = '';
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    showToast('Image size should not exceed 2MB', 'error');
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
    }

    // View picture button
    const viewPictureBtn = document.getElementById('viewPictureBtn');
    if (viewPictureBtn) {
        viewPictureBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const preview = document.getElementById('picturePreview');
            if (preview && preview.src) {
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

                modal.addEventListener('hidden.bs.modal', function () {
                    document.body.removeChild(modal);
                });
            }
        });
    }

    // Remove picture button
    const removePictureBtn = document.getElementById('removePictureBtn');
    if (removePictureBtn) {
        removePictureBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const pictureInput = document.getElementById('picture');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            const preview = document.getElementById('picturePreview');

            if (pictureInput) pictureInput.value = '';
            if (preview) preview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        });
    }

    // Form validation on submit
    const form = document.getElementById('admissionSlipForm');
    if (form) {
        console.log('Form found, attaching submit handler');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted, validating...');

            let isValid = true;

            // Remove all previous invalid classes
            form.querySelectorAll('.is-invalid').forEach(field => {
                field.classList.remove('is-invalid');
            });

            // Define required fields
            const requiredFields = [
                { id: 'applicantName', label: 'Name of Applicant' },
                { id: 'telNumber', label: 'Tel. Number' },
                { id: 'assessmentApplied', label: 'Assessment Applied for' },
                { id: 'applicantPrintedName', label: 'Printed Name' },
                { id: 'applicantDate', label: 'Date' }
            ];

            const missingFields = [];

            // Validate each required field
            requiredFields.forEach(field => {
                const element = document.getElementById(field.id);
                console.log(`Checking field: ${field.id}`, element, element ? element.value : 'not found');

                if (element && (!element.value || element.value.trim() === '')) {
                    element.classList.add('is-invalid');
                    missingFields.push(field.label);
                    isValid = false;
                    console.log(`Field ${field.id} is invalid`);
                }
            });

            if (!isValid) {
                console.log('Form is invalid, showing error');

                // Scroll to first invalid field
                const firstInvalidField = form.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Show error toast
                showToast('Please complete all required fields.', 'error');
                return false;
            }

            // If validation passes, show success
            console.log('Form is valid!');
            showToast('Admission slip submitted successfully!', 'success');

            // You can add actual form submission logic here
            // setTimeout(() => {
            //     form.reset();
            //     clearSignature('signatureCanvas1');
            //     clearSignature('signatureCanvas2');
            // }, 1500);
        });

        // Remove invalid class when user starts typing
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            field.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });

            field.addEventListener('change', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    } else {
        console.error('Form not found!');
    }
});
