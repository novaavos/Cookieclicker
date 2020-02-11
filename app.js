var express = require("express");
var app = express();
var servidor = require("http").createServer(app);
var bodyParser= require('body-parser');
var io = require('socket.io')(servidor,{});
var fs = require('fs');
var scoreTimes;

var vermelho = 10;
var azul = 10;

app.use(express.static(__dirname +"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


servidor.listen(process.env.PORT ||3000, function(){
    console.log("Server running...");
});


fs.readFile(
  "data/scoreTimes.json",
  "utf8",     
  function(err, data){ 
    if(err){
      throw err
    }
    scoreTimes = JSON.parse(data);
    vermelho = scoreTimes.vermelho;
    azul = scoreTimes.azul;
    console.log("Score Azul :"+scoreTimes.azul);
    console.log("Score Vermelho :"+scoreTimes.vermelho);
});

io.sockets.on('connection',function (socket){
    console.log('Novo usuário conectado!');
    
    socket.on('teamScoreVermelho',function(data){
        vermelho += data;
        console.log(data);
        console.log(vermelho);
        io.emit('ScoretimeVermelho',vermelho);
    });
    socket.on('teamScoreAzul',function(data){
        azul += data;
        console.log(data);
        console.log(azul);
        io.emit('ScoretimeAzul',azul);
    });
});


setInterval(function(){
    
    fs.writeFile(
  "data/scoreTimes.json",   
  JSON.stringify({vermelho,azul}),  
  "utf8",  
  function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Gravamos o scoreTimes!");
});

},10000);
