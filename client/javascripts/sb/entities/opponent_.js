'use strict';

var Entity = require('../../sb/Entity');
var Render = require('../../sb/comp/Render');
var UserControl = require('../../sb/comp/MouseUserControl');
var mouse = require('../mouse_');
var Vector = require('../../utils/Vector');
var _ = require('../../utils/_');

function playerFactory(id, options){

    var player = new Entity(id);

    player.addComponent(new Render(renderEventCb.bind(player)));
    player.addComponent(new UserControl(mouseEventCb.bind(player)));

    player.angle = options.angle;
    player.power = options.power;


    //event handler
    function mouseEventCb(type, keyEvent){

        if (mouse_.mouseDown === false){
            var x = this.power * Math.cos(this.angle),
              y = this.power * Math.sin(this.angle);

            this.publish(this.getId()+'/fireball', {
                pos: new Vector(options.position.x, options.position.y),
                velocity: new Vector(x, y)
            });
            this.power = 0.8;
            mouse_.mouseDown = null;
        }
        if (mouse_.mouseDown === true) {
            if (this._mouseStartPos) {
                var deltaV = new Vector(options.position.x - mouse_.position.x,  options.position.y - mouse_.position.y);
                var deltaLength = deltaV.length();
                var calcAngle = -Math.atan2(deltaV.x, deltaV.y ) + (Math.PI / 2);
                if (calcAngle < options.angleMax && calcAngle > options.angleMin){
                    this.angle = -Math.atan2(deltaV.x, deltaV.y ) + (Math.PI / 2);
                    if (deltaLength * 0.06 > options.powerMin && deltaLength * 0.06 < options.powerMax) {
                        this.power = deltaLength * 0.1;
                    }
                }
            } else {
                this._mouseStartPos = mouse_.position;
            }
        }
    }

    // render
    function renderEventCb(type, graphic){
        var ctx = graphic.context,
          width = 210,
          height = 20;

        drawRotatedRect.call(this, options.position.x - width ,options.position.y - height/2, width, height, this.angle);

        function drawRotatedRect(x,y,width,height,degrees){
            ctx.save();
            ctx.beginPath();
            ctx.translate( x+width, y+height/2 );
            ctx.rotate(degrees);
            ctx.rect( -width, -height/2, width,height);
            ctx.fillStyle="gold";
            ctx.fill();
            ctx.beginPath();
            ctx.rect(0, -height/4, -this.power*10, height/2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.restore();
        }
    }
    return player;
}
module.exports = playerFactory;



