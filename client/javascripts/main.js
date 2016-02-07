require('./sb/Base');
var Socket = require('socket.io-client')

var Gameloop = require('./sb/Gameloop');
var smashball = require('./cosmos_')();
var Entity = require('./sb/Entity');
var Pos = require('./sb/comp/Pos');
var Vector = require('./utils/Vector');
var BasicScene = require('./sb/scenes/basicScene');
var keyboard = require('./sb/keyboard_')();

var element = document.getElementById('board');
var venue = new BasicScene(element);
var gameloop = new Gameloop();
var player;
var room;

var socket = new Socket();
global.document.cookie = JSON.stringify( {id : Math.floor(Math.random()* 1000000000000)});

document.getElementById('diven3').innerHTML += '<br/> Cookies' + global.document;


socket.on('connect', function(){
  document.getElementById('diven3').innerHTML += '<br/> Connnect';
  socket.emit('handshake', {id: 'browserId'})

});

socket.on("handshake", function(msg){
  console.log("handshake", msg);
  player = msg.player;
  room = msg.id;
  document.getElementById('diven2').innerHTML = '' + JSON.stringify(msg);
});

socket.on("state", function(data){
  switch(data){
    case 'go' : toggleStartStop(keyboard.P); break;
    case 'stop': gameloop.stop();
  }
  document.getElementById('diven3').innerHTML += '<br/> State: ' + data ;
});

socket.on('ballFired', function (data) {
  console.log("ballfire");
  if (data.player === "player1"){
    eventBus.publish('player1/launchBall' , data);
  } else {
    eventBus.publish('player2/launchBall', data);
  }
});

smashball.on("collision" , function(){
  gameloop.stop();
  var entities = venue.getEntitiesByComponent("Move");
  var send = [];
  for (var i = 0; entities.length > i; i++){
    var entitiy = entities[i];
    var pos = entitiy.getComponent("Pos").getPos()
    var velocity = entitiy.getComponent("Move").getVelocity();
    send.push({

      pos: {x: pos.x, y: pos.y},
      velocity : {x:velocity.x, y:velocity.y},
    })
  }
  socket.emit("update", {
    player: player,
    roomId: room,
    entities: send
  });
});

smashball.on('player1/fireball', function(topic, data) {
  var event = {
    pos: {
      x: data.pos.x,
      y: data.pos.y
    },
    velocity: {
      x: data.velocity.x,
      y: data.velocity.y
    },
    player: "player1"
  };
  socket.emit('ballFired', event);
});

smashball.on('player2/fireball', function(topic, data){
  var event = {
    pos: {
      x: data.pos.x,
      y: data.pos.y
    },
    velocity: {
      x: data.velocity.x,
      y: data.velocity.y
    },
    player : "player2"
  };
  socket.emit('ballFired' , event);
});

smashball.on('gameloop/stop', function () {
  gameloop.stop();
}.bind(this));
smashball.on('gameloop/start', function () {
  gameloop.start();
}.bind(this));

/* subscribe to gametick event */
printGametickEvents();

function printGametickEvents(){

  var gametick = 0;

  smashball.on('gameloop/gameTick',function(data){
    document.getElementById('diven').innerHTML = 'Data : '+JSON.stringify(data)+' GameTick: '+ gametick;
    gametick++;
  });
  var render = 0;
}

function toggleStartStop(key) {
  gameloop.setFrameRate(35);
  gameloop.setGraphic(venue.getGraphic());

  venue.load();
  gameloop.start();
  console.log("starting");
  smashball.on('keyboard/keyup', eventExecute);

  var running = true;

  function eventExecute(data) {
    if (data.keyCode === key) {
      if (! running) {
        gameloop.start();
        running = true;
      } else {
        gameloop.stop();
        running = false;
      }
    }
  }
}

