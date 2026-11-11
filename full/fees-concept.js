'use strict';

// "Before you hit Buy": the fees concept's five platform previews and AI before/after demo in Content Studio.
(() => {
  const view = document.getElementById('fees-concept');
  if (!view) return;
  const stage = view.querySelector('[data-bh-stage]');
  const outputs = document.getElementById('fees-ai-outputs');
  const walkthrough = 'content-calendar.html#ex-walkthrough';
  const cta = 'See the first-buy walkthrough';
  const feesCta = { href: walkthrough, text: cta };
  // Stands in for an approved Invity custody page until product confirms one.
  const custodyCta = { href: 'content-calendar.html#ex-withdraw', text: 'See what to check before you withdraw' };
  const custodyHook = 'Where does your bitcoin go after you buy?';

  // Campaign artwork uses 4:5 master cards and 9:16 Reel crops.
  const art = {
    cover: '../assets/fees-campaign/cover.webp',
    pay: '../assets/fees-campaign/pay.webp',
    receive: '../assets/fees-campaign/receive.webp',
    both: '../assets/fees-campaign/both.webp',
    reelHook: '../assets/fees-campaign/reel-cover.webp',
    reelPay: '../assets/fees-campaign/reel-pay.webp',
    reelReceive: '../assets/fees-campaign/reel-receive.webp',
    reelBoth: '../assets/fees-campaign/reel-both.webp',
    custody: '../assets/custody-creative.webp',
    withdraw: '../assets/withdraw-creative.webp'
  };

  const hooks = {
    original: { cover: 'Before you hit Buy, read this screen.', x: 'Before you hit Buy on a first bitcoin purchase, read the quote screen.' },
    alternate: { cover: 'What will your first Bitcoin purchase cost?', x: 'What will your first Bitcoin purchase cost? Read the quote screen before you hit Buy.' }
  };
  let hook = 'original';

  const xTip = () => hooks[hook].x + '\n\nCheck two numbers before you confirm:\n1. What you’ll pay\n2. How much bitcoin you’ll receive\n\nIf either one surprises you, stop there. Bitcoin can lose value.';

  // The four master cards; platform versions reuse them with their own copy where the format needs it.
  const master = () => [
    { art: 'cover', chip: '1 / 4', title: hooks[hook].cover, body: 'Two numbers to check on a first purchase.' },
    { art: 'pay', chip: '2 / 4', title: 'What will you pay?', body: 'Find the total in your currency before you confirm.', focus: 'pay' },
    { art: 'receive', chip: '3 / 4', title: 'How much bitcoin will you receive?', body: 'Find the BTC amount this quote gives you.', focus: 'receive' },
    { art: 'both', chip: '4 / 4', title: 'Check both before you confirm.', body: 'If either number surprises you, stop there. Bitcoin can lose value.', focus: 'pay receive', cta: true }
  ];
  const facebook = [
    { art: 'both', chip: '1 / 4', title: 'Two checks before you hit Buy.', body: 'What you’ll pay. How much bitcoin you’ll receive.', focus: 'pay receive', foot: 'Check both before you confirm' },
    { art: 'pay', chip: '2 / 4', title: 'What will you pay?', body: 'Buying bitcoin for the first time? The quote shows the total in your currency.', focus: 'pay', foot: 'Read the total before you confirm' },
    { art: 'receive', chip: '3 / 4', title: 'How much bitcoin will you receive?', body: 'The same quote shows the BTC this purchase gets you.', focus: 'receive', foot: 'Read the BTC amount before you confirm' },
    { art: 'cover', chip: '4 / 4', title: 'See every screen of a first purchase.', body: 'Bitcoin can lose value.', cta: true, foot: 'The first-buy walkthrough' }
  ];
  const linkedin = [
    { art: 'cover', chip: 'Page 1 / 4', title: 'What should a first-time buyer see before confirming?', body: 'Two numbers. One screen. Before the button.' },
    { art: 'pay', light: true, chip: 'Page 2 / 4', title: 'What they will pay.', body: 'The total, in their own currency, before they tap Confirm.', focus: 'pay' },
    { art: 'receive', light: true, chip: 'Page 3 / 4', title: 'How much bitcoin they will receive.', body: 'The BTC amount this quote gives them, on the same screen.', focus: 'receive' },
    { art: 'both', light: true, chip: 'Page 4 / 4 · Product-design takeaway', title: 'Make the purchase decision clear.', body: 'Show what someone pays and what they receive side by side, before Confirm. If a first-time buyer has to hunt for either number, the screen isn’t finished.', cta: true }
  ];
  const reel = () => [
    { art: 'reelHook', chip: 'Independent concept', title: hooks[hook].cover, body: 'First bitcoin purchase? Pause here.' },
    { art: 'reelPay', chip: 'Check 1', title: 'What will you pay?', body: 'The total, in your currency.', focus: 'pay' },
    { art: 'reelReceive', chip: 'Check 2', title: 'How much bitcoin will you receive?', body: 'The BTC this quote gives you.', focus: 'receive' },
    { art: 'reelBoth', chip: 'Independent concept', title: 'Check both before you confirm.', body: 'Bitcoin can lose value.', focus: 'pay receive', cta: true }
  ];
  const short = [
    { art: 'reelHook', chip: 'YouTube Short', title: 'Check these two numbers.', cc: 'Buying Bitcoin for the first time? Check these two numbers.' },
    { art: 'reelPay', chip: 'Number 1', title: 'The amount you pay', focus: 'pay', cc: 'First, the amount you pay, in your currency.' },
    { art: 'reelReceive', chip: 'Number 2', title: 'The BTC you receive', focus: 'receive', cc: 'Then the BTC you receive for that amount.' },
    { art: 'reelBoth', chip: 'Before you confirm', title: 'Check both before confirming.', focus: 'pay receive', cc: 'Check both before you confirm. Bitcoin can lose value.', cta: true }
  ];
  const shortTitle = 'Two numbers to check before your first Bitcoin buy';
  const custodyReel = [
    { art: 'custody', custody: true, chip: 'Custody follow-up', title: custodyHook, body: 'Two questions to answer before a first purchase.' },
    { art: 'custody', custody: true, chip: 'Question 1', title: 'Who holds it?', body: 'Check whether it stays with the app or goes to a wallet you control.' },
    { art: 'withdraw', custody: true, chip: 'Question 2 · Pending product review', title: 'Can you move it out?', body: 'Invity’s public pages say you can withdraw to a Bitcoin address you control. Check the limits and fees first.' },
    { art: 'withdraw', custody: true, chip: 'Before you buy', title: 'Know where it goes.', body: 'Bitcoin can lose value.', cta: custodyCta }
  ];
  const custodyAudience = '<p class="bh-setnote"><b>Custody follow-up</b> For eligible people who viewed the first-buy guide. Exclude known first buyers where the purchase event supports it. Same hook and destination in all three.</p>';

  const quote = focus => '<div class="bh-quote" role="img" aria-label="Schematic quote screen with two fields, You pay and You receive in BTC, and no figures"' + (focus ? ' data-focus="' + focus + '"' : '') + '>' +
    '<span class="bh-q-title">Quote</span>' +
    '<span class="bh-field" data-field="pay"><span>You pay</span><i></i></span>' +
    '<span class="bh-field" data-field="receive"><span>You receive · BTC</span><i></i></span>' +
    '<span class="bh-q-confirm">Confirm</span><span class="bh-note">Schematic · no real figures</span></div>';

  // The hook stays editable across platform previews.
  function card(c, shape = '', live = true) {
    const a = art[c.art];
    const style = a ? ' style="--art:url(' + a + ')"' : '';
    const link = c.cta === true ? feesCta : c.cta;
    const action = link ? (live ? '<a class="bh-cta" href="' + link.href + '">' + link.text + '</a>' : '<span class="bh-cta">' + link.text + '</span>') : '';
    return '<div class="bh-card' + (shape ? ' bh-' + shape : '') + (c.light ? ' bh-light' : '') + (c.custody ? ' bh-custody' : '') + (c.focus ? ' bh-has-quote' : '') + '"' + style + '>' +
      (a ? '<span class="bh-art" aria-hidden="true"></span>' : '') +
      '<div class="bh-in"><span class="bh-chip">' + c.chip + (/Independent|Nezávislý/.test(c.chip) ? '' : ' · Independent concept') + '</span>' +
      '<p class="bh-h">' + c.title + '</p>' + (c.body ? '<p class="bh-body">' + c.body + '</p>' : '') +
      (c.list ? '<ol class="bh-faq">' + c.list.map(item => '<li>' + item + '</li>').join('') + '</ol>' : '') +
      (c.focus ? quote(c.focus) : '') + (c.cc ? '<p class="bh-cc">' + c.cc + '</p>' : '') + action + '</div></div>';
  }

  const head = (name, meta, square = false) => '<div class="bh-head"><span class="bh-avatar' + (square ? ' bh-square-avatar' : '') + '" aria-hidden="true">PF</span><div><b>' + name + '</b><small>' + meta + '</small></div></div>';
  const controls = label => '<div class="iv-nav bh-controls"><button type="button" class="cursor-interaction" data-bh-move="-1" aria-label="Previous ' + label + '"><span aria-hidden="true">‹</span> Previous</button><span data-bh-count aria-live="polite" aria-atomic="true"></span><button type="button" class="cursor-interaction" data-bh-move="1" aria-label="Next ' + label + '">Next <span aria-hidden="true">›</span></button></div>';
  const clock = ms => '0:' + String(Math.floor(ms / 1000)).padStart(2, '0');
  // A captioned vertical video: scenes play on a clock, with static keyframes for reduced motion.
  const video = ({ label, scenes, sceneMs, top = '', bottom = '', poster }) => {
    const length = scenes.length * sceneMs;
    const seconds = length / 1000;
    return top + '<div class="bh-screen" data-scene-ms="' + sceneMs + '" data-label="' + label + '">' +
      (poster ? '<div class="bh-poster">' + card(poster, 'tall', false) + '</div>' : '') +
      scenes.map((c, i) => '<div class="bh-scene' + (i ? '' : ' is-on') + '"' + (i ? ' inert' : '') + '>' + card(c, 'tall', i === scenes.length - 1) + '</div>').join('') +
      '<span class="bh-badge" aria-hidden="true">▶ ' + clock(length) + ' · captions on screen</span></div>' +
      '<div class="iv-nav bh-player"><button type="button" class="cursor-interaction" data-bh-play aria-label="Play the ' + label + '">▶ Play</button>' +
      '<span class="bh-progress" role="progressbar" aria-label="' + label + ' progress" aria-valuemin="0" aria-valuemax="' + seconds + '" aria-valuenow="0" aria-valuetext="0 of ' + seconds + ' seconds"><i></i></span>' +
      '<span data-bh-time>0:00 / ' + clock(length) + '</span></div>' +
      '<p class="visually-hidden" data-bh-live aria-live="polite"></p>' + bottom +
      '<div class="iv-nav"><button type="button" class="cursor-interaction" data-bh-frames aria-expanded="false" aria-controls="bh-frames">Show the frames</button><span>Static keyframes</span></div>' +
      '<div class="bh-frames" id="bh-frames" hidden>' + (poster ? '<figure><figcaption>Poster</figcaption>' + card(poster, 'tall', false) + '</figure>' : '') +
      scenes.map((c, i) => '<figure><figcaption>' + (i * sceneMs / 1000).toFixed(2).replace(/\.?0+$/, '') + ' s</figcaption>' + card(c, 'tall', false) + '</figure>').join('') + '</div>';
  };
  const slider = (slides, label, unit) => '<div class="bh-viewport" role="region" aria-roledescription="carousel" aria-label="' + label + '" tabindex="0">' +
    slides.map((html, i) => '<div class="bh-slide" role="group" aria-roledescription="' + unit + '" aria-label="' + (i + 1) + ' of ' + slides.length + '">' + html + '</div>').join('') + '</div>' + controls(unit);

  const formats = {
    post: () => '<article class="bh-frame bh-ig" aria-label="Instagram carousel ad preview">' + head('The Patient Funnel', 'Sponsored · Independent concept') +
      slider(master().map(c => card(c)), 'Instagram carousel ad, four cards', 'card') +
      '<a class="bh-ctabar" href="' + walkthrough + '">' + cta + ' <span aria-hidden="true">›</span></a>' +
      '<p class="bh-text"><b>The Patient Funnel</b> Your first bitcoin purchase has one screen worth slowing down for. Swipe for the two numbers to check before you confirm. Bitcoin can lose value.</p></article>',
    ig: () => '<article class="bh-frame bh-reelframe" aria-label="Instagram Reel preview">' + video({
      label: 'Reel', scenes: reel(), sceneMs: 3500,
      top: head('The Patient Funnel', 'Reel · Sponsored · Independent concept'),
      bottom: '<a class="bh-ctabar" href="' + walkthrough + '">' + cta + ' <span aria-hidden="true">›</span></a>' +
        '<p class="bh-text"><b>The Patient Funnel</b> Two numbers to check before you confirm a first bitcoin purchase. Every line is on screen, so it works with the sound off. Bitcoin can lose value.</p>'
    }) + '</article>',
    yt: () => '<article class="bh-frame bh-reelframe bh-short" aria-label="YouTube Short preview">' + video({
      label: 'Short', scenes: short, sceneMs: 3250,
      poster: { art: 'reelHook', chip: 'YouTube Short · 0:13', title: shortTitle },
      bottom: '<p class="bh-yt-title">' + shortTitle + '</p>' + head('The Patient Funnel', 'Short · Independent concept') +
        '<a class="bh-ctabar" href="' + walkthrough + '">' + cta + ' <span aria-hidden="true">›</span></a>' +
        '<p class="bh-text">Before you confirm a first bitcoin purchase, check the amount you pay and the BTC you receive. The quote screen here is a schematic with no real figures. Captions are burned in, so it works with the sound off. Bitcoin can lose value.</p>'
    }) + '</article>',
    cs: () => '<article class="bh-frame bh-ig" aria-label="Czech Instagram carousel cover, draft">' +
      '<p class="bh-draft">Czech draft, pending local review</p>' +
      '<div lang="cs">' + head('The Patient Funnel', 'Sponzorováno · Nezávislý koncept') +
      card({ art: 'cover', chip: 'Nezávislý koncept', title: 'Než nakoupíte bitcoin, zkontrolujte tyto dvě částky.' }) +
      '<a class="bh-ctabar" href="' + walkthrough + '">Projděte si první nákup krok za krokem <span aria-hidden="true">›</span></a>' +
      '<p class="bh-text"><b>The Patient Funnel</b> Váš první nákup bitcoinu má jednu obrazovku, u které se vyplatí zpomalit. Než nákup potvrdíte, zkontrolujte, kolik zaplatíte a kolik bitcoinu dostanete. Hodnota bitcoinu může klesnout.</p></div>' +
      '<p class="bh-review">Cover and caption only; the other three cards are not translated. A native Czech reviewer confirms the product terms and the CTA before use. The walkthrough it links to is in English.</p></article>',
    'custody-ig': () => '<article class="bh-frame bh-reelframe" aria-label="Instagram custody Reel preview">' + custodyAudience + video({
      label: 'Reel', scenes: custodyReel, sceneMs: 3000,
      top: head('The Patient Funnel', 'Reel · Sponsored · Independent concept'),
      bottom: '<a class="bh-ctabar" href="' + custodyCta.href + '">' + custodyCta.text + ' <span aria-hidden="true">›</span></a>' +
        '<p class="bh-text"><b>The Patient Funnel</b> ' + custodyHook + ' Two questions to answer before a first purchase. Bitcoin can lose value.</p>' +
        '<p class="bh-review">Pending product review: the withdrawal line on frame 3 and the destination page.</p>'
    }) + '</article>',
    'custody-fb': () => '<article class="bh-frame bh-fb" aria-label="Facebook static FAQ ad preview">' + custodyAudience + head('The Patient Funnel', 'Sponsored · Independent concept') +
      '<p class="bh-text">Getting ready for a first bitcoin purchase? Three questions to answer first.\n\n<b>Who holds it?</b> Check whether your bitcoin stays with the app or goes to a wallet you control.\n<b>Can I move it?</b> Invity’s public pages say you can withdraw to a hardware wallet or any Bitcoin address you control. Check the current limits and fees first.\n<b>What do I check before moving it?</b> The address, twice. If it is a new wallet, send a small test first.\n\nBitcoin can lose value.</p>' +
      '<div class="bh-static">' + card({ art: 'custody', custody: true, chip: 'FAQ', title: custodyHook, list: ['Who holds it?', 'Can I move it?', 'What do I check first?'] }) +
      '<div class="bh-fb-foot"><b>Three questions before you buy</b><a href="' + custodyCta.href + '">' + custodyCta.text + '</a></div></div>' +
      '<p class="bh-review">Pending product review: the withdrawal answer and the destination page.</p></article>',
    'custody-email': () => '<article class="bh-frame bh-email" aria-label="Follow-up email mockup">' + custodyAudience +
      '<dl class="bh-mail-head"><dt>From</dt><dd>The Patient Funnel</dd><dt>To</dt><dd>Eligible subscribers who viewed the first-buy guide</dd><dt>Subject</dt><dd>' + custodyHook + '</dd><dt>Preview</dt><dd>One question to answer before a first purchase.</dd></dl>' +
      '<div class="bh-mail-body"><img src="' + art.custody + '" width="1080" height="1350" alt="Who holds your bitcoin? Custody and wallet control, explained. A bitcoin sits in a glass vault beside a hardware wallet.">' +
      '<p class="bh-mail-h">' + custodyHook + '</p>' +
      '<p>If you are getting ready for a first purchase, one more question is worth answering: where the bitcoin sits afterwards.</p>' +
      '<ul><li><b>Who holds it.</b> Check whether it stays with the app or goes to a wallet you control.</li>' +
      '<li><b>Whether you can move it.</b> Invity’s public pages say you can withdraw to a hardware wallet or any Bitcoin address you control. <span class="bh-pending">Pending product review</span></li>' +
      '<li><b>What to check first.</b> The address, twice, the fee and any limits.</li></ul>' +
      '<a class="bh-mail-cta" href="' + custodyCta.href + '">' + custodyCta.text + '</a>' +
      '<p class="bh-mail-foot">Bitcoin can lose value. You get this email because you subscribed to updates. Unsubscribe · Email preferences</p></div>' +
      '<p class="bh-review">Mockup, not sent. Pending product review: the withdrawal line and the destination page.</p></article>',
    fb: () => '<article class="bh-frame bh-fb" aria-label="Facebook carousel ad preview">' + head('The Patient Funnel', 'Sponsored · Independent concept') +
      '<p class="bh-text">First bitcoin purchase coming up? Two numbers to check on the quote screen: what you’ll pay and how much bitcoin you’ll receive. Bitcoin can lose value.</p>' +
      slider(facebook.map(c => card(c, 'square') + '<div class="bh-fb-foot"><b>' + c.foot + '</b><a href="' + walkthrough + '">' + cta + '</a></div>'), 'Facebook carousel ad, four cards', 'card') + '</article>',
    li: () => '<article class="bh-frame bh-li" aria-label="LinkedIn document post preview">' + head('The Patient Funnel', 'Independent concept · Document post', true) +
      '<p class="bh-text">What should a first-time buyer see before confirming a purchase? Four pages on two numbers, one screen, and why a clear decision beats a fast one.</p>' +
      '<div class="bh-doc-title"><b>Before you hit Buy</b><span>Document · 4 pages</span></div>' +
      slider(linkedin.map(c => card(c)), 'LinkedIn document, four pages', 'page') + '</article>',
    x: () => '<article class="bh-frame bh-x" aria-label="X image post preview">' + head('The Patient Funnel', '@patientfunnel · Independent concept') +
      '<p class="bh-text">' + xTip() + '</p>' +
      '<div class="bh-pair">' + card({ art: 'pay', chip: 'Check 1', title: 'What will you pay?', focus: 'pay' }, 'half') + card({ art: 'receive', chip: 'Check 2', title: 'How much bitcoin will you receive?', focus: 'receive' }, 'half') + '</div>' +
      '<div class="bh-reply">' + head('The Patient Funnel', 'Replying to @patientfunnel') +
      '<p class="bh-text">Every screen of a first purchase, in one walkthrough:</p>' +
      '<a class="bh-linkcard" href="' + walkthrough + '"><small>kittiborissza.github.io</small><b>' + cta + '</b></a></div></article>'
  };

  let shown = null;
  let slide = null;
  let player = null;

  function mountSlider(start, onMove) {
    const viewport = stage.querySelector('.bh-viewport');
    const slides = [...viewport.children];
    const count = stage.querySelector('[data-bh-count]');
    const prev = stage.querySelector('[data-bh-move="-1"]');
    const next = stage.querySelector('[data-bh-move="1"]');
    let index = -1;
    let settle;
    const update = i => {
      index = i;
      slides.forEach((item, n) => { item.inert = n !== index; });
      count.textContent = (index + 1) + ' / ' + slides.length;
      prev.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === slides.length - 1));
    };
    const go = (i, smooth = true) => {
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === index) return;
      update(i);
      viewport.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
    };
    const move = delta => {
      const before = index;
      go(index + delta);
      if (index !== before) onMove?.(index);
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    stage.firstElementChild.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target.closest('a')) return;
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    });
    // Swipes land through scroll snapping; read the settled slide back into state.
    viewport.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const stride = slides[1].offsetLeft - slides[0].offsetLeft;
        const nearest = Math.round(viewport.scrollLeft / stride);
        const settled = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2 ? slides.length - 1 : nearest;
        if (settled !== index) { update(settled); onMove?.(index); }
      }, 120);
    }, { passive: true });
    go(start, false);
    return { go, current: () => index };
  }

  function mountPlayer() {
    const screen = stage.querySelector('.bh-screen');
    const sceneLength = Number(screen.dataset.sceneMs);
    const label = screen.dataset.label;
    const scenes = [...screen.querySelectorAll('.bh-scene')];
    const button = stage.querySelector('[data-bh-play]');
    const progress = stage.querySelector('.bh-progress');
    const time = stage.querySelector('[data-bh-time]');
    const live = stage.querySelector('[data-bh-live]');
    const framesButton = stage.querySelector('[data-bh-frames]');
    const frames = stage.querySelector('.bh-frames');
    const reelLength = sceneLength * scenes.length;
    const seconds = reelLength / 1000;
    let elapsed = 0;
    let started = 0;
    let frame;
    let scene = 0;
    const draw = () => {
      const next = Math.min(scenes.length - 1, Math.floor(elapsed / sceneLength));
      if (next !== scene) {
        scenes.forEach((item, i) => {
          item.classList.toggle('is-on', i === next);
          item.inert = i !== next;
        });
        scene = next;
        live.textContent = scenes[scene].querySelector('.bh-cc, .bh-h').textContent;
      }
      scenes[scene].style.setProperty('--p', ((elapsed - scene * sceneLength) / sceneLength).toFixed(3));
      progress.firstChild.style.width = (elapsed / reelLength * 100) + '%';
      const now = Math.floor(elapsed / 1000);
      if (progress.getAttribute('aria-valuenow') !== String(now)) {
        progress.setAttribute('aria-valuenow', now);
        progress.setAttribute('aria-valuetext', now + ' of ' + seconds + ' seconds');
      }
      time.textContent = clock(elapsed) + ' / ' + clock(reelLength);
    };
    const setButton = state => {
      screen.dataset.state = state;
      button.textContent = state === 'playing' ? '❚❚ Pause' : state === 'ended' ? '↺ Replay' : '▶ Play';
      button.setAttribute('aria-label', (state === 'playing' ? 'Pause the ' : state === 'ended' ? 'Replay the ' : 'Play the ') + label);
    };
    const tick = now => {
      elapsed = Math.min(reelLength, elapsed + now - started);
      started = now;
      draw();
      if (elapsed >= reelLength) { setButton('ended'); return; }
      frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      if (screen.dataset.state === 'playing') setButton('paused');
    };
    button.addEventListener('click', () => {
      if (screen.dataset.state === 'playing') return pause();
      if (screen.dataset.state === 'ended') { elapsed = 0; draw(); }
      setButton('playing');
      started = performance.now();
      frame = requestAnimationFrame(tick);
    });
    framesButton.addEventListener('click', () => {
      frames.hidden = !frames.hidden;
      framesButton.setAttribute('aria-expanded', String(!frames.hidden));
      framesButton.textContent = frames.hidden ? 'Show the frames' : 'Hide the frames';
      if (!frames.hidden) { revealChange(frames); scrollToChange(frames); }
    });
    if (reducedMotion.matches) framesButton.click();
    setButton('poster');
    return { stop: () => { cancelAnimationFrame(frame); } };
  }

  function renderOutputs() {
    if (!outputs) return;
    outputs.innerHTML =
      '<figure class="bh-output"><figcaption>Instagram carousel cover</figcaption><div class="bh-mini">' + card(master()[0], '', false) + '</div><small>Example output</small></figure>' +
      '<figure class="bh-output"><figcaption>Reel opening frame</figcaption><div class="bh-mini">' + card(reel()[0], 'tall', false) + '</div><small>Example output</small></figure>' +
      '<figure class="bh-output"><figcaption>X post copy</figcaption><p class="bh-xcopy">' + xTip() + '</p><small>Example output</small></figure>';
    for (const cover of document.querySelectorAll('[data-bh-cover]')) cover.innerHTML = card(master()[0], '', false);
  }

  function render(format, step = 0, reveal = false) {
    player?.stop();
    player = null;
    if (!format) { shown = null; return; }
    if (shown === format && slide) { slide.go(step); return; }
    shown = format;
    stage.innerHTML = formats[format]();
    slide = null;
    if (stage.querySelector('.bh-screen')) player = mountPlayer();
    else if (stage.querySelector('.bh-viewport')) slide = mountSlider(format === 'post' ? step : 0, format === 'post' ? index => view.dispatchEvent(new CustomEvent('fees-card', { detail: index })) : null);
    if (reveal) revealChange(stage);
  }

  for (const button of document.querySelectorAll('[data-bh-hook]')) button.addEventListener('click', () => {
    if (hook === button.dataset.bhHook) return;
    hook = button.dataset.bhHook;
    for (const other of document.querySelectorAll('[data-bh-hook]')) other.setAttribute('aria-pressed', String(other === button));
    renderOutputs();
    revealChange(outputs);
    const current = shown;
    if (['post', 'ig', 'x'].includes(current)) {
      const index = slide?.current() ?? 0;
      shown = null;
      render(current, index);
    }
  });

  renderOutputs();
  window.feesConcept = { render };
})();
