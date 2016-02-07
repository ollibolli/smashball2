'use strict';

var Entity = require('../../sb/Entity');
var Render = require('../../sb/comp/Render');
var Collision = require('../../sb/comp/Collision');
var Vector = require('../../utils/Vector');
var Pos = require('../../sb/comp/Pos');

function boardFactory(offsetX, offsetY, width, height) {

    var board = new Entity('board');

    var base_image = new Image();
    base_image.src = './images/background.png';
    var loading = true;
    base_image.onload = function(){
        console.log('[Image.onload]', "backgroud loaded");
        loading = false;
    };

    board.addComponent(new Render(function (graphic) {
        graphic.context.drawImage(base_image, offsetX - width / 2,offsetY - width / 2);
//            graphic.context.beginPath();
//            graphic.context.fillStyle = "#eeeeee";
//            graphic.context.fillRect(offsetX - width / 2, offsetY - width / 2, width, height);
    }));
    board.addComponent(new Pos(new Vector(offsetX, offsetY)));
    board.addComponent(new Collision('boundary', {
        position: new Vector(offsetX, offsetY),
        width: width,
        height: height
    }));
    return board;
}

module.exports = boardFactory;
