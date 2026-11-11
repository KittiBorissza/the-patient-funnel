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
  if (input === primary) {
    updateMarketReference(primary.value, 'cpm', 'ctr');
    showPlannerMarket();
  }
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
// Discrete choices (radios, selects) get a visible change; typing stays still.
const showForecastChange = () => { revealChange(get('result')); scrollToChange(get('result')); };
controls.addEventListener('change', event => { if (event.target.matches('[type="radio"], select')) showForecastChange(); });


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

// The planner opens on one market from the forecast, with that market's Meta spend (Reels + link ads) filled in.
let plannerMarket = null;
let lastForecast = null;
function showPlannerMarket() {
  write('market-language', market(primary.value).langNote);
  write('planner-from', 'Opened from the forecast: ' + market(primary.value).name + '. Pick another market in the forecast table, or change it under “Adjust setup”.');
}
function openPlanner(id, fromClick = false) {
  const row = lastForecast?.byMarket.find(item => item.id === id);
  if (!row) return;
  plannerMarket = id;
  primary.value = id;
  updateMarketReference(id, 'cpm', 'ctr');
  setOrigin('primary-market', 'From the forecast');
  const metaSpend = row.lines.filter(line => line.id === 'reels' || line.id === 'meta-link').reduce((sum, line) => sum + line.spend, 0);
  get('meta-budget').value = Math.round(metaSpend) || '';
  setOrigin('meta-budget', 'From the forecast');
  showPlannerMarket();
  renderForecast();
  for (const button of get('calc-markets').querySelectorAll('[data-plan-market]')) button.setAttribute('aria-pressed', String(button.dataset.planMarket === id));
  if (fromClick) {
    revealChange(get('result'));
    get('planner-h').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
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
  get('calc-markets-card').hidden = Boolean(problem);
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
  const funded = result.spread.filter(line => line.spend > 0);
  const answered = funded.filter(line => line.decision.enough).length;
  write('calc-spread-title', answered + ' of ' + funded.length + (funded.length === 1 ? ' channel gets' : ' channels get') + ' enough volume to compare versions');
  get('calc-spread').innerHTML = result.spread.map(line => `<tr><th scope="row">${line.name}</th>
    <td>${wholeEuro(line.spend)}<small>${wholeEuro(line.perMarket)} per market</small></td>
    <td>${estimateCell(line)}<small class="calc-fit" data-fit="${line.fitLevel}">${line.fit}</small></td>
    <td>${line.decision.text}</td></tr>`).join('');
  lastForecast = result;
  const spendOf = (row, ids) => row.lines.filter(line => ids.includes(line.id)).reduce((sum, line) => sum + line.spend, 0);
  get('calc-markets').innerHTML = result.byMarket.map(row => `<tr><th scope="row">${market(row.id).name}<small>${market(row.id).langShort}</small></th>
    <td>${wholeEuro(spendOf(row, ['reels', 'meta-link']))}<small>${span(row.lines[0])} views past the opening</small></td>
    <td>${wholeEuro(spendOf(row, ['search']))}</td><td>${wholeEuro(spendOf(row, ['youtube']))}</td>
    <td><button type="button" class="button outline" data-plan-market="${row.id}" aria-pressed="${row.id === plannerMarket}">Plan the Meta test<span class="visually-hidden"> for ${market(row.id).name}</span></button></td></tr>`).join('');
  if (!markets.includes(plannerMarket)) openPlanner(markets[0]);
  else if (get('meta-budget-origin').textContent === 'From the forecast') openPlanner(plannerMarket);
}

const showCalcChange = () => { revealChange(get('calc-scenarios')); scrollToChange(get('calc-total')); };
budgetCalc.addEventListener('input', renderBudgetCalc);
budgetCalc.addEventListener('change', event => { if (event.target.matches('select, [type="checkbox"]')) showCalcChange(); });
budgetCalc.addEventListener('submit', event => event.preventDefault());
get('calc-markets').addEventListener('click', event => {
  const button = event.target.closest('[data-plan-market]');
  if (!button) return;
  openPlanner(button.dataset.planMarket, true);
});
budgetCalc.addEventListener('click', event => {
  const preset = event.target.closest('[data-amount]');
  if (!preset) return;
  get('calc-budget').value = preset.dataset.amount;
  renderBudgetCalc();
  showCalcChange();
});
const requestedBudget = new URLSearchParams(location.search).get('budget');
if (requestedBudget !== null) {
  const budgetInput = get('calc-budget');
  const fallback = budgetInput.value;
  budgetInput.value = requestedBudget;
  if (!budgetInput.validity.valid || budgetInput.value === '') budgetInput.value = fallback;
}
renderBudgetCalc();
renderForecast();
