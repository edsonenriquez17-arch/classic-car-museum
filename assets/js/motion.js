/* ARTECH · MH02: T4 line reveals, with progressive enhancement.
 * Opt in with data-motion="lines" on a plain-text heading.
 * No SplitText, no hidden-content dependency, no global GSAP defaults.
 */
(function () {
  'use strict';

  const selector = '[data-motion="lines"]';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const seen = new WeakMap();
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  let available = false;
  let frame = 0;
  let resizeTimer;
  let rebuild = false;

  try {
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      available = true;
    }
  } catch (_) { /* Native fade remains available if the CDN fails. */ }

  // Same curve as --ease-out: cubic-bezier(.16, 1, .3, 1).
  function easeOut(progress) {
    if (progress <= 0 || progress >= 1) return progress;
    let low = 0, high = 1, t = progress;
    for (let i = 0; i < 16; i++) {
      const x = 3 * .16 * t * (1 - t) ** 2 + 3 * .3 * t ** 2 * (1 - t) + t ** 3;
      if (x < progress) low = t; else high = t;
      t = (low + high) / 2;
    }
    return 1 - (1 - t) ** 3;
  }

  function visible(heading) {
    return heading.isConnected && heading.getClientRects().length > 0
      && !heading.closest('[inert]') && heading.getBoundingClientRect().height > 0;
  }

  function signature(heading, text) {
    return `${document.documentElement.lang}|${text.replace(/\s+/g, ' ')}`;
  }

  // Measure actual wrapped lines, respecting authored newline breaks.
  // Resizing and web-font loading remeasure them without replaying seen text.
  function splitLines(heading, text) {
    heading.textContent = text;
    const node = heading.firstChild;
    const range = document.createRange();
    const lines = [];
    let line = '', top = null, end = 0;
    for (const word of text.matchAll(/\S+/g)) {
      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);
      const nextTop = range.getBoundingClientRect().top;
      const forcedBreak = text.slice(end, word.index).includes('\n');
      if (line && (forcedBreak || Math.abs(nextTop - top) > 2)) {
        lines.push(line);
        line = '';
      }
      line += (line ? ' ' : '') + word[0];
      top = nextTop;
      end = word.index + word[0].length;
    }
    if (line) lines.push(line);
    const fragment = document.createDocumentFragment();
    const targets = lines.map((line, index) => {
      const mask = document.createElement('span');
      const content = document.createElement('span');
      mask.className = 'motion-line';
      mask.setAttribute('aria-hidden', 'true');
      content.className = 'motion-line-text';
      content.textContent = line;
      mask.append(content);
      if (index) fragment.append(document.createTextNode('\n'));
      fragment.append(mask);
      return content;
    });
    heading.replaceChildren(fragment);
    heading.classList.add('motion-lines');
    // Accessible name stays complete; assistive technology does not read lines twice.
    heading.setAttribute('aria-label', text.replace(/\s+/g, ' '));
    return targets;
  }

  function stop(state) {
    state.trigger?.kill();
    state.observer?.disconnect();
    state.tween?.kill();
    state.fade?.cancel();
    if (state.targets?.length) {
      gsap?.set(state.targets, { clearProps: 'transform,opacity,visibility' });
    }
    // A language update may already have replaced our spans. Preserve its new text.
    if (state.heading.querySelector(':scope > .motion-line')) {
      state.heading.textContent = state.text;
    }
    state.heading.classList.remove('motion-lines');
    if (state.label === null) state.heading.removeAttribute('aria-label');
    else state.heading.setAttribute('aria-label', state.label);
  }

  function fade(state) {
    if (seen.get(state.heading) === state.signature) return;
    seen.set(state.heading, state.signature);
    // WAAPI is independent of GSAP and never translates the heading.
    if (typeof state.heading.animate === 'function') {
      state.fade = state.heading.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200, easing: 'linear', fill: 'none'
      });
    }
  }

  function nativeReveal(state) {
    if (!('IntersectionObserver' in window)) { fade(state); return; }
    state.observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      if (visible(state.heading)) {
        fade(state);
        state.observer.disconnect();
      }
    }, { rootMargin: '0px 0px -15% 0px' });
    state.observer.observe(state.heading);
  }

  function prepare(heading) {
    const text = heading.textContent.trim();
    if (!text) return;
    const state = {
      heading, text, signature: signature(heading, text),
      label: heading.getAttribute('aria-label')
    };
    states.set(heading, state);
    const played = seen.get(heading) === state.signature;
    if (preference.matches || !available) {
      if (!played) nativeReveal(state);
      return;
    }
    try {
      state.targets = splitLines(heading, text);
      if (played) return;
      gsap.set(state.targets, { yPercent: 110, opacity: 0 });
      state.trigger = ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        once: true,
        onEnter() {
          if (!visible(heading)) return;
          seen.set(heading, state.signature);
          state.tween = gsap.to(state.targets, {
            yPercent: 0, opacity: 1, duration: .65, stagger: .08,
            ease: easeOut, overwrite: 'auto',
            clearProps: 'transform,opacity,visibility'
          });
        }
      });
    } catch (_) {
      stop(state);
      state.targets = [];
      nativeReveal(state);
    }
  }

  function refresh() {
    frame = 0;
    const force = rebuild;
    rebuild = false;
    for (const [heading, state] of states) {
      const changed = signature(heading, heading.textContent.trim()) !== state.signature;
      // apply(lang) can replace the spans with identical text after catalogue loading.
      const replaced = state.targets?.length && !heading.contains(state.targets[0]);
      if (!visible(heading) || changed || replaced || force) {
        stop(state);
        states.delete(heading);
      }
    }
    document.querySelectorAll(selector).forEach(heading => {
      if (visible(heading) && !states.has(heading)) prepare(heading);
    });
    if (available && !preference.matches) ScrollTrigger.refresh();
  }

  function schedule(force = false) {
    rebuild = rebuild || force;
    if (!frame) frame = requestAnimationFrame(refresh);
  }

  // Reusable entry point for the later page and transition patches.
  window.ArtechMotion = Object.freeze({
    refresh: () => schedule(true),
    get reduced() { return preference.matches; },
    get available() { return available; }
  });
  addEventListener('artech:route', () => schedule());
  addEventListener('artech:lang', () => schedule());
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => schedule(true), 150);
  });
  preference.addEventListener('change', () => {
    // Settle in-flight movement immediately when the preference changes.
    for (const state of states.values()) stop(state);
    states.clear();
    schedule();
  });
  const intro = document.getElementById('preloader');
  if (intro && 'MutationObserver' in window) {
    new MutationObserver(() => schedule()).observe(intro, {
      attributes: true, attributeFilter: ['hidden']
    });
  }
  document.fonts?.ready.then(() => schedule(true));
  schedule();
})();
