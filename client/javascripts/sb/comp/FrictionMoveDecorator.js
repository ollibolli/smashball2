'use strict';

var _ = require( '../../utils/_');
var Move = require( '../../sb/comp/Move');
var Vector = require( '../../utils/Vector');

function FrictionMoveDecorator(move,friction){
    move._frictionMove = move.move;
    move.move = function newMove(){
        move.setVelocity(move.getVelocity().multiply(friction));
        move._frictionMove.call(move)
    };
    return move;
};

module.exports = FrictionMoveDecorator;

