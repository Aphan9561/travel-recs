// ============================================================
// Interactive Map — Destination Data & Controls
// ============================================================

const destinations = {
  kyoto: {
    number: 'I',
    name: 'Kyoto',
    region: 'Kansai, Japan',
    coords: '35.0116\u00b0 N, 135.7681\u00b0 E',
    desc: 'Ancient capital of a thousand temples, where bamboo groves whisper and geisha still glide through lantern-lit alleys. A place where every season paints its own masterpiece.',
    tags: ['Temples', 'Gardens', 'Tea Ceremony']
  },
  santorini: {
    number: 'II',
    name: 'Santorini',
    region: 'Cyclades, Greece',
    coords: '36.3932\u00b0 N, 25.4615\u00b0 E',
    desc: 'A crescent of volcanic cliffs crowned with whitewashed villages, where the Aegean stretches endlessly and sunsets over the caldera have moved poets to silence.',
    tags: ['Caldera Views', 'Sunsets', 'Wine']
  },
  patagonia: {
    number: 'III',
    name: 'Patagonia',
    region: 'Argentina & Chile',
    coords: '41.8101\u00b0 S, 68.9063\u00b0 W',
    desc: 'The uttermost end of the earth, where glaciers calve into turquoise lakes, granite spires pierce the clouds, and the wind carries the wild spirit of untamed lands.',
    tags: ['Glaciers', 'Trekking', 'Wildlife']
  },
  marrakech: {
    number: 'IV',
    name: 'Marrakech',
    region: 'Marrakech-Safi, Morocco',
    coords: '31.6295\u00b0 N, 7.9811\u00b0 W',
    desc: 'The Red City, where labyrinthine souks overflow with spice and silk, where riads hide courtyards of impossible beauty, and the call to prayer drifts over terracotta rooftops.',
    tags: ['Souks', 'Architecture', 'Cuisine']
  },
  reykjavik: {
    number: 'V',
    name: 'Reykjavik',
    region: 'Capital Region, Iceland',
    coords: '64.1466\u00b0 N, 21.9426\u00b0 W',
    desc: 'Gateway to fire and ice, where geothermal springs steam beneath the aurora borealis, black sand beaches meet roaring waves, and the midnight sun defies the clock.',
    tags: ['Northern Lights', 'Geysers', 'Hot Springs']
  },
  amalfi: {
    number: 'VI',
    name: 'Amalfi Coast',
    region: 'Campania, Italy',
    coords: '40.6340\u00b0 N, 14.6027\u00b0 E',
    desc: 'A ribbon of pastel villages clinging to dramatic sea cliffs, where lemon groves perfume the salt air, and every winding road reveals another view that stops the heart.',
    tags: ['Coastal Roads', 'Limoncello', 'Villages']
  },
  prague: {
    number: 'VII',
    name: 'Prague',
    region: 'Bohemia, Czech Republic',
    coords: '50.0755\u00b0 N, 14.4378\u00b0 E',
    desc: 'A fairy-tale city of Gothic spires and Baroque palaces, where cobblestone lanes wind past astronomical clocks, and the Vltava River reflects centuries of art, music, and revolution.',
    tags: ['Architecture', 'History', 'Beer']
  },
  machupicchu: {
    number: 'VIII',
    name: 'Machu Picchu',
    region: 'Cusco, Peru',
    coords: '13.1631\u00b0 S, 72.5450\u00b0 W',
    desc: 'The lost citadel of the Inca, perched among the clouds on a razor-thin ridge, where ancient stone terraces cascade into mist and the silence holds the memory of an empire.',
    tags: ['Ruins', 'Trekking', 'History']
  }
};

// ============================================================
// DOM Elements
// ============================================================

const infoPanel = document.getElementById('info-panel');
const infoClose = document.getElementById('info-close');
const infoNumber = document.getElementById('info-number');
const infoName = document.getElementById('info-name');
const infoRegion = document.getElementById('info-region');
const infoCoords = document.getElementById('info-coords');
const infoDesc = document.getElementById('info-desc');
const infoTags = document.getElementById('info-tags');
const pins = document.querySelectorAll('.pin');
const listItems = document.querySelectorAll('.dest-list-item');
const routePaths = document.getElementById('route-paths');
const mapViewport = document.getElementById('map-viewport');
const worldMap = document.getElementById('world-map');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomResetBtn = document.getElementById('zoom-reset');
const toggleRoutesBtn = document.getElementById('toggle-routes');

// ============================================================
// State
// ============================================================

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

// ============================================================
// Info Panel
// ============================================================

function showDestination(destKey) {
  const dest = destinations[destKey];
  if (!dest) return;

  // Update panel content
  infoNumber.textContent = dest.number;
  infoName.textContent = dest.name;
  infoRegion.textContent = dest.region;
  infoCoords.textContent = dest.coords;
  infoDesc.textContent = dest.desc;

  // Build tags
  infoTags.innerHTML = '';
  dest.tags.forEach(function(tag) {
    var span = document.createElement('span');
    span.className = 'info-tag';
    span.textContent = tag;
    infoTags.appendChild(span);
  });

  // Show panel
  infoPanel.classList.add('visible');

  // Highlight active pin
  pins.forEach(function(pin) {
    pin.classList.remove('active');
    if (pin.dataset.dest === destKey) {
      pin.classList.add('active');
    }
  });

  // Highlight active list item
  listItems.forEach(function(item) {
    item.classList.remove('active');
    if (item.dataset.dest === destKey) {
      item.classList.add('active');
    }
  });

  activeDestination = destKey;
}

function hideDestination() {
  infoPanel.classList.remove('visible');
  pins.forEach(function(pin) { pin.classList.remove('active'); });
  listItems.forEach(function(item) { item.classList.remove('active'); });
  activeDestination = null;
}

// Pin click handlers
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

// List item click handlers
listItems.forEach(function(item) {
  item.addEventListener('click', function() {
    var dest = item.dataset.dest;
    if (activeDestination === dest) {
      hideDestination();
    } else {
      showDestination(dest);
    }
  });
});

// Close button
infoClose.addEventListener('click', hideDestination);

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
  if (e.key === 'Escape') {
    hideDestination();
    return;
  }

  // Arrow keys cycle through destinations when one is active
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

  // Number keys 1-8 select destinations
  var num = parseInt(e.key);
  if (num >= 1 && num <= 8) {
    showDestination(destKeys[num - 1]);
  }
});
