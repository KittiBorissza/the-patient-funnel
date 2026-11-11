'use strict';

const preview = document.querySelector('.budget-preview');
const previewBudget = document.getElementById('preview-budget');
const labLink = document.getElementById('budget-lab-link');
const plan = window.PlanCalc;
const whole = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const euros = value => '€' + whole.format(value);
const range = line => whole.format(line.lo) + '–' + whole.format(line.hi);
const show = (id, text) => { document.getElementById(id).textContent = text; };

preview.querySelector('.budget-presets').innerHTML = plan.PRESETS.map(preset =>
  `<button type="button" data-amount="${preset.amount}"><b>${preset.name}</b> €${whole.format(preset.amount)}</button>`).join('');

function renderBudgetPreview() {
  const perMarket = previewBudget.valueAsNumber;
  const valid = previewBudget.validity.valid && Number.isFinite(perMarket);
  for (const button of preview.querySelectorAll('[data-amount]')) {
    button.setAttribute('aria-pressed', String(valid && perMarket === Number(button.dataset.amount)));
  }
  previewBudget.setAttribute('aria-invalid', String(!valid));
  document.getElementById('preview-scenarios').hidden = !valid;
  if (!valid) {
    show('preview-total', 'Enter a monthly budget of €0 or more.');
    return;
  }
  labLink.href = 'strategy.html?' + new URLSearchParams({ budget: previewBudget.value }) + '#budget';
  const markets = plan.DEFAULT_MARKETS;
  const result = plan.budgetForecast({ perMarket, markets });
  show('preview-total', markets.length + ' markets × ' + euros(perMarket) + ' = ' + euros(result.total) + ' a month in total');
  const focus = result.focused;
  show('preview-focus-value', perMarket > 0 ? range(focus) + ' ' + focus.unit + ' on ' + focus.name + ', all ' + euros(focus.spend) : 'No paid test');
  show('preview-focus-decision', focus.spend > 0 ? focus.decision.label + '. ' + focus.decision.text : focus.decision.text);
  document.getElementById('preview-spread').innerHTML = result.spread.filter(line => perMarket === 0 || line.spend > 0).map(line =>
    `<li><b>${line.name}</b> ${euros(line.spend)} · ${line.spend > 0 ? range(line) + ' ' + line.unit : 'no spend'}<span>${line.decision.label}${line.id === 'reels' && line.spend > 0 ? '. ' + line.decision.text : ''}</span></li>`).join('');
}

preview.addEventListener('input', renderBudgetPreview);
preview.addEventListener('click', event => {
  const preset = event.target.closest('[data-amount]');
  if (!preset) return;
  previewBudget.value = preset.dataset.amount;
  renderBudgetPreview();
  revealChange(document.getElementById('preview-scenarios'));
  scrollToChange(document.getElementById('preview-total'));
});
preview.addEventListener('submit', event => event.preventDefault());
renderBudgetPreview();
preview.hidden = false;
