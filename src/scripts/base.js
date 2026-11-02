/* Comportamentos comuns das LPs: FAQ, CTA fixo no celular, revelar ao rolar, carrossel fade.
   (antigo assets/js/main.js) */
document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-item__q');
    var answer = item.querySelector('.faq-item__a');
    var inner = item.querySelector('.faq-item__a-inner');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.offsetHeight + 'px';
      }
    });
  });

  /* ---------- Barra de CTA fixa (mobile) ---------- */
  var stickyCta = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');

  if (stickyCta && hero) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, { rootMargin: '-10% 0px 0px 0px' });

    heroObserver.observe(hero);
  }

  /* ---------- Revelar seções ao rolar ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Carrossel fade ---------- */
  document.querySelectorAll('.carousel-fade').forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.carousel-fade__slide');
    if (slides.length < 2) return;

    var current = 0;

    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 3500);
  });
});
