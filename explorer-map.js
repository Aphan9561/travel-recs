// ============================================================
// Explorer Map — Hybrid Adventure/RPG Travel Map
// ============================================================

// --- Destination Data ---
const destinations = {
  kyoto: {
    name: 'Kyoto',
    region: 'Kansai, Japan',
    letter: 'K',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    desc: 'Ancient capital of a thousand temples, where bamboo groves whisper and geisha still glide through lantern-lit alleys. A place where every season paints its own masterpiece.',
    culture: 95,
    adventure: 45,
    relaxation: 75,
    statColors: { culture: '#ff6b6b', adventure: '#ff6b6b', relaxation: '#ff6b6b' }
  },
  santorini: {
    name: 'Santorini',
    region: 'Cyclades, Greece',
    letter: 'S',
    color: '#4ecdc4',
    gradient: 'linear-gradient(135deg, #4ecdc4, #0abde3)',
    desc: 'A crescent of volcanic cliffs crowned with whitewashed villages, where the Aegean stretches endlessly and sunsets over the caldera have moved poets to silence.',
    culture: 70,
    adventure: 50,
    relaxation: 90,
    statColors: { culture: '#4ecdc4', adventure: '#4ecdc4', relaxation: '#4ecdc4' }
  },
  patagonia: {
    name: 'Patagonia',
    region: 'Argentina & Chile',
    letter: 'P',
    color: '#55efc4',
    gradient: 'linear-gradient(135deg, #55efc4, #00b894)',
    desc: 'The uttermost end of the earth, where glaciers calve into turquoise lakes, granite spires pierce the clouds, and the wind carries the wild spirit of untamed lands.',
    culture: 30,
    adventure: 98,
    relaxation: 60,
    statColors: { culture: '#55efc4', adventure: '#55efc4', relaxation: '#55efc4' }
  },
  marrakech: {
    name: 'Marrakech',
    region: 'Marrakech-Safi, Morocco',
    letter: 'M',
    color: '#ffe66d',
    gradient: 'linear-gradient(135deg, #ffe66d, #f9ca24)',
    desc: 'The Red City, where labyrinthine souks overflow with spice and silk, where riads hide courtyards of impossible beauty, and the call to prayer drifts over terracotta rooftops.',
    culture: 90,
    adventure: 70,
    relaxation: 55,
    statColors: { culture: '#ffe66d', adventure: '#ffe66d', relaxation: '#ffe66d' }
  },
  reykjavik: {
    name: 'Reykjavik',
    region: 'Capital Region, Iceland',
    letter: 'R',
    color: '#a29bfe',
    gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    desc: 'Gateway to fire and ice, where geothermal springs steam beneath the aurora borealis, black sand beaches meet roaring waves, and the midnight sun defies the clock.',
    culture: 55,
    adventure: 90,
    relaxation: 70,
    statColors: { culture: '#a29bfe', adventure: '#a29bfe', relaxation: '#a29bfe' }
  },
  amalfi: {
    name: 'Amalfi Coast',
    region: 'Campania, Italy',
    letter: 'A',
    color: '#ff9f43',
    gradient: 'linear-gradient(135deg, #ff9f43, #e17055)',
    desc: 'A ribbon of pastel villages clinging to dramatic sea cliffs, where lemon groves perfume the salt air, and every winding road reveals another view that stops the heart.',
    culture: 75,
    adventure: 55,
    relaxation: 85,
    statColors: { culture: '#ff9f43', adventure: '#ff9f43', relaxation: '#ff9f43' }
  },
  prague: {
    name: 'Prague',
    region: 'Bohemia, Czech Republic',
    letter: 'P',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    desc: 'A fairy-tale city of Gothic spires and Baroque palaces, where cobblestone lanes wind past astronomical clocks, and the Vltava River reflects centuries of art, music, and revolution.',
    culture: 85,
    adventure: 55,
    relaxation: 70,
    statColors: { culture: '#f59e0b', adventure: '#f59e0b', relaxation: '#f59e0b' }
  },
  machupicchu: {
    name: 'Machu Picchu',
    region: 'Cusco, Peru',
    letter: 'M',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    desc: 'The lost citadel of the Inca, perched among the clouds on a razor-thin ridge, where ancient stone terraces cascade into mist and the silence holds the memory of an empire.',
    culture: 80,
    adventure: 95,
    relaxation: 40,
    statColors: { culture: '#059669', adventure: '#059669', relaxation: '#059669' }
  }
};

// --- Rank Progression ---
const ranks = [
  { min: 0, name: 'Novice Explorer', color: '#a0b4c8' },
  { min: 2, name: 'Seasoned Traveler', color: '#4ecdc4' },
  { min: 4, name: 'Expert Voyager', color: '#a29bfe' },
  { min: 6, name: 'Master Voyager', color: '#f59e0b' },
  { min: 8, name: 'Explorer Master', color: '#ffe66d' }
];

// --- DOM Elements ---
const infoCard = document.getElementById('info-card');
const infoClose = document.getElementById('info-close');
const infoPhoto = document.getElementById('info-photo');
const infoRegionBadge = document.getElementById('info-region-badge');
const infoName = document.getElementById('info-name');
const infoDesc = document.getElementById('info-desc');
const statCulture = document.getElementById('stat-culture');
const statAdventure = document.getElementById('stat-adventure');
const statRelaxation = document.getElementById('stat-relaxation');
const collectBtn = document.getElementById('collect-btn');
const collectBtnText = document.getElementById('collect-btn-text');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const profileRank = document.getElementById('profile-rank');
const passportGrid = document.getElementById('passport-grid');
const passportAchievement = document.getElementById('passport-achievement');
const toastContainer = document.getElementById('toast-container');
const stampOverlay = document.getElementById('stamp-overlay');
const stampAnimation = document.getElementById('stamp-animation');
const stampDestName = document.getElementById('stamp-dest-name');
const pins = document.querySelectorAll('.pin');
const routePaths = document.getElementById('route-paths');
const mapViewport = document.getElementById('map-viewport');
const worldMap = document.getElementById('world-map');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomResetBtn = document.getElementById('zoom-reset');
const toggleRoutesBtn = document.getElementById('toggle-routes');

// --- State ---
let currentZoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let panStartX = 0;
let panStartY = 0;
let routesVisible = true;
let activeDestination = null;
let collectedStamps = {};
const destKeys = Object.keys(destinations);

// ============================================================
// PASSPORT GRID — Build cards
// ============================================================
function buildPassport() {
  passportGrid.innerHTML = '';
  destKeys.forEach(function(key) {
    var dest = destinations[key];
    var isCollected = collectedStamps[key];
    var card = document.createElement('div');
    card.className = 'passport-card ' + (isCollected ? 'collected' : 'uncollected');
    card.dataset.dest = key;
    card.innerHTML =
      '<div class="passport-stamp-icon" style="background: ' + dest.color + '">' +
        dest.letter +
        '<span class="passport-stamp-check">' +
          '<svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span>' +
      '</div>' +
      '<div class="passport-dest-name">' + dest.name + '</div>' +
      '<div class="passport-dest-region">' + dest.region + '</div>';
    card.addEventListener('click', function() {
      showDestination(key);
    });
    passportGrid.appendChild(card);
  });
}

// ============================================================
// PROGRESS — Update header bar, rank, passport
// ============================================================
function updateProgress() {
  var count = Object.keys(collectedStamps).length;
  var pct = (count / 8) * 100;

  progressFill.style.width = pct + '%';
  progressLabel.textContent = count + ' / 8 stamps';

  // Update rank
  var currentRank = ranks[0];
  for (var i = ranks.length - 1; i >= 0; i--) {
    if (count >= ranks[i].min) {
      currentRank = ranks[i];
      break;
    }
  }
  profileRank.textContent = currentRank.name;
  profileRank.style.color = currentRank.color;

  // Rebuild passport cards
  buildPassport();

  // Highlight active passport card
  if (activeDestination) {
    var cards = passportGrid.querySelectorAll('.passport-card');
    cards.forEach(function(card) {
      card.classList.remove('active');
      if (card.dataset.dest === activeDestination) {
        card.classList.add('active');
      }
    });
  }

  // Update pin checkmarks
  pins.forEach(function(pin) {
    var key = pin.dataset.dest;
    if (collectedStamps[key] && !pin.classList.contains('collected')) {
      pin.classList.add('collected');
      // Add checkmark to SVG pin
      var existingCheck = pin.querySelector('.pin-check');
      if (!existingCheck) {
        var checkText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        checkText.setAttribute('class', 'pin-check');
        checkText.setAttribute('x', '0');
        checkText.setAttribute('y', '4');
        checkText.setAttribute('text-anchor', 'middle');
        checkText.setAttribute('font-family', "'Poppins', sans-serif");
        checkText.setAttribute('font-size', '10');
        checkText.setAttribute('font-weight', '800');
        checkText.setAttribute('fill', '#fff');
        checkText.textContent = '\u2713';
        // Replace the letter
        var letter = pin.querySelector('.pin-letter');
        if (letter) letter.style.display = 'none';
        pin.appendChild(checkText);
      }
    }
  });

  // Explorer Master achievement
  if (count >= 8) {
    passportAchievement.classList.add('unlocked');
  }
}

// ============================================================
// INFO CARD — Show / Hide
// ============================================================
function showDestination(destKey) {
  var dest = destinations[destKey];
  if (!dest) return;

  // Photo gradient
  infoPhoto.style.background = dest.gradient;

  // Content
  infoRegionBadge.textContent = dest.region;
  infoName.textContent = dest.name;
  infoDesc.textContent = dest.desc;

  // Stat bars — animate in
  setTimeout(function() {
    statCulture.style.width = dest.culture + '%';
    statCulture.style.background = dest.statColors.culture;
    statAdventure.style.width = dest.adventure + '%';
    statAdventure.style.background = dest.statColors.adventure;
    statRelaxation.style.width = dest.relaxation + '%';
    statRelaxation.style.background = dest.statColors.relaxation;
  }, 100);

  // Collect button state
  if (collectedStamps[destKey]) {
    collectBtn.classList.add('collected');
    collectBtnText.textContent = 'Stamp Collected';
    collectBtn.disabled = true;
  } else {
    collectBtn.classList.remove('collected');
    collectBtnText.textContent = 'Collect Stamp';
    collectBtn.disabled = false;
  }

  // Show card
  infoCard.classList.add('visible');

  // Highlight active pin
  pins.forEach(function(pin) {
    pin.classList.remove('active');
    if (pin.dataset.dest === destKey) {
      pin.classList.add('active');
    }
  });

  // Highlight active passport card
  var cards = passportGrid.querySelectorAll('.passport-card');
  cards.forEach(function(card) {
    card.classList.remove('active');
    if (card.dataset.dest === destKey) {
      card.classList.add('active');
    }
  });

  activeDestination = destKey;
}

function hideDestination() {
  infoCard.classList.remove('visible');

  // Reset stat bars
  statCulture.style.width = '0%';
  statAdventure.style.width = '0%';
  statRelaxation.style.width = '0%';

  // Clear active states
  pins.forEach(function(pin) { pin.classList.remove('active'); });
  var cards = passportGrid.querySelectorAll('.passport-card');
  cards.forEach(function(card) { card.classList.remove('active'); });

  activeDestination = null;
}

// ============================================================
// STAMP COLLECTION
// ============================================================
function collectStamp(destKey) {
  if (!destKey || collectedStamps[destKey]) return;

  var dest = destinations[destKey];
  collectedStamps[destKey] = true;
  var count = Object.keys(collectedStamps).length;

  // 1. Stamp animation
  stampDestName.textContent = dest.name;
  stampAnimation.style.color = dest.color;
  stampOverlay.classList.add('active');

  setTimeout(function() {
    stampOverlay.classList.remove('active');
    stampOverlay.classList.add('fade-out');
    setTimeout(function() {
      stampOverlay.classList.remove('fade-out');
    }, 300);
  }, 800);

  // 2. Update everything
  updateProgress();

  // 3. Update current info card button
  collectBtn.classList.add('collected');
  collectBtnText.textContent = 'Stamp Collected';
  collectBtn.disabled = true;

  // 4. Toast notification
  showToast(
    dest.color,
    dest.letter,
    'Stamp Collected!',
    dest.name + ' — ' + count + '/8 stamps'
  );

  // 5. Achievement toast if all collected
  if (count === 8) {
    setTimeout(function() {
      showToast(
        '#ffe66d',
        '\u2605',
        'Achievement Unlocked!',
        'Explorer Master — All stamps collected'
      );
    }, 1200);
  }
}

// ============================================================
// TOAST SYSTEM
// ============================================================
function showToast(color, icon, title, message) {
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML =
    '<div class="toast-icon" style="background: ' + color + '22; color: ' + color + '">' + icon + '</div>' +
    '<div class="toast-content">' +
      '<div class="toast-title">' + title + '</div>' +
      '<div class="toast-message">' + message + '</div>' +
    '</div>';
  toastContainer.appendChild(toast);

  // Trigger slide-in
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });
  });

  // Remove after delay
  setTimeout(function() {
    toast.classList.remove('visible');
    toast.classList.add('removing');
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 3000);
}

// ============================================================
// PIN CLICK HANDLERS
// ============================================================
pins.forEach(function(pin) {
  pin.addEventListener('click', function(e) {
    e.stopPropagation();
    var dest = pin.dataset.dest;
    if (activeDestination === dest) {
      hideDestination();
    } else {
      showDestination(dest);
    }
  });
});

// Close button
infoClose.addEventListener('click', hideDestination);

// Collect button
collectBtn.addEventListener('click', function() {
  if (activeDestination && !collectedStamps[activeDestination]) {
    collectStamp(activeDestination);
  }
});

// ============================================================
// ZOOM
// ============================================================
function applyTransform() {
  worldMap.style.transform =
    'translate(' + panX + 'px, ' + panY + 'px) scale(' + currentZoom + ')';
}

zoomInBtn.addEventListener('click', function() {
  if (currentZoom < 4) {
    currentZoom = Math.min(4, currentZoom + 0.5);
    applyTransform();
  }
});

zoomOutBtn.addEventListener('click', function() {
  if (currentZoom > 1) {
    currentZoom = Math.max(1, currentZoom - 0.5);
    if (currentZoom === 1) { panX = 0; panY = 0; }
    applyTransform();
  }
});

zoomResetBtn.addEventListener('click', function() {
  currentZoom = 1;
  panX = 0;
  panY = 0;
  applyTransform();
});

// Mouse wheel zoom
mapViewport.addEventListener('wheel', function(e) {
  e.preventDefault();
  var delta = e.deltaY > 0 ? -0.25 : 0.25;
  var newZoom = Math.max(1, Math.min(4, currentZoom + delta));
  if (newZoom === 1) { panX = 0; panY = 0; }
  currentZoom = newZoom;
  applyTransform();
}, { passive: false });

// ============================================================
// PAN (DRAG)
// ============================================================
mapViewport.addEventListener('mousedown', function(e) {
  if (currentZoom <= 1) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  panStartX = panX;
  panStartY = panY;
  mapViewport.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  panX = panStartX + (e.clientX - dragStartX);
  panY = panStartY + (e.clientY - dragStartY);
  applyTransform();
});

window.addEventListener('mouseup', function() {
  if (isDragging) {
    isDragging = false;
    mapViewport.style.cursor = currentZoom > 1 ? 'grab' : 'default';
  }
});

// Touch support
mapViewport.addEventListener('touchstart', function(e) {
  if (currentZoom <= 1 || e.touches.length !== 1) return;
  isDragging = true;
  dragStartX = e.touches[0].clientX;
  dragStartY = e.touches[0].clientY;
  panStartX = panX;
  panStartY = panY;
}, { passive: true });

mapViewport.addEventListener('touchmove', function(e) {
  if (!isDragging || e.touches.length !== 1) return;
  panX = panStartX + (e.touches[0].clientX - dragStartX);
  panY = panStartY + (e.touches[0].clientY - dragStartY);
  applyTransform();
}, { passive: true });

mapViewport.addEventListener('touchend', function() {
  isDragging = false;
});

// ============================================================
// TOGGLE ROUTES
// ============================================================
toggleRoutesBtn.addEventListener('click', function() {
  routesVisible = !routesVisible;
  if (routesVisible) {
    routePaths.classList.remove('hidden');
    toggleRoutesBtn.classList.remove('active');
  } else {
    routePaths.classList.add('hidden');
    toggleRoutesBtn.classList.add('active');
  }
});

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================
document.addEventListener('keydown', function(e) {
  // Escape — close info card
  if (e.key === 'Escape') {
    hideDestination();
    return;
  }

  // Enter — collect stamp for active destination
  if (e.key === 'Enter' && activeDestination && !collectedStamps[activeDestination]) {
    collectStamp(activeDestination);
    return;
  }

  // Arrow keys — cycle destinations
  if (activeDestination && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    showDestination(destKeys[(idx + 1) % destKeys.length]);
  }

  if (activeDestination && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    showDestination(destKeys[(idx - 1 + destKeys.length) % destKeys.length]);
  }

  // Number keys 1-8
  var num = parseInt(e.key);
  if (num >= 1 && num <= 8) {
    showDestination(destKeys[num - 1]);
  }

  // R — toggle routes
  if (e.key === 'r' || e.key === 'R') {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    toggleRoutesBtn.click();
  }

  // + / = — zoom in
  if (e.key === '+' || e.key === '=') {
    zoomInBtn.click();
  }

  // - — zoom out
  if (e.key === '-') {
    zoomOutBtn.click();
  }

  // 0 — reset zoom
  if (e.key === '0') {
    zoomResetBtn.click();
  }
});

// ============================================================
// CLICK OUTSIDE TO CLOSE
// ============================================================
document.addEventListener('click', function(e) {
  if (activeDestination &&
      !e.target.closest('.info-card') &&
      !e.target.closest('.pin') &&
      !e.target.closest('.passport-card')) {
    hideDestination();
  }
});

// ============================================================
// INIT
// ============================================================
buildPassport();
updateProgress();
