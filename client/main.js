(() => {
  const video_image = document.getElementById('video-img');
  const socket = io();

  socket.emit('not-server');

  socket.on('send-image', (image) => {
    console.log(image);
    video_image.src = image;
  })
})();