// Certificate Management JavaScript
// Handles certificate viewing, downloading, and printing

// View Certificate
function viewCertificate(courseName, courseCode, completionDate, certNumber, grade) {
    document.getElementById('certCourseName').textContent = courseName;
    document.getElementById('certCourseCode').textContent = courseCode;
    document.getElementById('certCompletionDate').textContent = completionDate;
    document.getElementById('certNumber').textContent = certNumber;
    document.getElementById('certGrade').textContent = grade;

    const modal = new bootstrap.Modal(document.getElementById('certificateModal'));
    modal.show();
}

// Download Certificate
function downloadCertificate() {
    const certificate = document.getElementById('certificateContent');

    html2canvas(certificate, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        width: certificate.offsetWidth,
        height: certificate.offsetHeight
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'CAATE_Certificate_' + document.getElementById('certNumber').textContent + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Print Certificate
function printCertificate() {
    const printWindow = window.open('', '_blank');
    const certificateContent = document.getElementById('certificateContent').innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate</title>
            <style>
                @page { 
                    size: 11in 8.5in;
                    margin: 0; 
                }
                body { 
                    margin: 0; 
                    padding: 0;
                    width: 11in;
                    height: 8.5in;
                }
                @media print {
                    body { 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                    }
                }
            </style>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div style="padding: 40px; width: 11in; height: 8.5in;">
                ${certificateContent}
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 500);
}

