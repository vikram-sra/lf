/**
 * LotusCycle Aura - Immersive Modal Controller
 * Handles Sacred Log, History, and Rituals with parchment aesthetics.
 */

class ModalController {
    constructor() {
        this.modals = {
            log: document.getElementById('log-modal'),
            history: document.getElementById('history-modal'),
            settings: document.getElementById('settings-modal'),
            rituals: document.getElementById('scroll-rituals')
        };
        this.init();
    }

    init() {
        window.addEventListener('modal:open', (e) => this.open(e.detail.modal));

        // Close on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(b => {
            b.addEventListener('click', () => this.closeAll());
        });

        // Close on close button
        document.querySelectorAll('.modal-close').forEach(c => {
            c.addEventListener('click', () => this.closeAll());
        });

        this.setupLogModal();
    }

    open(name) {
        const modal = this.modals[name];
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('scroll-mode-active');
            if (name === 'log') this.renderLogContent();
            if (name === 'history') this.renderHistoryContent();
            if (name === 'rituals') this.renderRitualsContent();
        }
    }

    closeAll() {
        Object.values(this.modals).forEach(m => {
            if (m) m.classList.add('hidden');
        });

        const rituals = document.getElementById('scroll-rituals');
        if (rituals) {
            rituals.classList.remove('open');
            setTimeout(() => rituals.classList.add('hidden'), 500);
        }

        document.body.classList.remove('scroll-mode-active');
    }

    setupLogModal() {
        // Handle save logic
        const saveBtn = document.getElementById('save-log');
        saveBtn?.addEventListener('click', () => this.saveCurrentLog());
    }

    async renderLogContent() {
        const body = document.getElementById('log-body');
        const state = window.cycleStore.getState();
        const cycleDay = state.getCycleDay();

        body.innerHTML = `
            <div class="space-y-6 animate-fade-in-up">
                <!-- Flow Section -->
                <div class="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <h3 class="font-display text-lg mb-4 text-gold tracking-[0.2em] uppercase opacity-90 font-light text-center">Sacred Flow</h3>
                    <div class="flex gap-4 justify-center">
                        ${[1, 2, 3, 4, 5].map(v => `
                            <button class="flow-dot w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-light text-base hover:bg-gold/20 hover:border-gold transition-all duration-500 hover:scale-110" data-value="${v}">
                                ${v}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Mood Section -->
                <div class="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <h3 class="font-display text-lg mb-4 text-gold tracking-[0.2em] uppercase opacity-90 font-light text-center">Gaze Within</h3>
                    <div class="grid grid-cols-4 gap-3">
                        ${MOOD_OPTIONS.map(m => `
                            <button class="mood-btn p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-gold/10 hover:border-gold transition-all duration-500 flex flex-col items-center gap-2 group" data-mood="${m.label}">
                                <span class="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:scale-125 transition-transform duration-500">${m.emoji}</span>
                                <span class="text-[8px] uppercase tracking-[0.2em] font-bold opacity-40 group-hover:opacity-100 transition-opacity">${m.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Notes Section -->
                <div class="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <h3 class="font-display text-lg mb-4 text-gold tracking-[0.2em] uppercase opacity-90 font-light text-center">Echoes of the Soul</h3>
                    <textarea id="log-notes" class="w-full bg-transparent border border-white/5 rounded-2xl p-4 h-28 focus:outline-none focus:border-gold/30 font-body text-sm leading-relaxed resize-none text-[#faf4e4]/80 placeholder:opacity-20" placeholder="Whisper your heart..."></textarea>
                </div>
            </div>
        `;

        // Interaction logic for buttons
        body.querySelectorAll('.flow-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                body.querySelectorAll('.flow-dot').forEach(d => {
                    d.style.background = 'transparent';
                    d.style.color = 'inherit';
                    d.style.borderColor = 'rgba(255,255,255,0.1)';
                    d.classList.remove('ring-2', 'ring-gold/50');
                });
                dot.style.background = 'rgba(255, 215, 0, 0.9)';
                dot.style.color = '#000';
                dot.style.borderColor = '#ffd700';
                dot.classList.add('ring-2', 'ring-gold/50');
                this.tempFlow = dot.dataset.value;
            });
        });

        body.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                body.querySelectorAll('.mood-btn').forEach(b => {
                    b.style.background = 'rgba(255,255,255,0.02)';
                    b.style.borderColor = 'rgba(255,255,255,0.1)';
                    b.classList.remove('ring-1', 'ring-gold/30');
                });
                btn.style.background = 'rgba(255, 215, 0, 0.1)';
                btn.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                btn.classList.add('ring-1', 'ring-gold/30');
                this.tempMood = btn.dataset.mood;
            });
        });

        // Style the save button as well
        const saveBtn = document.getElementById('save-log');
        if (saveBtn) {
            saveBtn.className = "w-full mt-8 py-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-bold tracking-[0.3em] uppercase text-sm hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-2xl shadow-gold/20";
        }
    }

    async saveCurrentLog() {
        const notes = document.getElementById('log-notes').value;
        const date = new Date().toISOString().split('T')[0];
        const state = window.cycleStore.getState();

        await state.addLog({
            date,
            flow: this.tempFlow || 1,
            mood: this.tempMood || 'Neutral',
            notes,
            day: state.getCycleDay()
        });

        this.closeAll();
        this.showToast("Ritual Recorded ✨");

        // Reset temp values
        this.tempFlow = null;
        this.tempMood = null;
    }

    showToast(msg) {
        // Simple implementation
        console.log("Toast:", msg);
    }

    async renderHistoryContent() {
        const body = document.getElementById('history-body');
        const state = window.cycleStore.getState();
        const logs = [...state.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        const cycleLength = state.settings.cycleLength;
        const currentDay = state.getCycleDay();

        const calendarHTML = this.generateCalendar(currentDay, cycleLength);

        body.innerHTML = `
            <div class="animate-fade-in-up">
                ${calendarHTML}
                
                <div class="mt-12">
                    <h3 class="font-display text-xl text-gold mb-8 tracking-[0.3em] uppercase text-center font-light opacity-60">Past Reflections</h3>
                    
                    ${logs.length === 0 ? `
                        <div class="text-center py-16 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl">
                            <span class="text-5xl block mb-6 opacity-20 filter grayscale">📜</span>
                            <p class="italic text-[#faf4e4]/30 font-light tracking-widest text-sm uppercase">The river holds no echoes yet.</p>
                        </div>
                    ` : `
                        <div class="space-y-6">
                            ${logs.map(log => {
            const phase = getPhaseFromDay(log.day, cycleLength);
            const phaseData = getPhaseData(phase);
            return `
                                    <div class="relative p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-gold/20 transition-all duration-700 group backdrop-blur-md">
                                        <div class="flex justify-between items-center mb-6">
                                            <div class="flex flex-col">
                                                <span class="text-[9px] font-black tracking-[0.3em] text-gold uppercase opacity-60 mb-1">${new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                                <span class="text-[10px] text-white/20 tracking-[0.2em] uppercase font-bold">Inner Day ${log.day}</span>
                                            </div>
                                            <span class="px-3 py-1 bg-white/5 text-white/40 text-[8px] rounded-full uppercase tracking-[0.25em] font-black border border-white/5">${phaseData.name}</span>
                                        </div>
                                        <div class="flex items-center gap-6">
                                            <div class="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:bg-gold/5 group-hover:border-gold/10 transition-all duration-700">
                                                ${this.getMoodEmoji(log.mood)}
                                            </div>
                                            <div class="flex-1">
                                                <div class="h-[2px] w-full bg-white/5 rounded-full mb-4 overflow-hidden">
                                                    <div class="h-full bg-gradient-to-r from-gold/50 to-gold" style="width: ${log.flow * 20}%"></div>
                                                </div>
                                                <div class="flex justify-between text-[7px] uppercase tracking-[0.4em] opacity-20 font-black">
                                                    <span>Stillness</span>
                                                    <span>Vibrancy</span>
                                                </div>
                                            </div>
                                        </div>
                                        ${log.notes ? `<p class="mt-6 pt-6 border-t border-white/5 text-xs italic text-[#faf4e4]/50 leading-relaxed font-light font-body tracking-wide">"${log.notes}"</p>` : ''}
                                    </div>
                                `;
        }).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    async renderRitualsContent() {
        const body = document.getElementById('rituals-content');
        const state = window.cycleStore.getState();
        const cycleDay = state.getCycleDay();
        const phase = getPhaseFromDay(cycleDay, state.settings.cycleLength);
        const phaseData = getPhaseData(phase);

        if (!body || !phaseData.rituals) return;

        body.innerHTML = `
            <div class="animate-fade-in-up">
                <p class="italic mb-10 text-[#faf4e4]/50 text-center text-sm tracking-[0.1em] leading-relaxed font-light">Sacred practices for the ${phaseData.name}.</p>
                <div class="grid gap-6">
                    ${phaseData.rituals.map(r => `
                        <div class="p-6 bg-white/5 border border-white/5 rounded-3xl shadow-2xl backdrop-blur-xl transition-all duration-700 hover:bg-gold/5 hover:border-gold/10 group">
                            <h4 class="font-display text-xl text-gold mb-3 tracking-[0.2em] font-light group-hover:tracking-[0.3em] transition-all duration-700 uppercase">${r.name}</h4>
                            <p class="text-xs leading-relaxed text-[#faf4e4]/60 tracking-widest font-light" style="line-height: 2;">${r.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateCalendar(currentDay, cycleLength) {
        const state = window.cycleStore.getState();
        const lastPeriodStart = new Date(state.settings.lastPeriodStart);
        const days = [];

        for (let day = 1; day <= cycleLength; day++) {
            const phase = getPhaseFromDay(day, cycleLength);
            const phaseData = getPhaseData(phase);
            const isToday = day === currentDay;
            const isFuture = day > currentDay;

            const realDate = new Date(lastPeriodStart);
            realDate.setDate(lastPeriodStart.getDate() + (day - 1));
            const monthDay = realDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            days.push(`
                <div class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-700 cursor-pointer ${isToday ? 'ring-2 ring-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-110 z-10' : 'hover:scale-110 hover:z-20'} overflow-hidden"
                     style="background: ${isFuture ? 'rgba(255,255,255,0.05)' : phaseData.color + '60'}; border: 1px solid rgba(255,255,255,0.1); min-height: 52px;">
                    <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
                    <div class="text-[10px] font-black text-white ${isFuture ? 'opacity-30' : 'opacity-100'} mb-0.5 tracking-tighter">${day}</div>
                    <div class="text-[8px] text-white/50 uppercase tracking-tighter font-extrabold scale-90">${monthDay.replace(' ', '')}</div>
                    ${isToday ? '<div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#ffd700]"></div>' : ''}
                    ${!isFuture ? `<div class="absolute bottom-0 left-0 w-full h-[4px]" style="background: ${phaseData.color}"></div>` : ''}
                </div>
            `);
        }

        return `
            <div class="p-6 bg-black/40 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative backdrop-blur-3xl">
                <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                <h3 class="font-display text-lg text-gold mb-8 tracking-[0.4em] uppercase text-center font-bold opacity-100 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">Solar Rhythm</h3>
                <div class="grid grid-cols-7 gap-1.5 mb-10">
                    ${days.join('')}
                </div>
                <!-- Precision Legend -->
                <div class="flex justify-between gap-2 text-[8px] pt-6 border-t border-white/10 uppercase tracking-[0.3em] font-black">
                    <div class="flex items-center gap-1.5 opacity-90">
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_#7A1E2D]" style="background: #7A1E2D;"></div>
                        <span class="text-white/70">MENSTRUAL</span>
                    </div>
                    <div class="flex items-center gap-1.5 opacity-90">
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_#7FB3A6]" style="background: #7FB3A6;"></div>
                        <span class="text-white/70">FOLLICULAR</span>
                    </div>
                    <div class="flex items-center gap-1.5 opacity-90">
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_#F2C94C]" style="background: #F2C94C;"></div>
                        <span class="text-white/70">OVULATORY</span>
                    </div>
                    <div class="flex items-center gap-1.5 opacity-90">
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_#6B5B95]" style="background: #6B5B95;"></div>
                        <span class="text-white/70">LUTEAL</span>
                    </div>
                </div>
            </div>
        `;
    }

    getMoodEmoji(moodLabel) {
        const mood = MOOD_OPTIONS.find(m => m.label === moodLabel);
        return mood ? mood.emoji : '✨';
    }

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#1a4a2a] text-[#f5e8c8] rounded-full shadow-2xl z-[200] animate-slide-up font-display text-lg tracking-widest pointer-events-none border border-sun-glow/30';
        toast.innerHTML = `<span class="text-sun-glow mr-2">✦</span> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// Mood Options for Sacred Log
const MOOD_OPTIONS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😤', label: 'Irritated' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😍', label: 'Loving' },
    { emoji: '😴', label: 'Tired' }
];
