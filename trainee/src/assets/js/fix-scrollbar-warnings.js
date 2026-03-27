
(function () {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'wheel' || type === 'mousewheel' || type === 'touchstart' || type === 'touchmove') {
            if (typeof options === 'boolean') {
                options = { capture: options };
            }
            if (typeof options === 'object' || options === undefined) {
                options = options || {};
                options.passive = false;
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();
