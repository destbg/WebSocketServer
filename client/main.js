(async () => {
  const reload = document.getElementById('reload');
  const stream_div = document.getElementById('stream');
  const leave_stream = document.getElementById('leave-stream');
  const video_image = document.getElementById('video-stream');
  const list_of_streams = document.getElementById('list-of-streams');
  const socket = io();

  stream_div.style.display = 'none';

  leave_stream.addEventListener('click', async () => {
    console.log('leaving stream');
    socket.emit('leave-streams');
    await fetchStreams();
    video_image.src = '';
    list_of_streams.style.display = 'block';
    stream_div.style.display = 'none';
  });

  reload.addEventListener('click', async () => await fetchStreams());

  socket.on('send-image', (image) => {
    video_image.src = 'data:image/jpeg;base64,' + image;
  });

  socket.on('send-audio', (audio) => {
    const snd = new Audio("data:audio/wav;base64," + audio);
    snd.play();
  });

  await fetchStreams();

  async function fetchStreams() {
    console.log('fetching streams');
    const response = await fetch('/streams')
      .then(res => res.json());
    console.log(response);

    list_of_streams.innerHTML = '';
    for (const stream of response.streams) {
      console.log(stream);
      const button = document.createElement('button');
      button.addEventListener('click', () => openStream(stream));
      button.innerHTML = stream;

      list_of_streams.appendChild(button);
    }
  }

  async function openStream(stream) {
    list_of_streams.style.display = 'none';
    stream_div.style.display = 'block';

    socket.emit('join-stream', stream);
  }
})();