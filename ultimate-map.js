/* ============================================================
   ULTIMATE QUEST MAP — INTERACTIVE ENGINE
   ============================================================ */

(function () {
    'use strict';

    // ========== DESTINATION DATA ==========
    const destinations = {
        kyoto: {
            id: 'kyoto',
            name: 'Temple of Hidden Knowledge',
            location: 'Kyoto, Japan',
            rarity: 'legendary',
            color: '#ff6b6b',
            desc: 'Walk through ancient torii gates, master the art of tea ceremony, and unlock the secrets of a thousand temples.',
            difficulty: 40,
            cost: 65,
            adventure: 70,
            difficultyNum: '4/10',
            costNum: '6.5/10',
            adventureNum: '7/10',
            xp: 850,
            gold: 500,
            achievement: 'Unlocks: Zen Master',
            svgX: 795,
            svgY: 120
        },
        santorini: {
            id: 'santorini',
            name: 'Caldera of the Ancients',
            location: 'Santorini, Greece',
            rarity: 'epic',
            color: '#4dabf7',
            desc: 'Conquer the cliffs of the caldera, feast on legendary Mediterranean loot, and witness the mythic sunset of Oia.',
            difficulty: 25,
            cost: 75,
            adventure: 50,
            difficultyNum: '2.5/10',
            costNum: '7.5/10',
            adventureNum: '5/10',
            xp: 720,
            gold: 400,
            achievement: 'Unlocks: Island Hopper',
            svgX: 570,
            svgY: 143
        },
        patagonia: {
            id: 'patagonia',
            name: 'Edge of the Known World',
            location: 'Patagonia, Argentina',
            rarity: 'legendary',
            color: '#51cf66',
            desc: 'Brave the winds at the end of the world. Trek glacial passes, encounter rare wildlife, and earn the ultimate explorer title.',
            difficulty: 90,
            cost: 70,
            adventure: 100,
            difficultyNum: '9/10',
            costNum: '7/10',
            adventureNum: '10/10',
            xp: 1200,
            gold: 750,
            achievement: 'Unlocks: End of the World',
            svgX: 245,
            svgY: 390
        },
        marrakech: {
            id: 'marrakech',
            name: "The Merchant's Labyrinth",
            location: 'Marrakech, Morocco',
            rarity: 'rare',
            color: '#ffd43b',
            desc: 'Navigate the labyrinth of the medina, barter for rare crafted items, and uncover hidden riads behind ancient walls.',
            difficulty: 55,
            cost: 30,
            adventure: 80,
            difficultyNum: '5.5/10',
            costNum: '3/10',
            adventureNum: '8/10',
            xp: 600,
            gold: 300,
            achievement: 'Unlocks: Souk Navigator',
            svgX: 488,
            svgY: 186
        },
        reykjavik: {
            id: 'reykjavik',
            name: 'Realm of Fire and Ice',
            location: 'Reykjavik, Iceland',
            rarity: 'epic',
            color: '#cc5de8',
            desc: 'Harness geothermal power, chase the Northern Lights boss encounter, and explore volcanic dungeons of fire and ice.',
            difficulty: 70,
            cost: 85,
            adventure: 95,
            difficultyNum: '7/10',
            costNum: '8.5/10',
            adventureNum: '9.5/10',
            xp: 950,
            gold: 600,
            achievement: 'Unlocks: Aurora Chaser',
            svgX: 425,
            svgY: 58
        },
        amalfi: {
            id: 'amalfi',
            name: 'The Coastal Citadel',
            location: 'Amalfi Coast, Italy',
            rarity: 'rare',
            color: '#ff922b',
            desc: 'Cruise the legendary coastal highway, collect culinary artifacts in cliffside villages, and complete the Limoncello side quest.',
            difficulty: 30,
            cost: 80,
            adventure: 55,
            difficultyNum: '3/10',
            costNum: '8/10',
            adventureNum: '5.5/10',
            xp: 680,
            gold: 400,
            achievement: 'Unlocks: La Dolce Vita',
            svgX: 539,
            svgY: 136
        },
        prague: {
            id: 'prague',
            name: 'The Clockwork Spires',
            location: 'Prague, Czech Republic',
            rarity: 'epic',
            color: '#ffe66d',
            desc: 'Uncover the secrets of the Clockwork City, where Gothic spires pierce the sky and Baroque palaces guard ancient knowledge beneath the astronomical clock.',
            difficulty: 35,
            cost: 45,
            adventure: 65,
            difficultyNum: '3.5/10',
            costNum: '4.5/10',
            adventureNum: '6.5/10',
            xp: 750,
            gold: 400,
            achievement: 'Unlocks: Clockwork Scholar',
            svgX: 539,
            svgY: 110
        },
        machupicchu: {
            id: 'machupicchu',
            name: 'The Cloud Citadel',
            location: 'Machu Picchu, Peru',
            rarity: 'legendary',
            color: '#55efc4',
            desc: 'Ascend to the lost citadel in the clouds. Trek ancient Inca trails, decode stone terraces, and claim the ultimate high-altitude reward.',
            difficulty: 80,
            cost: 55,
            adventure: 95,
            difficultyNum: '8/10',
            costNum: '5.5/10',
            adventureNum: '9.5/10',
            xp: 1100,
            gold: 650,
            achievement: 'Unlocks: Cloud Walker',
            svgX: 210,
            svgY: 285
        }
    };

    const destOrder = ['kyoto', 'santorini', 'patagonia', 'marrakech', 'reykjavik', 'amalfi', 'prague', 'machupicchu'];

    // ========== RANK PROGRESSION ==========
    const ranks = [
        { name: 'RECRUIT', minXP: 0 },
        { name: 'SCOUT', minXP: 800 },
        { name: 'PATHFINDER', minXP: 2000 },
        { name: 'COMMANDER', minXP: 3500 },
        { name: 'LEGENDARY COMMANDER', minXP: 5000 }
    ];

    // ========== STATE ==========
    let state = {
        xp: 0,
        gold: 0,
        level: 1,
        xpForNextLevel: 1000,
        launched: new Set(),
        selectedDest: null,
        zoomLevel: 1,
        panX: 0,
        panY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        routesVisible: true,
        completionShown: false
    };

    // ========== DOM REFS ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const worldMap = $('#world-map');
    const mapViewport = $('#map-viewport');
    const infoCard = $('#info-card');
    const infoClose = $('#info-close');
    const launchBtn = $('#launch-btn');
    const screenFlash = $('#screen-flash');
    const achievementBanner = $('#achievement-banner');
    const completionOverlay = $('#completion-overlay');
    const questLogGrid = $('#quest-log-grid');
    const particleBurst = $('#particle-burst-container');
    const routePaths = $('#route-paths');

    // HUD elements
    const missionsCount = $('#missions-count');
    const goldCount = $('#gold-count');
    const xpLevel = $('#xp-level');
    const xpBarFill = $('#xp-bar-fill');
    const xpBarText = $('#xp-bar-text');
    const xpBarParticles = $('#xp-bar-particles');
    const rankBadge = $('#rank-badge');
    const rankText = $('#rank-text');
    const progressRingFill = $('#progress-ring-fill');
    const progressRingText = $('#progress-ring-text');

    // Info card elements
    const infoHeader = $('#info-header');
    const infoRarity = $('#info-rarity');
    const infoName = $('#info-name');
    const infoLocation = $('#info-location');
    const infoDesc = $('#info-desc');
    const statDifficulty = $('#stat-difficulty');
    const statCost = $('#stat-cost');
    const statAdventure = $('#stat-adventure');
    const statDifficultyNum = $('#stat-difficulty-num');
    const statCostNum = $('#stat-cost-num');
    const statAdventureNum = $('#stat-adventure-num');
    const infoXP = $('#info-xp');
    const infoGold = $('#info-gold');
    const infoAchievement = $('#info-achievement');

    // ========== QUEST LOG INIT ==========
    function initQuestLog() {
        questLogGrid.innerHTML = '';
        destOrder.forEach(id => {
            const d = destinations[id];
            const card = document.createElement('div');
            card.className = 'quest-card';
            card.setAttribute('data-dest', id);
            card.setAttribute('data-color', id);
            card.innerHTML = `
                <div class="quest-card-top">
                    <span class="quest-card-status pending" data-status="${id}">PENDING</span>
                    <span class="quest-card-rarity ${d.rarity}">${d.rarity.toUpperCase()}</span>
                </div>
                <div class="quest-card-name">${d.name}</div>
                <div class="quest-card-location">${d.location}</div>
                <div class="quest-card-xp">+${d.xp} XP</div>
            `;
            card.addEventListener('click', () => selectDestination(id));
            questLogGrid.appendChild(card);
        });
    }

    // ========== SELECT DESTINATION ==========
    function selectDestination(id) {
        if (state.selectedDest === id && infoCard.classList.contains('visible')) {
            closeInfoCard();
            return;
        }

        state.selectedDest = id;
        const d = destinations[id];

        // Update info card
        infoRarity.textContent = d.rarity.toUpperCase();
        infoRarity.className = 'info-rarity ' + d.rarity;
        infoName.textContent = d.name;
        infoLocation.textContent = d.location;
        infoDesc.textContent = d.desc;
        statDifficultyNum.textContent = d.difficultyNum;
        statCostNum.textContent = d.costNum;
        statAdventureNum.textContent = d.adventureNum;
        infoXP.textContent = '+' + d.xp + ' XP';
        infoGold.textContent = '+' + d.gold + ' Gold';
        infoAchievement.textContent = d.achievement;

        // Reset stat bars then animate
        statDifficulty.style.width = '0%';
        statCost.style.width = '0%';
        statAdventure.style.width = '0%';

        // Show card
        infoCard.classList.add('visible');

        // Animate stat bars after a frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                statDifficulty.style.width = d.difficulty + '%';
                statCost.style.width = d.cost + '%';
                statAdventure.style.width = d.adventure + '%';
            });
        });

        // Update launch button state
        if (state.launched.has(id)) {
            launchBtn.classList.add('launched');
            launchBtn.querySelector('.launch-btn-text').textContent = 'EXPEDITION LAUNCHED';
            launchBtn.querySelector('.launch-btn-icon').textContent = '';
        } else {
            launchBtn.classList.remove('launched');
            launchBtn.querySelector('.launch-btn-text').textContent = 'LAUNCH EXPEDITION';
            launchBtn.querySelector('.launch-btn-icon').textContent = '\u25B6';
        }

        // Update active pin
        $$('.pin').forEach(p => p.classList.remove('active'));
        const activePin = $(`.pin[data-dest="${id}"]`);
        if (activePin) activePin.classList.add('active');

        // Update active quest card
        $$('.quest-card').forEach(c => c.style.outline = 'none');
        const activeQuestCard = $(`.quest-card[data-dest="${id}"]`);
        if (activeQuestCard) {
            activeQuestCard.style.outline = '1px solid ' + d.color;
        }
    }

    function closeInfoCard() {
        infoCard.classList.remove('visible');
        state.selectedDest = null;
        $$('.pin').forEach(p => p.classList.remove('active'));
        $$('.quest-card').forEach(c => c.style.outline = 'none');
    }

    // ========== LAUNCH EXPEDITION ==========
    function launchExpedition() {
        const id = state.selectedDest;
        if (!id || state.launched.has(id)) return;

        const d = destinations[id];
        state.launched.add(id);

        // 1. Screen flash
        screenFlash.classList.remove('active');
        void screenFlash.offsetWidth;
        screenFlash.classList.add('active');

        // 2. Particle burst from pin
        createParticleBurst(d.svgX, d.svgY, d.color);

        // 3. Ripple from pin
        createRipple(d.svgX, d.svgY, d.color);

        // 4. XP animation
        animateXPGain(d.xp);

        // 5. Gold animation
        animateGoldGain(d.gold);

        // 6. Achievement banner
        showAchievementBanner(d.location, d.xp);

        // 7. Update pin to completed
        const pin = $(`.pin[data-dest="${id}"]`);
        if (pin) {
            pin.classList.add('completed');
            // Replace center dot with crown text
            const center = pin.querySelector('.pin-center');
            if (center) {
                center.setAttribute('r', '0');
            }
        }

        // 8. Update launch button
        launchBtn.classList.add('launched');
        launchBtn.querySelector('.launch-btn-text').textContent = 'EXPEDITION LAUNCHED';
        launchBtn.querySelector('.launch-btn-icon').textContent = '';

        // 9. Update quest log
        updateQuestLog(id);

        // 10. Update missions and progress ring
        updateMissionsCounter();
        updateProgressRing();

        // 11. Update rank
        updateRank();

        // 12. Check completion
        if (state.launched.size === 8 && !state.completionShown) {
            setTimeout(() => triggerCompletion(), 2800);
        }
    }

    // ========== PARTICLE BURST ==========
    function createParticleBurst(svgX, svgY, color) {
        // Convert SVG coords to pixel coords in the viewport
        const svgRect = worldMap.getBoundingClientRect();
        const viewBox = worldMap.viewBox.baseVal;
        const scaleX = svgRect.width / viewBox.width;
        const scaleY = svgRect.height / viewBox.height;

        const pixelX = svgX * scaleX;
        const pixelY = svgY * scaleY;

        const particleCount = 24;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'burst-particle';
            p.style.left = pixelX + 'px';
            p.style.top = pixelY + 'px';
            p.style.background = color;
            p.style.boxShadow = `0 0 6px ${color}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const dist = 40 + Math.random() * 60;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            p.style.setProperty('--tx', tx + 'px');
            p.style.setProperty('--ty', ty + 'px');
            p.style.animation = 'none';

            particleBurst.appendChild(p);

            // Manually animate with random flight
            requestAnimationFrame(() => {
                p.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                p.style.opacity = '0';
            });

            setTimeout(() => p.remove(), 1000);
        }
    }

    // ========== RIPPLE EFFECT ==========
    function createRipple(svgX, svgY, color) {
        const svgRect = worldMap.getBoundingClientRect();
        const viewBox = worldMap.viewBox.baseVal;
        const scaleX = svgRect.width / viewBox.width;
        const scaleY = svgRect.height / viewBox.height;

        const pixelX = svgX * scaleX;
        const pixelY = svgY * scaleY;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ring = document.createElement('div');
                ring.className = 'ripple-ring';
                ring.style.left = pixelX + 'px';
                ring.style.top = pixelY + 'px';
                ring.style.borderColor = color;
                ring.style.marginLeft = '-75px';
                ring.style.marginTop = '-75px';
                particleBurst.appendChild(ring);
                setTimeout(() => ring.remove(), 1200);
            }, i * 200);
        }
    }

    // ========== XP ANIMATION ==========
    function animateXPGain(amount) {
        const startXP = state.xp;
        state.xp += amount;

        // Calculate level
        const oldLevel = state.level;
        state.level = Math.floor(state.xp / 1000) + 1;
        state.xpForNextLevel = state.level * 1000;

        // Animate counter
        animateCounter(startXP, state.xp, 1200, (val) => {
            const currentLevel = Math.floor(val / 1000) + 1;
            const xpInLevel = val % 1000;
            const xpNeeded = 1000;
            const pct = (xpInLevel / xpNeeded) * 100;

            xpBarFill.style.width = pct + '%';
            xpBarText.textContent = Math.floor(val) + ' / ' + (currentLevel * 1000) + ' XP';
            xpLevel.textContent = 'LVL ' + currentLevel;
        });

        // Spawn XP bar particles
        spawnXPParticles();
    }

    function spawnXPParticles() {
        const count = 12;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'xp-particle';
                p.style.left = (Math.random() * 60) + '%';
                p.style.top = (Math.random() * 100) + '%';
                xpBarParticles.appendChild(p);
                setTimeout(() => p.remove(), 1000);
            }, i * 80);
        }
    }

    // ========== GOLD ANIMATION ==========
    function animateGoldGain(amount) {
        const startGold = state.gold;
        state.gold += amount;

        goldCount.classList.add('animating');
        animateCounter(startGold, state.gold, 1000, (val) => {
            goldCount.textContent = Math.floor(val).toLocaleString();
        });

        setTimeout(() => goldCount.classList.remove('animating'), 1200);
    }

    // ========== ANIMATE COUNTER ==========
    function animateCounter(start, end, duration, callback) {
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            callback(current);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // ========== ACHIEVEMENT BANNER ==========
    function showAchievementBanner(destName, xp) {
        const destEl = $('#achievement-dest');
        const xpEl = $('#achievement-xp');
        destEl.textContent = destName;
        xpEl.textContent = '+' + xp + ' XP';

        achievementBanner.classList.remove('active');
        void achievementBanner.offsetWidth;
        achievementBanner.classList.add('active');

        setTimeout(() => achievementBanner.classList.remove('active'), 3000);
    }

    // ========== UPDATE QUEST LOG ==========
    function updateQuestLog(id) {
        const card = $(`.quest-card[data-dest="${id}"]`);
        if (!card) return;

        card.classList.add('completed');
        const statusEl = card.querySelector('.quest-card-status');
        if (statusEl) {
            statusEl.textContent = 'LAUNCHED';
            statusEl.className = 'quest-card-status launched';
        }
    }

    // ========== UPDATE MISSIONS ==========
    function updateMissionsCounter() {
        const count = state.launched.size;
        missionsCount.textContent = count + '/8';
        missionsCount.classList.add('animating');
        setTimeout(() => missionsCount.classList.remove('animating'), 600);
    }

    // ========== UPDATE PROGRESS RING ==========
    function updateProgressRing() {
        const count = state.launched.size;
        const circumference = 2 * Math.PI * 34; // r=34
        const offset = circumference - (count / 8) * circumference;
        progressRingFill.style.strokeDashoffset = offset;
        progressRingText.textContent = count + '/8';
    }

    // ========== UPDATE RANK ==========
    function updateRank() {
        let currentRank = ranks[0];
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (state.xp >= ranks[i].minXP) {
                currentRank = ranks[i];
                break;
            }
        }
        rankText.textContent = currentRank.name;

        // Upgrade badge based on rank
        const rankIndex = ranks.indexOf(currentRank);
        const badges = ['\u2666', '\u2666\u2666', '\u2605', '\u2605\u2605', '\u2605\u2605\u2605'];
        rankBadge.textContent = badges[rankIndex] || '\u2666';

        if (rankIndex >= 3) {
            rankBadge.style.color = '#ffd43b';
            rankText.style.color = '#ffd43b';
        }
    }

    // ========== COMPLETION SEQUENCE ==========
    function triggerCompletion() {
        state.completionShown = true;

        // All pins pulse
        $$('.pin').forEach(p => {
            p.style.animation = 'none';
            void p.offsetWidth;
        });

        // Force rank to legendary
        rankText.textContent = 'LEGENDARY COMMANDER';
        rankBadge.textContent = '\u2605\u2605\u2605';
        rankBadge.style.color = '#ffd43b';
        rankText.style.color = '#ffd43b';

        // Show completion overlay
        completionOverlay.classList.add('active');

        // Create golden particles
        const container = $('#completion-particles');
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 4}px;
                height: ${3 + Math.random() * 4}px;
                background: ${Math.random() > 0.5 ? '#ffd43b' : '#ff922b'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                box-shadow: 0 0 8px ${Math.random() > 0.5 ? 'rgba(255,212,59,0.6)' : 'rgba(255,146,43,0.6)'};
                animation: gold-particle ${2 + Math.random() * 3}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(p);
        }

        // Add the keyframe for gold particles
        if (!document.querySelector('#gold-particle-style')) {
            const style = document.createElement('style');
            style.id = 'gold-particle-style';
            style.textContent = `
                @keyframes gold-particle {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { transform: translate(${-20 + Math.random() * 40}px, ${-30 + Math.random() * 60}px) scale(0.5); opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }

        // Click anywhere to dismiss
        completionOverlay.addEventListener('click', () => {
            completionOverlay.classList.remove('active');
        });
    }

    // ========== ZOOM / PAN ==========
    function applyTransform() {
        worldMap.style.transform = `scale(${state.zoomLevel}) translate(${state.panX}px, ${state.panY}px)`;
    }

    function zoomIn() {
        state.zoomLevel = Math.min(state.zoomLevel + 0.3, 4);
        applyTransform();
    }

    function zoomOut() {
        state.zoomLevel = Math.max(state.zoomLevel - 0.3, 0.5);
        applyTransform();
    }

    function zoomReset() {
        state.zoomLevel = 1;
        state.panX = 0;
        state.panY = 0;
        applyTransform();
    }

    function toggleRoutes() {
        state.routesVisible = !state.routesVisible;
        routePaths.classList.toggle('hidden', !state.routesVisible);
        $('#toggle-routes').classList.toggle('active', state.routesVisible);
    }

    // Mouse wheel zoom
    mapViewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }, { passive: false });

    // Drag to pan
    mapViewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('.pin')) return;
        state.isDragging = true;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        mapViewport.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;
        const dx = (e.clientX - state.dragStartX) / state.zoomLevel;
        const dy = (e.clientY - state.dragStartY) / state.zoomLevel;
        state.panX += dx;
        state.panY += dy;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        applyTransform();
    });

    document.addEventListener('mouseup', () => {
        state.isDragging = false;
        mapViewport.style.cursor = 'grab';
    });

    // ========== PIN CLICK HANDLERS ==========
    $$('.pin').forEach(pin => {
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            const dest = pin.getAttribute('data-dest');
            selectDestination(dest);
        });
    });

    // ========== BUTTON HANDLERS ==========
    $('#zoom-in').addEventListener('click', zoomIn);
    $('#zoom-out').addEventListener('click', zoomOut);
    $('#zoom-reset').addEventListener('click', zoomReset);
    $('#toggle-routes').addEventListener('click', toggleRoutes);
    infoClose.addEventListener('click', closeInfoCard);
    launchBtn.addEventListener('click', launchExpedition);

    // Close card on clicking map background
    mapViewport.addEventListener('click', (e) => {
        if (!e.target.closest('.pin') && !e.target.closest('.info-card')) {
            closeInfoCard();
        }
    });

    // ========== KEYBOARD ==========
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // 1-8 to select destinations
        if (key >= '1' && key <= '8') {
            const idx = parseInt(key) - 1;
            if (destOrder[idx]) {
                selectDestination(destOrder[idx]);
            }
        }

        // Arrow keys to cycle
        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            cycleDestination(1);
        }
        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            cycleDestination(-1);
        }

        // Enter to launch
        if (key === 'Enter' && state.selectedDest) {
            launchExpedition();
        }

        // Escape to close
        if (key === 'Escape') {
            if (completionOverlay.classList.contains('active')) {
                completionOverlay.classList.remove('active');
            } else {
                closeInfoCard();
            }
        }

        // R for routes
        if (key === 'r' || key === 'R') {
            if (!e.ctrlKey && !e.metaKey) {
                toggleRoutes();
            }
        }

        // + / - for zoom
        if (key === '+' || key === '=') zoomIn();
        if (key === '-') zoomOut();
        if (key === '0') zoomReset();
    });

    function cycleDestination(dir) {
        let idx = -1;
        if (state.selectedDest) {
            idx = destOrder.indexOf(state.selectedDest);
        }
        idx += dir;
        if (idx < 0) idx = destOrder.length - 1;
        if (idx >= destOrder.length) idx = 0;
        selectDestination(destOrder[idx]);
    }

    // ========== INIT ==========
    initQuestLog();
    updateProgressRing();
    updateRank();

    // Remove flash class after animation
    screenFlash.addEventListener('animationend', () => {
        screenFlash.classList.remove('active');
    });

})();
