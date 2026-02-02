/**
 * LotusCycle Aura - Immersive Modal Controller
 * Handles Sacred Log, History, and Rituals with parchment aesthetics.
 */

class ModalController {
    constructor() {
        this.modals = {
            log: document.getElementById('log-modal'),
            history: document.getElementById('history-modal'),
            settings: document.getElementById('settings-modal')
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
            if (name === 'log') this.renderLogContent();
            if (name === 'history') this.renderHistoryContent();
        }
    }

    closeAll() {
        Object.values(this.modals).forEach(m => {
            if (m) m.classList.add('hidden');
        });

        // Also close rituals scroll if it's treated as a modal
        const rituals = document.getElementById('scroll-rituals');
        if (rituals) {
            rituals.classList.remove('open');
            setTimeout(() => rituals.classList.add('hidden'), 500);
        }
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
        const phase = state.getCurrentPhase();

        body.innerHTML = `
            <div class="space-y-10 animate-fade-in-up">
                <div class="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h3 class="font-display text-2xl mb-6 text-[#ffd700] tracking-widest uppercase opacity-80">Today's Flow</h3>
                    <div class="flex gap-4 justify-center mt-4">
                        ${[1, 2, 3, 4, 5].map(v => `
                            <button class="flow-dot w-14 h-14 rounded-full border border-white/20 flex items-center justify-center font-bold text-xl hover:bg-[#ffd700]/20 hover:border-[#ffd700] transition-all" data-value="${v}">
                                ${v}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h3 class="font-display text-2xl mb-6 text-[#ffd700] tracking-widest uppercase opacity-80">Sacred Mood</h3>
                    <div class="grid grid-cols-4 gap-4 mt-4">
                        ${MOOD_OPTIONS.map(m => `
                            <button class="mood-btn p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#ffd700]/10 hover:border-[#ffd700] transition-all flex flex-col items-center gap-2" data-mood="${m.label}">
                                <span class="text-3xl">${m.emoji}</span>
                                <span class="text-[10px] uppercase tracking-widest opacity-60">${m.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h3 class="font-display text-2xl mb-6 text-[#ffd700] tracking-widest uppercase opacity-80">Notes of the Heart</h3>
                    <textarea id="log-notes" class="w-full bg-transparent border border-white/10 rounded-2xl p-6 h-48 focus:outline-none focus:border-[#ffd700]/40 font-body text-lg leading-relaxed resize-none text-[#faf4e4]/90" placeholder="Let your thoughts flow..."></textarea>
                </div>
            </div>
        `;

        // Add listeners to dots
        body.querySelectorAll('.flow-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                body.querySelectorAll('.flow-dot').forEach(d => {
                    d.style.background = 'transparent';
                    d.style.color = 'inherit';
                    d.style.borderColor = 'rgba(255,255,255,0.2)';
                });
                dot.style.background = '#ffd700';
                dot.style.color = '#000';
                dot.style.borderColor = '#ffd700';
                this.tempFlow = dot.dataset.value;
            });
        });

        // Add listeners to mood buttons  
        body.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                body.querySelectorAll('.mood-btn').forEach(b => {
                    b.style.background = 'rgba(255,255,255,0.05)';
                    b.style.borderColor = 'rgba(255,255,255,0.1)';
                });
                btn.style.background = 'rgba(255,215,0,0.2)';
                btn.style.borderColor = '#ffd700';
                this.tempMood = btn.dataset.mood;
            });
        });
    }

    async saveCurrentLog() {
        const notes = document.getElementById('log-notes').value;
        const date = new Date().toISOString().split('T')[0];

        await window.cycleStore.addLog({
            date,
            flow: this.tempFlow || 1,
            mood: this.tempMood || 'Neutral',
            notes,
            day: window.cycleStore.getState().getCycleDay()
        });

        this.closeAll();
        this.showToast("Ritual Recorded");

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

        // Generate calendar for current cycle
        const calendarHTML = this.generateCalendar(currentDay, cycleLength);

        if (!logs || logs.length === 0) {
            body.innerHTML = `
                ${calendarHTML}
                <div class="text-center py-12 opacity-60 mt-8">
                    <span class="text-5xl block mb-4">📜</span>
                    <p class="italic font-display text-xl">The river is calm. No entries recorded yet.</p>
                </div>
            `;
            return;
        }

        body.innerHTML = `
            ${calendarHTML}
            <h3 class="font-display text-2xl text-[#ffd700] mt-12 mb-6 tracking-widest uppercase border-t border-white/10 pt-8">Log History</h3>
            <div class="space-y-6">
                ${logs.map(log => {
            const phase = getPhaseFromDay(log.day, cycleLength);
            const phaseData = getPhaseData(phase);
            return `
                        <div class="relative p-8 bg-white/5 rounded-[2rem] border border-white/10 hover:border-[#ffd700]/30 transition-all group">
                            <div class="flex justify-between items-start mb-4">
                                <span class="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase">${new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span class="px-4 py-1.5 bg-[#ffd700]/10 text-[#ffd700] text-[10px] rounded-full uppercase tracking-widest font-semibold border border-[#ffd700]/20">Day ${log.day} • ${phaseData.name}</span>
                            </div>
                            <div class="flex items-center gap-4 mb-4">
                                <span class="text-3xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">${this.getMoodEmoji(log.mood)}</span>
                                <div class="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-[#ffd700] to-[#ffaa00]" style="width: ${log.flow * 20}%"></div>
                                </div>
                            </div>
                            ${log.notes ? `<p class="text-base italic text-[#faf4e4]/70 mt-4 leading-relaxed font-light">"${log.notes}"</p>` : ''}
                        </div>
                    `;
        }).join('')}
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

            // Calculate the real date for this cycle day
            const realDate = new Date(lastPeriodStart);
            realDate.setDate(lastPeriodStart.getDate() + (day - 1));
            const monthDay = realDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            days.push(`
                <div class="relative flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isToday ? 'ring-2 ring-[#ffd700] shadow-lg shadow-[#ffd700]/30 scale-105' : 'hover:scale-105'}"
                     style="background: linear-gradient(135deg, ${phaseData.color}${isFuture ? '30' : '70'}, ${phaseData.color}${isFuture ? '50' : 'A0'});">
                    <div class="text-xs font-bold text-white/90 mb-0.5">Day ${day}</div>
                    <div class="text-[9px] text-white/60 font-medium">${monthDay}</div>
                    ${isToday ? '<div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#ffd700] rounded-full animate-pulse shadow-lg shadow-[#ffd700]/50"></div>' : ''}
                </div>
            `);
        }

        return `
            <div class="mb-8">
                <h3 class="font-display text-2xl text-[#ffd700] mb-6 tracking-widest uppercase text-center">Cycle Calendar</h3>
                <div class="grid grid-cols-7 gap-2 mb-6">
                    ${days.join('')}
                </div>
                <div class="flex flex-wrap justify-center gap-4 text-xs mt-6 pb-6 border-b border-white/10">
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-lg shadow-md" style="background: linear-gradient(135deg, #7A1E2D, #A02838);"></div>
                        <span class="text-white/80 font-medium">Menstrual</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-lg shadow-md" style="background: linear-gradient(135deg, #7FB3A6, #9CC5BB);"></div>
                        <span class="text-white/80 font-medium">Follicular</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-lg shadow-md" style="background: linear-gradient(135deg, #F2C94C, #F7D76E);"></div>
                        <span class="text-white/80 font-medium">Ovulatory</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-lg shadow-md" style="background: linear-gradient(135deg, #6B5B95, #8B7BA8);"></div>
                        <span class="text-white/80 font-medium">Luteal</span>
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
