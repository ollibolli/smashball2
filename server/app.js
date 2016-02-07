var koa = require('koa.io');
var static = require('koa-static');
var app = koa();
var path = require('path');
var RoomHandler = require('./lib/RoomHandler');

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
  //console.log('%s %s - %sms', this.method, this.url, ms);
});
app.use(static(__dirname + '/../public/'));

var roomHandler = new RoomHandler(app.io);

app.io.use(function* (next) {
  try { // on connect
    console.log(this.socket.handshake.headers.cookie);
    yield* next;
  } catch (e) {
    console.log(e);
    console.log(e.stack);
  }
});

app.io.use(function* (next) {
  try { // on connect
    roomHandler.connection(this.socket);
    yield* next;
    roomHandler.disconnecting(this.socket);
  } catch (e) {
    console.log(e);
    console.log(e.stack);
  }
});

app.io.route('handshake', function* () {
  // we tell the client to execute 'new message'
  var message = this.args[0];
  this.broadcast.emit('new message', message);
});

/*
io.on('connection', function(socket){
  socket.emit('go', {pow :'POW'});
  console.log('a user connected');
  roomHandler.connection(socket);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
*/

module.exports = app;
