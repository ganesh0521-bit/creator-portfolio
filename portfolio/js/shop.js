/**
 * CINEMATIC GANYA | CREATOR PORTFOLIO
 * Shop JavaScript: Digital Store, Color Grading Before/After Slider & Cart Drawer
 */

const digitalProducts = [
  {
    id: 'prod-1',
    name: 'Cinematic Master LUTs Vol. 1',
    category: 'luts',
    categoryName: 'LUT Packs',
    price: 39,
    origPrice: 79,
    badge: 'BESTSELLER',
    desc: '15 Hollywood-grade .CUBE LUTs engineered for Sony S-Log3, RED IPP2, ARRI LogC3/4, and Rec.709.',
    specs: ['15 .CUBE Files', 'S-Log3 / Rec709', 'Premiere / FCPX / DaVinci', 'PDF Guide'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-2',
    name: 'Moody Film Grain & Halation PowerGrade',
    category: 'presets',
    categoryName: 'Grading Presets',
    price: 49,
    origPrice: 89,
    badge: 'NEW',
    desc: 'Authentic 16mm & 35mm film emulation node tree for DaVinci Resolve Studio with organic halation & gate weave.',
    specs: ['DaVinci Node Tree', '16mm & 35mm Scans', 'Print Film Emulations', 'Instant Download'],
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-3',
    name: 'Sonic Impact: 450+ Cinematic Sound FX',
    category: 'sfx',
    categoryName: 'Sound FX',
    price: 59,
    origPrice: 120,
    badge: 'HOT',
    desc: 'Deep cinematic risers, sub-bass drops, atmospheric whooshes, mechanical impacts, and foley recorded in 96kHz/24-bit.',
    specs: ['450+ WAV Files', '96kHz / 24-bit', 'Royalty-Free Commercial', 'Categorized Folders'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-4',
    name: 'Tokyo Cyberpunk & Neon LUT Bundle',
    category: 'luts',
    categoryName: 'LUT Packs',
    price: 35,
    origPrice: 65,
    badge: 'POPULAR',
    desc: 'Electric night palette giving glowing blues, saturated magenta, and deep clean shadows for night videography.',
    specs: ['10 Night LUTs', 'Sony & Canon Profiles', 'Mobile & Desktop', 'Before/After Previews'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-5',
    name: 'Street & Travel Photography Lightroom Pack',
    category: 'presets',
    categoryName: 'Lightroom Presets',
    price: 29,
    origPrice: 55,
    badge: 'TRENDING',
    desc: '20 timeless presets designed for warm documentary tones, golden hour street photography, and editorial portraits.',
    specs: ['20 XMP + DNG Presets', 'Lightroom Mobile & Desktop', 'One-Click Exposure Fix', 'Video Tutorial'],
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-6',
    name: 'The Complete Creator Master Bundle',
    category: 'bundle',
    categoryName: 'Full Suite',
    price: 119,
    origPrice: 280,
    badge: '60% OFF',
    desc: 'Everything inside one mega-pack: Master LUTs, 450+ Sound FX, DaVinci Film Emulation, and 20 Lightroom Presets.',
    specs: ['All 5 Products Included', 'Over 3.5GB Assets', 'Lifetime Updates', 'VIP Discord Access'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initShopProducts();
  initShopCategoryFilters();
  initBeforeAfterSlider();
  initCartDrawer();
});

/* ==========================================================================
   Render Digital Products
   ========================================================================== */
function initShopProducts(filter = 'all') {
  const container = document.getElementById('shop-product-grid');
  if (!container) return;

  let filtered = digitalProducts;
  if (filter !== 'all') {
    filtered = filtered.filter(p => p.category === filter);
  }

  container.innerHTML = filtered.map(item => `
    <article class="product-card" data-category="${item.category}">
      <div class="product-media">
        <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy">
        <span class="product-badge">${item.badge}</span>
      </div>
      <div class="product-body">
        <div>
          <span class="product-meta-type">${item.categoryName}</span>
          <h3 class="product-title">${item.name}</h3>
          <p class="product-desc">${item.desc}</p>
          <div class="product-specs-list">
            ${item.specs.map(s => `<span class="product-spec-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">$${item.price}</span>
            <span class="product-price-orig">$${item.origPrice}</span>
          </div>
          <button class="btn btn-primary btn-sm add-cart-btn" onclick="addToCart('${item.id}')">
            <i class="ri-shopping-bag-3-line"></i> Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   Category Filters
   ========================================================================== */
function initShopCategoryFilters() {
  const filterBtns = document.querySelectorAll('.shop-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      initShopProducts(category);
    });
  });
}

/* ==========================================================================
   Before / After Comparison Split Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-slider-container');
  if (!container) return;

  const beforeImg = container.querySelector('.comparison-img-before');
  const handle = container.querySelector('.slider-handle');
  if (!beforeImg || !handle) return;

  let isDragging = false;

  const updateSlider = (xPos) => {
    const rect = container.getBoundingClientRect();
    let position = ((xPos - rect.left) / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    beforeImg.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  };

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   Shopping Cart Drawer & State Management
   ========================================================================== */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cinematic_cart') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cinematic_cart', JSON.stringify(cart));
  if (window.updateCartBadge) window.updateCartBadge();
  renderCartItems();
}

function addToCart(productId) {
  const product = digitalProducts.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  showToast('Added to Cart', `${product.name} was added to your creator kit.`, 'success');
  openCartDrawer();
}
window.addToCart = addToCart;

function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }
}
window.openCartDrawer = openCartDrawer;

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.closeCartDrawer = closeCartDrawer;

function renderCartItems() {
  const listEl = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  if (!listEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="cart-empty-state">
        <i class="ri-shopping-bag-line cart-empty-icon"></i>
        <h4>Your kit is empty</h4>
        <p>Explore our premium cinematic LUTs, Sound FX packs, and Lightroom presets above.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    return;
  }

  let total = 0;
  listEl.innerHTML = cart.map(item => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    return `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price} each</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', -1)">-</button>
            <span style="font-weight:600; font-size:0.9rem;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <i class="ri-delete-bin-line cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remove"></i>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
}

function updateItemQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart(cart);
}
window.updateItemQuantity = updateItemQuantity;

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  showToast('Item Removed', 'Removed asset from your kit.', 'info');
}
window.removeCartItem = removeCartItem;

function initCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const closeBtn = document.getElementById('close-cart-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const triggerBtns = document.querySelectorAll('.cart-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCartDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('Empty Cart', 'Add at least one product before proceeding.', 'warning');
        return;
      }
      showToast('Preparing Order...', 'Generating instant digital download links...', 'success');
      setTimeout(() => {
        closeCartDrawer();
        alert('🎉 Order Confirmed! (Demo Checkout)\n\nThank you for supporting Cinematic Ganya! In production mode, instant download links are dispatched to your email alongside license keys.');
        saveCart([]);
      }, 900);
    });
  }
}
