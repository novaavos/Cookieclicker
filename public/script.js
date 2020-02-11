/*global Phaser*/


var socket = io.connect('http://localhost:3000');
var game = new Phaser.Game(400, 600, Phaser.AUTO,'phaser-example',{preload : preload, create: create, update: update});

var mousex,mousey;


var bmd;
var teamscore;
var team;
var vermelhoScore = 1,azulScore = 1;

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

var powerUp3;
var powerUp3text;
var powerUp3cost = 150;

var powerUp4;
var powerUp4text;
var powerUp4cost = 200;
var powerUp4anim;
var ativo4 = false;

var tweenA, tweenB;

var score = 0;
var scorePsecond = 0;
var text,tamanhoFont = 52;
var style = { font: "bold "+tamanhoFont.toString()+"px Arial", fill: "green", boundsAlignH: "center", boundsAlignV: "middle" };


function preload(){
    "use strict";
    game.load.image("moeda2","/Assets/Moeda2.png");
    game.load.image("moeda","/Assets/Moeda.png");
    game.load.image("background","/Assets/Background.png");
    game.load.image("banner","/Assets/Banner2.png");
    game.load.image("banner2","/Assets/Banner3.png");
    game.load.image("PowerUp","/Assets/PowerUp.png");
    game.load.image("tooltip","/Assets/tooltip.png");
    game.load.spritesheet("PowerUp2", "/Assets/PowerUp2Sheet.png",50,50,6);
    game.load.spritesheet("PowerUp4", "/Assets/hourglass.png",50,50,62);
    game.load.image("TeamScore", "/Assets/TeamScore.png");
    game.load.image('PowerUp3',"/Assets/PowerUp3.png");
}

function create(){
    "use strict";
    /*
    background = game.add.sprite(game.world.centerX,game.world.centerY,"background");
    background.anchor.setTo(0.5,0.5);
    */
    
    var teamRandom = Math.floor(Math.random()*2)+1;
    if(teamRandom == 1){
        team = 'blue';
        setInterval(function(){
            socket.emit('teamScoreAzul',score/100);
        },1000);
    }
    if(teamRandom == 2){
        team = 'red';
        setInterval(function(){
            socket.emit('teamScoreVermelho',score/100);
        },1000);
    }
    
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
    
    teamscore = game.add.sprite(game.world.centerX,10,"TeamScore");
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
    
    powerUp3 = game.add.button(100,475,"PowerUp3",powerUp3,this,2,1,0);
    
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
    powerUp3text = game.add.text(30,476,"R$"+powerUp3cost.toString(),{font: "bold 28px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    powerUp4text = game.add.text(305,476,"R$"+powerUp4cost.toString(),{font: "bold 28px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(40,410,"Auto-click",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(310,410,"Click power",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(40,510,"Super Auto-click",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    game.add.text(310,510,"Golden time",{font: "bold 12px Arial", fill: "white", boundsAlignH: "center", boundsAlignV: "middle"});
    
    

}

function update(){
    "use strict";
    text.setText("R$"+Math.floor(score));
    
    game.physics.arcade.collide(emitter,Banner);
    
    mousex = game.input.mousePointer.x;
    mousey = game.input.mousePointer.y;
    
    powerUp3.y = powerUp.y + 115;
    
    teamscore.x = ((azulScore*-1) + vermelhoScore /100)+240;
    if(teamscore.x > 400){
        teamscore.x = 400;
    }
    else if(teamscore.x < 0){
        teamscore.x = 0;
    }
}

function powerUp1(){
    if(score >= powerUp1cost){
        score = score - powerUp1cost;
            scorePsecond += 1;   
        powerUp1cost += Math.floor(powerUp1cost/10);
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

function powerUp3(){
    if(score >= powerUp3cost){
        score -= powerUp3cost;
        powerUp3cost += powerUp3cost/10;
        moedasPerSecond += 5;
    }
}

function powerUp4(){
    if(score >= powerUp4cost){
    score -= powerUp4cost;
    powerUp4cost += powerUp4cost/10;
    ativo4 = true;
    moedasPc = moedasPc * 2;
    setTimeout(function(){
        ativo4 = false;
        moedasPc = moedasPc/2;
    },10000);
    powerUp4text.text = "R$"+powerUp4cost.toString();
    }
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
        if(ativo4 == true){
          score += scorePsecond+(scorePsecond/10);   
        }else{
         score += scorePsecond;
        }
}


function rotacionar(){
    game.add.tween(powerUp4).to({angle:'+360'},300,"Linear",true);
    setTimeout(rotacionar,6400);
}

socket.on('ScoretimeVermelho',function(data){
    console.log(teamscore.x)
    vermelhoScore = data;
});
socket.on('ScoretimeAzul',function(data){
    console.log(teamscore.x)
    azulScore = data;
});


