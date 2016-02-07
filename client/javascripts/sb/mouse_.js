'use strict';

var smashball = require('../cosmos_');
var Vector = require('../utils/Vector');

var canvas, context, mouseDown;

var mouse = {};
mouse.mouseDown = null;
mouse.position = null;

mouse.setCanvas = function(can){
    canvas = can;
    context = can.getContext('2d');
    canvas.addEventListener('mousemove', function(evt) {
        this.position = getMousePos(canvas, evt);
    }.bind(this), false);

    canvas.addEventListener('mousedown',function(evt){
        this.mouseDown = true;
    }.bind(this),false);

    canvas.addEventListener('mouseup', function(){
        this.mouseDown = false;
    }.bind(this), false);

};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}

module.exports = function(){
    return mouse;
};
