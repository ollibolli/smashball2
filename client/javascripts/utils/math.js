define([

],function(){
    'use strict';
    var math ={};

    math.keneticEnergy = function(mass,velocity){
        return Math.pow(0.5*mass*velocity,2);
    };

    math.velocityPrime1 = function(m1,v1,m2,v2){
        return (v1 * (m1 - m2) + 2 * m2 + v2) / (m1 + m2);
    };



    return math;
});