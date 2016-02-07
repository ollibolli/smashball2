'use strict';

var Component = require('../../sb/comp/Component');
var _ = require('../../utils/_');
var Vector = require('../../utils/Vector');

Render.inherits(Component);

function Render(renderFn){
    _.assert(typeof renderFn === 'function');
    Render.super_.call(this);
    this._renderEventCb = renderFn;
    this._pos = new Vector(0,0);
}

/* overrride */
Render.prototype.setEntity = function(entity){
    this.super_.setEntity.call(this, entity);
    entity.subscribe('gameloop/render', this._renderEventCb.bind(this));
};

module.exports = Render;

