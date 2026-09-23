(function () {
  'use strict';

  document.body.classList.add('js-nav-enabled');

  var nav = document.querySelector('.nav-container');
  var links = nav ? nav.querySelector('.nav-links') : null;
  if (!nav || !links) return;

  // スマホ幅だけ。PC側までJSで面倒を見始めると後で直しにくいのでここまで。
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mobile-nav-button';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'MENU';
  nav.insertBefore(btn, links);

  btn.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'CLOSE' : 'MENU';
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 600 && links.classList.contains('is-open')) {
      links.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'MENU';
    }
  });
})();

(function () {
  'use strict';

  if (!document.body.classList.contains('story-page') || !document.querySelector('.story-text')) return;

  var cssHref = new URL('../../assets/css/story-reader.css', window.location.href).href;
  if (!document.querySelector('link[data-story-reader-style]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.setAttribute('data-story-reader-style', 'true');
    document.head.appendChild(link);
  }

  var script = document.createElement('script');
  script.src = new URL('../../assets/js/story-reader.js', window.location.href).href;
  script.defer = true;
  document.head.appendChild(script);
})();
