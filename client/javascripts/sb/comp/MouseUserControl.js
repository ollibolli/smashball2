'use strict';

var  Component = require('../comp/Component');

UserControl.inherits(Component);

function UserControl(mouseEventCb){
    UserControl.super_.constructor.call(this);
    this._mouseEventCb = mouseEventCb;
}

/* override */
UserControl.prototype.setEntity = function(entity){
    UserControl.super_.setEntity.call(this,entity);
    entity.subscribe('gameloop/gameTick',this._mouseEventCb.bind(this));
};

module.exports = UserControl;
