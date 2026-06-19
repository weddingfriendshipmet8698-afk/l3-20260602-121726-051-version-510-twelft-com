function setupMoviePlayer(videoId, overlayId, streamUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var hlsInstance = null;

  if (!video || !overlay || !streamUrl) {
    return;
  }

  function attachStream() {
    if (video.getAttribute('data-ready') === 'yes') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    video.setAttribute('data-ready', 'yes');
  }

  function startPlayback() {
    attachStream();
    overlay.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      overlay.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
