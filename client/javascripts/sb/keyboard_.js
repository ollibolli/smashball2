var cosmos = require('../cosmos_')();
    var keyboard = {
        keys: {},
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ESC: 27,
        S: 83,
        P: 80,
        R: 82,
        SPACE: 32,
        A:65,
        D:68,
        E:69,
        F:70
    };

    keyboard.isDown = function(keyCode) {
        return keyboard._keys[keyCode];
    };

    keyboard.onKeyEvent = function(e) {
        e = e || event;
        keyboard.keys[e.keyCode] = e.type == 'keydown';
    };

    attachListener('keyup', function(event){
        keyboard.onKeyEvent(event);
        cosmos.emit('keyboard/keyup', event);
    });

    attachListener('keydown', keyboard.onKeyEvent);


    /* browser compatibility */
    function attachListener(event,callback){
        if (window.attachEvent) {
            window.attachEvent('on'+event,callback);
        } else {
            window.addEventListener(event, callback, false);
        }
    }

    function removeListener(event,callback){
        if (window.attachEvent) {
            window.removeEvent('on'+event,callback);
        } else {
            window.removeEventListener(event, callback, false);
        }
    }

    module.exports = function() {
        return keyboard;
    };

