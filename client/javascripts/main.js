require('./sb/Base');
var Socket = require('socket.io-client');
var cookies = require('cookies-js');

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

toggleStartStop(keyboard.P);

var socket = new Socket();
if  (! cookies.get('ID')) {
  cookies.set('ID', "" + Math.floor(Math.random() * 100000000));
  document.getElementById('diven3').innerHTML += '<br/> New Cookies: ' + cookies.get('ID');
} else  {
  document.getElementById('diven3').innerHTML += '<br/> Cookies: ' + cookies.get('ID');
}

socket.on('error', function(err){
  console.log(e, e.stack);
});

socket.on('connect', function(){
  document.getElementById('diven3').innerHTML += '<br/> Connnect';
  socket.emit('handshake', {"ID":cookies.get('ID')});
});

socket.on("handshake", function(msg){
  player = msg.player;
  room = msg.id;
  document.getElementById('diven2').innerHTML = '' + JSON.stringify(msg);
});

socket.on("state", function(data){
  switch(data){
    case 'go' : gameloop.start();   console.log('[GO]');break;
    case 'stop': gameloop.stop(); break;
  }
});

socket.on('gameloop/gameTick', function(data){
  smashball.emit('gameloop/gameTick');
  smashball.emit('gameloop/postTick');
});

socket.on('entityUpdate', function(entity){
  var entity = venue.getEntityById(entity.id);
});

socket.on('ballFired', function (data) {
  if (data.player === "player1"){
    smashball.emit('player1/launchBall' , data);
  } else {
    smashball.emit('player2/launchBall', data);
  }
});

smashball.on("collision" , function(){
  gameloop.stop();
  console.log('[STOP]');
  emitSyncMovables('sync/movable');
});

socket.on('sync/movable', function(data){
  console.log('[sunk movable.]', data.entities.length);
  var entities = data.entities;
  try {
    for (var i = 0; i < entities.length; i++) {
      var entityData = entities[i];
      var entity = venue.getEntityById(entityData.id);
      entity.getComponent('Pos') && entity.getComponent('Pos').setPos(new Vector(entityData.pos.x, entityData.pos.y));
      entity.getComponent('Velocity') && entity.getComponent('Velocity').setVelocity(new Vector(entityData.velocity.x, entityData.velocity.y))

  } catch (e) {
    console.log(venue._entityPool, data.entities);
  }
  emitSyncMovables('resync/movable');
});

function emitSyncMovables(topic){
  var entities = venue.getEntitiesByComponent("Move");
  var send = [];
  for (var i = 0; entities.length > i; i++) {
    var entitiy = entities[i];
    var pos = entitiy.getComponent("Pos").getPos()
    var velocity = entitiy.getComponent("Move").getVelocity();
    send.push({
      id: entitiy.getId(),
      pos: {x: pos.x, y: pos.y},
      velocity : {x:velocity.x, y:velocity.y},
    })
  }
  console.log('--', topic);
  socket.emit(topic, {
    player: player,
    roomId: room,
    gameTick: gameloop.getGameTicks(),
    entities: send
  });

}

smashball.on('player1/fireball', function(data) {
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

smashball.on('player2/fireball', function(data){
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
  smashball.on('gameloop/gameTick',function(data){
    document.getElementById('diven').innerHTML = 'Data : '+JSON.stringify(data)+' GameTick: '+ gameloop.getGameTicks();
  });
  var render = 0;
}

function toggleStartStop(key) {
  gameloop.setFrameRate(35);
  gameloop.setGraphic(venue.getGraphic());

  venue.load();
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

