(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-card-search]');
  var selectInput = document.querySelector('[data-card-select]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
  var categoryButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));
  var selectedCategory = '';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards() {
    var keyword = normalize(searchInput ? searchInput.value : '');
    var region = normalize(selectInput ? selectInput.value : '');
    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-category'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesRegion = !region || normalize(card.getAttribute('data-region')).indexOf(region) !== -1;
      var matchesCategory = !selectedCategory || normalize(card.getAttribute('data-category')) === normalize(selectedCategory);
      card.classList.toggle('is-hidden-card', !(matchesKeyword && matchesRegion && matchesCategory));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (selectInput) {
    selectInput.addEventListener('change', filterCards);
  }

  categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter-category') || '';
      selectedCategory = selectedCategory === value ? '' : value;
      categoryButtons.forEach(function (item) {
        item.classList.toggle('active', item === button && selectedCategory === value);
      });
      filterCards();
    });
  });
})();
