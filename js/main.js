(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var static_ = /[?&]noanim/.test(location.search); // used only for full-page screenshots
  var $ = function (s) { return document.querySelector(s); };

  /* Scroll reveal */
  if (!static_ && 'IntersectionObserver' in window) {
    doc.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* Nav: solid after scroll, mobile menu */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > 40);
    if (!reduce) {
      var bg = $('#heroBg'), y = window.scrollY;
      if (y < 1200) bg.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0) scale(1.06)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function closeMenu() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('#navLinks a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* Toast for mock-only actions */
  var toast = $('#toast'), tt;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 3200);
  }
  document.querySelectorAll('[data-mock]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); say('This is a design mock — this page does not exist.'); });
  });

  /* Booking bar (no real booking) */
  var ci = $('#checkin'), co = $('#checkout'), bm = $('#bookingMsg');
  function iso(d) { var o = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return o.toISOString().slice(0, 10); }
  var today = new Date(), in1 = new Date(today.getTime() + 864e5 * 14), in2 = new Date(today.getTime() + 864e5 * 17);
  ci.min = iso(today); ci.value = iso(in1);
  co.min = iso(new Date(in1.getTime() + 864e5)); co.value = iso(in2);
  ci.addEventListener('change', function () {
    if (!ci.value) return;
    var next = new Date(new Date(ci.value).getTime() + 864e5);
    co.min = iso(next);
    if (!co.value || co.value <= ci.value) co.value = iso(next);
  });
  $('#booking').addEventListener('submit', function (e) {
    e.preventDefault();
    var nights = Math.round((new Date(co.value) - new Date(ci.value)) / 864e5);
    if (!ci.value || !co.value || nights < 1) { bm.textContent = 'Please choose a check-out date after your check-in.'; }
    else { bm.textContent = 'Design mock: ' + nights + ' night' + (nights > 1 ? 's' : '') + ', ' + $('#guests').value + '. No real booking is made.'; }
    bm.classList.add('is-on');
  });

  /* Review slider */
  var track = $('#sliderTrack'), dots = $('#dots'), cards = track.children;
  function perView() { return Math.round(track.clientWidth / cards[0].getBoundingClientRect().width) || 1; }
  function stepW() { return cards[0].getBoundingClientRect().width + 28; }
  function pages() { return Math.max(1, cards.length - perView() + 1); }
  function buildDots() {
    dots.innerHTML = '';
    for (var i = 0; i < pages(); i++) dots.appendChild(document.createElement('i'));
    mark();
  }
  function mark() {
    var idx = Math.round(track.scrollLeft / stepW());
    Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle('is-on', i === idx); });
  }
  $('#nextBtn').addEventListener('click', function () {
    var end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: end ? 0 : track.scrollLeft + stepW(), behavior: 'smooth' });
  });
  $('#prevBtn').addEventListener('click', function () {
    var start = track.scrollLeft <= 4;
    track.scrollTo({ left: start ? track.scrollWidth : track.scrollLeft - stepW(), behavior: 'smooth' });
  });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();

  /* Newsletter (no real signup) */
  $('#newsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#email').value.trim(), m = $('#newsMsg');
    m.textContent = /^\S+@\S+\.\S+$/.test(v) ? 'Thank you. This is a design mock, so nothing was subscribed.' : 'Please enter a valid email address.';
    m.classList.add('is-on');
  });
})();
