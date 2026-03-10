/* Disable Password Manager Popups */

(function () {
    'use strict';

    // Disable password manager suggestions and popups
    function disablePasswordManager() {
        // Disable autocomplete on all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-form-type', 'other');
            input.setAttribute('data-password-manager', 'disabled');
        });

        // Prevent password manager popups
        if (window.PasswordCredential) {
            try {
                navigator.credentials = undefined;
            } catch (e) {
                // Ignore errors
            }
        }

        // Disable password manager on forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('autocomplete', 'off');
            form.setAttribute('data-lpignore', 'true');
            form.setAttribute('data-password-manager', 'disabled');
        });

        // Override password manager detection
        if (window.chrome && window.chrome.runtime) {
            try {
                window.chrome.runtime = undefined;
            } catch (e) {
                // Ignore errors
            }
        }

        // Hide any existing password manager popups
        const hidePasswordManagerPopups = () => {
            const selectors = [
                '[data-password-manager-popup]',
                '[data-password-manager-dialog]',
                '.password-manager-popup',
                '.password-manager-dialog',
                '[role="dialog"][aria-label*="password"]',
                '[role="dialog"][aria-label*="Password"]'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                });
            });
        };

        // Run popup hiding immediately and on interval
        hidePasswordManagerPopups();
        setInterval(hidePasswordManagerPopups, 1000);

        // Override credential management API
        if (navigator.credentials) {
            navigator.credentials.get = () => Promise.resolve(null);
            navigator.credentials.store = () => Promise.resolve();
            navigator.credentials.create = () => Promise.resolve(null);
        }
    }

    // Run immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', disablePasswordManager);
    } else {
        disablePasswordManager();
    }

    // Also run on window load as a backup
    window.addEventListener('load', disablePasswordManager);

    // Run periodically to catch any dynamically added elements
    setInterval(disablePasswordManager, 2000);
})();