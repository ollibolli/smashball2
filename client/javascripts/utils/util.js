'use strict';
var util = {};

util.getNameOf = function getNameOf(object) {
    var funcNameRegex = /function (.{1,})\(/;
    if (typeof object === 'function' ){
        var results = (funcNameRegex).exec(object.toString());
    } else {
        var results = (funcNameRegex).exec((object).constructor.toString());
    }
    return (results && results.length > 1) ? results[1] : "";
};

/**
 * sub inherites from base and fix the prototype chain
 * adds a property super_ on sub that references to the Base prototype obj
 * it also give sub a name.
 * @param base
 * @param sub
 */
util.inherits = (function(){
    if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        return function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                },
                super_: {
                    value: superCtor.prototype,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        };
    } else {
        // old school shim for old browsers
        return function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function () {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor
            ctor.prototype.super_ = superCtor.prototype;
        }
    }

})();

util.hasExtend = function hasExtend(subject,included){
    if (!included) return false ;
    for (var property in included) {
        if (included.hasOwnProperty(property) && !subject.hasOwnProperty(property)){
            return false;
        } else {
            if (
              included.hasOwnProperty(property)
              && typeof included[property] === 'function'
              && included[property].toString() !== subject[property].toString())
            {
                return false;
            }
        }
    };
    return true;
};

util.assert = function assert(expression,message){
    if (expression){
        return true;
    } else {
        message = message || ' ';
        if (message instanceof Error){
            console.log(message.stack);
        } else if (typeof(message)  === 'string'){
            message = new Error(message);
            console.log(message.stack);
        }
        throw message;
    }
};

util.assertParam = function(param, requireId, obj){
    try {
        if (!util.instanceOf.call(this, param, requireId)) {
            var msg = 'expected [' + requireId + '] got ';
            msg += param ? param.toString() : param;
            msg += ' in ';
            msg += obj ? obj.toString() : this.toString();
            throw new TypeError(msg)
        }
    } catch (e){
        e.message = "Parameter Error :" + e.message;
        throw e;
    }
};

util.instanceOf = function instanceOf(object, requireId){
    if ( !requireId  && typeof object === 'string'){
        requireId = object;
        object = this;
    }

    if (typeof requireId === 'string'){
        try {
            var required = require(requireId);
            if(object instanceof required){
                return true;
            } else {
                return false;
            }
        } catch (e){
            switch(requireId){
                case 'String': return typeof(object) === 'string' || object instanceof String;
                case 'Object': return typeof(object) === 'object';
                case 'Number': return typeof(object) === 'number' || object instanceof Number;
                case 'Boolean': return typeof(object) === 'boolean' || object instanceof Boolean;
                default :
                    e.message = 'In '+ this + " :" + e.message;
                    throw e;
            }
            return false;
        }
    } else {
        return object instanceof requireId
    }
    return false;
};

module.exports =  util;