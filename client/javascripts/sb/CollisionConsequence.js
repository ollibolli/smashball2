'use strict';

var eventBus = require('../cosmos_')();
var Base = require('../sb/base');
var Vector = require('../utils/Vector');

CollisionConsequence.inherits(Base);

function CollisionConsequence(venue){
    this.venue = venue;
    eventBus.on('gameloop/postTick',this._onGameTick.bind(this));
};

CollisionConsequence.prototype._onGameTick = function(){
    var entities = this.venue.getEntitiesByComponent('Collision'),
      i,j;

    for (i = 0; i < entities.length; i++) {
        for (j = i + 1; j < entities.length; j++) {
            var collision = CollisionConsequence.checkCollision(entities[j].getComponent('Collision'), entities[i].getComponent('Collision'));
            if (collision) {
                eventBus.publish("collision", {});
            }
        }
    }
};

CollisionConsequence.checkCollision = function(obj1, obj2){
    if (obj1.type === 'circle' && obj2.type === 'circle'){
        return CollisionConsequence.elasticCollision(obj1, obj2)
    }
    if (obj1.type === 'boundary' && obj2.type === 'circle' ){
        return CollisionConsequence.elasticCollisionBoundaryCircle(obj2, obj1);
    }
    if (obj2.type === 'boundary' && obj1.type === 'circle' ){
        return CollisionConsequence.boundaryCircle(obj1, obj2);
    }
    if (obj2.type === 'hole' && obj1.type === 'circle' ){
        return CollisionConsequence.holeCircle(obj2, obj1);
    }
    if (obj2.type === 'circle' && obj1.type === 'hole' ){
        return CollisionConsequence.holeCircle(obj1, obj2);
    }

};

CollisionConsequence.holeCircle = function(hole, circle){
    var deltaVector = new Vector(hole.position.x - circle.position.x, hole.position.y - circle.position.y),
      sumOfRadie = hole.radius + circle.radius, // sum of radii
      sumOfMass = hole.mass + circle.mass,
      mT,
      deltaVLength = deltaVector.length(); // pre-normalized magnitude

    if (deltaVLength > sumOfRadie) {
        return false;
    }

    if (deltaVLength - circle.radius > hole.radius){

    }

    if (deltaVLength - circle.radius > hole.radius/2) {

    }

    if (deltaVLength - circle.radius > hole.radius/4) {

    }

    if (deltaVLength < 5) {
        eventBus.publish('collectEntity', circle.getEntity());
    }
    return true;
};

CollisionConsequence.boundaryCircle = function(circle, square){
    if (circle.position.x >= square.position.x + (square.width/2) ||
      circle.position.x <= square.position.x - (square.width/2) ||
      circle.position.y >= square.position.y + (square.height/2) ||
      circle.position.y <= square.position.y - (square.height/2))
    {
        eventBus.publish('deleteEntity', circle.getEntity());
        return true;
    }
    return false;
};

CollisionConsequence.elasticCollision = function(obj1,obj2){
    var deltaVector = new Vector(obj1.position.x - obj2.position.x, obj1.position.y - obj2.position.y),
      sumOfRadie = obj1.radius + obj2.radius, // sum of radii
      sumOfMass = obj1.mass + obj2.mass,
      mT,
      deltaVLength = deltaVector.length(); // pre-normalized magnitude

    if (deltaVLength > sumOfRadie) {
        return false;
    }

    obj1.velocity = obj1.getEntityComponent('Move').getVelocity();
    obj2.velocity = obj2.getEntityComponent('Move').getVelocity();

    obj1.position = obj1.getEntityComponent('Pos').getPos();
    obj2.position = obj2.getEntityComponent('Pos').getPos();

    deltaVector = deltaVector.normalize();

    mT = deltaVector.multiply(obj1.radius + obj2.radius - deltaVLength);
    obj1.position.tx(mT.multiply(obj2.mass / sumOfMass));
    obj2.position.tx(mT.multiply(-obj1.mass / sumOfMass));

    // create ball scalar normal direction.
    var ball1scalarNormal =  deltaVector.dot(obj1.velocity);

    var tangentVector = new Vector((deltaVector.y * -1), deltaVector.x);
    var ball2scalarNormal = deltaVector.dot(obj2.velocity);


    // create scalar velocity in the tagential direction.
    var ball1scalarTangential = tangentVector.dot(obj1.velocity);
    var ball2scalarTangential = tangentVector.dot(obj2.velocity);

    var ball1ScalarNormalAfter = (ball1scalarNormal * (obj1.mass - obj2.mass) + 2 * obj2.mass * ball2scalarNormal) / sumOfMass;
    var ball2ScalarNormalAfter = (ball2scalarNormal * (obj2.mass - obj1.mass) + 2 * obj1.mass * ball1scalarNormal) / sumOfMass;

    var ball1scalarNormalAfter_vector = deltaVector.multiply(ball1ScalarNormalAfter); // ball1Scalar normal doesnt have multiply not a vector.
    var ball2scalarNormalAfter_vector = deltaVector.multiply(ball2ScalarNormalAfter);

    var ball1ScalarNormalVector = tangentVector.multiply(ball1scalarTangential);
    var ball2ScalarNormalVector = tangentVector.multiply(ball2scalarTangential);

    obj1.velocity = ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector);
    obj2.velocity = ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector);

    obj1.getEntityComponent('Move').setVelocity(obj1.velocity);
    obj2.getEntityComponent('Move').setVelocity(obj2.velocity);
    return true;
}

module.exports = CollisionConsequence;
