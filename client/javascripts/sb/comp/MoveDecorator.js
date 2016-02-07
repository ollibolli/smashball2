'use strict';

var  _ = require('../../utils/_');
var  Move = require('../comp/Move');

MoveDecorator.inherits(Move);

function MoveDecorator(move){
    this._subject = move;
};

/*override*/
MoveDecorator.prototype.addSubscriptions = function(){
    return this._subject.addSubscriptions();
};
/*override*/
MoveDecorator.prototype.removeSubscriptions = function(){
    return this._subject.removeSubscriptions();
};

/*override*/
MoveDecorator.prototype.setVelocity = function(vector){
    return this._subject.setVelocity(vector);
};

/*override*/
MoveDecorator.prototype.getVelocity = function(){
    return this._subject.getVelocity();
};

/*override*/
MoveDecorator.prototype.onGameloopGameTick = function(type,data){
    return this._subject.onGameloopGameTick(type,data);
};

/*override*/
MoveDecorator.prototype.setEntity = function(entity){
    return this._subject.setEntity(entity);
};

/*override*/
MoveDecorator.prototype.getEntity = function(){
    return this._subject.getEntity();
};

/*override*/
MoveDecorator.prototype.setSubject = function(entity){
    return this._subject.setEntity(entity);
};

/*override*/
MoveDecorator.prototype.getSubject = function(){
    return this._subject.getEntity();
};


MoveDecorator.prototype.removeDecorator = function(decorator){
    if (this._subject == null) {
        return;
    } else if (this._subject === decorator) {
        this._subject = this._subject.getSubject();
    } else {
        this._subject = this._subject.removeDecorator(decorator);
    }
};

module.exports = MoveDecorator;


