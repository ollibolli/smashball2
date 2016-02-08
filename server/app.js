var koa = require('koa');
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


var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);

var roomHandler = new RoomHandler(io);

io.on('connection', function(socket){
  socket.on('handshake', handshake)
});

function handshake(data){
  roomHandler.connect(this, data);
  this.on('disconnect', () => {
    roomHandler.disconnect(this, data);
  });
}

module.exports = server;
