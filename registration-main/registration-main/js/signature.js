// Signature pad functionality
function initSignaturePad() {
    const pad = document.getElementById('learnerSignaturePad');
    const canvas = document.getElementById('learnerSignature');
    const clearBtn = document.getElementById('clearLearnerSig');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    pad.addEventListener('click', function(e) {
        if (canvas.style.display === 'none') {
            canvas.style.display = 'block';
            clearBtn.style.display = 'inline-block';
            pad.querySelector('p').style.display = 'none';
        }
    });

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return { x, y };
    }

    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        lastX = coords.x;
        lastY = coords.y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}
