document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  setupHeroSlider();
  setupSearchAndSort();
  applyQuerySearch();
});

function setupHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dotsWrap = document.querySelector("[data-hero-dots]");

  if (!slider || slides.length === 0 || !dotsWrap) {
    return;
  }

  let current = 0;
  const dots = slides.map(function (_, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "切换到第" + (index + 1) + "张推荐");
    button.addEventListener("click", function () {
      showSlide(index);
    });
    dotsWrap.appendChild(button);
    return button;
  });

  function showSlide(index) {
    current = index;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  showSlide(0);

  window.setInterval(function () {
    showSlide((current + 1) % slides.length);
  }, 5200);
}

function setupSearchAndSort() {
  const lists = Array.from(document.querySelectorAll("[data-card-list]"));

  lists.forEach(function (list) {
    const panel = list.closest("section")?.querySelector("[data-filter-panel]") || document;
    const searchInput = panel.querySelector("[data-search-input]");
    const sortSelect = panel.querySelector("[data-sort-select]");
    const count = list.closest("section")?.querySelector("[data-result-count]");
    const cards = Array.from(list.children);

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
      const keyword = normalize(searchInput ? searchInput.value : "");
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.tags
        ].join(" "));
        const matched = !keyword || haystack.includes(keyword);
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "当前显示 " + visible + " 部影片";
      }
    }

    function sortCards() {
      const mode = sortSelect ? sortSelect.value : "default";
      const sorted = cards.slice();

      if (mode === "year-desc") {
        sorted.sort(function (a, b) {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        });
      }

      if (mode === "year-asc") {
        sorted.sort(function (a, b) {
          return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
        });
      }

      if (mode === "title") {
        sorted.sort(function (a, b) {
          return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-CN");
        });
      }

      sorted.forEach(function (card) {
        list.appendChild(card);
      });

      filterCards();
    }

    if (searchInput) {
      searchInput.addEventListener("input", filterCards);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", sortCards);
    }

    filterCards();
  });
}

function applyQuerySearch() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  if (!query) {
    return;
  }

  const input = document.querySelector("[data-search-input]");
  if (input) {
    input.value = query;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
