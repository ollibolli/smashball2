'use strict';

var Entity = require ('../../sb/Entity');
var Render = require ('../../sb/comp/Render');
var UserControl = require ('../../sb/comp/UserControl');
var keyboard = require ('../keyboard_')();
var Vector = require ('../../utils/Vector');
var _ = require ('../../utils/_');

function playerFactory(id, options){
    var player = new Entity(id);

    player.addComponent(new Render(renderEventCb.bind(player)));
    player.addComponent(new UserControl(keyEventCb.bind(player)));

    player.angle = options.angle;
    player.power = options.power;


    //event handler
    function keyEventCb(keyEvent){
        if (keyboard.keys[options.powerUpKey] === false){
            var x = this.power * Math.cos(this.angle),
              y = this.power * Math.sin(this.angle);

            this.publish(this.getId()+'/fireball', {
                pos: new Vector(options.position.x, options.position.y),
                velocity: new Vector(x, y)
            });
            this.power = 0.8;
            delete keyboard.keys[options.powerUpKey];
        }
        if (keyboard.keys[options.powerUpKey] === true) {
            if (this.power < options.powerMax) {
                this.power += 0.1;
            }
        }
        if (keyboard.keys[options.angleUpKey] === true) {
            if (this.angle < options.angleMax) {
                this.angle += 0.0174532925 * 2;
            } else {
                this.angle = options.angleMax;
            }
        }
        if (keyboard.keys[options.angleDownKey] === true) {
            if (this.angle > options.angleMin) {
                this.angle -= 0.0174532925 * 2 ;
            } else {
                this.angle = options.angleMin;
            }
        }
    }

    // render
    function renderEventCb(graphic){
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



