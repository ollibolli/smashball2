"use strict";

function Room (id){
  this.id = ""+id
  this.sync = null;
  this._update1 = null;
  this._update2 = null;
  this._syncHandler = null;
  this._unSync = false;
}

Room.prototype.player1 = function(socket){
  this._player1 = socket;
  socket.emit("handshake", {
    player: 1,
    id : this.id });
  this._add(socket);
};

Room.prototype.player2 = function(socket){
  this._player2 = socket;
  socket.emit("handshake", {
    player: 2,
    id : this.id
  });
  this._add(socket);
};
var fileIndex = 0;
Room.prototype._add = function(socket){
  socket.on("ballFired", (msg) => {
    this.emit("ballFired", msg);
  });
  socket.on('sync/movable', (data) => {
    if (data.player === 1){
      this._update1 = data;
    }else {
      this._update2 = data;
    }
    if (this._update1 && this._update2) {
      if (JSON.stringify(this._update1.entities) === JSON.stringify(this._update2.entities)) {
        this.emit('state', 'go');
        this._update2 = null;
        this._update1 = null;
      } else {
        if (this._update1.entities.length >= this._update2.entities.length) {
          this.emit('sync/movable', this._update1);
        } else {
          this.emit('sync/movable', this._update2);
        }

        this._update2 = null;
        this._update1 = null;
      }
    }
  });
  socket.on('resync/movable', (data) => {
    if (data.player === 1){
      this._resync1 = data;
    }else {
      this._resync2 = data;
    }
    if (this._resync1 && this._resync2) {
      this.emit('state', 'go');

/*
      if (JSON.stringify(this._resync1.entities) === JSON.stringify(this._resync2.entities)) {
        console.log('[Room.]RESOLVED');
      } else {
        require('fs').writeFileSync(`./tmp/1resync-${fileIndex}.json`, JSON.stringify(this._resync1.entities, null, 2));
        require('fs').writeFileSync(`./tmp/2resync-${fileIndex}.json`, JSON.stringify(this._resync2.entities, null, 2));
        fileIndex++;
        console.log('[Room.]BIG ERROR');
      }
*/
    }

  });

  socket.on('entityUpdate', (data) => {
    console.log('[Room. Entity update]');
    this.emit('entityUpdate', data);
  })
};

Room.prototype.emit = function(topic, data){
  this._player1 && this._player1.emit(topic, data);
  this._player2 && this._player2.emit(topic, data);
};


module.exports = Room;