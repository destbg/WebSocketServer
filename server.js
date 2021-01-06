const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 4200;

app.use(helmet());
app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (sock) => {
  console.log('A new connection');

  sock.on('not-server', () => {
    sock.join('receive');
  });

  sock.on('image', (image) => {
    console.log('Received image ' + image);
    io.to('receive').emit('send-image', image);
  });
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

http.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
