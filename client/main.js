(async () => {
  const stream_div = document.getElementById('stream');
  const leave_stream = document.getElementById('leave-stream');
  const video_image = document.getElementById('video-stream');
  const list_of_streams = document.getElementById('list-of-streams');
  const socket = io();

  stream_div.style.display = 'none';

  leave_stream.addEventListener('click', async () => {
    socket.emit('leave-streams');
    await fetchStreams();
    video_image.src = '';
    list_of_streams.style.display = 'block';
    stream_div.style.display = 'none';
  });

  socket.on('send-image', (image) => {
    console.log(image);
    video_image.src = image;
  });

  await fetchStreams();

  async function fetchStreams() {
    const streams = await fetch('/streams')
      .then(res => res.json());

    list_of_streams.innerHTML = '';
    for (const stream of streams) {
      const p = document.createElement('p');
      p.addEventListener('click', () => openStream(stream));
      p.innerHTML = stream;

      list_of_streams.appendChild(p);
    }
  }

  async function openStream(stream) {
    list_of_streams.style.display = 'none';
    stream_div.style.display = 'block';

    socket.emit('join-stream', stream);
  }
})();