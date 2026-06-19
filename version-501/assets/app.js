function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }
  callback();
}

ready(function () {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  var carousel = document.querySelector("[data-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-go")) || 0);
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  var grids = Array.prototype.slice.call(document.querySelectorAll(".filter-grid"));

  grids.forEach(function (grid) {
    var search = document.querySelector(".grid-search");
    var year = document.querySelector(".year-filter");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (search && query) {
      search.value = query;
    }

    function apply() {
      var keyword = search ? search.value.trim().toLowerCase() : "";
      var selectedYear = year ? year.value : "";
      var items = Array.prototype.slice.call(grid.querySelectorAll(".movie-item"));

      items.forEach(function (item) {
        var text = (item.getAttribute("data-filter") || "").toLowerCase();
        var itemYear = item.getAttribute("data-year") || "";
        var matchText = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !selectedYear || itemYear === selectedYear;
        item.classList.toggle("hidden", !(matchText && matchYear));
      });
    }

    if (search) {
      search.addEventListener("input", apply);
    }

    if (year) {
      year.addEventListener("change", apply);
    }

    apply();
  });
});

function initializePlayer(url, videoId, coverId) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var hls = null;
  var loaded = false;

  if (!video || !cover || !url) {
    return;
  }

  function playVideo() {
    var action = video.play();

    if (action && typeof action.catch === "function") {
      action.catch(function () {});
    }
  }

  function loadVideo() {
    if (loaded) {
      playVideo();
      return;
    }

    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      video.load();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      return;
    }

    video.src = url;
    video.addEventListener("loadedmetadata", playVideo, { once: true });
    video.load();
  }

  function start() {
    cover.classList.add("is-hidden");
    video.setAttribute("controls", "controls");
    loadVideo();
  }

  cover.addEventListener("click", start);

  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
}