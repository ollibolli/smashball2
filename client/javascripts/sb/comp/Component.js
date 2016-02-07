'use strict';

var Base = require('../../sb/Base');
var _ = require('../../utils/_');
var smashball = require('../../cosmos_');

Component.inherits(Base);

function Component(){
    Base.call(this);
    this._entity = null;
    this._tokens = {};
}

/**
 * @param entity
 */
Component.prototype.setEntity = function(entity){
    this.hasEntityDependencies(entity);
    this._entity = entity || null;
};

Component.prototype.getEntity = function(){
    return this._entity;
};

Component.prototype.getEntityComponent = function(name){
    return this._entity.getComponent(name);
};

/**
 * Check that entity have the dependent components are added.
 * @param entity
 */
Component.prototype.hasEntityDependencies = function(entity){
    for (var i in this._dependencies){
        var dependency = this._dependencies[i];
        var result = false;
        for (var key in entity.getComponents()){
            var comp = entity.getComponents()[key];
            if (comp.instanceOf(dependency)){
                result = true;
                break;
            }
        }
        if (! result){
            return false
        }
    }
    return true;
};

module.exports =  Component;

