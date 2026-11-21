/**
 * CINEMATIC GANYA | CREATOR PORTFOLIO
 * Portfolio JavaScript: Project Filtering, Live Search, Interactive Video Modal Player
 */

// Portfolio Projects Database
const portfolioProjects = [
  {
    id: 'project-1',
    title: 'RED BULL | Beyond the Horizon',
    category: 'commercial',
    categoryName: 'Commercial',
    client: 'Red Bull Extreme Sports',
    duration: '02:45',
    views: '2.4M',
    year: '2026',
    role: 'Director of Photography & Lead Colorist',
    gear: 'Sony FX6 + Cooke Anamorphic / DJI Inspire 3',
    desc: 'High-octane commercial film capturing extreme wingsuit proximity flights across the Swiss Alps. Shot entirely in 4K RAW with custom high-speed drone chasing.',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#ff5722'
  },
  {
    id: 'project-2',
    title: 'Echoes of the Arctic | The Vanishing Ice',
    category: 'documentary',
    categoryName: 'Documentary',
    client: 'National Geographic Wild',
    duration: '08:12',
    views: '1.8M',
    year: '2026',
    role: 'Director & Cinematographer',
    gear: 'RED V-Raptor 8K VV + Zeiss Supreme Primes',
    desc: 'An expedition documentary into Svalbard examining the vanishing glaciers and resilient Arctic wildlife under midnight sun illumination.',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#00d2ff'
  },
  {
    id: 'project-3',
    title: 'Midnight Neon: The Weeknd Visualizer',
    category: 'music',
    categoryName: 'Music Video',
    client: 'Republic Records',
    duration: '03:38',
    views: '5.1M',
    year: '2025',
    role: 'Director & Visual FX Supervisor',
    gear: 'ARRI Alexa Mini LF + Atlas Orion Anamorphics',
    desc: 'Cyberpunk-inspired nocturnal music video set in Neo-Tokyo with reflective wet streets, practical neon lighting, and synchronized synthwave color pulses.',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#ec4899'
  },
  {
    id: 'project-4',
    title: 'SONY Alpha 7S IV Launch Film: Light the Void',
    category: 'commercial',
    categoryName: 'Commercial',
    client: 'Sony Imaging Global',
    duration: '01:50',
    views: '3.6M',
    year: '2025',
    role: 'Creator & Global Ambassador',
    gear: 'Sony A7S IV + G-Master 24-70mm f/2.8 GM II',
    desc: 'Official launch campaign showcasing low-light capabilities in astrophotography, bioluminescent caves, and high dynamic range night cityscapes.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#6366f1'
  },
  {
    id: 'project-5',
    title: 'Kyoto: In Search of Serenity',
    category: 'travel',
    categoryName: 'Travel & Nature',
    client: 'Japan Tourism Board',
    duration: '04:15',
    views: '1.2M',
    year: '2025',
    role: 'Solo Filmmaker & Sound Designer',
    gear: 'Sony FX3 + Sony 35mm f/1.4 GM / Ronin RS3 Pro',
    desc: 'A poetic cinematic study of ancient Zen temples, misty bamboo groves of Arashiyama, and traditional master craftsmen in Kyoto.',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#10b981'
  },
  {
    id: 'project-6',
    title: 'Speed of Sound: Porsche 911 GT3 RS',
    category: 'commercial',
    categoryName: 'Commercial',
    client: 'Porsche Motorsport',
    duration: '02:10',
    views: '4.8M',
    year: '2026',
    role: 'Cinematographer & Sound Recordist',
    gear: 'RED Komodo 6K + Chase Car Rig / Ambisonic Audio',
    desc: 'Pure visceral sensory assault capturing the naturally aspirated flat-six at 9,000 RPM through high-speed tracking curves on the Nürburgring Nordschleife.',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#f59e0b'
  },
  {
    id: 'project-7',
    title: 'The Art of Coffee | Micro-Documentary',
    category: 'shorts',
    categoryName: 'Short Form & Reels',
    client: 'Blue Bottle Coffee Co.',
    duration: '00:58',
    views: '8.4M',
    year: '2026',
    role: 'Creator & Macro Cinematographer',
    gear: 'Laowa 24mm f/14 Probe Lens + High Speed 240fps',
    desc: 'Ultra-macro 240fps vertical visual story tracing single-origin beans from precision roast to espresso extraction. 8.4M viral views on Instagram & YouTube Shorts.',
    thumbnail: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#8b5cf6'
  },
  {
    id: 'project-8',
    title: 'Chasing the Solstice | Icelandic Glaciers',
    category: 'travel',
    categoryName: 'Travel & Nature',
    client: 'Visit Iceland & DJI',
    duration: '03:40',
    views: '1.9M',
    year: '2025',
    role: 'Cinematographer & FPV Pilot',
    gear: 'Custom 7-inch FPV Drone + GoPro HERO 13 Black Bones',
    desc: 'Cinematic FPV one-take dives down sheer glacial crevasses and volcanic black sand beaches during Iceland’s endless summer twilight.',
    thumbnail: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    colorTheme: '#38bdf8'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioGrid();
  initFilters();
  initSearch();
  initVideoModal();
});

/* ==========================================================================
   Render Portfolio Grid
   ========================================================================== */
function initPortfolioGrid(filter = 'all', searchQuery = '') {
  const grid = document.getElementById('portfolio-grid-container');
  if (!grid) return;

  let filtered = portfolioProjects;

  if (filter !== 'all') {
    filtered = filtered.filter(p => p.category === filter);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.client.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.gear.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i class="ri-film-line" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-subtle);"></i>
        <h3>No projects found</h3>
        <p>Try searching for a different keyword or selecting another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="work-card" data-id="${item.id}" onclick="openProjectModal('${item.id}')">
      <div class="work-media-wrap">
        <img src="${item.thumbnail}" alt="${item.title}" class="work-thumbnail" loading="lazy">
        <span class="work-category-badge">${item.categoryName}</span>
        <span class="work-duration-badge"><i class="ri-time-line"></i> ${item.duration}</span>
        <div class="work-play-hover">
          <div class="play-mini-btn">
            <i class="ri-play-fill"></i>
          </div>
        </div>
      </div>
      <div class="work-details">
        <div>
          <div class="work-client-tag">${item.client}</div>
          <h3 class="work-title">${item.title}</h3>
          <p class="work-desc">${item.desc}</p>
        </div>
        <div class="work-meta-row">
          <div class="work-stats">
            <i class="ri-eye-line"></i> ${item.views} Views
          </div>
          <div class="work-stats">
            <i class="ri-calendar-line"></i> ${item.year}
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   Category Filter Tabs
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');
      const searchInput = document.getElementById('portfolio-search-input');
      const query = searchInput ? searchInput.value : '';

      initPortfolioGrid(filterCategory, query);
    });
  });
}

/* ==========================================================================
   Live Search
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('portfolio-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const activeFilterBtn = document.querySelector('.portfolio-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    initPortfolioGrid(filter, e.target.value);
  });
}

/* ==========================================================================
   Interactive Video Modal Player Simulation
   ========================================================================== */
let isPlaying = false;
let currentProgress = 0;
let playbackInterval = null;
let simulatedCanvas = null;
let animationFrameId = null;

function initVideoModal() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const playBtn = modal.querySelector('#player-play-btn');
  const bigPlayBtn = modal.querySelector('#big-center-play');
  const scrubberTrack = modal.querySelector('.scrubber-track');
  const muteBtn = modal.querySelector('#player-mute-btn');
  const fullscreenBtn = modal.querySelector('#player-fullscreen-btn');

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeVideoModal();
    }
    if (e.key === ' ' && modal.classList.contains('active')) {
      e.preventDefault();
      togglePlayback();
    }
  });

  // Play / Pause toggles
  if (playBtn) playBtn.addEventListener('click', togglePlayback);
  if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlayback);

  // Scrubber scrubbing
  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      currentProgress = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
      updateScrubberUI(currentProgress);
    });
  }

  // Mute toggle
  if (muteBtn) {
    let isMuted = false;
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      const icon = muteBtn.querySelector('i');
      if (icon) {
        icon.className = isMuted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill';
      }
      showToast('Audio', isMuted ? 'Muted' : 'Unmuted (Stereo Master)', 'info');
    });
  }

  // Fullscreen toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const player = document.querySelector('.player-container');
      if (!player) return;
      if (!document.fullscreenElement) {
        player.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }
}

function openProjectModal(projectId) {
  const project = portfolioProjects.find(p => p.id === projectId) || portfolioProjects[0];
  const modal = document.getElementById('video-modal');
  if (!modal) return;

  // Populate metadata
  const titleEl = modal.querySelector('#modal-project-title');
  const descEl = modal.querySelector('#modal-project-desc');
  const clientEl = modal.querySelector('#modal-project-client');
  const gearEl = modal.querySelector('#modal-project-gear');
  const roleEl = modal.querySelector('#modal-project-role');
  const durationEl = modal.querySelector('#modal-total-time');

  if (titleEl) titleEl.textContent = project.title;
  if (descEl) descEl.textContent = project.desc;
  if (clientEl) clientEl.textContent = project.client;
  if (gearEl) gearEl.textContent = project.gear;
  if (roleEl) roleEl.textContent = project.role;
  if (durationEl) durationEl.textContent = project.duration;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Start animated visual simulation
  startVideoSimulation(project);
}
window.openProjectModal = openProjectModal;

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';

  stopPlayback();
  stopVideoSimulation();
}

function togglePlayback() {
  if (isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  isPlaying = true;
  const bigPlayBtn = document.getElementById('big-center-play');
  const playBtnIcon = document.querySelector('#player-play-btn i');

  if (bigPlayBtn) bigPlayBtn.classList.add('playing');
  if (playBtnIcon) playBtnIcon.className = 'ri-pause-fill';

  clearInterval(playbackInterval);
  playbackInterval = setInterval(() => {
    currentProgress += 0.5;
    if (currentProgress >= 100) {
      currentProgress = 0;
      stopPlayback();
    }
    updateScrubberUI(currentProgress);
  }, 200);
}

function stopPlayback() {
  isPlaying = false;
  const bigPlayBtn = document.getElementById('big-center-play');
  const playBtnIcon = document.querySelector('#player-play-btn i');

  if (bigPlayBtn) bigPlayBtn.classList.remove('playing');
  if (playBtnIcon) playBtnIcon.className = 'ri-play-fill';

  clearInterval(playbackInterval);
}

function updateScrubberUI(percent) {
  const fill = document.getElementById('player-scrubber-fill');
  const timeCurrent = document.getElementById('modal-current-time');

  if (fill) fill.style.width = `${percent}%`;

  if (timeCurrent) {
    const totalSecs = 165; // ~2:45
    const curSecs = Math.floor((percent / 100) * totalSecs);
    const mins = Math.floor(curSecs / 60);
    const secs = curSecs % 60;
    timeCurrent.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

/* ==========================================================================
   Simulated Canvas Film Visualizer
   ========================================================================== */
function startVideoSimulation(project) {
  const canvas = document.getElementById('video-simulation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  let frame = 0;
  const img = new Image();
  img.src = project.thumbnail;

  function render() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background thumbnail with subtle zoom pulse
    if (img.complete) {
      const zoom = isPlaying ? 1 + Math.sin(frame * 0.02) * 0.04 : 1;
      const w = canvas.width * zoom;
      const h = canvas.height * zoom;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = '#11141c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Cinematic vignette & color grading overlay
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 100,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.4
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Watermark / Cinema aspect markers
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillRect(0, canvas.height - 36, canvas.width, 36);

    // Dynamic wave / particle effect if playing
    if (isPlaying) {
      ctx.strokeStyle = project.colorTheme || '#ff5722';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 8) {
        const wave = Math.sin((i * 0.02) + (frame * 0.08)) * 14 * Math.sin(frame * 0.03);
        const yPos = canvas.height - 50 + wave;
        if (i === 0) ctx.moveTo(i, yPos);
        else ctx.lineTo(i, yPos);
      }
      ctx.stroke();

      // Film Grain Effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let g = 0; g < 400; g++) {
        const gx = Math.random() * canvas.width;
        const gy = Math.random() * canvas.height;
        ctx.fillRect(gx, gy, 2, 2);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

function stopVideoSimulation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}
