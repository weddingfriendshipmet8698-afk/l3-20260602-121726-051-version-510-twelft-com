import { H as Hls } from "./hls.js";

export function initMoviePlayer(source) {
  const video = document.getElementById("moviePlayer");
  const button = document.getElementById("moviePlayButton");

  if (!video || !source) {
    return;
  }

  let attached = false;

  const attach = function () {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.load();
      return;
    }

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
    video.load();
  };

  const start = async function () {
    attach();
    if (button) {
      button.classList.add("is-hidden");
    }
    video.controls = true;
    try {
      await video.play();
    } catch (error) {
      video.focus();
    }
  };

  if (button) {
    button.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (!attached || video.paused) {
      start();
    }
  });
}
