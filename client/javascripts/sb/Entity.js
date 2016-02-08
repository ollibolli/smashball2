"use strict";

var _ = require('../utils/_');
var Base = require('./Base');
var cosmos = require('../cosmos_')();

Entity.inherits(Base);

function Entity(id){
    _.assertParam(id,'String');
    Base.call(this);
    this._id = id;
    this._components = {};
    this.venue = null;
    this._subscriptions = {};
};

Entity.prototype.addComponent = function(component){
    this.assertParam(component, require('./comp/Component'));
    this._components[_.getNameOf(component)] = component;
    component.setEntity(this);
};

Entity.prototype.getComponents = function(){
    return this._components
};

Entity.prototype.hasComponent = function(){
    return this._components[name] ? true : false;
}

Entity.prototype.getComponent = function(name){
    return this._components[name];
};

Entity.prototype.removeComponent = function(component){
    this.assertParam(component, require('./comp/Component'));
    component.removeSubscriptions();
};

Entity.prototype.subscribe = function(topic, callback){
    this._subscriptions[topic] = callback;
};

Entity.prototype.unsubscribe = function(topic){
    delete this._subscriptions[topic];
    cosmos.removeListener(this._subscriptions[topic])
};

Entity.prototype.activateSubs = function(){
    for (var topic in this._subscriptions){
        cosmos.on(topic , this._subscriptions[topic]);
    }
};

Entity.prototype.deactivateSubs = function(){
    for (var topic in this._subscriptions){
        cosmos.removeListener(topic, this._subscriptions[topic]);
    }
};

Entity.prototype.publish = function(topic, data){
    cosmos.emit(topic, data);
};

//    Entity.prototype.setGraphic = function (venue){
//        this._graphic=venue;
//    }

Entity.prototype.getId = function (){
    return this._id;
};


module.exports = Entity;

