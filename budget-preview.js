'use strict';

const preview = document.querySelector('.budget-preview');
const previewBudget = document.getElementById('preview-budget');
const previewResult = preview.querySelector('[role="status"]');
const labLink = document.getElementById('budget-lab-link');
const wholeNumber = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
let decision = 'purchases';

function renderBudgetPreview() {
  const budget = previewBudget.valueAsNumber;
  const valid = previewBudget.validity.valid && Number.isFinite(budget);
  for (const button of preview.querySelectorAll('[data-amount]')) {
    button.setAttribute('aria-pressed', String(valid && budget === Number(button.dataset.amount)));
  }

  const query = new URLSearchParams({ decision });
  if (valid) query.set('budget', previewBudget.value);
  labLink.href = 'strategy.html?' + query + '#forecast';

  if (!valid) {
    previewResult.textContent = 'Enter a positive monthly budget.';
    return;
  }
  if (decision === 'purchases') {
    const purchases = budget / 60;
    const estimate = purchases < 1 ? 'Fewer than one' : 'About ' + wholeNumber.format(purchases);
    previewResult.textContent = estimate + ' first purchases over 30 days at an illustrative €60 per purchase.';
    return;
  }

  const model = window.PlanCalc;
  const impressions = model.socialForecast(budget, model.BENCH.cpm.cz.mid, 0).impressions;
  const perGroup = Math.floor(impressions / 1.2 / 2);
  const required = model.sampleSize({ baseline: 0.25, lift: 0.03, allocation: 0.5, alpha: 0.05, power: 0.8 }).a;
  previewResult.textContent = 'About ' + wholeNumber.format(perGroup) + ' reached people per group. '
    + 'The comparison needs ' + wholeNumber.format(required) + ' per group under these assumptions. '
    + (perGroup >= required ? 'Check eligible reach and randomisation before launch.' : 'Start with a delivery test.');
}

preview.addEventListener('input', renderBudgetPreview);
preview.addEventListener('click', event => {
  const preset = event.target.closest('[data-amount]');
  if (!preset) return;
  previewBudget.value = preset.dataset.amount;
  renderBudgetPreview();
});
preview.addEventListener('submit', event => {
  event.preventDefault();
  decision = event.submitter?.value || 'purchases';
  renderBudgetPreview();
});
renderBudgetPreview();
preview.hidden = false;
