const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 4200;

let streams = [];

app.use(helmet());
app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (sock) => {
  console.log('A new connection');
  let userRoom = undefined;

  sock.on('disconnect', () => {
    if (userRoom != undefined) {
      streams = streams.filter(f => f != userRoom);
    }
  });

  sock.on('create-stream', (room) => {
    console.log('creating room ' + room);
    userRoom = room;
    streams.push(userRoom);
  });

  sock.on('leave-streams', () => {
    console.log('leaving all rooms');
    sock.leaveAll();
  });

  sock.on('join-stream', (room) => {
    console.log('joining stream ' + room);
    sock.join('receive ' + room);
  });

  sock.on('image', (image) => {
    io.to('receive ' + userRoom).emit('send-image', image);
  });
});

app.get('/streams', (_, res) => {
  res.json({streams});
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

http.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
