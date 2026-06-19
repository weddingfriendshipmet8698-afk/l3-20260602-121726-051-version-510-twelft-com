(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var active = 0;
        var show = function (index) {
            active = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === active);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                show((active + 1) % slides.length);
            }, 5200);
        }
    }

    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-card-grid]"));
    grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        var section = grid.closest(".section") || document;
        var input = section.querySelector(".local-filter");
        var typeButtons = Array.prototype.slice.call(section.querySelectorAll("[data-filter-type]"));
        var yearButtons = Array.prototype.slice.call(section.querySelectorAll("[data-filter-year]"));
        var state = {
            keyword: "",
            type: "all",
            year: "all"
        };
        var apply = function () {
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();
                var matchesKeyword = !state.keyword || haystack.indexOf(state.keyword) !== -1;
                var matchesType = state.type === "all" || card.getAttribute("data-type") === state.type;
                var matchesYear = state.year === "all" || card.getAttribute("data-year") === state.year;
                card.classList.toggle("is-hidden", !(matchesKeyword && matchesType && matchesYear));
            });
        };
        if (input) {
            input.addEventListener("input", function () {
                state.keyword = input.value.trim().toLowerCase();
                apply();
            });
        }
        typeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                state.type = button.getAttribute("data-filter-type");
                typeButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                apply();
            });
        });
        yearButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var next = button.getAttribute("data-filter-year");
                state.year = state.year === next ? "all" : next;
                yearButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button && state.year === next);
                });
                apply();
            });
        });
    });
})();
