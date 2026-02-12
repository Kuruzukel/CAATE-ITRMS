/* Requests Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Fix passive event listeners for better performance
    // Override default event listener options for scroll-blocking events
    if (typeof EventTarget !== 'undefined') {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
            if (passiveEvents.includes(type)) {
                if (typeof options === 'object' && options !== null) {
                    if (!('passive' in options)) {
                        options.passive = true;
                    }
                } else {
                    options = { passive: true, capture: typeof options === 'boolean' ? options : false };
                }
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // Update copyright year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Menu toggle is handled by main.js - no need to duplicate here
});