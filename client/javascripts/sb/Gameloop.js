var eventBus = require('../cosmos_')();
var Base = require('../sb/Base');
var _ = require('../utils/util');

GameLoop.inherits(Base);

function GameLoop() {
  Base.call(this);
  this._fps = 60;
  this._running = false;
  this._loops = 0;
  this._skipTicks = 1000 / this._fps;
  this._maxFrameSkip = 100;
  this._startTime;
  this._requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / this._fps);
  }.bind(this);

  this._cancelRequestAnimationFrame = window.cancelAnimationFrame ||
  window.cancelRequestAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  function (id) {
    window.clearTimeout(id);
  };
};

GameLoop.prototype.setFrameRate = function setFrameRate(rate) {
  this._fps = rate;
  this._skipTicks = 1000 / this._fps;
};

GameLoop.prototype.getFrameRate = function getFrameRate() {
  return this._fps;
};

GameLoop.prototype.start = function start() {
  var self = this;
  self._startTime = (new Date).getTime();
  self._running = true;
  self._loops = 0;


  function onFrame() {
    if (self._running) {
      while ((new Date).getTime() > self._startTime) {
        self.getGraphic().clear();
        eventBus.emit('gameloop/render', self.getGraphic());
        eventBus.emit('gameloop/gameTick');
        eventBus.emit('gameloop/postTick');
        self._startTime += self._skipTicks;
        self._loops++;
      }
      onFrame._id = self._requestAnimationFrame.call(window, onFrame);
    } else {
      self._cancelRequestAnimationFrame.call(window, onFrame._id);
    }
  };

  self._onFrame = onFrame;

  onFrame();
};

GameLoop.prototype.stop = function stop() {
  this._running = false;
};

GameLoop.prototype.setGraphic = function (venue) {
  this.assertParam(venue, require('./Graphic'));
  this._graphic = venue;
};
GameLoop.prototype.getGraphic = function () {
  if (!this._graphic) throw new Error('[Gameloop.getGraphic] Graphic on Gameloop not set');
  return this._graphic
};
GameLoop.prototype.getGameTicks = function(){
  return this._loops;
};

module.exports = GameLoop;
