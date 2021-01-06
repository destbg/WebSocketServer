(() => {
  const video_image = document.getElementById('video-img');
  const socket = io();

  socket.on('image', (image) => {
    console.log(image);
    video_image.src = image;
  })
})();