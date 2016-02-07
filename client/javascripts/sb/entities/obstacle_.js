'use strict';

var Entity = require('../../sb/Entity');
var Pos = require('../../sb/comp/Pos');
var Vector = require('../../utils/Vector');
var Render = require('../../sb/comp/Render');
var Collision = require('../../sb/comp/Collision');
var Move = require('../../sb/comp/Move');

module.exports = function obstacleFactory(id , pos){
    var radius = 3;
    var obstacle = new Entity(id);
    obstacle.addComponent(new Pos(new Vector(pos.x, pos.y)));
    obstacle.addComponent(new Render(function(graphic){
        var pos = this.getEntityComponent('Pos').getPos();
        graphic.context.beginPath();
        graphic.context.arc(pos.x,pos.y,radius,0,2*Math.PI,false);
        graphic.context.fillStyle = 'black';
        graphic.context.fill();

    }));
    obstacle.addComponent(new Move(new Vector(0,0)));
    obstacle.addComponent(new Collision('circle', {radius : radius, mass: 99999999999999999999, elasticity: 1}));

    return obstacle;
};


