/* Comportamentos das LPs com hero + formulário: progresso de leitura, linha do tempo (EB-5),
   destaque do form, checklist, 10 empregos (EB-5), prêmios sob demanda, contadores e vídeos em popup
   (antigos page.js da EB-2 NIW e da EB-5). Cada bloco só age se o elemento existir na página. */
document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Barra de progresso de leitura + linha do tempo do processo (.eb5-steps) ---------- */
  var progress = document.querySelector('.read-progress');
  var timeline = document.querySelector('.eb5-steps');
  var steps = timeline ? timeline.querySelectorAll('.eb5-steps__step') : [];
  if (progress || timeline) {
    var onScroll = function () {
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      }
      if (timeline) {
        /* A linha dourada enche conforme o centro da tela passa pelos passos */
        var mid = window.innerHeight * 0.55;
        var r = timeline.getBoundingClientRect();
        var fill = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
        timeline.style.setProperty('--fill', fill.toFixed(3));
        steps.forEach(function (step) {
          step.classList.toggle('is-active', step.getBoundingClientRect().top < mid);
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (timeline) window.addEventListener('resize', onScroll);
    onScroll();
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

  /* ---------- 10 empregos (EB-5): ícones acendem em sequência ---------- */
  var jobs = document.querySelector('.jobs-row');
  if (jobs) {
    var icons = jobs.querySelectorAll('span');
    var lightUp = function () {
      icons.forEach(function (el, i) {
        if (prefersReducedMotion) el.classList.add('is-on');
        else setTimeout(function () { el.classList.add('is-on'); }, i * 110);
      });
    };
    if ('IntersectionObserver' in window) {
      var jobsObserver = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { lightUp(); obs.disconnect(); }
      }, { threshold: 0.8 });
      jobsObserver.observe(jobs);
    } else {
      lightUp();
    }
  }

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

  /* ---------- Contador animado (credenciais e valores de investimento) ----------
     data-count = alvo; data-decimals = casas decimais; data-decimal-sep = separador (padrão vírgula; "." no EN). */
  var counters = document.querySelectorAll('[data-count]');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var animate = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var from = parseFloat(el.getAttribute('data-from') || '0');
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var sep = el.getAttribute('data-decimal-sep') || ',';
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var final = el.innerHTML;
      var start = null;
      var duration = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + (from + (target - from) * eased).toFixed(decimals).replace('.', sep) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.innerHTML = final;
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
