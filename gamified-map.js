// ============================================================
// Gamified Interactive Map — Quest Map Controller
// ============================================================

// ============================================================
// Destination Quest Data
// ============================================================

var destinations = {
    kyoto: {
        name: 'Kyoto, Japan',
        region: 'Asia \u2022 Kansai Region',
        rarity: 'legendary',
        desc: 'Walk through ancient torii gates, master the art of tea ceremony, and unlock the secrets of a thousand temples. A realm of serene beauty and hidden power.',
        difficulty: 2,
        cost: 3,
        adventure: 7,
        xp: 850,
        gold: 200,
        achievement: 'Zen Master'
    },
    santorini: {
        name: 'Santorini, Greece',
        region: 'Europe \u2022 Cyclades',
        rarity: 'epic',
        desc: 'Conquer the cliffs of the caldera, feast on legendary Mediterranean loot, and witness the mythic sunset of Oia. An epic quest of beauty and wonder.',
        difficulty: 1,
        cost: 4,
        adventure: 5,
        xp: 720,
        gold: 180,
        achievement: 'Island Hopper'
    },
    patagonia: {
        name: 'Patagonia, Argentina',
        region: 'South America \u2022 Tierra del Fuego',
        rarity: 'legendary',
        desc: 'Brave the winds at the end of the world. Trek glacial passes, encounter rare wildlife, and earn the ultimate explorer title. Only the worthy survive.',
        difficulty: 5,
        cost: 4,
        adventure: 10,
        xp: 1200,
        gold: 350,
        achievement: 'End of the World'
    },
    marrakech: {
        name: 'Marrakech, Morocco',
        region: 'Africa \u2022 Marrakech-Safi',
        rarity: 'rare',
        desc: 'Navigate the labyrinth of the medina, barter for rare crafted items, and uncover hidden riads behind ancient walls. The souks hold many secrets.',
        difficulty: 3,
        cost: 2,
        adventure: 8,
        xp: 600,
        gold: 120,
        achievement: 'Souk Navigator'
    },
    reykjavik: {
        name: 'Reykjavik, Iceland',
        region: 'Europe \u2022 Capital Region',
        rarity: 'epic',
        desc: 'Harness geothermal power, chase the Northern Lights boss encounter, and explore volcanic dungeons of fire and ice. An elemental challenge awaits.',
        difficulty: 4,
        cost: 5,
        adventure: 9,
        xp: 950,
        gold: 280,
        achievement: 'Aurora Chaser'
    },
    amalfi: {
        name: 'Amalfi Coast, Italy',
        region: 'Europe \u2022 Campania',
        rarity: 'rare',
        desc: 'Cruise the legendary coastal highway, collect culinary artifacts in cliffside villages, and complete the Limoncello side quest. A rare coastal treasure.',
        difficulty: 2,
        cost: 4,
        adventure: 6,
        xp: 680,
        gold: 160,
        achievement: 'La Dolce Vita'
    }
};

// ============================================================
// DOM Elements
// ============================================================

var infoCard = document.getElementById('info-card');
var infoCardClose = document.getElementById('info-card-close');
var infoCardRarity = document.getElementById('info-card-rarity');
var infoCardName = document.getElementById('info-card-name');
var infoCardRegion = document.getElementById('info-card-region');
var infoCardDesc = document.getElementById('info-card-desc');
var infoCardXP = document.getElementById('info-card-xp');
var statDifficulty = document.getElementById('stat-difficulty');
var statCost = document.getElementById('stat-cost');
var statAdventureFill = document.getElementById('stat-adventure-fill');
var statAdventureLabel = document.getElementById('stat-adventure-label');
var acceptQuestBtn = document.getElementById('accept-quest-btn');
var screenFlash = document.getElementById('screen-flash');
var achievementBanner = document.getElementById('achievement-banner');
var achievementDetail = document.getElementById('achievement-detail');
var achievementXP = document.getElementById('achievement-xp');
var hudLevel = document.getElementById('hud-level');
var hudGold = document.getElementById('hud-gold');
var hudQuests = document.getElementById('hud-quests');
var xpLevelBadge = document.getElementById('xp-level-badge');
var xpBarFill = document.getElementById('xp-bar-fill');
var xpBarText = document.getElementById('xp-bar-text');
var xpNextBadge = document.getElementById('xp-next-badge');
var mapViewport = document.getElementById('map-viewport');
var worldMap = document.getElementById('world-map');
var routePaths = document.getElementById('route-paths');
var zoomInBtn = document.getElementById('zoom-in');
var zoomOutBtn = document.getElementById('zoom-out');
var zoomResetBtn = document.getElementById('zoom-reset');
var toggleRoutesBtn = document.getElementById('toggle-routes');
var minimapViewport = document.getElementById('minimap-viewport');
var questPins = document.querySelectorAll('.quest-pin');
var questLogItems = document.querySelectorAll('.quest-log-item');

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
var acceptedQuests = {};
var totalXP = 0;
var totalGold = 0;
var playerLevel = 1;
var xpPerLevel = 3000;
var achievementTimeout = null;

// ============================================================
// Helper Functions
// ============================================================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getRarityFlashClass(rarity) {
    if (rarity === 'legendary') return 'flash-gold';
    if (rarity === 'epic') return 'flash-purple';
    return 'flash-cyan';
}

// Generate sword icons for difficulty
function buildSwordIcons(count, max) {
    var html = '';
    for (var i = 0; i < max; i++) {
        var activeClass = i < count ? ' active' : '';
        html += '<span class="stat-sword' + activeClass + '">\u2694</span>';
    }
    return html;
}

// Generate coin icons for cost
function buildCoinIcons(count, max) {
    var html = '';
    for (var i = 0; i < max; i++) {
        var activeClass = i < count ? ' active' : '';
        html += '<span class="stat-coin' + activeClass + '">\u2666</span>';
    }
    return html;
}

// ============================================================
// HUD Updates
// ============================================================

function updateHUD() {
    var level = Math.floor(totalXP / xpPerLevel) + 1;
    var xpInLevel = totalXP % xpPerLevel;
    var xpPercent = (xpInLevel / xpPerLevel) * 100;
    var questCount = Object.keys(acceptedQuests).length;

    playerLevel = level;
    hudLevel.textContent = level;
    hudGold.textContent = formatNumber(totalGold);
    hudQuests.textContent = questCount + '/6';
    xpLevelBadge.textContent = 'LVL ' + level;
    xpNextBadge.textContent = 'LVL ' + (level + 1);
    xpBarFill.style.width = xpPercent + '%';
    xpBarText.textContent = formatNumber(xpInLevel) + ' / ' + formatNumber(xpPerLevel) + ' XP';

    // Update player title based on level
    var titleEl = document.querySelector('.player-title');
    if (titleEl) {
        if (level >= 5) titleEl.textContent = 'Legendary Explorer';
        else if (level >= 3) titleEl.textContent = 'Seasoned Traveler';
        else if (level >= 2) titleEl.textContent = 'Apprentice Wanderer';
        else titleEl.textContent = 'Novice Wanderer';
    }
}

// ============================================================
// Info Card
// ============================================================

function showInfoCard(destKey) {
    var dest = destinations[destKey];
    if (!dest) return;

    // Update card content
    infoCardRarity.textContent = dest.rarity.toUpperCase();
    infoCardRarity.className = 'info-card-rarity ' + dest.rarity;
    infoCardName.textContent = dest.name;
    infoCardRegion.textContent = dest.region;
    infoCardDesc.textContent = dest.desc;
    infoCardXP.textContent = '+' + formatNumber(dest.xp) + ' XP';

    // Build stat icons
    statDifficulty.innerHTML = buildSwordIcons(dest.difficulty, 5);
    statCost.innerHTML = buildCoinIcons(dest.cost, 5);
    statAdventureFill.style.width = (dest.adventure * 10) + '%';
    statAdventureLabel.textContent = dest.adventure + '/10';

    // Update accept button state
    if (acceptedQuests[destKey]) {
        acceptQuestBtn.textContent = 'QUEST ACCEPTED';
        acceptQuestBtn.classList.add('accepted');
    } else {
        acceptQuestBtn.innerHTML = '<span class="accept-quest-icon">\u2694</span> Accept Quest';
        acceptQuestBtn.classList.remove('accepted');
    }

    // Apply rarity border glow to card
    var glowColor;
    if (dest.rarity === 'legendary') glowColor = 'rgba(255, 215, 0, 0.3)';
    else if (dest.rarity === 'epic') glowColor = 'rgba(168, 85, 247, 0.3)';
    else glowColor = 'rgba(0, 240, 255, 0.3)';
    infoCard.style.borderColor = glowColor;
    infoCard.style.boxShadow = '0 0 30px rgba(0,0,0,0.5), 0 0 15px ' + glowColor;

    // Show card
    infoCard.classList.add('visible');

    // Highlight active pin
    questPins.forEach(function(pin) {
        pin.classList.remove('active');
        if (pin.dataset.dest === destKey) {
            pin.classList.add('active');
        }
    });

    // Highlight active quest log item
    questLogItems.forEach(function(item) {
        item.classList.remove('active');
        if (item.dataset.dest === destKey) {
            item.classList.add('active');
        }
    });

    activeDestination = destKey;
}

function hideInfoCard() {
    infoCard.classList.remove('visible');
    questPins.forEach(function(pin) { pin.classList.remove('active'); });
    questLogItems.forEach(function(item) { item.classList.remove('active'); });
    activeDestination = null;
}

// ============================================================
// Accept Quest
// ============================================================

function acceptQuest(destKey) {
    if (!destKey || acceptedQuests[destKey]) return;

    var dest = destinations[destKey];
    if (!dest) return;

    // Mark as accepted
    acceptedQuests[destKey] = true;

    // Add XP and gold
    totalXP += dest.xp;
    totalGold += dest.gold;

    // Update HUD
    updateHUD();

    // Screen flash effect
    screenFlash.className = 'screen-flash ' + getRarityFlashClass(dest.rarity);
    setTimeout(function() {
        screenFlash.className = 'screen-flash';
    }, 700);

    // Show achievement banner
    achievementDetail.textContent = 'Explore ' + dest.name.split(',')[0] + '!';
    achievementXP.textContent = '+' + formatNumber(dest.xp) + ' XP';
    achievementBanner.classList.add('visible');

    if (achievementTimeout) clearTimeout(achievementTimeout);
    achievementTimeout = setTimeout(function() {
        achievementBanner.classList.remove('visible');
    }, 3500);

    // Update pin appearance (add accepted class)
    questPins.forEach(function(pin) {
        if (pin.dataset.dest === destKey) {
            pin.classList.add('accepted');
        }
    });

    // Update quest log
    var statusEl = document.getElementById('status-' + destKey);
    var logItem = document.querySelector('.quest-log-item[data-dest="' + destKey + '"]');
    if (statusEl) statusEl.textContent = 'ACCEPTED';
    if (logItem) logItem.classList.add('accepted');

    // Update accept button in info card
    acceptQuestBtn.textContent = 'QUEST ACCEPTED';
    acceptQuestBtn.classList.add('accepted');

    // Spawn particles
    spawnParticles(dest.rarity);
}

// ============================================================
// Particles
// ============================================================

function spawnParticles(rarity) {
    var color;
    if (rarity === 'legendary') color = '#ffd700';
    else if (rarity === 'epic') color = '#a855f7';
    else color = '#00f0ff';

    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    for (var i = 0; i < 20; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = color;
        particle.style.boxShadow = '0 0 6px ' + color;

        var angle = (Math.PI * 2 * i) / 20;
        var distance = 60 + Math.random() * 80;
        var tx = Math.cos(angle) * distance;
        var ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        (function(p) {
            setTimeout(function() {
                if (p.parentNode) p.parentNode.removeChild(p);
            }, 1000);
        })(particle);
    }
}

// Hover particles on pins
function spawnHoverParticles(event, rarity) {
    var color;
    if (rarity === 'legendary') color = '#ffd700';
    else if (rarity === 'epic') color = '#a855f7';
    else color = '#00f0ff';

    for (var i = 0; i < 5; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = event.clientX + 'px';
        particle.style.top = event.clientY + 'px';
        particle.style.background = color;
        particle.style.width = '3px';
        particle.style.height = '3px';

        var tx = (Math.random() - 0.5) * 40;
        var ty = (Math.random() - 0.5) * 40 - 20;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        (function(p) {
            setTimeout(function() {
                if (p.parentNode) p.parentNode.removeChild(p);
            }, 900);
        })(particle);
    }
}

// ============================================================
// Pin Event Handlers
// ============================================================

questPins.forEach(function(pin) {
    pin.addEventListener('click', function(e) {
        e.stopPropagation();
        var dest = pin.dataset.dest;
        if (activeDestination === dest) {
            hideInfoCard();
        } else {
            showInfoCard(dest);
        }
    });

    // Hover particles
    pin.addEventListener('mouseenter', function(e) {
        var dest = pin.dataset.dest;
        var rarity = destinations[dest] ? destinations[dest].rarity : 'rare';
        spawnHoverParticles(e, rarity);
    });
});

// Quest log click handlers
questLogItems.forEach(function(item) {
    item.addEventListener('click', function() {
        var dest = item.dataset.dest;
        if (activeDestination === dest) {
            hideInfoCard();
        } else {
            showInfoCard(dest);
        }
    });
});

// Close button
infoCardClose.addEventListener('click', hideInfoCard);

// Accept Quest button
acceptQuestBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (activeDestination && !acceptedQuests[activeDestination]) {
        acceptQuest(activeDestination);
    }
});

// Click outside to close
document.addEventListener('click', function(e) {
    if (infoCard.classList.contains('visible') &&
        !infoCard.contains(e.target) &&
        !e.target.closest('.quest-pin') &&
        !e.target.closest('.quest-log-item')) {
        hideInfoCard();
    }
});

// ============================================================
// Zoom
// ============================================================

function applyTransform() {
    worldMap.style.transform =
        'translate(' + panX + 'px, ' + panY + 'px) scale(' + currentZoom + ')';
    updateMinimap();
}

function updateMinimap() {
    if (!minimapViewport) return;
    var invZoom = 1 / currentZoom;
    var vw = 1000 * invZoom;
    var vh = 500 * invZoom;
    var vx = (-panX / currentZoom) * (1000 / mapViewport.offsetWidth) * invZoom;
    var vy = (-panY / currentZoom) * (500 / mapViewport.offsetHeight) * invZoom;

    // Clamp
    vx = Math.max(0, Math.min(1000 - vw, (500 - vw / 2) - panX / currentZoom * (1000 / mapViewport.offsetWidth)));
    vy = Math.max(0, Math.min(500 - vh, (250 - vh / 2) - panY / currentZoom * (500 / mapViewport.offsetHeight)));

    // Simplified approach: just reflect zoom level
    var w = 1000 / currentZoom;
    var h = 500 / currentZoom;
    var x = (1000 - w) / 2 - (panX / (mapViewport.offsetWidth || 1)) * w;
    var y = (500 - h) / 2 - (panY / (mapViewport.offsetHeight || 1)) * h;

    minimapViewport.setAttribute('x', Math.max(0, x));
    minimapViewport.setAttribute('y', Math.max(0, y));
    minimapViewport.setAttribute('width', Math.min(1000, w));
    minimapViewport.setAttribute('height', Math.min(500, h));
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
    if (e.target.closest('.quest-pin')) return;
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
    if (e.target.closest('.quest-pin')) return;
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
    // Escape closes info card and achievement banner
    if (e.key === 'Escape') {
        hideInfoCard();
        achievementBanner.classList.remove('visible');
        return;
    }

    // Arrow keys cycle through destinations when one is active
    if (activeDestination && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
        e.preventDefault();
        var idx = destKeys.indexOf(activeDestination);
        var next = destKeys[(idx + 1) % destKeys.length];
        showInfoCard(next);
    }

    if (activeDestination && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
        e.preventDefault();
        var idx2 = destKeys.indexOf(activeDestination);
        var prev = destKeys[(idx2 - 1 + destKeys.length) % destKeys.length];
        showInfoCard(prev);
    }

    // Number keys 1-6 select destinations
    var num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
        showInfoCard(destKeys[num - 1]);
    }

    // Enter or Space accepts quest when info card is visible
    if ((e.key === 'Enter' || e.key === ' ') && activeDestination && !acceptedQuests[activeDestination]) {
        if (infoCard.classList.contains('visible')) {
            e.preventDefault();
            acceptQuest(activeDestination);
        }
    }

    // + / = zoom in
    if (e.key === '+' || e.key === '=') {
        if (currentZoom < 4) {
            currentZoom = Math.min(4, currentZoom + 0.5);
            applyTransform();
        }
    }

    // - zoom out
    if (e.key === '-') {
        if (currentZoom > 1) {
            currentZoom = Math.max(1, currentZoom - 0.5);
            if (currentZoom === 1) { panX = 0; panY = 0; }
            applyTransform();
        }
    }

    // R to reset view
    if (e.key === 'r' || e.key === 'R') {
        currentZoom = 1;
        panX = 0;
        panY = 0;
        applyTransform();
    }

    // T to toggle routes
    if (e.key === 't' || e.key === 'T') {
        toggleRoutesBtn.click();
    }
});

// ============================================================
// Initial Setup
// ============================================================

updateHUD();
updateMinimap();
