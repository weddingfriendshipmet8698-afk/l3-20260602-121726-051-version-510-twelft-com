function initMoviePlayer(videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var attached = false;
    var hlsInstance = null;

    if (!video || !overlay || !source) {
        return;
    }

    var attach = function () {
        if (attached) {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
        attached = true;
    };

    var start = function () {
        attach();
        overlay.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    };

    overlay.addEventListener("click", start);
    video.addEventListener("click", function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
    });
    video.addEventListener("ended", function () {
        overlay.classList.remove("is-hidden");
    });
    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
