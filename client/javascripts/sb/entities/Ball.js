'use strict';

var Entity = require('../../sb/Entity');
var _ = require('../../utils/_');
var Render = require('../../sb/comp/Render');
var Move = require('../../sb/comp/Move');
var Pos = require('../../sb/comp/Pos');
var Vector = require('../../utils/Vector');
var FnDecorator = require('../../sb/comp/FnMoveDecorator');
var FrictionMoveDecorator = require('../../sb/comp/FrictionMoveDecorator');
var Collision = require('../../sb/comp/Collision');

Ball.inherits(Entity);

function Ball(id,pos,velocity, r, g, b){
    Ball.super_.call(this, id);
    this.addComponent(new Pos(pos));
    this.addComponent(new Render(Ball.renderCbFactory(r, g, b)));
    //var move = new Move(velocity);
    //move = new FnDecorator(move,new Vector(300,220),-0.001);
    //move = new FrictionMoveDecorator(move,0.99);
    //this.addComponent(move);
};

Ball.renderCbFactory = function(r,g,b){
    r = r || Math.floor(Math.random()*100+20);
    g = g || Math.floor(Math.random()*100+20);
    b = b || Math.floor(Math.random()*100+20);
    var style = "rgb("+r+","+g+","+b+")";


    return function(graphic){
        var pos = this.getEntityComponent('Pos').getPos();
        graphic.context.beginPath();
        graphic.context.arc(pos.x, pos.y, 10, 0, 2*Math.PI, false);
        graphic.context.fillStyle = style;
        graphic.context.fill();
    };

};
module.exports = Ball;
