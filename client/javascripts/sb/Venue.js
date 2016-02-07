    'use strict';
    var Base = require('../sb/Base');
    var _ = require('../utils/_');
    Venue.inherits(Base);

    /**
     * Define the enviromental places for the entities
     * @param graphic [sb/Graphic]
     */
    function Venue(){
        Base.prototype.constructor.call(this);
        this._entityPool = {};
        this._onStage = {};
    };

    /**
     * Add entity to the Venue
     * @param entity [sb/Entity]
     * @return id [Number]
     */
    Venue.prototype.addEntity = function(entity){
        this.assertParam(entity, require('./Entity'));
        this._entityPool[entity._id] = entity;
    };

    /**
     * Remove entity from the Venue
     * @param entity [sb/Entity]
     * @return id [Number]
     */
    Venue.prototype.removeEntity = function(entity){
        if (this.isOnStage(entity)){
            this.removeFromStage(entity);
        }
        this._entityPool = _.omit(this._entityPool, entity.getId());
    };

    /**
     * Remove entity from the Venue
     * @param id [Number] the id returned by addEntity
     */
    Venue.prototype.removeEntityById = function(id){
        return null;
    };

    /**
     *
     * @param {sb/Entity} entity
     */
    Venue.prototype.addToStage = function(entity){
        this.assertParam(entity, require('./Entity'));
        entity.activateSubs();
        this._onStage[entity._id] = entity;
    };

    Venue.prototype.isOnStage = function(entity){
        return _.contains(this._onStage,entity);
    };

    Venue.prototype.removeFromStage = function(entity){
        entity.deactivateSubs();
    };

    Venue.prototype.reStage = function(entity){
        entity.deactivateSubs();
        entity.activateSubs();
    };


    Venue.prototype.getEntitiesByName = function(name){
        return null;
    };

    Venue.prototype.getEntitiesByComponent = function(Component){
        var entities = [];
        for (var i in this._entityPool){
            var item = this._entityPool[i];
            if (item.getComponents()[Component]){
                entities.push(item);
            }
        }
        return entities;
    };

    Venue.prototype.getEntityById = function(id){
        return null;
    };

    Venue.prototype.getGraphic = function(){
        if(! this._graphic) {throw new Error('[ BascicScene.getGraphic] graphic not set');}
        return this._graphic;
    };

    Venue.prototype.setGraphic = function(graphic){
        this._graphic = graphic;
    };

    Venue.prototype.load = function(){
        throw new Error('[Venue.load] Not Implemented');
    };

    Venue.prototype.reset = function(){
    };

    module.exports = Venue;
