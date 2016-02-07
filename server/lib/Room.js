function Room (id){
  this.id = ""+id
  this.sync = null;
}

Room.prototype.player1 = function(socket){
  this._player1 = socket;
  socket.emit("handshake", {
    player: 1,
    id : this.id });
  this._add(socket);
  console.log('[Room.player1] ' +  this.id);
};

Room.prototype.player2 = function(socket){
  this._player2 = socket;
  socket.emit("handshake", {
    player: 2,
    id : this.id
  });
  this._add(socket);
  console.log('[Room.player2] ' + this.id);
};

Room.prototype._add = function(socket){
  socket.on("ballFired", function(msg){
    this.emit("ballFired", msg);
  }.bind(this));
  socket.on('update', function(data){
    console.log('UPDATE');
  });
};

Room.prototype.emit = function(topic, data){
  this._player1 && this._player1.emit(topic, data);
  this._player2 && this._player2.emit(topic, data);
};


module.exports = Room;