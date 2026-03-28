// ============================================================
// Adventure Map — Bright & Playful + Gamified Hybrid
// ============================================================

// ============================================================
// Destination Data
// ============================================================

var destinations = {
  kyoto: {
    name: 'Kyoto, Japan',
    region: 'Asia',
    emoji: '\uD83C\uDF38',        // cherry blossom
    rarity: 'legendary',
    desc: 'Walk through ancient torii gates and discover a thousand temples in a city where every season is a masterpiece. Sip matcha in bamboo groves!',
    funStars: 4,
    budgetCoins: 3,
    adventurePercent: 70,
    xpReward: 500,
    coinReward: 120,
    achievement: 'Zen Explorer'
  },
  santorini: {
    name: 'Santorini, Greece',
    region: 'Europe',
    emoji: '\u26F1\uFE0F',        // beach umbrella
    rarity: 'epic',
    desc: 'Chase the world\'s most magical sunset from whitewashed cliffs above the sparkling Aegean Sea. Pure island bliss!',
    funStars: 5,
    budgetCoins: 4,
    adventurePercent: 50,
    xpReward: 400,
    coinReward: 100,
    achievement: 'Island Hopper'
  },
  patagonia: {
    name: 'Patagonia, Argentina',
    region: 'South America',
    emoji: '\u26F0\uFE0F',        // mountain
    rarity: 'legendary',
    desc: 'Brave the winds at the edge of the world! Trek past glaciers, spot condors, and feel truly wild and free.',
    funStars: 5,
    budgetCoins: 3,
    adventurePercent: 100,
    xpReward: 650,
    coinReward: 150,
    achievement: 'Trailblazer'
  },
  marrakech: {
    name: 'Marrakech, Morocco',
    region: 'Africa',
    emoji: '\u2B50',               // star
    rarity: 'rare',
    desc: 'Get lost in colorful souks bursting with spices, fabrics, and treasures. Every alley hides a surprise!',
    funStars: 4,
    budgetCoins: 2,
    adventurePercent: 80,
    xpReward: 350,
    coinReward: 80,
    achievement: 'Souk Navigator'
  },
  reykjavik: {
    name: 'Reykjavik, Iceland',
    region: 'Europe',
    emoji: '\u2744\uFE0F',        // snowflake
    rarity: 'epic',
    desc: 'Chase the Northern Lights, soak in hot springs, and explore a land of volcanoes, glaciers, and midnight sun!',
    funStars: 5,
    budgetCoins: 4,
    adventurePercent: 95,
    xpReward: 550,
    coinReward: 130,
    achievement: 'Aurora Chaser'
  },
  amalfi: {
    name: 'Amalfi Coast, Italy',
    region: 'Europe',
    emoji: '\uD83C\uDF4B',        // lemon
    rarity: 'rare',
    desc: 'Cruise the dreamiest coastal road in the world! Pastel villages, lemon groves, and gelato at every turn.',
    funStars: 4,
    budgetCoins: 4,
    adventurePercent: 55,
    xpReward: 380,
    coinReward: 90,
    achievement: 'La Dolce Vita'
  }
};

// ============================================================
// Game State
// ============================================================

var gameState = {
  xp: 0,
  xpToLevel: 1000,
  level: 1,
  coins: 500,
  startedAdventures: {}
};

// ============================================================
// DOM Elements
// ============================================================

var infoCard = document.getElementById('info-card');
var infoClose = document.getElementById('info-close');
var infoRarity = document.getElementById('info-rarity');
var infoEmoji = document.getElementById('info-emoji');
var infoName = document.getElementById('info-name');
var infoRegion = document.getElementById('info-region');
var infoDesc = document.getElementById('info-desc');
var statFun = document.getElementById('stat-fun');
var statBudget = document.getElementById('stat-budget');
var statAdventure = document.getElementById('stat-adventure');
var infoXp = document.getElementById('info-xp');
var infoCoins = document.getElementById('info-coins');
var startBtn = document.getElementById('start-adventure-btn');
var achievementBanner = document.getElementById('achievement-banner');
var achievementTitle = document.getElementById('achievement-title');
var achievementDetail = document.getElementById('achievement-detail');
var xpBarFill = document.getElementById('xp-bar-fill');
var xpLabel = document.getElementById('xp-label');
var levelDisplay = document.getElementById('level-display');
var coinCount = document.getElementById('coin-count');
var pins = document.querySelectorAll('.pin');
var logCards = document.querySelectorAll('.log-card');
var routePaths = document.getElementById('route-paths');
var mapViewport = document.getElementById('map-viewport');
var worldMap = document.getElementById('world-map');
var zoomInBtn = document.getElementById('zoom-in');
var zoomOutBtn = document.getElementById('zoom-out');
var zoomResetBtn = document.getElementById('zoom-reset');
var toggleRoutesBtn = document.getElementById('toggle-routes');

// ============================================================
// Map State
// ============================================================

var currentZoom = 1;
var panX = 0;
var panY = 0;
var isDragging = false;
var dragStartX = 0;
var dragStartY = 0;
var panStartX = 0;
var panStartY = 0;
var routesVisible = true;
var activeDestination = null;
var achievementTimeout = null;

// ============================================================
// HUD Updates
// ============================================================

function updateHUD() {
  // XP bar
  var percent = Math.min((gameState.xp / gameState.xpToLevel) * 100, 100);
  xpBarFill.style.width = percent + '%';
  xpLabel.textContent = gameState.xp + ' / ' + gameState.xpToLevel + ' XP';
  levelDisplay.textContent = 'LVL ' + gameState.level;
  coinCount.textContent = gameState.coins.toLocaleString();
}

function addXP(amount) {
  gameState.xp += amount;

  // Level up check
  while (gameState.xp >= gameState.xpToLevel) {
    gameState.xp -= gameState.xpToLevel;
    gameState.level += 1;
    gameState.xpToLevel = Math.floor(gameState.xpToLevel * 1.3);
  }

  updateHUD();
}

function addCoins(amount) {
  gameState.coins += amount;
  updateHUD();
}

// ============================================================
// Star & Coin Rendering
// ============================================================

function renderStars(container, count) {
  var html = '';
  for (var i = 0; i < 5; i++) {
    if (i < count) {
      html += '<span>\u2B50</span>';
    } else {
      html += '<span class="star-empty">\u2B50</span>';
    }
  }
  container.innerHTML = html;
}

function renderCoins(container, count) {
  var html = '';
  for (var i = 0; i < 5; i++) {
    if (i < count) {
      html += '<span>\uD83E\uDE99</span>';
    } else {
      html += '<span class="coin-empty">\uD83E\uDE99</span>';
    }
  }
  container.innerHTML = html;
}

// ============================================================
// Info Card
// ============================================================

function showDestination(destKey) {
  var dest = destinations[destKey];
  if (!dest) return;

  // Set rarity class
  infoRarity.className = 'info-rarity ' + dest.rarity;
  infoRarity.textContent = dest.rarity.charAt(0).toUpperCase() + dest.rarity.slice(1);

  // Set content
  infoEmoji.textContent = dest.emoji;
  infoName.textContent = dest.name;
  infoRegion.textContent = dest.region;
  infoDesc.textContent = dest.desc;

  // Stats
  renderStars(statFun, dest.funStars);
  renderCoins(statBudget, dest.budgetCoins);
  statAdventure.style.width = dest.adventurePercent + '%';

  // XP & coins reward
  infoXp.textContent = dest.xpReward;
  infoCoins.textContent = dest.coinReward;

  // Button state
  if (gameState.startedAdventures[destKey]) {
    startBtn.classList.add('started');
    startBtn.querySelector('.btn-text').textContent = 'Adventure Started!';
    startBtn.querySelector('.btn-sparkle').textContent = '\u2728';
  } else {
    startBtn.classList.remove('started');
    startBtn.querySelector('.btn-text').textContent = 'Start Adventure!';
    startBtn.querySelector('.btn-sparkle').textContent = '\u2728';
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

  // Highlight active log card
  logCards.forEach(function(card) {
    card.classList.remove('active');
    if (card.dataset.dest === destKey) {
      card.classList.add('active');
    }
  });

  activeDestination = destKey;
}

function hideDestination() {
  infoCard.classList.remove('visible');
  pins.forEach(function(pin) { pin.classList.remove('active'); });
  logCards.forEach(function(card) { card.classList.remove('active'); });
  activeDestination = null;
}

// ============================================================
// Start Adventure
// ============================================================

function startAdventure() {
  if (!activeDestination) return;
  if (gameState.startedAdventures[activeDestination]) return;

  var dest = destinations[activeDestination];
  var destKey = activeDestination;

  // Mark as started
  gameState.startedAdventures[destKey] = true;

  // Add XP and coins
  addXP(dest.xpReward);
  addCoins(dest.coinReward);

  // Update button
  startBtn.classList.add('started');
  startBtn.querySelector('.btn-text').textContent = 'Adventure Started!';

  // Update pin appearance
  pins.forEach(function(pin) {
    if (pin.dataset.dest === destKey) {
      pin.classList.add('started');
    }
  });

  // Update log card
  logCards.forEach(function(card) {
    if (card.dataset.dest === destKey) {
      card.classList.add('started-card');
      var status = card.querySelector('.log-status');
      status.textContent = '\u2713 Started';
      status.setAttribute('data-status', 'started');
    }
  });

  // Show achievement banner
  showAchievement(
    'Adventure Started!',
    'Explore ' + dest.name.split(',')[0] + '! +' + dest.xpReward + ' XP'
  );
}

// ============================================================
// Achievement Banner
// ============================================================

function showAchievement(title, detail) {
  achievementTitle.textContent = title;
  achievementDetail.textContent = detail;
  achievementBanner.classList.add('show');

  // Clear any previous timeout
  if (achievementTimeout) {
    clearTimeout(achievementTimeout);
  }

  achievementTimeout = setTimeout(function() {
    achievementBanner.classList.remove('show');
    achievementTimeout = null;
  }, 3000);
}

// ============================================================
// Pin Click Handlers
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

// ============================================================
// Log Card Click Handlers
// ============================================================

logCards.forEach(function(card) {
  card.addEventListener('click', function() {
    var dest = card.dataset.dest;
    if (activeDestination === dest) {
      hideDestination();
    } else {
      showDestination(dest);
    }
  });
});

// ============================================================
// Close Button & Start Button
// ============================================================

infoClose.addEventListener('click', hideDestination);
startBtn.addEventListener('click', startAdventure);

// ============================================================
// Zoom
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
    if (currentZoom === 1) {
      panX = 0;
      panY = 0;
    }
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
  if (newZoom === 1) {
    panX = 0;
    panY = 0;
  }
  currentZoom = newZoom;
  applyTransform();
}, { passive: false });

// ============================================================
// Pan (drag)
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
  var dx = e.clientX - dragStartX;
  var dy = e.clientY - dragStartY;
  panX = panStartX + dx;
  panY = panStartY + dy;
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
  var dx = e.touches[0].clientX - dragStartX;
  var dy = e.touches[0].clientY - dragStartY;
  panX = panStartX + dx;
  panY = panStartY + dy;
  applyTransform();
}, { passive: true });

mapViewport.addEventListener('touchend', function() {
  isDragging = false;
});

// ============================================================
// Toggle Routes
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
// Keyboard Navigation
// ============================================================

var destKeys = Object.keys(destinations);

document.addEventListener('keydown', function(e) {
  // Escape closes info card
  if (e.key === 'Escape') {
    hideDestination();
    return;
  }

  // Enter starts adventure if card is open
  if (e.key === 'Enter' && activeDestination) {
    e.preventDefault();
    startAdventure();
    return;
  }

  // Arrow keys cycle through destinations
  if (activeDestination && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    var next = destKeys[(idx + 1) % destKeys.length];
    showDestination(next);
  }

  if (activeDestination && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    var prev = destKeys[(idx - 1 + destKeys.length) % destKeys.length];
    showDestination(prev);
  }

  // Number keys 1-6 select destinations
  var num = parseInt(e.key);
  if (num >= 1 && num <= 6) {
    showDestination(destKeys[num - 1]);
  }
});

// ============================================================
// Initialize HUD
// ============================================================

updateHUD();
