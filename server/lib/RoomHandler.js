"use strict";

var Room = require('./Room');

var io = io;
var rooms = {};
var clients = {};
var room = null;

function RoomHandler(io){
  function connect (socket, playerInfo){
    if (!room) {
      room = new Room("" + Math.floor(Math.random() * 10000000));
      room.player1(socket);
      rooms[room.id] = room;
      clients[playerInfo.ID] = room.id;
    } else {
      clients[playerInfo.ID] = room.id;
      room.player2(socket);
      room.emit('state', 'go');
      room = null;
    }
  };

  function disconnect(socket , data) {
    var disRoom = rooms[clients[data.ID]];
    if (disRoom) {
      disRoom.emit('state', 'stop');
      delete rooms[disRoom.id];
      delete clients[socket.id];
    } else {
      console.log('[RoomHandler.disconnecting] ERRROR' );
    }
  };

  return {
    connect : connect,
    disconnect: disconnect
  }
}

module.exports = RoomHandler;
