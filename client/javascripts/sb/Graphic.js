"use strict";

var Base = require('../sb/Base');
var _ = require('../utils/_');
    Graphic.inherits(Base);

    function Graphic(){
        Base.prototype.constructor.call(this);
    };
    /**
     * Clear the venues graphic to prepare new render phase.
     */
    Graphic.prototype.clear = function() {
        throw 'Not implemented';
    }
    /**
     * Creates a graphical object deffining the render strategis
     * @param string
     * @param element
     * @param width
     * @param height
     * @param depth
     */
    Graphic.factory = function(string,element,width,height,depth){
        _.assert(Graphic.factory[string]);
        var graphic = Graphic.factory[string](element,width,height,depth);
        graphic.graphicType = string;
        return graphic;
    };

    /**
     * A graphic factory method for creating a Graphic object suporting the <canvas> element
     * @param element a element where the canvas will be render in
     * @param width The with of the canvas
     * @param height The height of the canvas
     */
    Graphic.factory.canvas2d = function canvas2d(element,width,height){
        var graphic = new Graphic();
        graphic.canvas = document.createElement("canvas");
        graphic.canvas.style.border = "1px solid #000000"
        graphic.context = graphic.canvas.getContext("2d");
        graphic.canvas.width = graphic.width = width;
        graphic.canvas.height = graphic.height = height;
        graphic.clear = function() {
            if(graphic.backgroundImage){
                graphic.context.drawImage(graphic.backgroundImage,0,0);
            }else {
                graphic.context.clearRect(0, 0, graphic.width, graphic.height);
            }
        };
        element.appendChild(graphic.canvas);
        return graphic;
    };

    Graphic.factory.svg2d = function svg2d(element,width,height){
        var graphic = new Graphic();
        graphic.svg = raphael.paper();

    };

    module.exports = Graphic;
