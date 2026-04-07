document.getElementById('picture').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            this.value = '';
            return;
        }

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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('viewPictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const preview = document.getElementById('picturePreview');
        if (preview.src) {
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

    document.getElementById('removePictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const pictureInput = document.getElementById('picture');
        const placeholder = document.getElementById('picturePlaceholder');
        const previewContainer = document.getElementById('picturePreviewContainer');
        const preview = document.getElementById('picturePreview');

        pictureInput.value = '';

        preview.src = '';
        previewContainer.style.display = 'none';
        placeholder.style.display = 'flex';
    });
});

function setupSignatureCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

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
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        [lastX, lastY] = [x, y];
    });

    canvas.addEventListener('touchend', () => isDrawing = false);
}

function clearSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

setupSignatureCanvas('signatureCanvas1');
setupSignatureCanvas('signatureCanvas2');

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
    resetModal.hide();
    alert('Form has been reset successfully!');
}

function confirmSubmit() {
    const form = document.getElementById('admissionSlipForm');
    form.submit();
    const submitModal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
    submitModal.hide();
}

function confirmPrint() {
    const printModal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    printModal.hide();
    setTimeout(() => {
        window.print();
    }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
});
