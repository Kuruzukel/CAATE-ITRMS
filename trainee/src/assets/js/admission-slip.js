document.getElementById('pictureUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const pictureBox = document.querySelector('.picture-upload-box');
            pictureBox.innerHTML = `<img src="${event.target.result}" alt="Applicant Photo">`;
        };
        reader.readAsDataURL(file);
    }
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
    const pictureBox = document.querySelector('.picture-upload-box');
    pictureBox.innerHTML = `<span>PICTURE<br>(Passport<br>size)</span>`;
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
