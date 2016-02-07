'use strict';

var Entity = require ('../../sb/Entity');
var Vector = require ('../../utils/Vector');
var Pos = require ('../../sb/comp/Pos');
var Move = require ('../../sb/comp/Move');
var Collision = require ('../../sb/comp/Collision');
var Render = require ('../../sb/comp/Render');

function holeFactory(x, y, holeRadius, removeRadius) {
    var hole = new Entity('hole');
    hole.addComponent(new Pos(new Vector(x, y)));
    hole.addComponent(new Move(new Vector(0, 0)));
    hole.addComponent(new Collision('hole', {radius: removeRadius, mass: 99999999999999}));
    hole.addComponent(new Render(function(graphic){
        graphic.context.beginPath();
        graphic.context.arc(x, y, holeRadius, 0, 2 * Math.PI, false);
        graphic.context.fillStyle = "#000";
        graphic.context.fill();
    }));

    return hole;
}

module.exports = holeFactory;