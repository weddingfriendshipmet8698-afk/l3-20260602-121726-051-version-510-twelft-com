(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    initHero();
    initFilters();
    initPlayer();
  });

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-thumb]"));
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var next = Number(thumb.getAttribute("data-hero-thumb") || "0");
        show(next);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-filter-grid]"));
    grids.forEach(function (grid) {
      var section = grid.closest("section") || document;
      var input = section.querySelector("[data-filter-input]");
      var yearSelect = section.querySelector("[data-year-filter]");
      var typeSelect = section.querySelector("[data-type-filter]");
      var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));

      if (grid.getAttribute("data-query-source") === "url" && input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";

        cards.forEach(function (card) {
          var haystack = card.getAttribute("data-search") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchedYear = !year || cardYear === year;
          var matchedType = !type || cardType.indexOf(type) !== -1;
          card.classList.toggle("is-filter-hidden", !(matchedKeyword && matchedYear && matchedType));
        });
      }

      [input, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      apply();
    });
  }

  function initPlayer() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    blocks.forEach(function (block) {
      var video = block.querySelector("video");
      var overlay = block.querySelector(".player-overlay");
      var stream = block.getAttribute("data-stream");
      var loaded = false;
      var hls = null;

      if (!video || !stream) {
        return;
      }

      function attach() {
        if (loaded) {
          return;
        }
        loaded = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          return;
        }

        video.src = stream;
      }

      function play() {
        attach();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", play);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }
})();
