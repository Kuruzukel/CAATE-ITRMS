/**
 * Fix for perfect-scrollbar passive event listener warnings
 * This patches addEventListener to use non-passive listeners for wheel events
 */
(function () {
    'use strict';

    // Store the original addEventListener
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // Override addEventListener to make wheel events non-passive
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        // Check if this is a wheel/mousewheel/touchstart event
        if (type === 'wheel' || type === 'mousewheel' || type === 'touchstart' || type === 'touchmove') {
            // If options is a boolean, convert to object
            if (typeof options === 'boolean') {
                options = { capture: options };
            }
            // If options is an object or undefined, ensure passive is false
            if (typeof options === 'object' || options === undefined) {
                options = options || {};
                options.passive = false;
            }
        }
        // Call the original addEventListener with modified options
        return originalAddEventListener.call(this, type, listener, options);
    };
})();
