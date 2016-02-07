"use strict";

var  _ = require('../../utils/_');
var  Component = require('../comp/Component');
Pos.inherits(Component);

function Pos(vector){
    Component.call(this);
    this._pos = vector;
}

Pos.prototype.setPos = function(vector){
    this._pos = vector;
};

Pos.prototype.getPos = function(){
    return this._pos;
};

module.exports =  Pos;
