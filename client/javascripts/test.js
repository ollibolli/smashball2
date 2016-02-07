require([
    'sb/Entity',
    'sb/Gameloop',
    'cosmos_',
    'sb/keyboard_',
    'sb/Venue',
    'sb/Graphic',
    'sb/comp/Render',
    'sb/entities/player_',
    'sb/entities/opponent_',
    'sb/entities/board_',
    'sb/entities/Ball',
    'utils/Vector',
    'sb/comp/FnMoveDecorator',
    'sb/comp/Move'

], function(Entity, Gameloop, smashball, keyboard, Venue, Graphic, Rendable, player, opponent, board, Ball, Vector, FnMoveDecorator, Move) {
    var gameloop,
        eventBus,
        venue,
        ball1;

    eventBus = cosmos_.eventBus;
    cosmos.on('keyboard/keydown', function (type, event) {
        if (event.keyCode === keyboard_.P) {
            gameloop.stop();
        }
    });

    var venue2 = new Venue(Graphic.factory('canvas2d', document.getElementById('venue2'), 400, 400));
    var ctx = venue2.getGraphic().context;
    var move = new Move(new Vector(0,0));
    move = new FnMoveDecorator(move,new Vector(200,200),-0.01);
    window.move = move;
    for(var j = 0;j < 400 ; j++){
        for(var i = 0;i < 400 ; i++){
            //if(j%1 == 0 && i%5 == 0){
                var r = FnMoveDecorator.deltaVector(new Vector(j,i),new Vector(200,200),0.011),
                    x = r.length()*60+60;
                x = Math.floor(x);
                ctx.fillStyle = 'rgba('+x+','+x+','+x+',127)';
                ctx.fillRect( i, j, 5, 5 );
            //}
        }
    }



    document.getElementById('venue').backgroundImage = image;
    var venue = new Venue(Graphic.factory('canvas2d', document.getElementById('venue'), 400, 400));

    var image = new Image();
    image.src = venue2.getGraphic().canvas.toDataURL("image/png");//.replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

    venue.getGraphic().backgroundImage = image;
    //move to a scene//
    var ball1 = new Entity('ball1');
    var render = new Rendable();
    ball1.addComponent(render);
    venue.addEntity(player);
    venue.addToStage(player);
//    venue.addEntity(opponent);
//    venue.addToStage(opponent);
//    venue.addEntity(board);
//    venue.addToStage(board);

    //move to game logic
    var ballIndex= 0;
    cosmos_.cosmos.on('player/fireball',function(type,options){
        var ball = new Ball('ball'+ballIndex,options.pos,options.velocity);
        ballIndex++;
        venue.addEntity(ball);
        venue.addToStage(ball);
    });

    cosmos_.cosmos.on('pos/outsideBoundery',function(type,entity){
        venue.removeEntity(entity);
    });

    gameloop = new Gameloop();
    gameloop.setGraphic(venue);
    gameloop.setFrameRate(60);
    gameloop.start();

});

