(function () {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("siteNav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const opened = body.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    const prev = hero.querySelector(".hero-prev");
    const next = hero.querySelector(".hero-next");
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };

    const play = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide-to")) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }

    play();
  }

  const filterRoot = document.querySelector("[data-filter-root]");
  if (filterRoot) {
    const input = filterRoot.querySelector("[data-search-input]");
    const year = filterRoot.querySelector("[data-year-filter]");
    const type = filterRoot.querySelector("[data-type-filter]");
    const cards = Array.from(filterRoot.querySelectorAll("[data-card]"));
    const empty = filterRoot.querySelector(".empty-result");
    const form = filterRoot.querySelector(".filter-bar");
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");

    if (q && input) {
      input.value = q;
    }

    const apply = function () {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      const yearValue = year ? year.value : "";
      const typeValue = type ? type.value : "";
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-category"),
          card.getAttribute("data-year"),
        ]
          .join(" ")
          .toLowerCase();
        const okKeyword = !keyword || text.includes(keyword);
        const okYear =
          !yearValue || card.getAttribute("data-year") === yearValue;
        const okType =
          !typeValue || card.getAttribute("data-type") === typeValue;
        const ok = okKeyword && okYear && okType;
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
    }

    [input, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    apply();
  }
})();
