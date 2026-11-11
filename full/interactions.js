'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Fade new content in with a short rise. Skipped when the reader asks for reduced motion.
function revealChange(element) {
  if (!element || reducedMotion.matches) return;
  element.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
    { duration: 220, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
}

// Scroll to changed content only when its top sits off screen or low in the viewport.
function scrollToChange(element) {
  if (!element) return;
  const top = element.getBoundingClientRect().top;
  if (top >= 0 && top <= innerHeight * .7) return;
  element.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function activateTab(tab, focus = false) {
  const tabs = tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]');
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) tab.focus();
}

for (const list of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const initial = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  activateTab(initial);
  if (list.dataset.planTabs === 'lifecycle-steps') {
    const narrowTimeline = matchMedia('(max-width: 47.999rem)');
    const setOrientation = () => list.setAttribute('aria-orientation', narrowTimeline.matches ? 'vertical' : 'horizontal');
    narrowTimeline.addEventListener('change', setOrientation);
    setOrientation();
  }
  if (list.closest('.concept-feed')) {
    const restorePlatform = () => {
      const active = tabs.find(tab => '#' + tab.getAttribute('aria-controls') === location.hash);
      activateTab(active || initial);
    };
    addEventListener('hashchange', restorePlatform);
    restorePlatform();
  }
  const select = tab => {
    const wasSelected = tab.getAttribute('aria-selected') === 'true';
    activateTab(tab, true);
    if (!wasSelected) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      revealChange(panel);
      scrollToChange(panel);
    }
    if (list.closest('.concept-feed')) {
      const hash = '#' + tab.getAttribute('aria-controls');
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
    if (list.classList.contains('month-tabs')) {
      const hash = '#' + tab.getAttribute('aria-controls');
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
  };

  for (const tab of tabs) {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      const key = vertical && event.key === 'ArrowUp' ? 'ArrowLeft'
        : vertical && event.key === 'ArrowDown' ? 'ArrowRight' : event.key;
      const next = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      }[key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next]);
    });
  }
}

const legacyFragments = new Map(
  (document.getElementById('legacy-fragments')?.textContent.trim() || '')
    .split(/\n/).filter(Boolean).map(line => line.trim().split(/\s+/))
);

function revealFragment() {
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const originalId = id;
  id = legacyFragments.get(id) || id;
  if (id.includes('#')) {
    location.replace(id);
    return;
  }
  if (!originalId) {
    const firstMonth = document.getElementById('tab-nov');
    if (firstMonth) activateTab(firstMonth);
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;

  const lifecyclePath = target.closest('.lifecycle-path');
  if (lifecyclePath) activateTab(document.getElementById(lifecyclePath.getAttribute('aria-labelledby')));

  const planPanel = target.closest('.plan-panel');
  if (planPanel) activateTab(document.getElementById(planPanel.getAttribute('aria-labelledby')));

  const month = target.closest('.calendar-month');
  if (month) activateTab(document.getElementById(month.getAttribute('aria-labelledby')));

  const post = target.closest('.agenda-post');
  if (post) post.querySelector('.agenda-detail').open = true;

  let details = target.closest('details');
  while (details) {
    details.open = true;
    details = details.parentElement.closest('details');
  }

  if (id === 'ab-test') target.querySelector('details').open = true;
  const heading = document.getElementById(id + '-heading');
  if (id !== originalId || heading || month || lifecyclePath || planPanel || details || target.matches('.concept-feed [role=tabpanel]') || target.closest('details') || id === 'ab-test') {
    requestAnimationFrame(() => {
      (heading || target).scrollIntoView({ block: 'start' });
      if (heading) heading.focus({ preventScroll: true });
    });
  }
}

addEventListener('hashchange', revealFragment);
document.addEventListener('toggle', event => {
  const details = event.target;
  if (details.tagName !== 'DETAILS' || !details.open) return;
  revealChange(details.querySelector(':scope > :not(summary)'));
  scrollToChange(details);
}, true);
document.addEventListener('click', event => {
  const sameLink = event.target.closest('a[href^="#"]');
  if (sameLink && sameLink.hash === location.hash) revealFragment();
});
revealFragment();

const wagmiToggle = document.getElementById('wagmi-toggle');
if (wagmiToggle) {
  const image = document.getElementById('wagmi-image');
  let playing = false;
  wagmiToggle.hidden = false;
  wagmiToggle.addEventListener('click', () => {
    playing = !playing;
    image.src = playing ? '../assets/wagmi-4x5.gif' : '../assets/wagmi-still-4x5.png';
    revealChange(image);
    wagmiToggle.textContent = playing ? 'Stop WAGMI GIF' : 'Play WAGMI GIF';
  });
}

const countrySelector = document.getElementById('research-country');
if (countrySelector) {
  const countries = [...document.querySelectorAll('tr[id^="market-"]')];
  const restoreCountry = () => {
    const value = location.hash.replace(/^#market-/, '');
    countrySelector.value = countries.some(row => row.id === 'market-' + value) ? value : '';
    for (const row of countries) row.hidden = Boolean(countrySelector.value) && row.id !== 'market-' + countrySelector.value;
  };
  countrySelector.addEventListener('change', () => {
    const hash = countrySelector.value ? '#market-' + countrySelector.value : '#markets';
    history.pushState(null, '', hash);
    restoreCountry();
    const table = countrySelector.closest('.research-filter').nextElementSibling;
    revealChange(table);
    scrollToChange(table);
  });
  addEventListener('hashchange', restoreCountry);
  restoreCountry();
  countrySelector.closest('.research-filter').hidden = false;
}


const mainNav = document.querySelector('.site-head nav');
if (mainNav) {
  const navId = 'site-navigation';
  mainNav.id = navId;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu';
  toggle.textContent = 'Menu';
  toggle.setAttribute('aria-controls', navId);
  toggle.setAttribute('aria-expanded', 'false');
  mainNav.before(toggle);
  mainNav.classList.add('mobile-collapsible');

  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    mainNav.classList.toggle('mobile-open', open);
    if (open) revealChange(mainNav);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') === 'false'));
  mainNav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    if (getComputedStyle(toggle).display !== 'none') toggle.focus();
    setOpen(false);
  });
  mainNav.parentElement.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}
