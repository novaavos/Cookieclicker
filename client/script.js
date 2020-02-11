/*global Phaser*/


var game = new Phaser.Game(400, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
var mousex,mousey;

var bmd;
var teamscore;
var team = "blue";
var vermelhoScore = 600,azulScore = 600;

var moeda;
var background;
var Banner;
var Banner2;

var tooltip;
var tooltipText1;

var emitter;
var minMoeda;

var moedasPc = 1;

var powerUp;
var powerUp1text;
var powerUp1cost = 50;

var powerUp2;
var powerUp2text;
var powerUp2cost = 100;
var powerUp2anim;

var powerUp4;
var powerUp4text;
var powerUp4cost = 200;
var powerUp4anim;

var tweenA, tweenB;

var score = 0;
var scorePsecond = 0;
var text,tamanhoFont = 52;
var style = { font: "bold "+tamanhoFont.toString()+"px Arial", fill: "green", boundsAlignH: "center", boundsAlignV: "middle" };

function preload(){
    "use strict";
    game.load.image("moeda2","Moeda2.png");
    game.load.image("moeda","Moeda.png");
    game.load.image("background","Background.png");
    game.load.image("banner","Banner2.png");
    game.load.image("banner2","Banner3.png");
    game.load.image("PowerUp","PowerUp.png");
    game.load.image("tooltip","tooltip.png");
    game.load.spritesheet("PowerUp2", "PowerUp2Sheet.png",50,50,6);
    game.load.spritesheet("PowerUp4", "hourglass.png",50,50,62);
    game.load.image("TeamScore", "TeamScore.png");
}

function create(){
    "use strict";
    /*
    background = game.add.sprite(game.world.centerX,game.world.centerY,"background");
    background.anchor.setTo(0.5,0.5);
    */
    var myBitmap = game.add.bitmapData(400, 600);
    var grd=myBitmap.context.createLinearGradient(0,0,0,600);
    grd.addColorStop(0,"black");
    if(team == "blue"){
        grd.addColorStop(580/600,"#52B6C1");
    }
    else if(team == "red"){
        grd.addColorStop(580/600,"#FF3333");
    }
    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0,0,400,600);
    game.add.sprite(0, 0, myBitmap);
    
    teamscore = game.add.sprite(game.world.centerX+27,10,"TeamScore");
    teamscore.anchor.setTo(0.5,0.5);
    
    moeda = game.add.sprite(game.world.centerX,game.world.centerY-100,"moeda2");
    moeda.scale.setTo(0.40);
    moeda.anchor.setTo(0.5,0.5);
    moeda.inputEnabled = true;
    moeda.events.onInputDown.add(function (){
        emitter = game.add.emitter(moeda.x,moeda.y);
        emitter.makeParticles("moeda");
        emitter.y = game.world.centerY-100;
        emitter.minParticleSpeed.setTo(-200, -300);
        emitter.maxParticleSpeed.setTo(200, -400);
        emitter.gravity = 400;
        emitter.bounce.setTo(0.5, 0.5);
        emitter.angularDrag = 30;
        emitter.start(true, 8000, 400,moedasPc);
        game.world.swap(emitter,moeda);
        score += moedasPc; 
    });
    
    Banner = game.add.sprite(0,350,"banner");
    Banner.scale.setTo(0.4);
    Banner.inputEnable = true;
    Banner.events.onInputDown.add(function () {
        scorePsecond += 1;
    });
    Banner = game.add.sprite(0,450,"banner");
    Banner.scale.setTo(0.4);
    Banner2 = game.add.sprite(400,345,"banner2");
    Banner2.anchor.setTo(1,0);
    Banner2.scale.setTo(0.4);
    Banner2 = game.add.sprite(400,445,"banner2");
    Banner2.anchor.setTo(1,0);
    Banner2.scale.setTo(0.4);
    
    powerUp = game.add.button(100,360,"PowerUp",powerUp1,this,2,1,0);
    powerUp.onInputOver.add(tooltip1over,this);
    powerUp.onInputOut.add(tooltip1out,this);
    /*
    powerUp2anim = powerUp2.animations.add("anim");
    powerUp2.animations.play("anim",6,true);
    */
    powerUp2 = game.add.button(250,350,"PowerUp2",powerUp2,this,2,1,0);
    
    setInterval(function (){
        powerUp2.frame += 1;
    },1000/7);
    
    powerUp4 = game.add.button(275,475,"PowerUp4",powerUp4,this,2,1,0);
    powerUp4.anchor.setTo(0.5,0.5);
    powerUp4.angle = 10;
    
    setInterval(function (){
        powerUp4.frame += 1 
    },1000/10);
    
    setTimeout(rotacionar,6400);
    
    game.time.events.repeat(Phaser.Timer.SECOND, 10000000,moedasPerSecond,this);
    
    tweenA = game.add.tween(powerUp.position).to({y:340},500,"Linear");
    tweenB = game.add.tween(powerUp.position).to({y:360},500,"Linear");
    
    tweenA.chain(tweenB);
    tweenB.chain(tweenA);
    
    tweenA.start();
    
    text = game.add.text(game.world.centerX,50,score.toString(),style);
    text.setShadow(3,3,"rgba(0,0,0,0.5)",2);
    text.anchor.setTo(0.5,0.5);
    powerUp1text = game.add.text(30,376,"R$"+powerUp1cost.toString(),{font: "bold 28px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    powerUp2text = game.add.text(305,376,"R$"+powerUp2cost.toString(),{font: "bold 28px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    powerUp4text = game.add.text(305,476,"R$"+powerUp4cost.toString(),{font: "bold 28px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(40,410,"Auto-click",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(310,410,"Click power",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(310,510,"Golden time",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    
    teamscore.x += (vermelhoScore - azulScore);
    
}

function update(){
    "use strict";
    text.setText("R$"+score);
    
    game.physics.arcade.collide(emitter,Banner);
    
    mousex = game.input.mousePointer.x;
    mousey = game.input.mousePointer.y;

    
}

function powerUp1(){
    if(score >= powerUp1cost){
        score = score - powerUp1cost;
        scorePsecond += 1;
        powerUp1cost += Math.floor(powerUp1cost/10);
        powerUp1text.text = "R$"+powerUp1cost.toString();
        tooltip1out();
    }
}

function powerUp2(){
    if(score >= powerUp2cost){
        score = score - powerUp2cost;
        moedasPc++;
        powerUp2cost += Math.floor(powerUp2cost/10);
        powerUp2text.text = "R$"+powerUp2cost.toString();
    }
}

function powerUp4(){
    
}

function tooltip1over(){
    tooltip = game.add.sprite(mousex + 10,mousey - 10,"tooltip");
    game.add.tween(tooltip.scale).to({x: 7.5,y: 1}, 100, "Linear", true);
    tooltipText1 = game.add.text(tooltip.x + 5,tooltip.y,"Moedas por segundo + 1",{font: "bold 12px Arial", fill: "black", boundsAlignH: "center", boundsAlignV: "middle"});
}
function tooltip1out(){
    game.add.tween(tooltip.scale).to({x: 1/4,y: 1}, 100, "Linear", true);
    tooltip.destroy();
    tooltipText1.destroy();
}

function moedasPerSecond(){
    score += scorePsecond;
}

function rotacionar(){
    game.add.tween(powerUp4).to({angle:'+360'},300,"Linear",true);
    setTimeout(rotacionar,6400);
}