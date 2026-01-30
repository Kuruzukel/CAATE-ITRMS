// Form validation and handling
const form = {
    // Required fields for validation
    requiredFields: [
        'entryDate', 'lastName', 'firstName', 'barangay', 'city', 'province', 'region',
        'mobileNumber', 'nationality', 'birthDate', 'courseTitle', 'dateAccomplished'
    ],

    validate() {
        let isValid = true;
        
        // Validate required text/select fields
        this.requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorMsg = field.nextElementSibling;
            
            if (!field.value.trim()) {
                field.classList.add('error');
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.classList.add('show');
                }
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.classList.remove('show');
                }
            }
        });

        // Validate employment status radio
        const employmentStatus = document.querySelector('input[name="employmentStatus"]:checked');
        if (!employmentStatus) {
            const errorMsg = document.querySelector('input[name="employmentStatus"]').closest('.form-group').querySelector('.error-message');
            if (errorMsg) errorMsg.classList.add('show');
            isValid = false;
        }

        // Validate sex radio
        const sex = document.querySelector('input[name="sex"]:checked');
        if (!sex) {
            const errorMsg = document.querySelector('input[name="sex"]').closest('.form-group').querySelector('.error-message');
            if (errorMsg) errorMsg.classList.add('show');
            isValid = false;
        }

        // Validate civil status radio
        const civilStatus = document.querySelector('input[name="civilStatus"]:checked');
        if (!civilStatus) {
            const errorMsg = document.querySelector('input[name="civilStatus"]').closest('.form-group').querySelector('.error-message');
            if (errorMsg) errorMsg.classList.add('show');
            isValid = false;
        }

        // Validate education radio
        const education = document.querySelector('input[name="education"]:checked');
        if (!education) {
            const errorMsg = document.querySelector('input[name="education"]').closest('.form-group').querySelector('.error-message');
            if (errorMsg) errorMsg.classList.add('show');
            isValid = false;
        }

        // Validate data privacy consent
        const consent = document.querySelector('input[name="dataPrivacyConsent"]:checked');
        if (!consent) {
            const consentError = document.querySelector('input[name="dataPrivacyConsent"]').closest('.form-group').querySelector('.error-message');
            if (consentError) consentError.classList.add('show');
            isValid = false;
        }

        return isValid;
    },

    populatePrintView() {
        // Helper function to get value
        const getValue = (id) => {
            const el = document.getElementById(id);
            if (!el) return '';
            if (el.type === 'radio') {
                const checked = document.querySelector(`input[name="${id}"]:checked`);
                return checked ? checked.value : '';
            }
            return el.value || '';
        };

        // Populate all print fields
        const fields = [
            'uliNumber', 'entryDate', 'lastName', 'firstName', 'middleName', 'extensionName',
            'addressNumber', 'street', 'barangay', 'district', 'city', 'province', 'region',
            'email', 'mobileNumber', 'nationality', 'birthDate', 'age', 'birthCity',
            'birthProvince', 'birthRegion', 'guardianName', 'guardianAddress',
            'classificationOthers', 'multipleDisabilities', 'courseTitle', 'scholarshipType',
            'dateAccomplished', 'registrarName', 'dateReceived'
        ];

        fields.forEach(field => {
            const printEl = document.getElementById(`print-${field}`);
            if (printEl) {
                printEl.textContent = getValue(field);
            }
        });

        // Sex
        const sex = document.querySelector('input[name="sex"]:checked');
        document.getElementById('print-sex').textContent = sex ? sex.value : '';

        // Civil Status
        const civilStatus = document.querySelector('input[name="civilStatus"]:checked');
        document.getElementById('print-civilStatus').textContent = civilStatus ? civilStatus.value : '';

        // Employment status
        const employmentStatus = document.querySelector('input[name="employmentStatus"]:checked');
        document.getElementById('print-employmentStatus').textContent = employmentStatus ? employmentStatus.value : '';

        // Employment Type checkboxes
        const employmentTypes = [];
        document.querySelectorAll('input[name="employmentType"]:checked').forEach(cb => {
            employmentTypes.push(cb.value);
        });
        document.getElementById('print-employmentType').textContent = employmentTypes.join(', ') || 'N/A';

        // Education
        const education = document.querySelector('input[name="education"]:checked');
        document.getElementById('print-education').textContent = education ? education.value : '';

        // Classification checkboxes
        const classifications = [];
        document.querySelectorAll('input[name="classification"]:checked').forEach(cb => {
            classifications.push(cb.value);
        });
        document.getElementById('print-classification').textContent = classifications.join(', ') || 'None';

        // Disability Type checkboxes
        const disabilityTypes = [];
        document.querySelectorAll('input[name="disabilityType"]:checked').forEach(cb => {
            disabilityTypes.push(cb.value);
        });
        document.getElementById('print-disabilityType').textContent = disabilityTypes.join(', ') || 'N/A';

        // Disability Cause
        const disabilityCause = document.querySelector('input[name="disabilityCause"]:checked');
        document.getElementById('print-disabilityCause').textContent = disabilityCause ? disabilityCause.value : 'N/A';

        // Privacy Consent
        const consent = document.querySelector('input[name="dataPrivacyConsent"]:checked');
        document.getElementById('print-consent').textContent = consent ? consent.value : '';

        // Signature
        const sigCanvas = document.getElementById('learnerSignature');
        const printSig = document.getElementById('print-learnerSignature');
        if (sigCanvas && !sigCanvas.style.display.includes('none')) {
            printSig.src = sigCanvas.toDataURL();
            printSig.style.display = 'block';
        }
    },

    reset() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            document.querySelectorAll('input, select, textarea').forEach(el => {
                if (el.type === 'checkbox' || el.type === 'radio') {
                    el.checked = false;
                } else {
                    el.value = '';
                }
                el.classList.remove('error');
            });

            document.querySelectorAll('.error-message').forEach(msg => {
                msg.classList.remove('show');
            });

            // Reset signature
            const sigCanvas = document.getElementById('learnerSignature');
            const sigPad = document.getElementById('learnerSignaturePad');
            if (sigCanvas) {
                sigCanvas.style.display = 'none';
                const ctx = sigCanvas.getContext('2d');
                ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
            }
            if (sigPad) {
                sigPad.querySelector('p').style.display = 'block';
            }
            document.getElementById('clearLearnerSig').style.display = 'none';

            // Set default values
            document.getElementById('nationality').value = 'Filipino';
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('entryDate').value = today;
            document.getElementById('dateAccomplished').value = today;
        }
    }
};
