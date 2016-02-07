"use strict";
var _ = require('../../utils/_');
var Venue = require('../../sb/Venue');
var Ball = require('../../sb/entities/Ball');
var boardFactory = require('../entities/board_');
var playerFactory = require('../entities/player_');
var Vector = require('../../utils/Vector');
var Graphic = require('../../sb/Graphic');
var eventBus = require('../../cosmos_')();
var CollisionConsequence = require('../../sb/CollisionConsequence');
var obstacleFactory = require('../entities/obstacle_');
var opponentFactory = require('../entities/opponent_');
var Move = require('../../sb/comp/Move');
var FnDecorator = require('../../sb/comp/FnMoveDecorator');
var FrictionMoveDecorator = require('../../sb/comp/FrictionMoveDecorator');
var Collision = require('../../sb/comp/Collision');
var Render = require('../../sb/comp/Render');
var Pos = require('../../sb/comp/Pos');
var Entity = require('../../sb/Entity');

var holeFactory = require('../entities/holeFactory_');
var mouse = require('../mouse_')();
var keyboard = require('../keyboard_')();

var width = 600,
  height = 440,
  boardHeight = 400,
  boardWidth = 400;

BasicScene.inherits(Venue);

function BasicScene(element){
    Venue.call(this);
    var graphic = Graphic.factory('canvas2d',element, width, height, null);
    this.setGraphic(graphic);
    mouse.setCanvas(graphic.canvas);
}

/*override*/
BasicScene.prototype.load = function(){
    var board = boardFactory(width/2, height/2, boardWidth, boardHeight);
    this.addEntity(board);
    this.addToStage(board);

    var hole = holeFactory(width/2,height/2, 15, 10);
    this.addEntity(hole);
    this.addToStage(hole);

    //Player one
    var position = new Vector(102,220);
    var player1 = playerFactory('player1', {
        position : position,
        angle: 0,
        angleMax: Math.PI/2,
        angleMin: -(Math.PI/2),
        power: 0.8,
        powerMax: 5,
        powerMin: 0.8,
        powerUpKey: keyboard.S,
        powerDownKey: keyboard.F,
        angleUpKey: keyboard.E,
        angleDownKey: keyboard.D,
        shoot: keyboard.A

    });
    this.addEntity(player1);
    this.addToStage(player1);
    var player1BallInChamber = prepareBall.call(this, position.multiply(1), 200, null, null);

    //Player two
    var position2 = new Vector(498,220);
    var player2 = playerFactory('player2', {
        position : position2,
        angle: Math.PI,
        angleMax: Math.PI * 1.5,
        angleMin: Math.PI/2,
        power: 0.8,
        powerMax: 5,
        powerMin: 0.8,
        powerUpKey: keyboard.RIGHT,
        angleUpKey: keyboard.DOWN,
        angleDownKey: keyboard.UP,
        shoot: keyboard.SPACE
    });
    this.addEntity(player2);
    this.addToStage(player2);
    var player2BallInChamber = prepareBall.call(this, position2.multiply(1), null, 200, null);


    var obstacle1 = obstacleFactory('player1Obstacle', new Vector(160,220));
    this.addEntity(obstacle1);
    this.addToStage(obstacle1);
    var obstacle2 = obstacleFactory('player2Obstacle', new Vector(440,220));
    this.addEntity(obstacle2);
    this.addToStage(obstacle2);

    var scoreP1 = new Entity('player1Score');
    scoreP1.addComponent(new Pos(new Vector(10,10)));
    scoreP1.addComponent(new Render(function(graphic){
        var context = graphic.context;
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        var message = player1Balls;
        context.fillText(message, 10, 25);
    }));
    this.addEntity(scoreP1);
    this.addToStage(scoreP1);

    var scoreP2 = new Entity('player1Score');
    scoreP2.addComponent(new Pos(new Vector(10,10)));
    scoreP2.addComponent(new Render(function(graphic){
        var context = graphic.context;
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        var message = player2Balls;
        context.fillText(message, 510, 25);
    }));
    this.addEntity(scoreP2);
    this.addToStage(scoreP2);

    var ballIndex = 0;

    eventBus.on('player1/launchBall',function(options){
        options.player = 'player1';
        options.ball = player1BallInChamber;
        console.log('[BasicScene.]', options);
        if (player1BallInChamber) {
            fireBall.call(this, type, options);
            player1BallInChamber = null;
            setTimeout(function(){
                player1BallInChamber = prepareBall.call(this, position.multiply(1), 200, null, null);
            }.bind(this),5000);
        }
    }.bind(this));

    eventBus.on('player2/launchBall',function(options){
        options.player = 'player2';
        options.ball = player2BallInChamber;
        if (player2BallInChamber) {
            fireBall.call(this, type, options);
            player2BallInChamber = null;
            setTimeout(function(){
                player2BallInChamber = prepareBall.call(this, position2.multiply(1), null, 200, null);
            }.bind(this),5000);
        }
    }.bind(this));

    function fireBall(type, options){
        //var ball = new Ball('ball'+ballIndex,options.pos,options.velocity.multiply(3), null, 200, null);
        ballIndex++;
        var ball = options.ball;
        ball.player = options.player;
        console.log('[BasicScene.]', options);
        var move = new Move((new Vector(options.velocity.x, options.velocity.y)).multiply(2));
        move = new FnDecorator(move, new Vector(300,220),-0.0007);
        move = new FrictionMoveDecorator(move,0.995);
        ball.addComponent(move);
        ball.addComponent(new Collision('circle', {mass:1, radius: 10, elasticy: 0.8}));
        this.addEntity(ball);
        this.reStage(ball);
    }


    eventBus.on('deleteEntity',function(entity){
        this.removeEntity(entity);
    }.bind(this));

    var player2Balls = 0;
    var player1Balls = 0;
    eventBus.on('collectEntity',function(entity){
        if (entity.player === 'player1'){
            player1Balls++;
            if (player1Balls > 9){
                updateText('<h1>Player 1 is the winner</h1>');
                eventBus.publish('gameloop/stop', {});
            }
        } else if (entity.player === 'player2'){
            player2Balls++;
            if (player2Balls > 9){
                updateText('<h1>Player 2 is the winner</h1>');
                eventBus.publish('gameloop/stop', {});
            }
        }
        this.removeEntity(entity);
        updateScore();
    }.bind(this));

    var collDect = new CollisionConsequence(this);

    function prepareBall(pos, r , g , b) {
        var ball = new Ball('ball' + ballIndex, pos, new Vector(0, 0), r, g, b);
        ballIndex++;
        ball.player = 'player1';
        this.addEntity(ball);
        this.addToStage(ball);
        return ball;
    };



    function updateScore(){
        var el = document.getElementById('score');
        el.innerHTML = 'Player 1 score : ' + player1Balls + " - Player 2 score : " + player2Balls;
    }

    function updateText(text){
        var el = document.getElementById('text');
        el.innerHTML = text;
    }

}

module.exports = BasicScene;