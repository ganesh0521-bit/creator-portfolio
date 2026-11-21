/**
 * CINEMATIC GANYA | CREATOR PORTFOLIO
 * Contact JavaScript: Booking Wizard, Quote Auto-Fill & Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBudgetChips();
  initProjectTypeChips();
  checkQuoteAutoFill();
  initContactForm();
});

/* ==========================================================================
   Interactive Chips Selection
   ========================================================================== */
function initBudgetChips() {
  const chips = document.querySelectorAll('.budget-chip');
  const hiddenInput = document.getElementById('selected-budget');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (hiddenInput) {
        hiddenInput.value = chip.getAttribute('data-value');
      }
    });
  });
}

function initProjectTypeChips() {
  const chips = document.querySelectorAll('.type-chip');
  const hiddenInput = document.getElementById('selected-project-type');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (hiddenInput) {
        hiddenInput.value = chip.getAttribute('data-type');
      }
    });
  });
}

/* ==========================================================================
   Auto-fill from Project Cost Calculator
   ========================================================================== */
function checkQuoteAutoFill() {
  const urlParams = new URLSearchParams(window.location.search);
  const isFromQuote = urlParams.get('from_quote');

  if (isFromQuote) {
    try {
      const savedQuote = JSON.parse(localStorage.getItem('cinematic_saved_quote'));
      if (savedQuote) {
        // Show banner alert
        const alertBanner = document.getElementById('quote-transfer-banner');
        if (alertBanner) {
          alertBanner.style.display = 'block';
          alertBanner.innerHTML = `
            <div style="background: rgba(255, 87, 34, 0.1); border: 1px solid var(--accent-primary); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="color: var(--accent-primary);"><i class="ri-checkbox-circle-fill"></i> Quote Imported:</strong>
                <span>${savedQuote.projectTypeName} • Total Est: <strong>$${savedQuote.grandTotal.toLocaleString()}</strong> (~${savedQuote.totalDays} days)</span>
              </div>
              <button class="btn btn-sm btn-outline" onclick="this.parentElement.remove()" style="padding: 0.25rem 0.6rem;">Dismiss</button>
            </div>
          `;
        }

        // Prepopulate message textarea
        const messageInput = document.getElementById('inquiry-message');
        if (messageInput) {
          const addonsList = savedQuote.addons.length ? savedQuote.addons.map(a => a.name).join(', ') : 'None';
          messageInput.value = `Hi Ganesh,\n\nI configured an estimate for a ${savedQuote.projectTypeName}.\n- Scope: ${savedQuote.lengthName}\n- Camera/Crew: ${savedQuote.crewTierName}\n- Add-ons: ${addonsList}\n- Estimated Quote: $${savedQuote.grandTotal.toLocaleString()}\n\nLooking forward to discussing our production timeline!`;
        }

        if (window.showToast) {
          window.showToast('Quote Loaded', 'Your customized estimate specifications were populated.', 'success');
        }
      }
    } catch (e) {
      console.error('Error importing quote:', e);
    }
  }
}

/* ==========================================================================
   Form Validation & Submission Simulation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('creator-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const company = document.getElementById('client-company').value.trim();
    const timeline = document.getElementById('project-timeline').value;
    const message = document.getElementById('inquiry-message').value.trim();
    const budgetInput = document.getElementById('selected-budget');
    const budget = budgetInput ? budgetInput.value : '$5,000 - $10,000';
    const typeInput = document.getElementById('selected-project-type');
    const projectType = typeInput ? typeInput.value : 'Commercial Film';

    // Validation
    if (!name) {
      showToast('Name Required', 'Please enter your name or company contact.', 'error');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      showToast('Valid Email Required', 'Please enter a valid business email address.', 'error');
      return;
    }

    if (!message) {
      showToast('Project Details Needed', 'Please provide a brief outline of your project vision.', 'error');
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="ri-loader-4-line" style="animation: spin 1s infinite linear;"></i> Transmitting Inquiry...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Save inquiry to localStorage
      try {
        const inquiries = JSON.parse(localStorage.getItem('cinematic_enquiries') || '[]');
        inquiries.unshift({
          name,
          email,
          company,
          timeline,
          budget,
          projectType,
          message,
          date: new Date().toISOString()
        });
        localStorage.setItem('cinematic_enquiries', JSON.stringify(inquiries));
      } catch (err) {
        console.error(err);
      }

      // Show confirmation dialog
      showBookingConfirmationModal(name, email, projectType);
      form.reset();
    }, 1200);
  });
}

function showBookingConfirmationModal(name, email, projectType) {
  let modal = document.getElementById('booking-confirmation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'booking-confirmation-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="video-modal-dialog" style="max-width: 560px; padding: 2.5rem; text-align: center;">
      <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); border: 2px solid #22c55e; color: #22c55e; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem auto;">
        <i class="ri-check-line"></i>
      </div>
      <h3 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Inquiry Received!</h3>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6;">
        Thank you, <strong>${name}</strong>! Your inquiry for <strong>${projectType}</strong> has been logged in our studio calendar. A production treatment & pitch deck link will be dispatched to <strong>${email}</strong> within 24 hours.
      </p>
      <div style="display: flex; justify-content: center; gap: 1rem;">
        <button class="btn btn-primary" onclick="closeConfirmationModal()">Done</button>
        <a href="portfolio.html" class="btn btn-secondary">Explore More Work</a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConfirmationModal() {
  const modal = document.getElementById('booking-confirmation-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeConfirmationModal = closeConfirmationModal;
