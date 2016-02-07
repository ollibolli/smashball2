'use strict';
var Component = require('../../sb/comp/Component');
var Vector = require('../../utils/Vector');
var sb = require('../../cosmos_');
var _ = require('../../utils/_');

Collision.inherits(Component);

function Collision(type, options){
    Collision.super_.call(this);
    this.type = type;
    _.assign(this, options);
};

Collision.prototype.setEntity = function(entity){
    Collision.super_.prototype.setEntity.call(this,entity);
    this.position = this.getEntityComponent('Pos').getPos();
};

module.exports = Collision;
