/* ============================================================
   White Pearl Clinics — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled border + mobile menu ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('nav--scrolled', window.scrollY > 8);
  }, { passive: true });

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav__links--left a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Animated stat counters ---------- */
  var counted = false;
  var statsEl = document.querySelector('.stats');
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.stat__num').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      var dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(eased * target);
        el.textContent = val.toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-US') + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  if (statsEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); obs.disconnect(); } });
    }, { threshold: 0.4 }).observe(statsEl);
  } else {
    runCounters();
  }

  /* ---------- Before / After sliders ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var beforeWrap = ba.querySelector('.ba__before-wrap');
    var handle = ba.querySelector('.ba__handle');
    function update(v) {
      beforeWrap.style.width = v + '%';
      handle.style.left = v + '%';
    }
    range.addEventListener('input', function () { update(range.value); });
    update(range.value);
  });

  /* ---------- Reviews carousel ---------- */
  var reviews = [
    { quote: 'Prof. Nassif completely transformed my smile. The care and precision were beyond anything I expected.', name: 'Rania K.', meta: 'Jounieh · Veneers' },
    { quote: 'Three generations of my family trust this clinic. Professional, warm, and always honest about treatment.', name: 'Georges A.', meta: 'Akkar · Family patient' },
    { quote: 'I was terrified of the dentist for years. Here I finally felt safe — and my teeth have never looked better.', name: 'Maya H.', meta: 'Jounieh · Whitening' },
    { quote: 'World-class expertise right here in Lebanon. The free screening call made it so easy to get started.', name: 'Tony S.', meta: 'Akkar · Implants' },
    { quote: 'Twenty-five years of experience truly shows. Every detail of my treatment was thoughtful and gentle.', name: 'Lara M.', meta: 'Jounieh · Restoration' }
  ];

  var track = document.querySelector('[data-track]');
  var dotsWrap = document.querySelector('[data-dots]');
  var carousel = document.querySelector('[data-carousel]');

  if (track) {
    reviews.forEach(function (r, i) {
      var slide = document.createElement('div');
      slide.className = 'review' + (i === 0 ? ' is-active' : '');
      slide.innerHTML =
        '<div class="review__card">' +
          '<div class="review__stars">★★★★★</div>' +
          '<p class="review__quote">“' + r.quote + '”</p>' +
          '<p class="review__name">' + r.name + '</p>' +
          '<p class="review__meta">' + r.meta + '</p>' +
        '</div>';
      track.appendChild(slide);

      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(dot);
    });

    var slides = track.querySelectorAll('.review');
    var dots = dotsWrap.querySelectorAll('button');
    var current = 0;
    var timer;

    function render() {
      track.style.transform = 'translateX(' + (-current * 100) + '%)';
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function go(i) {
      current = (i + slides.length) % slides.length;
      render();
      restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 6000);
    }

    document.querySelector('[data-prev]').addEventListener('click', function () { go(current - 1); });
    document.querySelector('[data-next]').addEventListener('click', function () { go(current + 1); });

    // pause on hover
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);

    render();
    restart();
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('screeningForm');
  if (form) {
    var note = form.querySelector('[data-form-note]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var location = data.get('location');
      var firstName = (data.get('firstName') || '').trim();
      var lastName = (data.get('lastName') || '').trim();
      var phone = (data.get('phone') || '').trim();

      // reset state
      note.hidden = true;
      note.className = 'form__note';
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

      var errors = [];
      if (!location) { errors.push('location'); form.querySelectorAll('.loc-choice').forEach(function (l) { l.classList.add('is-invalid'); }); }
      if (!firstName) { errors.push('first name'); form.querySelector('[name="firstName"]').classList.add('is-invalid'); }
      if (!lastName) { errors.push('last name'); form.querySelector('[name="lastName"]').classList.add('is-invalid'); }
      var phoneOk = /^[0-9+\s()\-]{6,}$/.test(phone);
      if (!phoneOk) { errors.push('a valid phone number'); form.querySelector('[name="phone"]').classList.add('is-invalid'); }

      if (errors.length) {
        note.hidden = false;
        note.classList.add('form__note--err');
        note.textContent = 'Please add ' + errors.join(', ') + '.';
        return;
      }

      note.hidden = false;
      note.classList.add('form__note--ok');
      note.textContent = 'Thank you, ' + firstName + '. Our ' + location + ' team will call you shortly to schedule your free screening.';
      form.reset();
    });
  }
})();
