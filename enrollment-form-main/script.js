// Auto-advance to next input box for letter boxes
document.addEventListener('DOMContentLoaded', function() {
    // Photo upload functionality for main form
    const photoUpload = document.getElementById('photoUpload');
    const pictureContent = document.getElementById('pictureContent');
    const uploadedPhoto = document.getElementById('uploadedPhoto');
    
    if (photoUpload && pictureContent && uploadedPhoto) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedPhoto.src = event.target.result;
                    uploadedPhoto.style.display = 'block';
                    pictureContent.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        uploadedPhoto.addEventListener('click', function(e) {
            e.stopPropagation();
            photoUpload.click();
        });
    }

    // Photo upload functionality for admission slip
    const photoUpload2 = document.getElementById('photoUpload2');
    const pictureContent2 = document.getElementById('pictureContent2');
    const uploadedPhoto2 = document.getElementById('uploadedPhoto2');
    
    if (photoUpload2 && pictureContent2 && uploadedPhoto2) {
        photoUpload2.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedPhoto2.src = event.target.result;
                    uploadedPhoto2.style.display = 'block';
                    pictureContent2.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        uploadedPhoto2.addEventListener('click', function(e) {
            e.stopPropagation();
            photoUpload2.click();
        });
    }

    // Handle letter boxes auto-advance
    const letterBoxes = document.querySelectorAll('.letter-box, .color-box, .uli-box, .birth-box, .middle-initial-box, .extension-box');
    
    letterBoxes.forEach((box) => {
        box.addEventListener('input', function() {
            // Convert to uppercase
            this.value = this.value.toUpperCase();
            
            if (this.value.length === parseInt(this.getAttribute('maxlength')) || this.value.length === 1) {
                // Find next input in the same container
                const container = this.closest('.letter-boxes, .reference-grid, .uli-grid, .birth-boxes, .middle-initial-boxes, .extension-boxes');
                if (container) {
                    const inputs = Array.from(container.querySelectorAll('input[type="text"]'));
                    const currentIndex = inputs.indexOf(this);
                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    }
                }
            }
        });

        // Handle backspace to go to previous box
        box.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                const container = this.closest('.letter-boxes, .reference-grid, .uli-grid, .birth-boxes, .middle-initial-boxes, .extension-boxes');
                if (container) {
                    const inputs = Array.from(container.querySelectorAll('input[type="text"]'));
                    const currentIndex = inputs.indexOf(this);
                    if (currentIndex > 0) {
                        inputs[currentIndex - 1].focus();
                    }
                }
            }
        });
    });

    // Auto-uppercase for all text inputs
    const allTextInputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], textarea');
    allTextInputs.forEach(input => {
        input.addEventListener('input', function() {
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(start, end);
        });
    });

    // Auto-expand table inputs to fit content
    const tableInputs = document.querySelectorAll('.table-input');
    tableInputs.forEach(input => {
        // Function to adjust height
        const adjustHeight = () => {
            input.style.height = 'auto';
            const newHeight = Math.max(30, input.scrollHeight);
            input.style.height = newHeight + 'px';
            
            // Also adjust parent td height
            const td = input.closest('td');
            if (td) {
                td.style.height = 'auto';
            }
        };
        
        // Adjust on input
        input.addEventListener('input', adjustHeight);
        
        // Adjust on load if there's content
        if (input.value) {
            adjustHeight();
        }
        
        // Adjust on focus
        input.addEventListener('focus', adjustHeight);
    });

    // Auto-calculate age from birthdate
    const birthBoxes = document.querySelectorAll('.birth-box');
    const ageInput = document.querySelector('.age-input');
    
    if (birthBoxes.length === 3 && ageInput) {
        birthBoxes.forEach(box => {
            box.addEventListener('change', calculateAge);
        });
    }

    function calculateAge() {
        const month = birthBoxes[0].value;
        const day = birthBoxes[1].value;
        const year = birthBoxes[2].value;

        if (month && day && year && year.length === 4) {
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            ageInput.value = age;
        }
    }

    // Ensure only one checkbox is selected in mutually exclusive groups
    const sexCheckboxes = document.querySelectorAll('#male, #female');
    sexCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                sexCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    const civilStatusCheckboxes = document.querySelectorAll('#single, #married, #widower, #separated');
    civilStatusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                civilStatusCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });
});

// Load saved form data on page load
window.addEventListener('load', loadForm);

// Print function with instructions
function printForm() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <h2 style="color: #0066cc; margin-bottom: 20px;">Print Instructions</h2>
        <p style="margin-bottom: 15px; text-align: left; line-height: 1.6;">
            To remove the <strong>date/time</strong> and <strong>file path</strong> from your printout:
        </p>
        <ol style="text-align: left; line-height: 1.8; margin-bottom: 20px;">
            <li>In the print dialog, click <strong>"More settings"</strong></li>
            <li><strong>UNCHECK</strong> the box that says <strong>"Headers and footers"</strong></li>
            <li>Click <strong>Print</strong> or <strong>Save as PDF</strong></li>
        </ol>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This will give you a clean printout without browser-generated text.
        </p>
        <button onclick="document.body.removeChild(this.parentElement.parentElement); window.print();" 
                style="background: #4caf50; color: white; border: none; padding: 12px 30px; 
                       border-radius: 5px; font-size: 16px; cursor: pointer; margin-right: 10px;">
            OK, Print Now
        </button>
        <button onclick="document.body.removeChild(this.parentElement.parentElement);" 
                style="background: #999; color: white; border: none; padding: 12px 30px; 
                       border-radius: 5px; font-size: 16px; cursor: pointer;">
            Cancel
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Save form data to localStorage and download as file
function saveForm() {
    // Collect all form data
    const formData = {
        // Basic info
        schoolName: document.getElementById('schoolName')?.value || '',
        schoolAddress: document.getElementById('schoolAddress')?.value || '',
        assessmentTitle: document.getElementById('assessmentTitle')?.value || '',
        
        // Reference numbers
        referenceNumbers: [],
        uliNumbers: [],
        
        // Name boxes
        surname: [],
        firstname: [],
        middlename: [],
        
        // Personal info
        sex: document.getElementById('male')?.checked ? 'Male' : (document.getElementById('female')?.checked ? 'Female' : ''),
        civilStatus: document.getElementById('single')?.checked ? 'Single' : 
                     (document.getElementById('married')?.checked ? 'Married' : 
                     (document.getElementById('widower')?.checked ? 'Widower' : 
                     (document.getElementById('separated')?.checked ? 'Separated' : ''))),
        
        // Tables data
        workExperience: [],
        trainingSeminars: [],
        licensureExam: [],
        competencyAssessment: [],
        
        timestamp: new Date().toISOString(),
        formVersion: '1.0'
    };
    
    // Collect reference number boxes
    document.querySelectorAll('.reference-grid .color-box').forEach(box => {
        formData.referenceNumbers.push(box.value);
    });
    
    // Collect ULI boxes
    document.querySelectorAll('.uli-grid .uli-box').forEach(box => {
        formData.uliNumbers.push(box.value);
    });
    
    // Collect name letter boxes
    document.querySelectorAll('.name-row:nth-child(1) .letter-box').forEach(box => {
        formData.surname.push(box.value);
    });
    
    document.querySelectorAll('.name-row:nth-child(2) .letter-box').forEach(box => {
        formData.firstname.push(box.value);
    });
    
    document.querySelectorAll('.name-row:nth-child(3) .letter-box').forEach(box => {
        formData.middlename.push(box.value);
    });
    
    // Collect table data
    document.querySelectorAll('.work-experience tbody tr').forEach(row => {
        const inputs = row.querySelectorAll('.table-input');
        if (inputs.length > 0) {
            formData.workExperience.push({
                company: inputs[0]?.value || '',
                position: inputs[1]?.value || '',
                dates: inputs[2]?.value || '',
                salary: inputs[3]?.value || '',
                status: inputs[4]?.value || '',
                years: inputs[5]?.value || ''
            });
        }
    });
    
    try {
        // Save to localStorage as backup
        localStorage.setItem('tesdaFormData', JSON.stringify(formData));
        
        // Create downloadable file
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(dataBlob);
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        downloadLink.download = `TESDA_Form_${timestamp}.json`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: bold;
        `;
        successMsg.textContent = 'Form saved to your device!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 3000);
    } catch (error) {
        alert('Error saving form data. Please try again.');
        console.error('Save error:', error);
    }
}

// Load saved form data
function loadForm() {
    try {
        const savedData = localStorage.getItem('tesdaFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            if (formData.schoolName) document.getElementById('schoolName').value = formData.schoolName;
            if (formData.schoolAddress) document.getElementById('schoolAddress').value = formData.schoolAddress;
            if (formData.assessmentTitle) document.getElementById('assessmentTitle').value = formData.assessmentTitle;
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
}

// Validate required fields
function validateForm() {
    const requiredFields = [
        { id: 'schoolName', label: 'School/Training Center/Company Name' },
        { id: 'schoolAddress', label: 'School Address' },
        { id: 'assessmentTitle', label: 'Assessment Title' }
    ];
    
    const emptyFields = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !element.value.trim()) {
            emptyFields.push(field.label);
            element.style.borderColor = 'red';
            element.style.borderWidth = '2px';
        } else if (element) {
            element.style.borderColor = '';
            element.style.borderWidth = '';
        }
    });
    
    if (emptyFields.length > 0) {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
        `;
        
        errorMsg.innerHTML = `
            <h3 style="color: #d32f2f; margin-bottom: 15px;">Required Fields Missing</h3>
            <p style="margin-bottom: 15px;">Please fill in the following required fields:</p>
            <ul style="text-align: left; margin-bottom: 20px; line-height: 1.8;">
                ${emptyFields.map(field => `<li>${field}</li>`).join('')}
            </ul>
            <button onclick="document.body.removeChild(this.parentElement);" 
                    style="background: #0066cc; color: white; border: none; padding: 10px 30px; 
                           border-radius: 5px; font-size: 14px; cursor: pointer;">
                OK
            </button>
        `;
        
        document.body.appendChild(errorMsg);
        return false;
    }
    
    return true;
}

// Smooth scroll to page 2
function scrollToPage2() {
    const page2 = document.querySelector('.page-2');
    if (page2) {
        page2.scrollIntoView({ behavior: 'smooth' });
    }
}
