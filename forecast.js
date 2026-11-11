'use strict';

const calc = window.PlanCalc;
const get = id => document.getElementById(id);
const write = (id, value) => { get(id).textContent = value; };
const count = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const money = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
const unitMoney = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 4 });
const pct = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
const fmt = value => count.format(Math.floor(value + 1e-9));
const euro = value => money.format(value);
const duration = days => fmt(days) + (days === 1 ? ' day' : ' days');
const market = id => calc.MARKETS.find(item => item.id === id);
const secondary = get('second-market');
const primary = get('primary-market');
const controls = document.querySelector('.forecast-band');
const values = ids => Object.fromEntries(ids.map(id => [id, Number(get(id).value)]));
const valid = ids => ids.every(id => get(id).value !== '' && get(id).validity.valid);
const acquisitionFields = ['meta-budget', 'period', 'cpm', 'ctr', 'hold', 'adsets', 'remarketing'];
const sampleFields = ['baseline', 'effect', 'allocation', 'significance', 'power', 'frequency'];

function setOrigin(id, origin) {
  write(id + '-origin', origin || get(id).dataset.origin);
}

function updateMarketReference(id, cpm, ctr) {
  if (!id) return;
  get(cpm).value = calc.BENCH.cpm[id].mid;
  get(ctr).value = calc.BENCH.euDtcCtr;
  setOrigin(cpm);
  setOrigin(ctr);
}

function renderGroups(rows, reserve) {
  const container = get('delivery-groups');
  container.replaceChildren();
  const list = document.createElement('ul');
  for (const row of rows) {
    for (let index = 1; index <= row.sets; index++) {
      const item = document.createElement('li');
      const { spend, impressions, purchases, watches } = row.delivery;
      const group = row.sets > 1 ? ' / acquisition ad set ' + index : ' / acquisition';
      item.textContent = market(row.id).name + group + ' · ' + euro(spend / row.sets)
        + ' · ≈ ' + fmt(impressions / row.sets) + ' impressions · ≈ ' + fmt(watches / row.sets)
        + ' watches · ≈ ' + fmt(purchases / row.sets) + ' first purchases';
      list.append(item);
    }
  }
  if (reserve > 0) {
    const item = document.createElement('li');
    item.textContent = 'Remarketing reserve · ' + euro(reserve) + ' · delivery outside this acquisition estimate';
    list.append(item);
  }
  container.append(list);
}

function renderSample(primaryDelivery, days, sets) {
  if (!valid(sampleFields)) {
    write('sample-result', 'Enter a valid baseline, lift, allocation, significance level, power and frequency.');
    return null;
  }
  const input = values(sampleFields);
  const allocation = input.allocation / 100;
  const required = calc.sampleSize({
    baseline: input.baseline / 100,
    lift: input.effect / 100,
    allocation,
    alpha: input.significance / 100,
    power: input.power / 100
  });
  if (!required) {
    write('sample-result', 'Choose a lift that leaves the second event rate below 100%.');
    return null;
  }

  const reach = primaryDelivery.impressions / input.frequency / sets;
  const availableA = Math.floor(reach * allocation);
  const availableB = Math.floor(reach * (1 - allocation));
  const enough = availableA >= required.a && availableB >= required.b;
  const requiredReach = Math.max(required.a / allocation, required.b / (1 - allocation));
  const neededSpend = requiredReach * primaryDelivery.spend / sets / reach;
  const neededDays = Math.ceil(requiredReach * days / reach);
  const scope = market(primary.value).name + (sets > 1 ? ', per acquisition ad set' : '');
  const message = 'Need ' + fmt(required.a) + ' people in A and ' + fmt(required.b) + ' in B. '
    + 'Projected over ' + duration(days) + ' in ' + scope + ': ' + fmt(availableA) + ' in A and ' + fmt(availableB) + ' in B. '
    + (enough ? 'Both groups reach the estimated requirement.' : 'At least one group is short.')
    + ' At these rates, allow about ' + euro(neededSpend) + ' in the test ad set or ' + duration(neededDays) + ' at its current daily spend.';
  write('sample-result', message);
  return { enough, reach, availableA, availableB };
}

function renderTarget(total) {
  const isWatch = get('target-event').value === 'watch';
  const volume = isWatch ? total.watches : total.purchases;
  const unit = isWatch ? 'watch past the opening' : 'completed first purchase';
  if (!valid(['target-count']) || volume <= 0) {
    write('event-result', 'Enter a valid event target and assumptions that produce at least some delivery for this event.');
    return;
  }
  const target = Number(get('target-count').value);
  const cost = total.spend / volume;
  write('event-result', 'About ' + euro(target * cost) + ' in acquisition spend for ' + fmt(target)
    + ' events, at ' + (cost < 1 ? unitMoney.format(cost) : euro(cost)) + ' per ' + unit + '.');
}

function renderForecast() {
  const purpose = controls.querySelector('[name="decision"]:checked').value;
  get('result-sample-link').hidden = purpose !== 'compare';
  const funnel = get('cost-mode').value === 'funnel';
  const hasSecond = Boolean(secondary.value);
  get('second-media').hidden = !hasSecond;
  get('market-share-field').hidden = !hasSecond;
  get('funnel-fields').hidden = !funnel;
  get('direct-fields').hidden = funnel;

  const ids = [...acquisitionFields, ...(funnel ? ['click-install', 'install-buy'] : ['cost'])];
  if (hasSecond) ids.push('market-share', 'cpm2', 'ctr2');
  const duplicate = hasSecond && primary.value === secondary.value;
  for (const input of controls.querySelectorAll('input[type="number"]')) {
    input.setAttribute('aria-invalid', String(!input.closest('[hidden]') && !valid([input.id])));
  }
  secondary.setAttribute('aria-invalid', String(duplicate));
  for (const button of controls.querySelectorAll('[data-budget]')) {
    button.setAttribute('aria-pressed', String(Number(get('meta-budget').value) === Number(button.dataset.budget)));
  }

  if (!valid(ids) || duplicate) {
    write('result-tag', 'Planning estimate');
    write('result-value', '—');
    write('result-event', 'Check the highlighted inputs');
    write('result-decision', duplicate ? 'Choose two different markets or leave the second market blank.' : 'Enter values within the indicated ranges.');
    write('result-setup', 'Start with one market and one acquisition ad set.');
    write('result-delivery', '');
    write('delivery-groups', 'Delivery appears when the setup is valid.');
    write('event-result', 'Fix the forecast inputs to estimate the target budget.');
    write('sample-result', 'Fix the forecast inputs to check available sample.');
    return;
  }

  const input = values(ids);
  const periodSpend = input['meta-budget'] * input.period / 30;
  const reserve = periodSpend * input.remarketing / 100;
  const acquisition = periodSpend - reserve;
  const primaryShare = hasSecond ? input['market-share'] / 100 : 1;
  const rates = funnel ? { clickInstall: input['click-install'] / 100, installBuy: input['install-buy'] / 100 } : null;
  const one = (spend, cpm, ctr) => calc.delivery(spend, cpm, ctr, input.hold / 100, input.cost, rates);
  const first = one(acquisition * primaryShare, input.cpm, input.ctr);
  const rows = [{ id: primary.value, delivery: first, sets: input.adsets }];
  if (hasSecond) rows.push({ id: secondary.value, delivery: one(acquisition * (1 - primaryShare), input.cpm2, input.ctr2), sets: input.adsets });
  const total = Object.fromEntries(['spend', 'impressions', 'clicks', 'watches', 'purchases', 'installs'].map(key => [
    key, rows.reduce((sum, row) => sum + row.delivery[key], 0)
  ]));
  const sample = renderSample(first, input.period, input.adsets);
  renderTarget(total);
  renderGroups(rows, reserve);

  const baseSetup = 'Start with one market and one acquisition ad set. ';
  const byPurpose = {
    attention: {
      value: total.watches, label: 'watches past the opening',
      decision: 'See where viewers keep watching and what they ask next. Treat uneven delivery as directional.',
      setup: baseSetup + 'Publish the walkthrough and read watch-through alongside comments.'
    },
    purchases: {
      value: total.purchases, label: 'completed first purchases',
      decision: 'Estimate how many tracked first purchases this budget might support. Confirm event tracking and attribution before spending.',
      setup: baseSetup + 'Use a tracked first-purchase event where eligible. Use the observed cost to update the estimate.'
    },
    compare: {
      value: sample?.reach, label: 'estimated reached people in the test setup',
      decision: sample ? (sample.enough ? 'The projected sample covers both arms. Confirm random assignment and observed reach before launch.' : 'The projected sample falls short in at least one arm. Use the sample panel to see the gap.') : 'Check the sample assumptions to see what a controlled test would need.',
      setup: baseSetup + 'Run two versions with random assignment and change only the opening line.'
    }
  };
  const result = byPurpose[purpose];
  const resultScope = purpose === 'compare' || !hasSecond ? market(primary.value).name : 'Two markets';
  write('result-tag', 'Planning estimate / ' + resultScope + ' / ' + duration(input.period));
  write('result-value', result.value == null ? '—' : '≈ ' + fmt(result.value));
  write('result-event', result.label);
  write('result-decision', result.decision);
  write('result-setup', result.setup);
  write('result-delivery', euro(total.spend) + ' acquisition spend · ≈ ' + fmt(total.impressions)
    + ' impressions · ≈ ' + fmt(total.clicks) + ' link clicks'
    + (total.clicks > 0 ? ' · ' + euro(total.spend / total.clicks) + ' implied CPC' : '')
    + (funnel ? ' · ≈ ' + fmt(total.installs) + ' installs' : '')
    + (reserve > 0 ? ' · ' + euro(reserve) + ' remarketing reserve' : '') + '.');
}

controls.addEventListener('input', event => {
  const input = event.target;
  if (input.dataset.origin) setOrigin(input.id, 'User-entered value');
  if (input === primary) updateMarketReference(primary.value, 'cpm', 'ctr');
  if (input === secondary) updateMarketReference(secondary.value, 'cpm2', 'ctr2');
  if (input.id === 'sample-event') {
    const buy = input.value === 'purchase';
    get('baseline').value = buy ? .02 : 25;
    get('effect').value = buy ? .01 : 3;
    setOrigin('baseline');
    setOrigin('effect');
  }
  renderForecast();
});
controls.addEventListener('click', event => {
  const preset = event.target.closest('[data-budget]');
  if (!preset) return;
  get('meta-budget').value = preset.dataset.budget;
  setOrigin('meta-budget');
  renderForecast();
});

const mix = get('market-plan');
const plans = calc.initialPlans();
for (const item of calc.MARKETS) {
  plans[item.id].rates = calc.CHANNELS.map(channel => channel.buy);
  plans[item.id].edited = new Set();
}
get('mix-channels').innerHTML = calc.CHANNELS.map(({ id, name, share, buy }) => `
  <div class="mix-channel">
    <div><h4>${name}</h4><label for="mix-share-${id}">Allocation <output id="mix-display-${id}" for="mix-share-${id}">${share}%</output></label>
      <input type="range" id="mix-share-${id}" min="0" max="100" value="${share}" aria-describedby="mix-share-${id}-origin">
      <p class="note" id="mix-share-${id}-origin"></p><p class="note" id="mix-note-${id}"></p></div>
    <div class="field"><label for="mix-rate-${id}">Install to first purchase (%)</label>
      <input type="number" id="mix-rate-${id}" min="0" max="100" step="any" value="${buy}" aria-describedby="mix-rate-${id}-origin">
      <small id="mix-rate-${id}-origin"></small></div>
  </div>`).join('');

function renderMix() {
  const active = get('mix-market').value;
  const plan = plans[active];
  const scenario = Number(get('mix-scenario').value);
  const result = calc.MARKETS.map(item => {
    const one = plans[item.id];
    const channels = calc.marketChannels(item).map((channel, index) => ({ ...channel, buy: one.rates[index] }));
    return { item, plan: one, channels, ...calc.model(one.budget, one.shares, scenario, channels) };
  });
  const selected = result.find(row => row.item.id === active);
  const testSpend = Number(get('meta-budget').value);
  const social = selected.rows.find(row => row.id === 'social').allocated;
  const totals = { budget: 0, social: 0, clicks: 0, installs: 0, buyers: 0, spend: 0 };
  write('market-language', selected.item.langNote);
  setOrigin('mix-budget', plan.edited.has('mix-budget') ? 'User-entered value' : undefined);
  const summary = euro(plan.budget) + ' across five channels · ' + euro(social) + ' included for Meta · ≈ '
    + fmt(selected.total.installs) + ' installs · ≈ ' + fmt(selected.total.buyers) + ' first buyers'
    + (selected.total.unused > .01 ? ' · ' + euro(selected.total.unused) + ' unused after the referral cap' : '') + '. ';
  const bridge = active === primary.value && testSpend > social
    ? 'This market’s Meta line is smaller than the separate monthly test scenario. Reallocate within the plan if you adopt that test.'
    : 'The separate Meta test scenario is excluded from this total.';
  write('mix-result', summary + bridge);
  const shares = calc.display(plan.shares);
  for (const [index, row] of selected.rows.entries()) {
    const shareId = 'mix-share-' + row.id;
    const rateId = 'mix-rate-' + row.id;
    get(shareId).value = shares[index];
    write('mix-display-' + row.id, shares[index] + '%');
    write(shareId + '-origin', plan.edited.has('shares') ? 'User-entered allocation, balanced to 100%' : 'Illustrative assumption');
    write(rateId + '-origin', plan.edited.has(rateId) ? 'User-entered value' : 'Illustrative assumption');
    write('mix-note-' + row.id, euro(row.allocated) + ' allocated · ' + euro(row.cpi) + ' illustrative CPI'
      + ' · ≈ ' + fmt(row.buyers) + ' first buyers' + (row.capped ? ' · referral cap reached' : ''));
  }
  get('market-rows').innerHTML = result.map(({ item, plan, total, rows }) => {
    const meta = rows.find(row => row.id === 'social').allocated;
    const media = calc.socialForecast(meta, plan.cpm, plan.ctr);
    totals.budget += plan.budget;
    totals.social += meta;
    totals.clicks += media.clicks;
    totals.installs += total.installs;
    totals.buyers += total.buyers;
    totals.spend += total.spend;
    return `<tr><th scope="row">${item.name}${item.toConfirm ? ' *' : ''}</th><td>${item.langShort}</td><td>${euro(plan.budget)}</td>
      <td>${euro(meta)}</td><td>${euro(plan.cpm)}</td><td>${pct.format(plan.ctr)}%</td><td>${fmt(media.clicks)}</td>
      <td>${fmt(total.installs)}</td><td>${fmt(total.buyers)}</td><td>${total.perBuyer == null ? '—' : euro(total.perBuyer)}</td></tr>`;
  }).join('');
  get('market-totals').innerHTML = `<tr><th scope="row">All markets</th><td>—</td><td>${euro(totals.budget)}</td>
    <td>${euro(totals.social)}</td><td>—</td><td>—</td><td>${fmt(totals.clicks)}</td><td>${fmt(totals.installs)}</td>
    <td>${fmt(totals.buyers)}</td><td>${totals.buyers ? euro(totals.spend / totals.buyers) : '—'}</td></tr>`;
}
function refreshMixInputs() {
  const plan = plans[get('mix-market').value];
  get('mix-budget').value = plan.budget;
  for (const [i, channel] of calc.CHANNELS.entries()) {
    const input = get('mix-rate-' + channel.id);
    input.value = plan.rates[i];
    input.removeAttribute('aria-invalid');
  }
  get('mix-budget').removeAttribute('aria-invalid');
}
mix.addEventListener('input', event => {
  const input = event.target;
  const plan = plans[get('mix-market').value];
  const share = input.id.startsWith('mix-share-');
  const rate = input.id.startsWith('mix-rate-');
  if (input.id === 'mix-market' || input.id === 'mix-scenario') setOrigin(input.id, 'User-entered value');
  if (input.id === 'mix-market') refreshMixInputs();
  if (input.id === 'mix-budget' || rate) {
    input.setAttribute('aria-invalid', String(!valid([input.id])));
    if (!valid([input.id])) {
      write('mix-result', 'Enter a valid value to update the market plan.');
      return;
    }
    plan.edited.add(input.id);
    if (rate) plan.rates[calc.CHANNELS.findIndex(channel => input.id === 'mix-rate-' + channel.id)] = Number(input.value);
    else plan.budget = Number(input.value);
  }
  if (share) {
    const index = calc.CHANNELS.findIndex(channel => input.id === 'mix-share-' + channel.id);
    plan.shares = calc.rebalance(plan.shares, index, Number(input.value));
    plan.edited.add('shares');
  }
  renderMix();
});

controls.addEventListener('input', renderMix);
controls.addEventListener('click', event => { if (event.target.closest('[data-budget]')) renderMix(); });
renderForecast();
renderMix();

const budgetCalc = get('budget-calc');
const whole = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const wholeEuro = value => '€' + whole.format(value);
const span = line => whole.format(line.lo) + '–' + whole.format(line.hi);
budgetCalc.querySelector('.budget-presets').innerHTML = calc.PRESETS.map(preset =>
  `<button type="button" data-amount="${preset.amount}"><b>${preset.name}</b> €${whole.format(preset.amount)}</button>`).join('');
get('calc-focus').innerHTML = calc.TEST_CHANNELS.map(channel => `<option value="${channel.id}">${channel.name}</option>`).join('');
get('calc-shares').innerHTML = calc.TEST_CHANNELS.map(channel => `<div class="field"><label for="share-${channel.id}">${channel.name}</label>
  <input id="share-${channel.id}" type="number" min="0" max="100" step="any" value="${channel.share}" inputmode="decimal" required></div>`).join('');

function estimateCell(line) {
  if (!(line.spend > 0)) return 'No spend';
  return span(line) + ' ' + line.unit
    + (line.purchases ? ' · ' + span(line.purchases) + ' first purchases at the assumed conversion' : '');
}

function renderBudgetCalc() {
  const budget = get('calc-budget');
  const purchase = get('calc-purchase');
  const shareInputs = calc.TEST_CHANNELS.map(channel => get('share-' + channel.id));
  const markets = [...budgetCalc.querySelectorAll('[name="market"]:checked')].map(box => box.value);
  for (const input of [budget, purchase, ...shareInputs]) input.setAttribute('aria-invalid', String(!input.validity.valid));
  for (const button of budgetCalc.querySelectorAll('[data-amount]')) {
    button.setAttribute('aria-pressed', String(Number(budget.value) === Number(button.dataset.amount)));
  }
  const problem = !budget.validity.valid || budget.value === '' ? 'Enter a monthly budget of €0 or more.'
    : !markets.length ? 'Pick at least one market.'
    : !purchase.validity.valid ? 'Enter a conversion between 0% and 100%, or leave it empty.'
    : shareInputs.some(input => !input.validity.valid || input.value === '') ? 'Enter a split between 0% and 100% for each channel.'
    : null;
  get('calc-scenarios').hidden = Boolean(problem);
  if (problem) {
    write('calc-total', problem);
    return;
  }
  const perMarket = Number(budget.value);
  const result = calc.budgetForecast({
    perMarket, markets, focus: get('calc-focus').value,
    shares: shareInputs.map(input => Number(input.value)),
    purchaseRate: purchase.value === '' ? 0 : Number(purchase.value) / 100
  });
  write('calc-total', markets.length + (markets.length === 1 ? ' market' : ' markets') + ' × ' + wholeEuro(perMarket)
    + ' = ' + wholeEuro(result.total) + ' a month in total. Both scenarios spend exactly this.');
  const focus = result.focused;
  write('calc-focus-title', focus.name + ' · ' + wholeEuro(focus.spend));
  get('calc-focus-line').innerHTML = `<p class="calc-value">${estimateCell(focus)}</p>
    <p>${wholeEuro(focus.perMarket)} per market.</p><p><b>What it answers</b> ${focus.decision.text}</p>
    <p class="calc-fit" data-fit="${focus.fitLevel}">${focus.fit}</p>`;
  const answered = result.spread.filter(line => line.decision.enough).length;
  write('calc-spread-title', answered + ' of ' + result.spread.length + ' channels get enough volume to compare versions');
  get('calc-spread').innerHTML = result.spread.map(line => `<tr><th scope="row">${line.name}</th>
    <td>${wholeEuro(line.spend)}<small>${wholeEuro(line.perMarket)} per market</small></td>
    <td>${estimateCell(line)}<small class="calc-fit" data-fit="${line.fitLevel}">${line.fit}</small></td>
    <td>${line.decision.text}</td></tr>`).join('');
}

budgetCalc.addEventListener('input', renderBudgetCalc);
budgetCalc.addEventListener('submit', event => event.preventDefault());
budgetCalc.addEventListener('click', event => {
  const preset = event.target.closest('[data-amount]');
  if (!preset) return;
  get('calc-budget').value = preset.dataset.amount;
  renderBudgetCalc();
});
const requestedBudget = new URLSearchParams(location.search).get('budget');
if (requestedBudget !== null) {
  const budgetInput = get('calc-budget');
  const fallback = budgetInput.value;
  budgetInput.value = requestedBudget;
  if (!budgetInput.validity.valid || budgetInput.value === '') budgetInput.value = fallback;
}
renderBudgetCalc();
