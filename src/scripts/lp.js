/* Comportamentos das LPs com hero + formulário: progresso de leitura, destaque do form,
   checklist, prêmios sob demanda, contadores e vídeos em popup (antigo page.js da EB-2 NIW). */
document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Barra de progresso de leitura ---------- */
  var progress = document.querySelector('.read-progress');
  if (progress) {
    var updateProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Link ativo no menu conforme a seção visível ---------- */
  var navLinks = document.querySelectorAll('.site-nav a');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
  }

  /* ---------- CTAs levam ao formulário do hero e destacam o card ---------- */
  var heroForm = document.querySelector('.hero-form');
  if (heroForm) {
    document.querySelectorAll('a[data-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        heroForm.classList.remove('is-highlight');
        setTimeout(function () {
          heroForm.classList.add('is-highlight');
          setTimeout(function () { heroForm.classList.remove('is-highlight'); }, 1600);
        }, 450);
      });
    });
  }

  /* ---------- Checklist "Quem pode considerar" ---------- */
  var toggles = document.querySelectorAll('.check-toggle');
  var meterBars = document.querySelectorAll('.check-meter span');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var count = document.querySelectorAll('.check-toggle[aria-pressed="true"]').length;
      meterBars.forEach(function (bar, i) { bar.classList.toggle('is-on', i < count); });
    });
  });

  /* ---------- Selos de prêmios: carregam só quando a faixa se aproxima da tela ---------- */
  var awards = document.querySelector('.awards');
  if (awards) {
    var loadAwards = function () {
      awards.querySelectorAll('[data-srcset]').forEach(function (el) { el.srcset = el.getAttribute('data-srcset'); el.removeAttribute('data-srcset'); });
      awards.querySelectorAll('img[data-src]').forEach(function (el) { el.src = el.getAttribute('data-src'); el.removeAttribute('data-src'); });
    };
    if ('IntersectionObserver' in window) {
      var awardsObserver = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { loadAwards(); obs.disconnect(); }
      }, { rootMargin: '800px 0px' });
      awardsObserver.observe(awards);
    } else {
      loadAwards();
    }
  }

  /* ---------- Contador animado nos números de credenciais ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var from = parseInt(el.getAttribute('data-from') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var final = el.textContent;
      var start = null;
      var duration = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(from + (target - from) * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    };
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Vídeos do YouTube em popup ----------
     A página carrega só a capa; o iframe é criado ao abrir o popup e removido ao fechar. */
  var modal = document.getElementById('videoModal');
  if (modal) {
    var frameBox = modal.querySelector('.video-modal__frame');
    var lastTrigger = null;
    var closeModal = function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      frameBox.innerHTML = '';
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    };
    var openModal = function (id, trigger) {
      lastTrigger = trigger;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = modal.getAttribute('aria-label') || 'YouTube';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      frameBox.innerHTML = '';
      frameBox.appendChild(iframe);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.video-modal__close').focus();
    };
    document.querySelectorAll('.video-embed[data-video]').forEach(function (box) {
      box.addEventListener('click', function () {
        openModal(box.getAttribute('data-video'), box.querySelector('.video-embed__play'));
      });
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.video-modal__close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }
});
