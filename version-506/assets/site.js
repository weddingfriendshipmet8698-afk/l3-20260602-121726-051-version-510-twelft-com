import { H as Hls } from "./hls-vendor-dru42stk.js";

const normalize = (value) => (value || "").toString().toLowerCase().trim();

function setupMobileMenu() {
  const button = document.querySelector(".mobile-menu-toggle");
  const links = document.querySelector(".nav-links");

  if (!button || !links) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupHeroSlider() {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const prev = document.querySelector("[data-hero-prev]");
  const next = document.querySelector("[data-hero-next]");

  if (slides.length === 0) {
    return;
  }

  let current = 0;
  let timer = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(current + 1), 6000);
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      restart();
    });
  });

  prev?.addEventListener("click", () => {
    showSlide(current - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    showSlide(current + 1);
    restart();
  });

  restart();
}

function setupSearchForms() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = form.getAttribute("data-search-target") || "./search.html";
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      const url = query ? `${target}?q=${encodeURIComponent(query)}` : target;
      window.location.href = url;
    });
  });
}

function setupFilters() {
  const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
  const input = document.querySelector(".filter-input");
  const resultCount = document.querySelector("[data-result-count]");
  const emptyState = document.querySelector("[data-empty-state]");
  const chips = Array.from(document.querySelectorAll(".filter-chip"));

  if (cards.length === 0) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  let activeField = "all";
  let activeValue = "全部";

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  const apply = () => {
    const query = normalize(input?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const searchText = normalize(card.getAttribute("data-search"));
      const fieldText = activeField === "all" ? "全部" : normalize(card.getAttribute(`data-${activeField}`));
      const matchesQuery = !query || searchText.includes(query);
      const matchesChip = activeField === "all" || fieldText === normalize(activeValue);
      const shouldShow = matchesQuery && matchesChip;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = String(visible);
    }

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  };

  input?.addEventListener("input", apply);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeField = chip.getAttribute("data-filter-field") || "all";
      activeValue = chip.getAttribute("data-filter-value") || "全部";
      apply();
    });
  });

  apply();
}

function setupImageFallback() {
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.opacity = "0";
      const frame = image.closest(".poster-frame, .hero-poster-card, .detail-poster, .category-preview, .category-large-preview");
      if (frame) {
        frame.classList.add("is-image-missing");
      }
    }, { once: true });
  });
}

function setupBackToTop() {
  const button = document.querySelector(".back-to-top");

  if (!button) {
    return;
  }

  const update = () => {
    button.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", update, { passive: true });
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  update();
}

function setupPlayer() {
  const player = document.querySelector("[data-player]");
  const video = player?.querySelector("video");
  const button = player?.querySelector("[data-play-url]");
  const cover = player?.querySelector(".player-cover");
  const status = document.querySelector("[data-player-status]");

  if (!player || !video || !button) {
    return;
  }

  let hlsInstance = null;

  const setStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const start = async () => {
    const source = button.getAttribute("data-play-url");

    if (!source) {
      setStatus("当前影片没有可用播放源。");
      return;
    }

    try {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);

        hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            setStatus("播放源加载失败，请检查网络或稍后重试。");
          }
        });
      } else {
        setStatus("当前浏览器不支持 HLS 播放。");
        return;
      }

      cover?.classList.add("is-hidden");
      setStatus("正在加载播放源，请稍候...");
      await video.play();
      setStatus("正在播放。");
    } catch (error) {
      setStatus("浏览器阻止了自动播放，请再次点击播放按钮或使用播放器控件。");
      cover?.classList.remove("is-hidden");
      console.error(error);
    }
  };

  button.addEventListener("click", start);
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupHeroSlider();
  setupSearchForms();
  setupFilters();
  setupImageFallback();
  setupBackToTop();
  setupPlayer();
});
