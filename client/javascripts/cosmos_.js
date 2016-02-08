"use strict";

const EventEmitter = require('events');

Cosmos.inherits(EventEmitter);

function Cosmos() {
    EventEmitter.call(this);
}

var cosmos = new Cosmos();
cosmos.setMaxListeners(100);

module.exports = function(){
    return cosmos
};

