'use strict';

var _ = require('../../utils/_');
var Vector = require('../../utils/Vector');

function FnMoveDecorator(move, centerVector, gravity) {

    move._moveOrg = move.move;

    move.move = function () {
        var deltaX = move.getEntityComponent('Pos').getPos().x - centerVector.x;
        var deltaY = move.getEntityComponent('Pos').getPos().y - centerVector.y;
        var length2 = Math.abs(deltaX * deltaX) + Math.abs(deltaY * deltaY);
        var friction = 1;
        var g;
        if (length2 < 50) {
            g = gravity * 120;
            friction *= 0.85;
        } else if (length2 < 225) {
            g = gravity * 30;
            friction *= 0.95;
        } else if (length2 < 330) {
            g = gravity * 20;
        } else {
            g = gravity;
        }

        var v = new Vector(deltaX * g , deltaY * g );

        move.setVelocity(move.getVelocity().tx(v).multiply(friction));
        move._moveOrg.call(move);
    };

    return move;
};

module.exports = FnMoveDecorator;
