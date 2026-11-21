# Cinematic Ganya | Creator Portfolio Website

A responsive, high-aesthetic portfolio website for a **Director, Cinematographer & Digital Content Creator**, built with pure semantic **HTML5**, **CSS3**, and modular **Vanilla JavaScript**.

---

## 🌟 Key Features & Pages

### 1. **Home (`index.html`)**
- **Cinematic Hero**: Showreel frame featuring dynamic 4K simulated video playback, video resolution badges, and pulsing play button.
- **Creator Status Indicator**: Live booking status badge (`Available for Q1/Q2 Worldwide Bookings`).
- **Stats Counter Bar**: 45M+ Video Views, 250K+ Community, 85+ Commercials, 14 Awards.
- **Brand Partners Marquee**: Continuous marquee of brand trust (Sony, Red Bull, Nat Geo, Porsche, Republic Records, DJI, Adobe).
- **Featured Works**: Curated high-impact video project cards with play triggers.
- **Creator Bio Sneak Peek**: Floating 10+ Years badge and photography teaser.
- **Client Testimonials**: Verified ratings from commercial creative directors.

### 2. **Portfolio (`portfolio.html`)**
- **Category Filter Pills**: Filter projects across *All*, *Commercials*, *Documentaries*, *Music Videos*, *Travel & Nature*, and *Short Form & Reels*.
- **Live Search Bar**: Real-time instant filtering by project title, client, camera gear, or location.
- **Interactive Video Modal**: Custom simulated 4K video player with real-time waveform visualizer, play/pause controls, interactive timeline scrubber, volume/mute toggles, and fullscreen mode.

### 3. **About & Cinema Gear Bag (`about.html`)**
- **Creator Story**: Detailed artistic journey and philosophy of Cinematic Ganya.
- **Production Milestones**: Interactive career chapters from 2017 to 2026.
- **Interactive Cinema Gear Bag Explorer**: Tabbed showcase of high-end equipment:
  - *Cameras & Bodies* (Sony FX6, RED V-Raptor 8K, Sony FX3)
  - *Optics & Lenses* (Cooke Anamorphics, Sony GM Trinity, Laowa Macro Probe)
  - *Aerial & FPV* (DJI Inspire 3, 7-inch High-Speed FPV, Avata 2 Cinewhoop)
  - *Audio & Monitoring* (Sennheiser Shotgun & Ambisonic VR Mics, Tentacle Sync Timecodes)
  - *Grading Suite & Rigs* (DaVinci Resolve Mini Panel, Flanders Scientific Reference Monitor, Ronin RS3 Pro)
- **Awards & Honors**: Cannes Corporate Silver Dolphin, Vimeo Staff Picks, Sony Alpha Showcase.

### 4. **Services & Pricing (`services.html`)**
- **Tiered Packages**: Social & Creator Pack ($2,500), Commercial Master ($5,500), Global Enterprise & Doc ($12,000+).
- **Interactive Project Cost Estimator**:
  - Step 1: Select Format (Commercial, YouTube, Music Video, Social Pack, Doc)
  - Step 2: Select Deliverable Runtime (< 60s, 1-3m, 3-7m, 7-15m+)
  - Step 3: Select Camera Package (Solo FX6, Dual Multicam, RED 8K Full Crew)
  - Step 4: Toggle Production Add-ons (4K FPV Drone, Dolby Atmos Sound Mix, 48h Rush Delivery, Scriptwriting Treatment)
  - **Live Dynamic Quote**: Updates grand total and estimated delivery days in real-time.
  - **"Lock Quote & Inquire"**: Saves your custom estimate and auto-populates it into the booking inquiry on `contact.html`!
- **FAQ Accordion**: Interactive answers on travel, commercial usage rights, and payment terms.

### 5. **Digital Store (`shop.html`)**
- **Interactive Before / After Color Grading Slider**: Draggable split divider comparing raw Sony S-Log3 Log footage against the finished Cinematic Master LUT.
- **Digital Products**: Master LUT Pack Vol. 1, 16mm/35mm DaVinci Film PowerGrades, 450+ Cinematic Sound FX, Tokyo Neon LUTs, Lightroom Presets, and Complete Suite.
- **Interactive Shopping Cart Drawer**: Slide-out drawer with quantity modifiers, remove item, subtotal calculator, and instant checkout demo.

### 6. **Contact & Booking Wizard (`contact.html`)**
- **Imported Quote Detection**: Automatically imports and displays saved estimates from the cost calculator.
- **Interactive Chips**: Budget range selection ($5K - $10K, $10K - $25K, etc.) and format chips.
- **Client-Side Validation & Confirmation**: Live error feedback, submit loading animation, inquiry persistence in `localStorage`, and an animated booking confirmation modal.

---

## 💻 Tech Stack & Architecture

- **HTML5**: Multi-page semantic architecture with accessible labels, meta tags, and OpenGraph descriptors.
- **CSS3**:
  - `css/style.css`: Core design system, CSS custom properties (variables), reset, typography, and dark/light themes.
  - `css/components.css`: Standalone reusable UI components (modal player, split slider, cart drawer, calculator cards).
  - `css/responsive.css`: Breakpoints for desktop, tablet, phablet, and mobile (320px to 1440px+).
- **Modular JavaScript**:
  - `js/main.js`: Dark/Light mode theme switch with `localStorage`, sticky header, mobile drawer menu, back-to-top, toast notifications.
  - `js/portfolio.js`: Project archives dataset, search and category filters, simulated 4K canvas video player.
  - `js/calculator.js`: Real-time pricing formula and estimate transfer logic.
  - `js/shop.js`: Before/after split slider touch/mouse drag handlers and shopping cart drawer state.
  - `js/contact.js`: Form validation, estimate prefill, and booking confirmation modal.

---

## 🚀 How to Run the Website

No build tools or installation steps are required!

1. **Directly in Browser**:
   Double click `index.html` to open it in your browser (Google Chrome, Microsoft Edge, Firefox, Safari).

2. **Local Development Server (Optional)**:
   If you have VS Code, right-click `index.html` and click **Open with Live Server**.
   Alternatively, open PowerShell in this directory and run:
   ```powershell
   # Using Python (if installed)
   python -m http.server 8000
   
   # Or using Node (if installed)
   npx serve .
   ```
