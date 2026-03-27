

(function () {
    'use strict';

    function disablePasswordManager() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-form-type', 'other');
            input.setAttribute('data-password-manager', 'disabled');
        });

        if (window.PasswordCredential) {
            try {
                navigator.credentials = undefined;
            } catch (e) {
            }
        }

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('autocomplete', 'off');
            form.setAttribute('data-lpignore', 'true');
            form.setAttribute('data-password-manager', 'disabled');
        });

        if (window.chrome && window.chrome.runtime) {
            try {
                window.chrome.runtime = undefined;
            } catch (e) {
            }
        }

        const hidePasswordManagerPopups = () => {
            const selectors = [
                '[data-password-manager-popup]',
                '[data-password-manager-dialog]',
                '.password-manager-popup',
                '.password-manager-dialog',
                '[role="dialog"][aria-label*="password"]',
                '[role="dialog"][aria-label*="Password"]',
                '[role="alertdialog"]',
                'div[style*="position: fixed"][style*="z-index"]',
                '.goog-tooltip',
                '[data-breach-notification]'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent || '';
                    if (text.includes('password') || text.includes('breach') || text.includes('data breach')) {
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        el.style.opacity = '0 !important';
                        el.style.pointerEvents = 'none !important';
                    }
                });
            });
        };

        hidePasswordManagerPopups();
        setInterval(hidePasswordManagerPopups, 1000);

        if (navigator.credentials) {
            navigator.credentials.get = () => Promise.resolve(null);
            navigator.credentials.store = () => Promise.resolve();
            navigator.credentials.create = () => Promise.resolve(null);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', disablePasswordManager);
    } else {
        disablePasswordManager();
    }

    window.addEventListener('load', disablePasswordManager);

    setInterval(disablePasswordManager, 2000);

    if (window.MutationObserver && document.body) {
        try {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                const text = node.textContent || '';
                                if (text.includes('password') || text.includes('breach') || text.includes('data breach')) {
                                    node.style.display = 'none !important';
                                    node.style.visibility = 'hidden !important';
                                    node.style.opacity = '0 !important';
                                    node.style.pointerEvents = 'none !important';
                                }
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
        } catch (e) {
        }
    }
})();