document.addEventListener("DOMContentLoaded", function () {
  const shell = document.querySelector("[data-player-shell]");
  const video = shell ? shell.querySelector("video[data-src]") : null;
  const playButton = shell ? shell.querySelector("[data-play-button]") : null;

  if (!shell || !video) {
    return;
  }

  let loaded = false;

  async function attachSource() {
    if (loaded) {
      return;
    }

    const source = video.dataset.src;
    if (!source) {
      return;
    }

    loaded = true;
    shell.classList.add("is-ready");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    try {
      const module = await import("./hls-vendor-dru42stk.js");
      const Hls = module.H;

      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }
    } catch (error) {
      console.warn("HLS module loading failed, falling back to direct source.", error);
    }

    video.src = source;
  }

  async function startPlayback(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    await attachSource();

    try {
      await video.play();
    } catch (error) {
      console.warn("Video playback requires a user gesture or browser support.", error);
    }
  }

  if (playButton) {
    playButton.addEventListener("click", startPlayback);
  }

  shell.addEventListener("click", function (event) {
    if (event.target === video) {
      return;
    }
    startPlayback(event);
  });
});
