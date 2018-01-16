//https://stackoverflow.com/questions/7702461/socket-io-custom-client-id
//https://socket.io/get-started/chat/
//https://stackoverflow.com/questions/24041220/sending-message-to-a-specific-id-in-socket-io-1-0

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http); //init new instance of socket.io by passing http server object.

var users = [];
var socketIds = {};
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


// listen on the connection event for incoming sockets
io.on('connection', function(socket){
      console.log('a user connected:');
      console.log('io.sockets.connected:', io.sockets.connected);
     

     //Socket disconnected event   
     socket.on('disconnect', function(){
         console.log('user disconnected');
         for( var i=0, len=users.length; i<len; ++i ){
                var user = users[i];

                if(user.socketId === socket.id){
                    users.splice(i,1);
                    break;
                }
        }
     });
    
     socket.on('user-connected', function(userData){
         //Maintaning the list of connected users. It would be better to keep it in Redis Server. Insteasd of variable.
         //The ideaa is to create a map of <userId, 'socket id'>. So to send a msg to specidffic user get the socket id by user id from map and send to the speciffic socket.
         var user = new Object();
         user.customId = userData.customId;
         user.id = userData.id;
         user.socketId = socket.id;
         socketIds[user.id] = socket.id;
         io.sockets.connected[socket.id].emit('message', user.id);
         users.push(user);
         console.log('users:', users.length);
     });

    //Socket message emitted
     socket.on('message', function(msg){
         io.emit('message', msg);
         console.log('message: ' + msg);
     });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});