var Room = require('./Room');

function RoomHandler(io){
  this.io = io;
  this._rooms = {};
  this._room;
  this._clients = {};
}

RoomHandler.prototype.connection = function (socket){
  console.log('[RoomHandler.connection]', socket.handshake.headers.cookie, socket.id);

  var room = this._room;
  if (! room){
    var room = new Room(""+Math.floor(Math.random()*10000000));
    this._rooms[room.id] = room;
    room.player1(socket);
    this._room = room;
    this._clients[socket.id] = room.id;
  } else {
    this._clients[socket.id] = room.id;
    room.player2(socket);
    room.emit('state', 'go');
    room = null;
  }
};

RoomHandler.prototype.disconnecting = function (socket) {
  var room = this._rooms[this._clients[socket.id]];
  if (room) {
    room.emit('state', 'stop');
    delete this._rooms[room.id];
    delete this._clients[socket.id];
    this._room = null;
  } else {
    console.log('[RoomHandler.disconnecting] ERRROR' );
  }
};

module.exports = RoomHandler;
