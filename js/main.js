/* ============================================
   Kore RH Estratégico - scripts do site
============================================ */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano do rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var botaoMenu = document.getElementById('menuToggle');
  var menu = document.getElementById('navMenu');
  var desktop = window.matchMedia('(min-width: 861px)');

  function abrirMenu(abrir) {
    menu.classList.toggle('open', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      abrirMenu(!menu.classList.contains('open'));
    });

    // Fecha ao tocar em qualquer link do menu
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { abrirMenu(false); });
    });

    // Fecha com Esc e devolve o foco ao botão
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        abrirMenu(false);
        botaoMenu.focus();
      }
    });

    // Fecha ao tocar fora do cabeçalho
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !e.target.closest('.site-header')) abrirMenu(false);
    });

    // Fecha ao voltar para a largura de computador
    desktop.addEventListener('change', function (e) {
      if (e.matches) abrirMenu(false);
    });
  }

  /* ---------- Sombra do cabeçalho ao rolar ---------- */
  var header = document.getElementById('siteHeader');
  function sombraHeader() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  if (header) {
    sombraHeader();
    window.addEventListener('scroll', sombraHeader, { passive: true });
  }

  if (!('IntersectionObserver' in window)) return;

  /* ---------- WhatsApp flutuante: aparece após o topo e some no contato/rodapé ---------- */
  var waFloat = document.getElementById('waFloat');
  var hero = document.getElementById('inicio');
  if (waFloat && hero) {
    var ocultaEm = new Set();
    var passouHero = false;
    var atualizaWa = function () {
      waFloat.classList.toggle('visible', passouHero && ocultaEm.size === 0);
    };
    new IntersectionObserver(function (entradas) {
      passouHero = !entradas[0].isIntersecting;
      atualizaWa();
    }).observe(hero);
    var observaFim = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) ocultaEm.add(entrada.target);
        else ocultaEm.delete(entrada.target);
      });
      atualizaWa();
    });
    document.querySelectorAll('#contato, .site-footer').forEach(function (el) { observaFim.observe(el); });
  }

  /* ---------- Link ativo no menu ---------- */
  var links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var observaSecao = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      var link = links[entrada.target.id];
      if (!link || !entrada.isIntersecting) return;
      Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
      link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) {
    var secao = document.getElementById(id);
    if (secao) observaSecao.observe(secao);
  });

  /* ---------- Animação de entrada (desligada com movimento reduzido) ---------- */
  if (reduzMovimento) return;
  var alvos = document.querySelectorAll('.section-head, .grid > li, .sinal, .segmento, .passo, .nr-col, .principio, .consultor, .cta-band, .quote, .canal, .aviso, .posicionamento-inner > div, .sobre-inner > div');
  var observaReveal = new IntersectionObserver(function (entradas, obs) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      obs.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  alvos.forEach(function (el) {
    el.classList.add('reveal');
    observaReveal.observe(el);
  });
});
