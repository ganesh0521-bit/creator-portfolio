/**
 * CINEMATIC GANYA | CREATOR PORTFOLIO
 * Calculator JavaScript: Interactive Project Cost Estimator & Quote Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectCalculator();
});

function initProjectCalculator() {
  const calcContainer = document.getElementById('project-calculator');
  if (!calcContainer) return;

  // State object
  const calcState = {
    projectType: 'commercial',
    projectTypeName: 'Brand Commercial Film',
    basePrice: 4500,
    baseDays: 21,
    lengthMultiplier: 1.0,
    lengthName: 'Under 60 Seconds',
    crewTierCost: 0,
    crewTierName: 'Solo Cinema Rig (Sony FX6)',
    addons: []
  };

  // Base configurations
  const projectTypes = {
    'commercial': { name: 'Brand Commercial Film', price: 4500, days: 21 },
    'youtube': { name: 'High-Production YouTube Epic', price: 2800, days: 14 },
    'music': { name: 'Music Video / Narrative Film', price: 3800, days: 18 },
    'social': { name: 'Social Reel Pack (5 Deliverables)', price: 1900, days: 7 },
    'documentary': { name: 'Docu-Style Brand Story', price: 5200, days: 28 }
  };

  const lengthTiers = {
    'under60': { name: 'Under 60 Seconds', mult: 1.0, addDays: 0 },
    'short': { name: '1 to 3 Minutes', mult: 1.25, addDays: 4 },
    'medium': { name: '3 to 7 Minutes', mult: 1.6, addDays: 8 },
    'long': { name: '7 to 15+ Minutes', mult: 2.1, addDays: 14 }
  };

  const crewTiers = {
    'solo': { name: 'Solo Cinema Rig (Sony FX6)', cost: 0, addDays: 0 },
    'duo': { name: 'Dual Multicam + Sound Operator', cost: 1200, addDays: 0 },
    'full': { name: 'RED / ARRI 8K + Gaffer & Grips', cost: 3200, addDays: 3 }
  };

  // Option selection handlers
  const projectTypeCards = calcContainer.querySelectorAll('.calc-type-card');
  projectTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      projectTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const typeKey = card.getAttribute('data-type');
      if (projectTypes[typeKey]) {
        calcState.projectType = typeKey;
        calcState.projectTypeName = projectTypes[typeKey].name;
        calcState.basePrice = projectTypes[typeKey].price;
        calcState.baseDays = projectTypes[typeKey].days;
        updateEstimate();
      }
    });
  });

  const lengthCards = calcContainer.querySelectorAll('.calc-length-card');
  lengthCards.forEach(card => {
    card.addEventListener('click', () => {
      lengthCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const lengthKey = card.getAttribute('data-length');
      if (lengthTiers[lengthKey]) {
        calcState.lengthMultiplier = lengthTiers[lengthKey].mult;
        calcState.lengthName = lengthTiers[lengthKey].name;
        calcState.lengthDays = lengthTiers[lengthKey].addDays;
        updateEstimate();
      }
    });
  });

  const crewCards = calcContainer.querySelectorAll('.calc-crew-card');
  crewCards.forEach(card => {
    card.addEventListener('click', () => {
      crewCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const crewKey = card.getAttribute('data-crew');
      if (crewTiers[crewKey]) {
        calcState.crewTierCost = crewTiers[crewKey].cost;
        calcState.crewTierName = crewTiers[crewKey].name;
        calcState.crewDays = crewTiers[crewKey].addDays;
        updateEstimate();
      }
    });
  });

  // Addon Checkbox Items
  const addonItems = calcContainer.querySelectorAll('.calc-addon-item');
  addonItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      const addonKey = item.getAttribute('data-addon');
      const addonCost = parseFloat(item.getAttribute('data-cost')) || 0;
      const addonName = item.querySelector('.addon-info h6').textContent;

      if (item.classList.contains('selected')) {
        calcState.addons.push({ key: addonKey, name: addonName, cost: addonCost });
      } else {
        calcState.addons = calcState.addons.filter(a => a.key !== addonKey);
      }
      updateEstimate();
    });
  });

  function updateEstimate() {
    const baseWithMultiplier = calcState.basePrice * calcState.lengthMultiplier;
    const addonsTotal = calcState.addons.reduce((sum, a) => sum + a.cost, 0);
    const grandTotal = Math.round(baseWithMultiplier + calcState.crewTierCost + addonsTotal);

    let totalDays = (calcState.baseDays || 21) + (calcState.lengthDays || 0) + (calcState.crewDays || 0);

    // If 48h rush addon is chosen
    if (calcState.addons.some(a => a.key === 'rush')) {
      totalDays = Math.max(2, Math.round(totalDays * 0.3));
    }

    // Update UI elements
    const totalEl = document.getElementById('calc-total-price');
    const timelineEl = document.getElementById('calc-timeline-est');
    const summaryTypeEl = document.getElementById('calc-summary-type');
    const summaryScopeEl = document.getElementById('calc-summary-scope');
    const summaryCrewEl = document.getElementById('calc-summary-crew');
    const summaryAddonsList = document.getElementById('calc-summary-addons-list');

    if (totalEl) totalEl.textContent = `$${grandTotal.toLocaleString()}`;
    if (timelineEl) timelineEl.textContent = `Estimated Delivery: ~${totalDays} business days`;
    if (summaryTypeEl) summaryTypeEl.textContent = calcState.projectTypeName;
    if (summaryScopeEl) summaryScopeEl.textContent = calcState.lengthName;
    if (summaryCrewEl) summaryCrewEl.textContent = calcState.crewTierName;

    if (summaryAddonsList) {
      if (calcState.addons.length === 0) {
        summaryAddonsList.innerHTML = `<span style="color: var(--text-subtle);">None selected</span>`;
      } else {
        summaryAddonsList.innerHTML = calcState.addons.map(a => 
          `<div style="display:flex; justify-content:space-between; margin-top:4px; font-size:0.85rem; color:var(--text-muted);">
            <span>• ${a.name}</span>
            <span>+$${a.cost}</span>
          </div>`
        ).join('');
      }
    }

    // Save state for booking redirect
    calcState.grandTotal = grandTotal;
    calcState.totalDays = totalDays;
    localStorage.setItem('cinematic_saved_quote', JSON.stringify(calcState));
  }

  // Book with quote button
  const bookBtn = document.getElementById('calc-book-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      showToast('Estimate Saved!', 'Transferring quote specifications to the booking inquiry...', 'success');
      setTimeout(() => {
        window.location.href = 'contact.html?from_quote=true';
      }, 700);
    });
  }

  // Initial calculation run
  updateEstimate();
}
