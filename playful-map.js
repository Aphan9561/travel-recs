// ============================================================
// Bright & Playful Interactive Map — Destination Data & Controls
// ============================================================

var destinations = {
  kyoto: {
    name: 'Kyoto',
    country: 'Japan',
    icon: '\uD83C\uDF51',
    desc: 'A magical city where ancient temples hide among bamboo forests, and every cherry blossom season feels like a fairy tale!',
    funFact: 'Kyoto has over 2,000 temples and shrines -- more than you could visit in a lifetime of adventures!',
    bestSeason: 'Spring (March-May) for cherry blossoms, Fall (Oct-Nov) for golden leaves',
    tags: ['Temples', 'Cherry Blossoms', 'Tea Gardens', 'Culture'],
    color: '#ff6b9d'
  },
  santorini: {
    name: 'Santorini',
    country: 'Greece',
    icon: '\uD83C\uDFD6\uFE0F',
    desc: 'Blue domes and white walls perched on volcanic cliffs, with the most jaw-dropping sunsets you have ever seen!',
    funFact: 'Santorini is actually what remains of an enormous volcanic explosion -- the whole island is a giant crater!',
    bestSeason: 'Summer (June-September) for perfect sunny beach days',
    tags: ['Sunsets', 'Blue Domes', 'Beaches', 'Wine'],
    color: '#60a5fa'
  },
  patagonia: {
    name: 'Patagonia',
    country: 'Argentina & Chile',
    icon: '\u26F0',
    desc: 'The wild end of the world! Glaciers, towering peaks, and endless windswept landscapes that make you feel tiny and alive.',
    funFact: 'The Perito Moreno Glacier is one of the few glaciers in the world that is still growing!',
    bestSeason: 'Summer (December-February) for hiking and longer days',
    tags: ['Glaciers', 'Hiking', 'Wildlife'],
    color: '#34d399'
  },
  marrakech: {
    name: 'Marrakech',
    country: 'Morocco',
    icon: '\u2605',
    desc: 'A riot of colors, spices, and sounds! Wander through bustling souks and discover hidden courtyards bursting with beauty.',
    funFact: 'The souks of Marrakech have over 40,000 individual shops and stalls -- shoppers paradise!',
    bestSeason: 'Spring (March-May) or Fall (Sept-Nov) for perfect warm weather',
    tags: ['Souks', 'Spices', 'Architecture'],
    color: '#f59e0b'
  },
  reykjavik: {
    name: 'Reykjavik',
    country: 'Iceland',
    icon: '\u2744',
    desc: 'Land of fire and ice! Chase the Northern Lights, soak in hot springs, and explore landscapes that look like another planet.',
    funFact: 'Iceland has no mosquitoes! It is one of the only places on Earth completely free of them.',
    bestSeason: 'Winter (Sept-March) for Northern Lights, Summer (June-Aug) for midnight sun',
    tags: ['Northern Lights', 'Hot Springs', 'Geysers'],
    color: '#a78bfa'
  },
  amalfi: {
    name: 'Amalfi Coast',
    country: 'Italy',
    icon: '\uD83C\uDF4B',
    desc: 'Pastel villages tumbling down sea cliffs, the scent of lemons in the air, and the most delicious pasta you will ever taste!',
    funFact: 'The lemons on the Amalfi Coast can grow as big as footballs -- they make the best limoncello!',
    bestSeason: 'Late Spring to Early Fall (May-October) for warm coastal bliss',
    tags: ['Coastal Views', 'Limoncello', 'Pasta', 'Villages'],
    color: '#fb923c'
  },
  prague: {
    name: 'Prague',
    country: 'Czech Republic',
    icon: '\uD83C\uDFF0',
    desc: 'A fairy-tale city of Gothic spires and Baroque palaces, where cobblestone lanes wind past astronomical clocks and ancient bridges!',
    funFact: 'Prague\'s Astronomical Clock has been ticking since 1410 -- it is one of the oldest working clocks in the world!',
    bestSeason: 'Spring (April-June) or Fall (Sept-Oct) for golden light and fewer crowds',
    tags: ['Architecture', 'History', 'Beer', 'Castles'],
    color: '#f59e0b'
  },
  machupicchu: {
    name: 'Machu Picchu',
    country: 'Peru',
    icon: '\u26F0',
    desc: 'The lost citadel of the Inca, perched among the clouds on a razor-thin ridge -- an ancient wonder that takes your breath away!',
    funFact: 'Machu Picchu was built without mortar -- the stones fit together so perfectly that you cannot slide a knife between them!',
    bestSeason: 'Dry season (May-September) for clear skies and epic mountain views',
    tags: ['Ruins', 'Trekking', 'History', 'Mountains'],
    color: '#059669'
  }
};

// ============================================================
// DOM Elements
// ============================================================

var infoCard = document.getElementById('info-card');
var infoClose = document.getElementById('info-close');
var infoIcon = document.getElementById('info-icon');
var infoName = document.getElementById('info-name');
var infoCountry = document.getElementById('info-country');
var infoDesc = document.getElementById('info-desc');
var infoFact = document.getElementById('info-fact');
var infoSeason = document.getElementById('info-season');
var infoTags = document.getElementById('info-tags');
var pins = document.querySelectorAll('.pin');
var pills = document.querySelectorAll('.pill');
var routePaths = document.getElementById('route-paths');
var mapViewport = document.getElementById('map-viewport');
var worldMap = document.getElementById('world-map');
var zoomInBtn = document.getElementById('zoom-in');
var zoomOutBtn = document.getElementById('zoom-out');
var zoomResetBtn = document.getElementById('zoom-reset');
var toggleRoutesBtn = document.getElementById('toggle-routes');

// ============================================================
// State
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
var destKeys = Object.keys(destinations);

// Tag colors for cycling
var tagColors = ['#ff6b9d', '#60a5fa', '#34d399', '#f59e0b', '#a78bfa', '#fb923c', '#14b8a6', '#f87171'];

// ============================================================
// Info Card
// ============================================================

function showDestination(destKey) {
  var dest = destinations[destKey];
  if (!dest) return;

  // Update card content
  infoIcon.textContent = dest.icon;
  infoName.textContent = dest.name;
  infoCountry.textContent = dest.country;
  infoDesc.textContent = dest.desc;
  infoFact.textContent = dest.funFact;
  infoSeason.textContent = dest.bestSeason;

  // Build colorful tags
  infoTags.innerHTML = '';
  dest.tags.forEach(function(tag, index) {
    var span = document.createElement('span');
    span.className = 'info-tag';
    span.textContent = tag;
    span.style.background = tagColors[index % tagColors.length];
    infoTags.appendChild(span);
  });

  // Color the info card border to match destination
  infoCard.style.borderColor = dest.color;

  // Show card
  infoCard.classList.add('visible');

  // Highlight active pin
  pins.forEach(function(pin) {
    pin.classList.remove('active');
    if (pin.dataset.dest === destKey) {
      pin.classList.add('active');
    }
  });

  // Highlight active pill
  pills.forEach(function(pill) {
    pill.classList.remove('active');
    if (pill.dataset.dest === destKey) {
      pill.classList.add('active');
    }
  });

  activeDestination = destKey;
}

function hideDestination() {
  infoCard.classList.remove('visible');
  pins.forEach(function(pin) { pin.classList.remove('active'); });
  pills.forEach(function(pill) { pill.classList.remove('active'); });
  activeDestination = null;
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

  // Keyboard support for pins
  pin.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      var dest = pin.dataset.dest;
      if (activeDestination === dest) {
        hideDestination();
      } else {
        showDestination(dest);
      }
    }
  });
});

// ============================================================
// Pill Click Handlers
// ============================================================

pills.forEach(function(pill) {
  pill.addEventListener('click', function() {
    var dest = pill.dataset.dest;
    if (activeDestination === dest) {
      hideDestination();
    } else {
      showDestination(dest);
    }
  });
});

// ============================================================
// Close Button
// ============================================================

infoClose.addEventListener('click', function(e) {
  e.stopPropagation();
  hideDestination();
});

// Click outside to close
document.addEventListener('click', function(e) {
  if (activeDestination && !infoCard.contains(e.target) && !e.target.closest('.pin') && !e.target.closest('.pill')) {
    hideDestination();
  }
});

// ============================================================
// Zoom Controls
// ============================================================

function applyTransform() {
  worldMap.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + currentZoom + ')';

  if (currentZoom > 1) {
    mapViewport.classList.add('zoomed');
  } else {
    mapViewport.classList.remove('zoomed');
  }
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
// Pan / Drag
// ============================================================

mapViewport.addEventListener('mousedown', function(e) {
  if (currentZoom <= 1) return;
  // Don't start drag on pins
  if (e.target.closest('.pin')) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  panStartX = panX;
  panStartY = panY;
  mapViewport.classList.add('dragging');
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
    mapViewport.classList.remove('dragging');
  }
});

// Touch support
mapViewport.addEventListener('touchstart', function(e) {
  if (currentZoom <= 1 || e.touches.length !== 1) return;
  if (e.target.closest('.pin')) return;
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
  mapViewport.classList.remove('dragging');
});

// ============================================================
// Toggle Routes
// ============================================================

toggleRoutesBtn.addEventListener('click', function() {
  routesVisible = !routesVisible;
  if (routesVisible) {
    routePaths.classList.remove('hidden');
    toggleRoutesBtn.classList.remove('routes-hidden');
  } else {
    routePaths.classList.add('hidden');
    toggleRoutesBtn.classList.add('routes-hidden');
  }
});

// ============================================================
// Keyboard Navigation
// ============================================================

document.addEventListener('keydown', function(e) {
  // Escape to close
  if (e.key === 'Escape') {
    hideDestination();
    return;
  }

  // Arrow keys: cycle destinations when one is active
  if (activeDestination && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    var next = destKeys[(idx + 1) % destKeys.length];
    showDestination(next);
    return;
  }

  if (activeDestination && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
    e.preventDefault();
    var idx = destKeys.indexOf(activeDestination);
    var prev = destKeys[(idx - 1 + destKeys.length) % destKeys.length];
    showDestination(prev);
    return;
  }

  // Arrow keys: if no destination active, start with first
  if (!activeDestination && (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
    e.preventDefault();
    showDestination(destKeys[0]);
    return;
  }

  // Number keys 1-8 select destinations directly
  var num = parseInt(e.key);
  if (num >= 1 && num <= 8) {
    showDestination(destKeys[num - 1]);
    return;
  }
});
