'use strict'

var Base = require('../sb/Base');
Vector.inherits(Base);

function Vector(x,y){
    Vector.super_.call(this);
    this.x = x;
    this.y = y;
};

Vector.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
};

Vector.prototype.clone = function(){
    return new Vector(this.x,this.y);
}

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.normalize = function() {
    var s = 1 / this.length();
    this.x *= s;
    this.y *= s;
    return this;
};

Vector.prototype.multiply = function(s) {
    return new Vector(this.x * s, this.y * s);
};

Vector.prototype.tx = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vector.prototype.add = function(v){
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subTx = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};


Object.defineProperties(Vector.prototype, {
    x: {
        get: function(){
            return this._x;
        },
        set: function(x){
            if (!isNaN(x) && (x instanceof Number || typeof(x) == 'number')){
                this._x = x;
            } else {
                throw new TypeError('Vector : X is not a valid number');
            }
        }
    },
    y: {
        get: function(){
            return this._y;
        },
        set: function(y){
            if (!isNaN(y) && (y instanceof Number || typeof(y) == 'number' && y !== NaN)){
                this._y = y;
            } else {
                throw new TypeError('Vector : X is not a valid number');
            }
        }
    }

})

module.exports = Vector;
