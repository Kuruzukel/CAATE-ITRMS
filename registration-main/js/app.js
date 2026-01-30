// Main application initialization and event listeners

// Event listeners for form buttons
document.getElementById('printBtn').addEventListener('click', function() {
    if (form.validate()) {
        form.populatePrintView();
        setTimeout(() => {
            window.print();
        }, 100);
    } else {
        alert('Please fill in all required fields before submitting.');
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    // Save form data to localStorage
    const formData = {
        // T2MIS
        uliNumber: document.getElementById('uliNumber').value,
        entryDate: document.getElementById('entryDate').value,
        
        // Learner Profile
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        extensionName: document.getElementById('extensionName').value,
        addressNumber: document.getElementById('addressNumber').value,
        street: document.getElementById('street').value,
        barangay: document.getElementById('barangay').value,
        district: document.getElementById('district').value,
        city: document.getElementById('city').value,
        province: document.getElementById('province').value,
        region: document.getElementById('region').value,
        email: document.getElementById('email').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        nationality: document.getElementById('nationality').value,
        
        // Personal Information
        sex: document.querySelector('input[name="sex"]:checked')?.value || '',
        civilStatus: document.querySelector('input[name="civilStatus"]:checked')?.value || '',
        employmentStatus: document.querySelector('input[name="employmentStatus"]:checked')?.value || '',
        birthDate: document.getElementById('birthDate').value,
        age: document.getElementById('age').value,
        birthCity: document.getElementById('birthCity').value,
        birthProvince: document.getElementById('birthProvince').value,
        birthRegion: document.getElementById('birthRegion').value,
        education: document.querySelector('input[name="education"]:checked')?.value || '',
        guardianName: document.getElementById('guardianName').value,
        guardianAddress: document.getElementById('guardianAddress').value,
        
        // Course & Scholarship
        courseTitle: document.getElementById('courseTitle').value,
        scholarshipType: document.getElementById('scholarshipType').value,
        
        // Consent & Signature
        dataPrivacyConsent: document.querySelector('input[name="dataPrivacyConsent"]:checked')?.value || '',
        dateAccomplished: document.getElementById('dateAccomplished').value,
        registrarName: document.getElementById('registrarName').value,
        dateReceived: document.getElementById('dateReceived').value,
        
        savedAt: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('tesdaFormData', JSON.stringify(formData));
        alert('✅ Form data saved successfully!\n\nYour data has been saved locally and can be restored later.');
    } catch (e) {
        alert('⚠️ Unable to save form data. Please check your browser settings.');
    }
});

// Remove error styling on input
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', function() {
        this.classList.remove('error');
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.remove('show');
        }
    });

    field.addEventListener('change', function() {
        this.classList.remove('error');
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.remove('show');
        }
    });
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initSignaturePad();
    
    // Set today's date as default for entry date and date accomplished
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
    document.getElementById('dateAccomplished').value = today;

    // Set default nationality
    document.getElementById('nationality').value = 'Filipino';

    // Auto-calculate age from birthdate
    document.getElementById('birthDate').addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        document.getElementById('age').value = age >= 0 ? age : '';
    });
    
    // Check if there's saved data and offer to load it
    const savedData = localStorage.getItem('tesdaFormData');
    if (savedData) {
        const loadSaved = confirm('📋 Found previously saved form data!\n\nWould you like to load your saved data?');
        if (loadSaved) {
            loadFormData();
        }
    }
});

// Function to load saved form data
function loadFormData() {
    try {
        const savedData = localStorage.getItem('tesdaFormData');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        
        // Load all text inputs
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element && formData[key]) {
                element.value = formData[key];
            }
        });
        
        // Load radio buttons
        if (formData.sex) {
            const sexRadio = document.querySelector(`input[name="sex"][value="${formData.sex}"]`);
            if (sexRadio) sexRadio.checked = true;
        }
        if (formData.civilStatus) {
            const civilRadio = document.querySelector(`input[name="civilStatus"][value="${formData.civilStatus}"]`);
            if (civilRadio) civilRadio.checked = true;
        }
        if (formData.employmentStatus) {
            const empRadio = document.querySelector(`input[name="employmentStatus"][value="${formData.employmentStatus}"]`);
            if (empRadio) empRadio.checked = true;
        }
        if (formData.education) {
            const eduRadio = document.querySelector(`input[name="education"][value="${formData.education}"]`);
            if (eduRadio) eduRadio.checked = true;
        }
        if (formData.dataPrivacyConsent) {
            const consentRadio = document.querySelector(`input[name="dataPrivacyConsent"][value="${formData.dataPrivacyConsent}"]`);
            if (consentRadio) consentRadio.checked = true;
        }
        
        alert('✅ Form data loaded successfully!');
    } catch (e) {
        alert('⚠️ Error loading saved data.');
    }
}

// Prevent accidental page unload
window.addEventListener('beforeunload', function(e) {
    const hasData = document.getElementById('lastName').value || 
                   document.getElementById('firstName').value;
    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('data:text/javascript;base64,c2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgZnVuY3Rpb24oZXZlbnQpIHsKICBzZWxmLnNraXBXYWl0aW5nKCk7Cn0pOwoKc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7CiAgcmV0dXJuIHNlbGYuY2xpZW50cy5jbGFpbSgpOwp9KTs=')
            .catch(function() {
                // Service worker registration failed, app still works offline
            });
    });
}
