class PrismaraGame {
    constructor() {
        this.state = {
            ageBand: '5-7',
            activeZone: 'hub',
            accessibility: { tts: false },
            progress: this.loadProgress(),
            achievements: this.loadAchievements(),
            streak: 0,
            shards: 0
        };
        this.currentMission = null;
        this._modalOnContinue = null;
        this.lighthouseDone = this.readBeacon();

        window.addEventListener('load', () => {
            this.updateHUD();
            this.renderHub();
        });
    }

    // ---------- Persistence ----------
    loadProgress() {
        try {
            const raw = localStorage.getItem('prismara_progress_v2');
            if (raw) return JSON.parse(raw);
        } catch(e) {}
        return { pathways: {}, gardens: {}, bridge: {}, signal: {} };
    }
    saveProgress() {
        try { localStorage.setItem('prismara_progress_v2', JSON.stringify(this.state.progress)); } catch(e) {}
    }
    loadAchievements() {
        try {
            const raw = localStorage.getItem('prismara_achievements_v2');
            if (raw) return JSON.parse(raw);
        } catch(e) {}
        return {};
    }
    saveAchievements() {
        try { localStorage.setItem('prismara_achievements_v2', JSON.stringify(this.state.achievements)); } catch(e) {}
    }

    totalStars() {
        let n = 0;
        for (const zone of Object.keys(this.state.progress)) {
            const z = this.state.progress[zone] || {};
            for (const id in z) n += z[id];
        }
        return n;
    }

    updateHUD() {
        const stars = this.totalStars();
        document.getElementById('global-stars').innerText = `${stars} / 36`;
        document.getElementById('global-streak').innerText = this.state.streak;
    }

    // ---------- Utilities ----------
    setPrompt(text) {
        document.getElementById('helper-text').innerText = text;
        if (this.state.accessibility.tts) audioSystem.speak(text);
    }

    toggleTTS() {
        this.state.accessibility.tts = !this.state.accessibility.tts;
        audioSystem.ttsEnabled = this.state.accessibility.tts;
        const btn = document.getElementById('tts-btn');
        btn.classList.toggle('text-teal-400', this.state.accessibility.tts);
        btn.classList.toggle('text-indigo-400', !this.state.accessibility.tts);
        this.setPrompt(this.state.accessibility.tts ? 'Read-aloud enabled.' : 'Read-aloud muted.');
    }

    celebrate() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const colors = ['#FF7675','#0984E3','#00B894','#FDCB6E','#A29BFE','#00CEC9'];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.left = Math.random() * 100 + '%';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.animationDelay = Math.random() * 0.3 + 's';
            el.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3200);
        }
    }

    shakeEl(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 400);
    }

    shapeStyle(shapeKey, strokeStyle = null) {
        const s = SHAPES[shapeKey];
        const border = strokeStyle === 'dashed' ? 'dashed'
                     : strokeStyle === 'dotted' ? 'dotted' : 'solid';
        return `background-color:${s.color};border:3px ${border} rgba(255,255,255,0.85);`;
    }

    // ---------- Navigation ----------
    goHome() {
        this.currentMission = null;
        this.state.activeZone = 'hub';
        document.getElementById('hint-btn').classList.add('hidden');
        this.renderHub();
    }

    // ---------- HUB ----------
    renderHub() {
        this.state.activeZone = 'hub';
        this.currentMission = null;
        document.getElementById('hint-btn').classList.add('hidden');
        this.setPrompt('Welcome to Prismara! Pick an age band and choose a zone.');

        const zones = Object.keys(MISSIONS);
        const zoneCards = zones.map(zk => this.renderZoneCard(zk)).join('');

        const lighthouseDone = this.lighthouseDone.every(Boolean);
        const lighthouseReady = zones.every(zk => this.zoneComplete(zk));
        const lhProgress = this.lighthouseDone.filter(Boolean).length;

        document.getElementById('app-container').innerHTML = `
            <div class="w-full bg-[#1A1635]/80 border border-indigo-700/40 rounded-2xl p-4 mb-6 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-3">
                    <div class="text-indigo-400 text-2xl"><i class="fa-solid fa-graduation-cap"></i></div>
                    <div>
                        <h3 class="font-display font-bold text-base text-white">Learning Level</h3>
                        <p class="text-xs text-indigo-300">Guides the scaffolding you'll receive</p>
                    </div>
                </div>
                <div class="flex gap-2 w-full md:w-auto flex-wrap">
                    ${['5-7','8-10','11-12'].map(b => `
                        <button onclick="game.setAgeBand('${b}')" class="flex-1 md:flex-initial px-3 py-2 rounded-xl font-display font-bold text-xs ${this.state.ageBand===b ? 'bg-teal-400 text-slate-950 shadow-lg' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'} transition">
                            Ages ${b}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                ${zoneCards}

                <div onclick="game.openLighthouse()" class="md:col-span-2 ${lighthouseReady ? 'bg-gradient-to-r from-indigo-900/70 via-purple-900/70 to-slate-900 border-amber-400/70' : 'bg-[#1A1635] border-indigo-700/40 opacity-80'} border-2 rounded-3xl p-6 cursor-pointer transform hover:-translate-y-1 transition duration-200 shadow-2xl relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition">
                        <i class="fa-solid fa-tower-observation text-9xl text-amber-300"></i>
                    </div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs rounded-full font-bold border border-amber-400/40">FINAL MISSION</span>
                        <span class="text-xs ${lighthouseReady ? 'text-amber-300' : 'text-indigo-300'} font-bold">
                            <i class="fa-solid fa-key mr-1"></i>${lighthouseReady ? 'Ready' : 'Complete zones to unlock'}
                        </span>
                    </div>
                    <h3 class="font-display font-bold text-2xl text-white mb-2">The Great Lantern Lighthouse</h3>
                    <p class="text-xs text-indigo-200 max-w-md mb-4">Reconnect 4 light channels to restore Prismara's beacon. Each channel uses a different pattern skill.</p>
                    <div class="flex items-center space-x-2 mb-4">
                        ${this.lighthouseDone.map((d, i) => `<span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${d ? 'bg-amber-400 text-slate-950' : 'bg-indigo-900/60 text-indigo-400'}">${i+1}</span>`).join('')}
                    </div>
                    <button class="px-5 py-2.5 rounded-xl ${lighthouseReady ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950' : 'bg-indigo-800 text-indigo-400 cursor-not-allowed'} font-display font-bold text-sm btn-prism">
                        ${lighthouseDone ? 'View Beacon' : lighthouseReady ? 'Enter Lighthouse' : `Channels: ${lhProgress}/4`} <i class="fa-solid fa-bolt ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }

    zoneComplete(zk) {
        const missions = MISSIONS[zk].missions;
        return missions.every(m => (this.state.progress[zk] || {})[m.id] !== undefined);
    }

    renderZoneCard(zk) {
        const zone = MISSIONS[zk];
        const prog = this.state.progress[zk] || {};
        const done = zone.missions.filter(m => prog[m.id] !== undefined).length;
        const totalStars = zone.missions.reduce((s, m) => s + (prog[m.id] || 0), 0);
        const maxStars = zone.missions.length * 3;
        const complete = done === zone.missions.length;
        const colorMap = {
            teal: { border: 'border-teal-500/40', bg: 'bg-teal-950', txt: 'text-teal-300', badge: 'bg-teal-500/20 text-teal-300' },
            indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-950', txt: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-300' },
            purple: { border: 'border-purple-500/40', bg: 'bg-purple-950', txt: 'text-purple-300', badge: 'bg-purple-500/20 text-purple-300' },
            amber: { border: 'border-amber-500/40', bg: 'bg-amber-950', txt: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300' }
        }[zone.color];

        return `
            <div onclick="game.openZone('${zk}')" class="bg-[#1A1635] border ${complete ? 'border-amber-400/60' : 'border-indigo-500/30'} hover:border-teal-400/80 rounded-3xl p-5 cursor-pointer transform hover:-translate-y-1 transition duration-200 shadow-xl group relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 ${zone.color === 'teal' ? 'bg-teal-500/10' : 'bg-indigo-500/10'} rounded-full blur-2xl group-hover:opacity-200 transition"></div>
                <div class="flex justify-between items-start mb-3">
                    <span class="px-3 py-1 ${colorMap.badge} text-xs rounded-full font-bold uppercase tracking-wide">${zone.name.split(' ')[0]}</span>
                    ${complete
                        ? '<span class="text-xs text-amber-400 font-bold"><i class="fa-solid fa-crown mr-1"></i>Complete</span>'
                        : `<span class="text-xs text-indigo-300 font-bold">${done}/${zone.missions.length} missions</span>`}
                </div>
                <div class="w-14 h-14 rounded-2xl ${colorMap.bg} border ${colorMap.border} flex items-center justify-center ${colorMap.txt} text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="fa-solid ${zone.icon}"></i>
                </div>
                <h3 class="font-display font-bold text-xl text-white mb-1">${zone.name}</h3>
                <p class="text-xs text-indigo-200 mb-4">${zone.intro}</p>
                <div class="flex items-center justify-between text-xs font-semibold">
                    <div class="flex items-center space-x-0.5">
                        ${Array.from({length: maxStars}).map((_, i) =>
                            `<i class="fa-solid fa-star ${i < totalStars ? 'gold-star' : 'empty-star'} text-xs"></i>`
                        ).join('')}
                    </div>
                    <div class="${colorMap.txt} flex items-center">
                        <span>${done === 0 ? 'Enter Zone' : complete ? 'Replay' : 'Continue'}</span>
                        <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
                    </div>
                </div>
            </div>
        `;
    }

    setAgeBand(band) {
        this.state.ageBand = band;
        audioSystem.playClick();
        this.renderHub();
    }

    // ---------- ZONE / MISSION SELECT ----------
    openZone(zk) {
        audioSystem.playClick();
        this.state.activeZone = zk;
        this.currentMission = null;
        document.getElementById('hint-btn').classList.add('hidden');
        const zone = MISSIONS[zk];
        this.setPrompt(`${zone.name}: ${zone.intro}`);

        const prog = this.state.progress[zk] || {};
        const missionCards = zone.missions.map((m, idx) => {
            const stars = prog[m.id];
            const done = stars !== undefined;
            const prevDone = idx === 0 || prog[zone.missions[idx-1].id] !== undefined;
            const locked = !prevDone;
            return `
                <div onclick="${locked ? '' : `game.startMission('${zk}', '${m.id}')`}"
                     class="${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'} bg-[#1A1635] border ${done ? 'border-emerald-500/40' : 'border-indigo-700/50'} rounded-2xl p-4 transition transform duration-150 relative">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs font-bold ${done ? 'text-emerald-400' : 'text-indigo-400'}">MISSION ${idx+1}</span>
                        ${locked ? '<i class="fa-solid fa-lock text-indigo-500"></i>' : done ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : '<i class="fa-solid fa-circle-play text-teal-400"></i>'}
                    </div>
                    <h4 class="font-display font-bold text-lg text-white mb-1">${m.title}</h4>
                    <p class="text-xs text-indigo-300 mb-3">${m.rule}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex space-x-0.5">
                            ${[1,2,3].map(n => `<i class="fa-solid fa-star ${stars >= n ? 'gold-star' : 'empty-star'} text-xs"></i>`).join('')}
                        </div>
                        <div class="flex space-x-0.5">
                            ${Array.from({length:3}).map((_, i) => `<span class="w-1.5 h-1.5 rounded-full ${i < m.difficulty ? 'bg-amber-400' : 'bg-indigo-800'}"></span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('app-container').innerHTML = `
            <div class="w-full max-w-4xl">
                <div class="flex items-center justify-between mb-6">
                    <button onclick="game.goHome()" class="text-indigo-300 hover:text-white text-sm flex items-center">
                        <i class="fa-solid fa-arrow-left mr-2"></i>Back to Hub
                    </button>
                    <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">${zone.name}</span>
                </div>
                <h2 class="font-display font-bold text-3xl text-white mb-2">Choose a Mission</h2>
                <p class="text-sm text-indigo-300 mb-6">${zone.intro}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${missionCards}
                </div>
            </div>
        `;
    }

    startMission(zk, missionId) {
        audioSystem.playClick();
        const zone = MISSIONS[zk];
        const mission = zone.missions.find(m => m.id === missionId);
        this.currentMission = {
            zone: zk, missionId, mission,
            hintsUsed: 0, placed: null, inLighthouse: false
        };
        document.getElementById('hint-btn').classList.remove('hidden');
        this.renderPuzzle();
    }

    renderPuzzle() {
        if (!this.currentMission) return;
        const { mission } = this.currentMission;
        if (mission.type === 'sequence') this.renderSequencePuzzle();
        else if (mission.type === 'bridge') this.renderBridgePuzzle();
        else if (mission.type === 'signal') this.renderSignalPuzzle();
    }

    // ---------- SEQUENCE PUZZLE ----------
    renderSequencePuzzle() {
        const { mission, zone, inLighthouse, placed } = this.currentMission;
        const sequence = this.generateSequence(mission.basePattern, mission.preFilled);
        const answerIdx = mission.preFilled % mission.basePattern.length;
        const correctAnswer = mission.basePattern[answerIdx];

        const options = this.getSequenceOptions(correctAnswer, mission.basePattern.length);

        this.setPrompt(`${mission.title}: Look for the repeating group, then choose the missing piece.`);

        document.getElementById('app-container').innerHTML = `
            <div class="w-full max-w-4xl bg-[#1A1635] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4 pb-4 border-b border-indigo-900/60">
                    <div>
                        <span class="text-xs font-bold text-teal-400 uppercase tracking-widest">${mission.rule}</span>
                        <h2 class="font-display font-bold text-2xl text-white">${mission.title}</h2>
                    </div>
                    <button onclick="game.backFromMission()" class="text-indigo-300 hover:text-white text-sm">
                        <i class="fa-solid fa-arrow-left mr-1"></i>Back
                    </button>
                </div>

                <div id="puzzle-canvas" class="bg-[#100D25] border border-indigo-950 rounded-2xl p-6 mb-6 min-h-[220px] flex items-center justify-center">
                    <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        ${sequence.map((shapeKey, i) => `
                            <div class="flex flex-col items-center">
                                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg" style="${this.shapeStyle(shapeKey)}">
                                    <i class="fa-solid ${SHAPES[shapeKey].icon} text-2xl text-white"></i>
                                </div>
                                <span class="text-[9px] text-indigo-400 font-bold uppercase mt-1">${SHAPES[shapeKey].name}</span>
                            </div>
                            ${i < sequence.length - 1 ? '<i class="fa-solid fa-chevron-right text-indigo-700 text-xs"></i>' : ''}
                        `).join('')}
                        <i class="fa-solid fa-chevron-right text-indigo-700 text-xs"></i>
                        <div id="answer-slot" class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-teal-400 bg-teal-500/10 flex items-center justify-center pulse-slot" ${placed ? `style="${this.shapeStyle(placed)}"` : ''}>
                            ${placed
                                ? `<i class="fa-solid ${SHAPES[placed].icon} text-2xl text-white"></i>`
                                : '<span class="text-teal-300 font-display font-bold text-2xl">?</span>'}
                        </div>
                    </div>
                </div>

                <div class="bg-[#15112E] border border-indigo-900/60 rounded-2xl p-4">
                    <h4 class="text-xs text-indigo-300 font-bold mb-3 text-center">SELECT THE MISSING PIECE:</h4>
                    <div class="flex justify-center gap-3 flex-wrap">
                        ${options.map(k => `
                            <button onclick="game.pickSequence('${k}')" class="p-3 rounded-2xl bg-[#1A1635] border-2 border-indigo-700/50 hover:border-white flex flex-col items-center space-y-1 btn-prism transition">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="${this.shapeStyle(k)}">
                                    <i class="fa-solid ${SHAPES[k].icon} text-xl text-white"></i>
                                </div>
                                <span class="text-xs font-bold text-white">${SHAPES[k].name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <button onclick="game.verifySequence()" id="submit-btn" ${placed ? '' : 'disabled'} class="px-8 py-3 rounded-xl ${placed ? 'bg-teal-400 hover:bg-teal-300 text-slate-950' : 'bg-indigo-800 text-indigo-400'} font-display font-bold text-sm btn-prism transition">
                        CHECK PATTERN <i class="fa-solid fa-circle-check ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }

    generateSequence(basePattern, count) {
        const out = [];
        for (let i = 0; i < count; i++) out.push(basePattern[i % basePattern.length]);
        return out;
    }

    getSequenceOptions(correct, cycleLen) {
        const all = Object.keys(SHAPES);
        const opts = new Set([correct]);
        // Add one distractor
        if (cycleLen === 2) {
            // For AB, show both
            all.forEach(s => { if (s !== correct && opts.size < 2) opts.add(s); });
        } else {
            all.forEach(s => { if (s !== correct && opts.size < 3) opts.add(s); });
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    }

    pickSequence(shapeKey) {
        audioSystem.playClick();
        this.currentMission.placed = shapeKey;
        this.renderPuzzle();
    }

    verifySequence() {
        const { mission, zone, placed, inLighthouse } = this.currentMission;
        const correct = mission.basePattern[mission.preFilled % mission.basePattern.length];
        if (placed === correct) {
            this.handleSuccess(zone, mission, `The next piece is ${SHAPES[correct].name}! The pattern continues perfectly.`);
        } else {
            this.handleFailure('Look again at the repeating group. What shape completes the cycle?');
        }
    }

    // ---------- BRIDGE PUZZLE ----------
    renderBridgePuzzle() {
        const { mission, placed } = this.currentMission;
        const targetIdx = mission.targetIndex;
        const visible = [];
        for (let i = 0; i < targetIdx; i++) {
            visible.push({
                shape: mission.shapeCycle[i % mission.shapeCycle.length],
                stroke: mission.strokeCycle[i % mission.strokeCycle.length]
            });
        }

        const selShape = this.currentMission.selShape || null;
        const selStroke = this.currentMission.selStroke || null;

        this.setPrompt(`${mission.title}: Look for the repeating group, then choose the missing piece.`);

        document.getElementById('app-container').innerHTML = `
            <div class="w-full max-w-4xl bg-[#1A1635] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4 pb-4 border-b border-indigo-900/60">
                    <div>
                        <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">${mission.rule}</span>
                        <h2 class="font-display font-bold text-2xl text-white">${mission.title}</h2>
                    </div>
                    <button onclick="game.backFromMission()" class="text-indigo-300 hover:text-white text-sm">
                        <i class="fa-solid fa-arrow-left mr-1"></i>Back
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    <div class="bg-[#100D25] border border-indigo-900/60 rounded-xl p-3 flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">1</div>
                        <div>
                            <h4 class="text-xs font-bold text-white">Shape Rule</h4>
                            <p class="text-[11px] text-indigo-300">Cycle length ${mission.shapeCycle.length}: ${mission.shapeCycle.map(s => SHAPES[s].name).join(' → ')}</p>
                        </div>
                    </div>
                    <div class="bg-[#100D25] border border-indigo-900/60 rounded-xl p-3 flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">2</div>
                        <div>
                            <h4 class="text-xs font-bold text-white">Outline Rule</h4>
                            <p class="text-[11px] text-indigo-300">Cycle length ${mission.strokeCycle.length}: ${mission.strokeCycle.join(' → ')}</p>
                        </div>
                    </div>
                </div>

                <div id="puzzle-canvas" class="bg-[#100D25] border border-indigo-950 rounded-2xl p-6 mb-5 flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
                    ${visible.map(v => `
                        <div class="flex flex-col items-center">
                            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg" style="${this.shapeStyle(v.shape, v.stroke)}">
                                <i class="fa-solid ${SHAPES[v.shape].icon} text-2xl text-white"></i>
                            </div>
                            <span class="text-[9px] text-indigo-400 font-bold uppercase mt-1">${v.stroke}</span>
                        </div>
                    `).join('<i class="fa-solid fa-chevron-right text-indigo-700 text-xs"></i>')}
                    <i class="fa-solid fa-chevron-right text-indigo-700 text-xs"></i>
                    <div id="answer-slot" class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center pulse-slot" style="${selShape ? this.shapeStyle(selShape, selStroke) : 'border:2px dashed #FDCB6E;background:rgba(253,203,110,0.1);'}">
                        ${selShape
                            ? `<i class="fa-solid ${SHAPES[selShape].icon} text-xl text-white"></i><span class="text-[9px] text-white font-bold mt-1">${selStroke}</span>`
                            : '<span class="text-amber-300 font-bold text-xl">?</span>'}
                    </div>
                </div>

                <div class="bg-[#15112E] border border-indigo-900/60 rounded-2xl p-4 space-y-3">
                    <div>
                        <label class="text-xs text-indigo-300 font-bold block mb-2">STEP 1: SHAPE</label>
                        <div class="flex gap-2 flex-wrap">
                            ${mission.shapeCycle.map(s => `
                                <button onclick="game.pickBridgeShape('${s}')" class="flex-1 py-2 px-3 ${selShape === s ? 'bg-teal-500/30 border-teal-400' : 'bg-[#1A1635] border-indigo-700/50'} border-2 rounded-xl text-xs font-bold text-white hover:border-teal-400 transition">${SHAPES[s].name}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <label class="text-xs text-indigo-300 font-bold block mb-2">STEP 2: OUTLINE</label>
                        <div class="flex gap-2 flex-wrap">
                            ${[...new Set(mission.strokeCycle)].map(s => `
                                <button onclick="game.pickBridgeStroke('${s}')" class="flex-1 py-2 px-3 ${selStroke === s ? 'bg-purple-500/30 border-purple-400' : 'bg-[#1A1635] border-indigo-700/50'} border-2 rounded-xl text-xs font-bold text-white hover:border-purple-400 transition capitalize">${s}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="mt-5 flex justify-end">
                    <button onclick="game.verifyBridge()" id="submit-btn" ${selShape && selStroke ? '' : 'disabled'} class="px-8 py-3 rounded-xl ${selShape && selStroke ? 'bg-purple-500 hover:bg-purple-400 text-slate-950' : 'bg-indigo-800 text-indigo-400'} font-display font-bold text-sm btn-prism transition">
                        TEST BRIDGE <i class="fa-solid fa-bolt ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }

    pickBridgeShape(s) {
        audioSystem.playClick();
        this.currentMission.selShape = s;
        this.renderBridgePuzzle();
    }
    pickBridgeStroke(s) {
        audioSystem.playClick();
        this.currentMission.selStroke = s;
        this.renderBridgePuzzle();
    }
    verifyBridge() {
        const { mission, zone, selShape, selStroke } = this.currentMission;
        const correctShape = mission.shapeCycle[mission.targetIndex % mission.shapeCycle.length];
        const correctStroke = mission.strokeCycle[mission.targetIndex % mission.strokeCycle.length];
        if (selShape === correctShape && selStroke === correctStroke) {
            this.handleSuccess(zone, mission, `Position ${mission.targetIndex + 1} needs ${SHAPES[correctShape].name} with a ${correctStroke} outline. Bridge activated!`);
        } else {
            this.handleFailure('Check both rules! The shape follows one cycle, the outline follows another.');
        }
    }

    // ---------- SIGNAL PUZZLE ----------
    renderSignalPuzzle() {
        const { mission, placed } = this.currentMission;
        const maxBeats = mission.maxBeats;

        this.setPrompt(`${mission.title}: Look for the repeating group, then choose the missing piece.`);

        const signalRows = mission.signals.map(sig => `
            <div class="mb-3">
                <div class="flex justify-between text-xs font-bold mb-2" style="color:${sig.color}">
                    <span>Signal ${sig.name} — every ${sig.period} beats</span>
                    <span>${Array.from({length: Math.floor(maxBeats/sig.period)}).map((_,i) => (i+1)*sig.period).join(', ')}...</span>
                </div>
                <div class="grid gap-1 bg-[#1A1635] p-2 rounded-xl" style="grid-template-columns: repeat(${maxBeats}, minmax(0,1fr));">
                    ${Array.from({length: maxBeats}).map((_, i) => `
                        <div class="h-7 rounded flex items-center justify-center font-bold text-[10px] ${(i+1) % sig.period === 0 ? 'text-slate-950' : 'bg-indigo-950 text-indigo-600'}" ${(i+1) % sig.period === 0 ? `style="background-color:${sig.color}"` : ''}>
                            ${i+1}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.getElementById('app-container').innerHTML = `
            <div class="w-full max-w-5xl bg-[#1A1635] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4 pb-4 border-b border-indigo-900/60">
                    <div>
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">${mission.rule}</span>
                        <h2 class="font-display font-bold text-2xl text-white">${mission.title}</h2>
                    </div>
                    <button onclick="game.backFromMission()" class="text-indigo-300 hover:text-white text-sm">
                        <i class="fa-solid fa-arrow-left mr-1"></i>Back
                    </button>
                </div>

                <div id="puzzle-canvas" class="bg-[#100D25] border border-indigo-950 rounded-2xl p-4 mb-6 overflow-x-auto">
                    ${signalRows}
                </div>

                <div class="bg-[#15112E] border border-indigo-900/60 rounded-2xl p-6 text-center">
                    <label for="signal-input" class="text-sm text-indigo-200 font-bold block mb-3">At which beat will <em>all</em> signals flash together?</label>
                    <div class="flex justify-center items-center gap-3">
                        <input id="signal-input" type="number" min="1" max="${maxBeats}" placeholder="?"
                               class="w-24 text-center py-3 bg-[#100D25] border-2 border-indigo-500 rounded-xl text-2xl font-bold text-amber-300 focus:outline-none focus:border-teal-400">
                        <button onclick="game.verifySignal()" class="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm rounded-xl btn-prism">
                            TEST SYNC <i class="fa-solid fa-play ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    verifySignal() {
        const { mission, zone } = this.currentMission;
        const input = document.getElementById('signal-input');
        const val = Number(input.value);
        // Compute LCM correctly
        const lcm2 = (a, b) => a * b / this.gcd(a, b);
        let expected = mission.signals[0].period;
        for (let i = 1; i < mission.signals.length; i++) {
            expected = lcm2(expected, mission.signals[i].period);
        }
        if (val === expected) {
            this.handleSuccess(zone, mission, `LCM(${mission.signals.map(s => s.period).join(', ')}) = ${expected}. All signals flash in harmony at beat ${expected}!`);
        } else {
            this.handleFailure('Look for the smallest beat that is a multiple of every signal period. Use the grids above to check.');
        }
    }
    gcd(a, b) { return b === 0 ? a : this.gcd(b, a % b); }

    // ---------- SUCCESS / FAILURE / COMPLETION ----------
    handleSuccess(zone, mission, message) {
        audioSystem.playSuccess();
        this.celebrate();
        this.state.streak++;
        this.updateHUD();

        let stars = 3;
        const h = this.currentMission.hintsUsed;
        if (h === 1) stars = 2;
        else if (h >= 2) stars = 1;

        let continueAction;
        if (this.currentMission.inLighthouse) {
            const idx = this.currentMission.lighthouseChannel;
            this.lighthouseDone[idx] = true;
            try { localStorage.setItem('prismara_beacon', JSON.stringify(this.lighthouseDone)); } catch(e) {}
            continueAction = () => this.openLighthouse();
        } else {
            this.completeMission(zone, mission.id, stars);
            const nextMission = MISSIONS[zone].missions.find((m, i, arr) =>
                arr[i-1]?.id === mission.id);
            continueAction = () => nextMission ? this.startMission(zone, nextMission.id) : this.openZone(zone);
        }

        this.showModal(
            'Channel Restored!',
            `<p class="mb-3">${message}</p>
             <div class="flex justify-center space-x-1 mb-1">
                ${[1,2,3].map(n => `<i class="fa-solid fa-star text-2xl ${stars >= n ? 'gold-star' : 'empty-star'}"></i>`).join('')}
             </div>
             <p class="text-xs text-indigo-400">${h === 0 ? 'Perfect — no hints used!' : `Used ${h} hint${h>1?'s':''}`}</p>`,
            true,
            continueAction
        );
    }

    handleFailure(message) {
        audioSystem.playError();
        this.shakeEl('puzzle-canvas');
        this.shakeEl('answer-slot');
        this.state.streak = 0;
        this.updateHUD();
        this.setPrompt(message);
    }

    completeMission(zone, missionId, stars) {
        if (!this.state.progress[zone]) this.state.progress[zone] = {};
        const prev = this.state.progress[zone][missionId] || 0;
        if (stars > prev) this.state.progress[zone][missionId] = stars;
        this.saveProgress();
        this.checkAchievements();
        this.updateHUD();
    }

    checkAchievements() {
        const unlock = (key) => {
            if (!this.state.achievements[key]) {
                this.state.achievements[key] = true;
                this.saveAchievements();
                setTimeout(() => this.toastAchievement(key), 400);
            }
        };
        const anyDone = Object.values(this.state.progress).some(z => Object.keys(z).length > 0);
        if (anyDone) unlock('first');
        Object.keys(MISSIONS).forEach(zk => {
            if (this.zoneComplete(zk)) unlock(zk);
        });
        if (this.lighthouseDone.every(Boolean)) unlock('restore');
    }

    toastAchievement(key) {
        const a = ACHIEVEMENTS[key];
        audioSystem.playTone(880, 'sine', 0.15, 0.1);
        const el = document.createElement('div');
        el.className = 'fixed top-20 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl px-4 py-3 shadow-2xl z-[200] flex items-center space-x-3 font-display font-bold text-sm';
        el.style.animation = 'slideIn 0.4s ease';
        el.innerHTML = `<i class="fa-solid ${a.icon} text-lg"></i><div><div class="text-xs opacity-70">ACHIEVEMENT UNLOCKED</div><div>${a.name}</div></div>`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
    }

    backFromMission() {
        if (this.currentMission?.inLighthouse) this.openLighthouse();
        else if (this.currentMission) this.openZone(this.currentMission.zone);
        else this.goHome();
    }

    // ---------- LIGHTHOUSE ----------
    openLighthouse() {
        audioSystem.playClick();
        this.state.activeZone = 'lighthouse';
        this.currentMission = null;
        document.getElementById('hint-btn').classList.add('hidden');
        const ready = Object.keys(MISSIONS).every(zk => this.zoneComplete(zk));
        const allDone = this.lighthouseDone.every(Boolean);

        if (!ready) {
            this.setPrompt('Complete all zones first to unlock the Great Lighthouse!');
        } else if (allDone) {
            this.setPrompt('The Great Lighthouse shines brighter than ever! Prismara is restored.');
        } else {
            this.setPrompt('Connect each light channel to restore the beacon. Every channel uses a different pattern skill!');
        }

        const channels = LIGHTHOUSE_CHANNELS.map((ch, i) => {
            const done = this.lighthouseDone[i];
            const enabled = ready;
            const colorMap = { teal:'text-teal-300', indigo:'text-indigo-300', purple:'text-purple-300', amber:'text-amber-300' };
            return `
                <div onclick="${enabled && !done ? `game.startLighthouseChannel(${i})` : ''}"
                     class="${done ? 'border-emerald-500/50 bg-emerald-950/20' : enabled ? 'border-indigo-600 hover:border-teal-400 cursor-pointer' : 'border-indigo-800/50 opacity-60'} bg-[#15112E] border-2 rounded-2xl p-4 flex justify-between items-center transition">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center ${colorMap[ch.color]}">
                            <i class="fa-solid ${ch.icon}"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-white">Channel ${i+1}: ${ch.name}</h4>
                            <p class="text-xs ${done ? 'text-emerald-400' : 'text-indigo-400'} font-semibold">
                                ${done ? '<i class="fa-solid fa-circle-check mr-1"></i>Connected' : enabled ? 'Ready to connect' : 'Locked'}
                            </p>
                        </div>
                    </div>
                    <div class="w-9 h-9 rounded-lg ${done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/10 text-indigo-500'} flex items-center justify-center font-bold text-xs">
                        ${done ? '✓' : '?'}
                    </div>
                </div>
            `;
        }).join('');

        const power = Math.round((this.lighthouseDone.filter(Boolean).length / 4) * 100);

        document.getElementById('app-container').innerHTML = `
            <div class="w-full max-w-4xl bg-[#1A1635] border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <i class="fa-solid fa-tower-observation text-[200px] text-amber-300"></i>
                </div>
                <div class="flex justify-between items-center mb-4 relative">
                    <button onclick="game.goHome()" class="text-indigo-300 hover:text-white text-sm">
                        <i class="fa-solid fa-arrow-left mr-1"></i>Back to Hub
                    </button>
                </div>
                <div class="text-center mb-6 relative">
                    <span class="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">LIGHTHOUSE SPIRE</span>
                    <h2 class="font-display font-bold text-3xl text-white mt-2">Multi-Channel Light Restoration</h2>
                </div>

                <div class="max-w-md mx-auto bg-[#100D25] border border-indigo-900 rounded-2xl p-4 mb-6 relative">
                    <div class="flex justify-between text-xs text-indigo-300 font-bold mb-2">
                        <span>BEACON POWER</span>
                        <span class="text-amber-300">${power}%</span>
                    </div>
                    <div class="w-full bg-indigo-950 h-5 rounded-full overflow-hidden p-0.5 border border-indigo-800">
                        <div class="bg-gradient-to-r from-amber-400 via-teal-400 to-indigo-400 h-full rounded-full transition-all duration-700" style="width:${power}%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                    ${channels}
                </div>

                ${allDone ? `
                    <div class="mt-6 text-center relative">
                        <button onclick="game.grandFinale()" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-display font-bold text-lg btn-prism shadow-2xl animate-glow">
                            <i class="fa-solid fa-bolt mr-2"></i>IGNITE THE BEACON
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    startLighthouseChannel(idx) {
        audioSystem.playClick();
        const ch = LIGHTHOUSE_CHANNELS[idx];
        // Convert lighthouse channel config to a mission-like object
        const mission = {
            id: ch.id, title: ch.name, type: ch.type,
            basePattern: ch.basePattern,
            preFilled: ch.preFilled,
            shapeCycle: ch.shapeCycle,
            strokeCycle: ch.strokeCycle,
            targetIndex: ch.targetIndex,
            signals: ch.signals,
            maxBeats: ch.maxBeats,
            hint: ch.hint,
            rule: ch.rule
        };
        this.currentMission = {
            zone: 'lighthouse', missionId: ch.id, mission,
            hintsUsed: 0, placed: null,
            inLighthouse: true, lighthouseChannel: idx
        };
        document.getElementById('hint-btn').classList.remove('hidden');
        this.renderPuzzle();
    }

    grandFinale() {
        audioSystem.playSuccess();
        this.celebrate();
        this.checkAchievements();
        this.showModal(
            '✨ PRISMARA IS RESTORED ✨',
            `<p class="mb-3">The Great Lighthouse blazes once more, and the Lantern-Keeper bows with gratitude.</p>
             <p class="text-xs text-amber-300 font-bold mb-1">Total Stars: ${this.totalStars()} / 36</p>
             <p class="text-xs text-indigo-300">You mastered repeating patterns, dual-attribute cycles, and least common multiples!</p>`,
            true,
            () => this.goHome()
        );
    }

    // ---------- HINTS ----------
    requestHint() {
        if (this.currentMission && this.currentMission.mission) {
            this.currentMission.hintsUsed++;
            this.showModal(
                "Lantern-Keeper's Hint",
                `<p>${this.currentMission.mission.hint}</p>`,
                false
            );
        } else {
            this.showModal(
                "Lantern-Keeper's Guidance",
                `<p>Start a mission to get a specific hint! Meanwhile, remember: look for what repeats, and how often.</p>`,
                false
            );
        }
    }

    // ---------- DASHBOARD ----------
    openDashboard() {
        const zoneProgress = Object.keys(MISSIONS).map(zk => {
            const missions = MISSIONS[zk].missions;
            const done = missions.filter(m => (this.state.progress[zk]||{})[m.id] !== undefined).length;
            return `<div class="flex justify-between"><span>${MISSIONS[zk].name}:</span><span class="text-teal-300 font-bold">${done}/${missions.length}</span></div>`;
        }).join('');

        const achievementsHtml = Object.keys(ACHIEVEMENTS).map(k => {
            const a = ACHIEVEMENTS[k];
            const unlocked = this.state.achievements[k];
            return `<div class="flex items-center space-x-2 ${unlocked ? '' : 'opacity-40'}">
                <i class="fa-solid ${a.icon} ${unlocked ? 'text-amber-400' : 'text-indigo-600'} w-4"></i>
                <span class="${unlocked ? 'text-amber-300' : 'text-indigo-400'}">${a.name}</span>
            </div>`;
        }).join('');

        this.showModal('Parent & Educator Dashboard', `
            <div class="space-y-4 text-left text-xs">
                <div class="bg-[#100D25] p-3 rounded-xl border border-indigo-900">
                    <h4 class="font-bold text-indigo-200 mb-2">Progress Overview</h4>
                    <div class="space-y-1 text-indigo-300">${zoneProgress}</div>
                    <div class="flex justify-between mt-2 pt-2 border-t border-indigo-900">
                        <span>Total Stars:</span><span class="text-amber-300 font-bold">${this.totalStars()} / 36</span>
                    </div>
                </div>
                <div class="bg-[#100D25] p-3 rounded-xl border border-indigo-900">
                    <h4 class="font-bold text-indigo-200 mb-2">Achievements</h4>
                    <div class="space-y-1.5">${achievementsHtml}</div>
                </div>
                <div class="bg-[#100D25] p-3 rounded-xl border border-indigo-900">
                    <h4 class="font-bold text-indigo-200 mb-1">Learning Skills Covered</h4>
                    <ul class="text-indigo-300 space-y-0.5 mt-1">
                        <li>• Repeating patterns (AB, AAB, ABC, AABB)</li>
                        <li>• Dual-attribute cycles (shape + outline)</li>
                        <li>• Least common multiples & periodic synchronization</li>
                        <li>• Systematic prediction & verification</li>
                    </ul>
                </div>
            </div>
        `, false);
    }

    openSettings() {
        this.showModal('Menu', `
            <div class="space-y-3 text-left">
                <button onclick="game.toggleTTS(); game.closeModal();" class="w-full p-3 bg-[#100D25] border border-indigo-800 rounded-xl text-xs font-bold text-indigo-200 hover:text-white flex justify-between items-center">
                    <span>Read-Aloud (TTS)</span>
                    <span class="${this.state.accessibility.tts ? 'text-teal-400' : 'text-rose-400'}">${this.state.accessibility.tts ? 'ON' : 'OFF'}</span>
                </button>
                <button onclick="game.openDashboard();" class="w-full p-3 bg-[#100D25] border border-indigo-800 rounded-xl text-xs font-bold text-indigo-200 hover:text-white text-left">
                    <i class="fa-solid fa-chart-pie mr-2"></i>Parent Dashboard
                </button>
                <button onclick="if(confirm('Reset all progress? This cannot be undone.')) { ['prismara_progress_v2','prismara_achievements_v2','prismara_beacon','prismara_preferences'].forEach(k => localStorage.removeItem(k)); location.reload(); }" class="w-full p-3 bg-[#100D25] border border-rose-800/60 rounded-xl text-xs font-bold text-rose-300 hover:text-white text-left">
                    <i class="fa-solid fa-trash mr-2"></i>Reset All Progress
                </button>
                <button onclick="game.goHome(); game.closeModal();" class="w-full p-3 bg-indigo-600 rounded-xl text-xs font-bold text-white">
                    Return to Hub
                </button>
            </div>
        `, false);
    }

    // ---------- MODAL ----------
    showModal(title, html, isSuccess, onContinue) {
        this._modalOnContinue = onContinue || null;
        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        content.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full ${isSuccess ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'} flex items-center justify-center text-3xl">
                    <i class="fa-solid ${isSuccess ? 'fa-star text-amber-400' : 'fa-gem'}"></i>
                </div>
                <h3 class="font-display font-bold text-2xl text-white mb-3">${title}</h3>
                <div class="text-sm text-indigo-200 mb-6">${html}</div>
                <button onclick="game.closeModal()" class="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 font-display font-bold text-sm btn-prism">
                    CONTINUE
                </button>
            </div>
        `;
        modal.classList.remove('hidden');
        if (typeof html === 'string' && this.state.accessibility.tts) {
            const plain = html.replace(/<[^>]+>/g, ' ');
            audioSystem.speak(title + '. ' + plain);
        }
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
        if (this._modalOnContinue) {
            const fn = this._modalOnContinue;
            this._modalOnContinue = null;
            setTimeout(fn, 50);
        }
    }
}

// Slide-in animation for achievement toast
const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }';
document.head.appendChild(style);


