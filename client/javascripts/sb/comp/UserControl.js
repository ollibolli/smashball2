'use strict';

var Component = require('../../sb/comp/Component');

UserControl.inherits(Component);

function UserControl(keyEventCb){
    UserControl.super_.constructor.call(this);
    this._mouseEventCb = keyEventCb;
}

/* override */
UserControl.prototype.setEntity = function(entity){
    this.super_.setEntity.call(this,entity);
    entity.subscribe('gameloop/gameTick',this._mouseEventCb.bind(this));
};

module.exports = UserControl;