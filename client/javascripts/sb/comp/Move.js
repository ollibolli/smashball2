'use strict';

var  _ = require('../../utils/_');
var  Component = require('../comp/Component');

Move.inherits(Component);

function Move(velocity){
    Component.call(this);
    this._velocity = velocity;
    this._tokens = {};
};

Move.prototype.setEntity = function(entity){
    Move.super_.prototype.setEntity.call(this,entity);
    this._Pos = this.getEntityComponent('Pos');
    entity.subscribe('gameloop/gameTick', this.move.bind(this));
};

Move.prototype.setVelocity = function(vector){
    this._velocity = vector;
};

Move.prototype.getVelocity = function(){
    if (! this._velocity) throw new Error('[ getVelocity]');
    return this._velocity;
};

Move.prototype.move = function(){
    this._Pos.setPos(this._Pos.getPos().tx(this._velocity));
};

module.exports = Move;
