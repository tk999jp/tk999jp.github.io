(function () {
  'use strict';

  var article = document.querySelector('.story-page .story-text');
  if (!article) return;

  var storyChapterLabels = Array.prototype.slice.call(article.querySelectorAll('.story-chapter')).map(function (heading) {
    return heading.textContent.trim();
  });

  var MODE_KEY = 'station.reader.mode';
  var SIZE_KEY = 'station.reader.fontSize';
  var FONT_KEY = 'station.reader.font';
  var LINE_HEIGHT_KEY = 'station.reader.lineHeight';
  var PADDING_KEY = 'station.reader.padding';
  var DEFAULT_SIZE = 17;
  var MIN_SIZE = 14;
  var MAX_SIZE = 24;
  var MIN_LINE_HEIGHT = 1.2;
  var MAX_LINE_HEIGHT = 3;
  var MIN_PADDING = 0;
  var MAX_PADDING = 80;
  var DEFAULT_FONT = 'mincho';
  var FONT_STACKS = {
    mincho: '"Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", serif',
    gothic: '"Yu Gothic", YuGothic, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
    meiryo: 'Meiryo, "メイリオ", sans-serif',
    system: 'system-ui, -apple-system, "Segoe UI", sans-serif'
  };
  var DESKTOP_POINTER_QUERY = '(min-width: 701px) and (pointer: fine)';
  var MOBILE_TOUCH_QUERY = '(max-width: 700px) and (pointer: coarse)';
  var SWIPE_THRESHOLD = 44;
  var SWIPE_LOCK_THRESHOLD = 10;

  function readStorage(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // Storage may be unavailable in privacy modes. Reader remains usable.
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function currentSlug() {
    var name = window.location.pathname.split('/').pop() || '';
    return decodeURIComponent(name).replace(/\.html$/i, '');
  }

  function storyTextUrl() {
    return new URL('../text/' + encodeURIComponent(currentSlug()) + '.txt', window.location.href).href;
  }

  function normalizedTitle(value) {
    return String(value || '')
      .replace(/^\uFEFF/, '')
      .trim()
      .replace(/^#\s*/, '')
      .replace(/^[「『]|[」』]$/g, '')
      .trim();
  }

  function renderText(raw) {
    var text = String(raw || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
    if (!text) return false;

    var title = normalizedTitle(document.querySelector('.story-hero h1') ? document.querySelector('.story-hero h1').textContent : '');
    var lines = text.split('\n');
    if (lines.length) {
      var sourceTitle = normalizedTitle(lines[0].replace(/^【Log:\s*[^】]+】\s*/, ''));
      if (sourceTitle === title) {
        lines.shift();
        while (lines.length && !lines[0].trim()) lines.shift();
      }
    }

    var blocks = lines.join('\n').split(/\n\s*\n+/);
    var fragment = document.createDocumentFragment();

    blocks.forEach(function (block) {
      var cleaned = block.replace(/[ \t]+$/gm, '').trim();
      if (!cleaned) return;

      if (cleaned === '☆') {
        var separator = document.createElement('div');
        separator.className = 'story-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '☆';
        fragment.appendChild(separator);
        return;
      }

      if (cleaned.indexOf('\n') === -1 && storyChapterLabels.indexOf(cleaned) !== -1) {
        var chapter = document.createElement('h2');
        chapter.className = 'story-chapter';
        chapter.textContent = cleaned;
        fragment.appendChild(chapter);
        return;
      }

      var paragraph = document.createElement('p');
      cleaned.split('\n').forEach(function (line, index) {
        if (index) paragraph.appendChild(document.createElement('br'));
        paragraph.appendChild(document.createTextNode(line));
      });
      fragment.appendChild(paragraph);
    });

    article.replaceChildren(fragment);
    return true;
  }

  var toolbar = document.createElement('div');
  toolbar.className = 'story-reader-toolbar';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', '読書設定');
  toolbar.innerHTML =
    '<div class="story-reader-toolbar-group">' +
      '<span class="story-reader-toolbar-label">表示</span>' +
      '<button type="button" class="story-reader-button" data-reader-mode="horizontal">横書き</button>' +
      '<button type="button" class="story-reader-button" data-reader-mode="vertical">縦書き</button>' +
    '</div>' +
    '<div class="story-reader-toolbar-group">' +
      '<span class="story-reader-toolbar-label">書体</span>' +
      '<select class="story-reader-select" data-reader-font aria-label="書体">' +
        '<option value="mincho">明朝</option>' +
        '<option value="gothic">ゴシック</option>' +
        '<option value="meiryo">メイリオ</option>' +
        '<option value="system">システム</option>' +
      '</select>' +
    '</div>' +
    '<div class="story-reader-toolbar-group">' +
      '<span class="story-reader-toolbar-label">文字</span>' +
      '<button type="button" class="story-reader-button" data-reader-size="down" aria-label="文字を小さくする">A−</button>' +
      '<input type="number" class="story-reader-number story-reader-size-input" data-reader-size-value min="14" max="24" step="1" inputmode="numeric" aria-label="文字サイズ">' +
      '<span class="story-reader-unit">px</span>' +
      '<button type="button" class="story-reader-button" data-reader-size="up" aria-label="文字を大きくする">A＋</button>' +
    '</div>' +
    '<div class="story-reader-toolbar-group">' +
      '<span class="story-reader-toolbar-label">行間</span>' +
      '<input type="number" class="story-reader-number" data-reader-line-height min="1.2" max="3" step="0.1" inputmode="decimal" aria-label="行間">' +
    '</div>' +
    '<div class="story-reader-toolbar-group">' +
      '<span class="story-reader-toolbar-label">余白</span>' +
      '<input type="number" class="story-reader-number" data-reader-padding min="0" max="80" step="1" inputmode="numeric" aria-label="本文余白">' +
      '<span class="story-reader-unit">px</span>' +
    '</div>' +
    '<span class="story-reader-source" aria-live="polite">HTML FALLBACK</span>';

  article.parentNode.insertBefore(toolbar, article);
  article.classList.add('story-reader-content');

  var modeButtons = Array.prototype.slice.call(toolbar.querySelectorAll('[data-reader-mode]'));
  var fontSelect = toolbar.querySelector('[data-reader-font]');
  var sizeInput = toolbar.querySelector('[data-reader-size-value]');
  var lineHeightInput = toolbar.querySelector('[data-reader-line-height]');
  var paddingInput = toolbar.querySelector('[data-reader-padding]');
  var sourceValue = toolbar.querySelector('.story-reader-source');

  var mode = readStorage(MODE_KEY, 'horizontal') === 'vertical' ? 'vertical' : 'horizontal';
  var storedSize = parseInt(readStorage(SIZE_KEY, String(DEFAULT_SIZE)), 10);
  var fontSize = clamp(isNaN(storedSize) ? DEFAULT_SIZE : storedSize, MIN_SIZE, MAX_SIZE);

  var storedFont = readStorage(FONT_KEY, DEFAULT_FONT);
  var fontId = Object.prototype.hasOwnProperty.call(FONT_STACKS, storedFont) ? storedFont : DEFAULT_FONT;

  var storedLineHeight = parseFloat(readStorage(LINE_HEIGHT_KEY, ''));
  var lineHeightCustom = !isNaN(storedLineHeight);
  var lineHeight = lineHeightCustom ? clamp(storedLineHeight, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT) : null;

  var storedPadding = parseFloat(readStorage(PADDING_KEY, ''));
  var paddingCustom = !isNaN(storedPadding);
  var padding = paddingCustom ? clamp(storedPadding, MIN_PADDING, MAX_PADDING) : null;

  function computedLineHeight() {
    var style = window.getComputedStyle(article);
    var lineHeightPx = parseFloat(style.lineHeight);
    var fontSizePx = parseFloat(style.fontSize);
    if (!isNaN(lineHeightPx) && !isNaN(fontSizePx) && fontSizePx > 0) {
      return clamp(lineHeightPx / fontSizePx, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT);
    }
    return 2;
  }

  function computedPadding() {
    var value = parseFloat(window.getComputedStyle(article).paddingTop);
    return isNaN(value) ? 0 : clamp(value, MIN_PADDING, MAX_PADDING);
  }

  function refreshDerivedControls() {
    if (!lineHeightCustom) lineHeightInput.value = computedLineHeight().toFixed(1);
    if (!paddingCustom) paddingInput.value = String(Math.round(computedPadding()));
  }

  function applyMode(nextMode) {
    mode = nextMode === 'vertical' ? 'vertical' : 'horizontal';
    article.classList.toggle('reader-vertical', mode === 'vertical');
    article.classList.toggle('reader-horizontal', mode !== 'vertical');
    modeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-reader-mode') === mode ? 'true' : 'false');
    });
    writeStorage(MODE_KEY, mode);
    refreshDerivedControls();
  }

  function applyFont(nextFont) {
    fontId = Object.prototype.hasOwnProperty.call(FONT_STACKS, nextFont) ? nextFont : DEFAULT_FONT;
    article.style.fontFamily = FONT_STACKS[fontId];
    fontSelect.value = fontId;
    writeStorage(FONT_KEY, fontId);
  }

  function applySize(nextSize) {
    var parsed = parseFloat(nextSize);
    if (isNaN(parsed)) parsed = fontSize;
    fontSize = Math.round(clamp(parsed, MIN_SIZE, MAX_SIZE));
    article.style.setProperty('--story-reader-font-size', fontSize + 'px');
    sizeInput.value = String(fontSize);
    writeStorage(SIZE_KEY, String(fontSize));
    refreshDerivedControls();
  }

  function applyLineHeight(nextLineHeight) {
    var parsed = parseFloat(nextLineHeight);
    if (isNaN(parsed)) parsed = lineHeightCustom ? lineHeight : computedLineHeight();
    lineHeight = Math.round(clamp(parsed, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT) * 10) / 10;
    lineHeightCustom = true;
    article.style.lineHeight = String(lineHeight);
    lineHeightInput.value = lineHeight.toFixed(1);
    writeStorage(LINE_HEIGHT_KEY, String(lineHeight));
  }

  function applyPadding(nextPadding) {
    var parsed = parseFloat(nextPadding);
    if (isNaN(parsed)) parsed = paddingCustom ? padding : computedPadding();
    padding = Math.round(clamp(parsed, MIN_PADDING, MAX_PADDING));
    paddingCustom = true;
    article.style.padding = padding + 'px';
    paddingInput.value = String(padding);
    writeStorage(PADDING_KEY, String(padding));
  }

  function normalizeInputOnEnter(input) {
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') input.blur();
    });
  }

  function wheelDeltaPixels(event) {
    var delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 40;
    if (event.deltaMode === 2) delta *= article.clientWidth;
    return delta;
  }

  function mobileVerticalSwipeEnabled() {
    return mode === 'vertical' && window.matchMedia(MOBILE_TOUCH_QUERY).matches;
  }

  function pageScrollAmount() {
    return Math.max(120, Math.round(article.clientWidth * 0.88));
  }

  function scrollVerticalPage(direction) {
    if (article.scrollWidth <= article.clientWidth + 1) return;
    var delta = direction === 'next' ? -pageScrollAmount() : pageScrollAmount();
    try {
      article.scrollBy({ left: delta, top: 0, behavior: 'smooth' });
    } catch (e) {
      article.scrollLeft += delta;
    }
  }

  modeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyMode(button.getAttribute('data-reader-mode'));
    });
  });

  fontSelect.addEventListener('change', function () {
    applyFont(fontSelect.value);
  });

  toolbar.querySelector('[data-reader-size="down"]').addEventListener('click', function () {
    applySize(fontSize - 1);
  });
  toolbar.querySelector('[data-reader-size="up"]').addEventListener('click', function () {
    applySize(fontSize + 1);
  });
  sizeInput.addEventListener('change', function () {
    applySize(sizeInput.value);
  });
  lineHeightInput.addEventListener('change', function () {
    applyLineHeight(lineHeightInput.value);
  });
  paddingInput.addEventListener('change', function () {
    applyPadding(paddingInput.value);
  });

  normalizeInputOnEnter(sizeInput);
  normalizeInputOnEnter(lineHeightInput);
  normalizeInputOnEnter(paddingInput);

  var swipeActive = false;
  var swipeVertical = false;
  var swipeStartX = 0;
  var swipeStartY = 0;

  function resetSwipe() {
    swipeActive = false;
    swipeVertical = false;
    swipeStartX = 0;
    swipeStartY = 0;
  }

  article.addEventListener('touchstart', function (event) {
    if (!mobileVerticalSwipeEnabled() || event.touches.length !== 1) {
      resetSwipe();
      return;
    }
    swipeActive = true;
    swipeVertical = false;
    swipeStartX = event.touches[0].clientX;
    swipeStartY = event.touches[0].clientY;
  }, { passive: true });

  article.addEventListener('touchmove', function (event) {
    if (!swipeActive || !mobileVerticalSwipeEnabled() || event.touches.length !== 1) return;

    var deltaX = event.touches[0].clientX - swipeStartX;
    var deltaY = event.touches[0].clientY - swipeStartY;

    if (!swipeVertical) {
      if (Math.abs(deltaX) < SWIPE_LOCK_THRESHOLD && Math.abs(deltaY) < SWIPE_LOCK_THRESHOLD) return;
      if (Math.abs(deltaY) <= Math.abs(deltaX)) {
        resetSwipe();
        return;
      }
      swipeVertical = true;
    }

    event.preventDefault();
  }, { passive: false });

  article.addEventListener('touchend', function (event) {
    if (!swipeActive || !swipeVertical || !mobileVerticalSwipeEnabled()) {
      resetSwipe();
      return;
    }

    var touch = event.changedTouches && event.changedTouches[0];
    if (touch) {
      var deltaY = touch.clientY - swipeStartY;
      if (Math.abs(deltaY) >= SWIPE_THRESHOLD) {
        scrollVerticalPage(deltaY > 0 ? 'next' : 'previous');
      }
    }
    resetSwipe();
  }, { passive: true });

  article.addEventListener('touchcancel', resetSwipe, { passive: true });

  article.addEventListener('wheel', function (event) {
    if (mode !== 'vertical' || !window.matchMedia(DESKTOP_POINTER_QUERY).matches) return;
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (article.scrollWidth <= article.clientWidth + 1) return;

    var before = article.scrollLeft;
    article.scrollLeft -= wheelDeltaPixels(event);
    if (article.scrollLeft !== before) event.preventDefault();
  }, { passive: false });

  applyMode(mode);
  applyFont(fontId);
  applySize(fontSize);
  if (lineHeightCustom) {
    article.style.lineHeight = String(lineHeight);
    lineHeightInput.value = lineHeight.toFixed(1);
  }
  if (paddingCustom) {
    article.style.padding = padding + 'px';
    paddingInput.value = String(padding);
  }
  refreshDerivedControls();

  fetch(storyTextUrl(), { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(function (text) {
      if (!renderText(text)) throw new Error('empty text');
      sourceValue.textContent = 'TXT SOURCE';
      article.setAttribute('data-reader-source', 'txt');
    })
    .catch(function () {
      sourceValue.textContent = 'HTML FALLBACK';
      article.setAttribute('data-reader-source', 'html');
    });
})();
