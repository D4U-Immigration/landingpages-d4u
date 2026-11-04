document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('navMobile');
  var navLinks = document.querySelectorAll('[data-navlink]');

  /* ---------- Vídeo: abre embutido em modal, sem sair da página ---------- */
  var videoTrigger = document.getElementById('videoTrigger');
  var videoModal = document.getElementById('videoModal');
  var videoEmbed = document.getElementById('videoEmbed');

  if (videoTrigger && videoModal && videoEmbed) {
    var openVideo = function () {
      var id = videoTrigger.getAttribute('data-youtube-id');
      videoEmbed.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" title="Vídeo da 3ª edição" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      videoModal.classList.add('is-open');
      document.body.classList.add('video-open');
    };
    var closeVideo = function () {
      videoModal.classList.remove('is-open');
      document.body.classList.remove('video-open');
      videoEmbed.innerHTML = '';
    };

    videoTrigger.addEventListener('click', openVideo);
    videoModal.querySelectorAll('[data-video-close]').forEach(function (el) {
      el.addEventListener('click', closeVideo);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && videoModal.classList.contains('is-open')) closeVideo();
    });
  }

  /* ---------- Cabeçalho: intensifica o fundo depois do topo ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  function closeMenu() {
    if (toggle) toggle.classList.remove('is-open');
    if (mobile) mobile.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('is-open');
      mobile.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    });
    mobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Rolagem suave para as âncoras do menu ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;
      // scroll instantâneo (não 'smooth'): evitar que a animação "arraste" a
      // página pela seção de participantes, que é bem alta por causa do pin
      // horizontal — passar por ela suavemente travava/enjoava a rolagem.
      window.scrollTo({ top: top, behavior: 'auto' });
    });
  });

  /* ---------- Participantes: pin horizontal por scroll ---------- */
  var pin = document.getElementById('speakerPin');
  var track = document.getElementById('speakerTrack');
  var dots = document.querySelectorAll('#speakerProgress .speaker-progress__dot');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (pin && track && !reduceMotion) {
    var slides = Array.prototype.slice.call(track.children);
    var slideCount = slides.length;
    var slideBodies = slides.map(function (slide) {
      return slide.querySelector('.speaker-slide__body');
    });
    var fadeRange = 0.55; // em "larguras de slide" — quanto o texto fica visível ao redor do centro
    var ticking = false;

    var updateTrack = function () {
      ticking = false;
      if (window.innerWidth < 780) return;
      var rect = pin.getBoundingClientRect();
      var scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      var progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      var maxTranslate = track.scrollWidth - window.innerWidth;
      track.style.transform = 'translateX(-' + (progress * maxTranslate) + 'px)';
      var exactIndex = progress * (slideCount - 1);
      var activeIndex = Math.round(exactIndex);
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeIndex);
      });
      slideBodies.forEach(function (body, i) {
        if (!body) return;
        var distance = Math.abs(exactIndex - i);
        var opacity = Math.max(0, 1 - distance / fadeRange);
        body.style.opacity = opacity;
        body.style.transform = 'translateY(' + (1 - opacity) * 18 + 'px)';
      });
    };

    var requestTick = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateTrack);
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    updateTrack();
  }

  /* ---------- Menu ativo conforme a seção visível (scrollspy) ---------- */
  var sections = document.querySelectorAll('[data-section]');
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }
});
