'use strict';

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
  activateTab(tabs.find(tab => tab.getAttribute('aria-selected') === 'true'));
  const select = tab => {
    activateTab(tab, true);
    if (list.classList.contains('month-tabs') && location.hash) {
      history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    }
  };

  for (const tab of tabs) {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      const next = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next]);
    });
  }
}

function revealFragment() {
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;

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
  if (heading || month || details || target.closest('details') || id === 'ab-test') {
    requestAnimationFrame(() => {
      (heading || target).scrollIntoView({ block: 'start' });
      if (heading) heading.focus({ preventScroll: true });
    });
  }
}

addEventListener('hashchange', revealFragment);
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
    image.src = playing ? 'assets/wagmi-4x5.gif' : 'assets/wagmi-still-4x5.png';
    wagmiToggle.textContent = playing ? 'Pause WAGMI GIF' : 'Play WAGMI GIF';
  });
}
