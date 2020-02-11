var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


server.listen(process.env.PORT || 3001);
console.log("Server running...");

app.use(express.static(__dirname + '/client'));

io.sockets.on('connection',function(socket){
    console.log("Novo Usuário conectado...")
});