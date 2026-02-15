/**
 * LotusCycle Aura - Modal Controller
 * Handles Daily Log, History, and Rituals with a luxury glassmorphism feel.
 */

class ModalController {
    constructor() {
        this.modals = {
            log: document.getElementById('log-modal'),
            history: document.getElementById('history-modal'),
            rituals: document.getElementById('scroll-rituals')
        };

        this.lastActionTime = 0;
        this.init();
    }

    init() {
        // Bind close buttons
        document.getElementById('close-log-modal')?.addEventListener('click', () => this.close('log'));
        document.getElementById('close-history-modal')?.addEventListener('click', () => this.close('history'));
        document.getElementById('close-rituals-modal')?.addEventListener('click', () => this.close('rituals'));

        // Handle backdrop clicks
        Object.values(this.modals).forEach(modal => {
            if (!modal) return;
            const backdrop = modal.querySelector('.modal-backdrop');
            backdrop?.addEventListener('click', () => {
                const type = Object.keys(this.modals).find(key => this.modals[key] === modal);
                this.close(type);
            });
        });

        // Bind Save Log button
        document.getElementById('save-log')?.addEventListener('click', () => this.saveDailyLog());
    }

    open(type) {
        const now = Date.now();
        if (now - this.lastActionTime < 300) {
            console.log('⏳ modalController.open ignored (rate limited)');
            return;
        }
        this.lastActionTime = now;

        console.log('🔮 modalController.open TRIGGERED:', type);
        const modal = this.modals[type];
        if (!modal) {
            console.error('❌ Modal not found:', type);
            return;
        }

        // Close others first
        this.closeAll();

        // Populate content before showing
        if (type === 'log') this.prepareLogForm();
        if (type === 'history') this.renderHistory();
        if (type === 'rituals') this.renderRituals();

        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');

        // Animation handled by CSS
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    close(type) {
        console.log('🌑 modalController.close TRIGGERED:', type);
        const modal = this.modals[type];
        if (!modal) return;

        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            if (!document.querySelector('.modal:not(.hidden)')) {
                document.body.classList.remove('modal-open');
            }
        }, 300);
    }

    closeAll(source = 'unknown') {
        console.log(`🌑 modalController.closeAll() called [Source: ${source}]`);
        Object.keys(this.modals).forEach(type => {
            const modal = this.modals[type];
            if (modal && !modal.classList.contains('hidden')) {
                this.close(type);
            }
        });
    }

    prepareLogForm() {
        const body = document.getElementById('log-body');
        if (!body) return;

        const state = window.cycleStore.getState();
        const today = new Date().toISOString().split('T')[0];

        // Mood options based on biophilic theme
        const moods = [
            { icon: '🌙', label: 'Reflective' },
            { icon: '🌱', label: 'Emerged' },
            { icon: '☀️', label: 'Radiant' },
            { icon: '🌊', label: 'Flowing' },
            { icon: '🕯️', label: 'Sacred' }
        ];

        body.innerHTML = `
            <div class="space-y-8 animate-fade-in">
                <div class="form-group">
                    <label class="block text-[10px] uppercase tracking-[0.3em] text-gold/60 mb-4">Mood Alchemy</label>
                    <div class="flex justify-between gap-2">
                        ${moods.map(m => `
                            <button class="mood-btn flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 transition-all flex flex-col items-center gap-2" data-mood="${m.label}">
                                <span class="text-2xl">${m.icon}</span>
                                <span class="text-[9px] uppercase tracking-widest opacity-60">${m.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="block text-[10px] uppercase tracking-[0.3em] text-gold/60 mb-4">Daily Reflection</label>
                    <textarea id="log-notes" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[#faf4e4] focus:border-gold/40 focus:outline-none min-h-[120px]" placeholder="Whisper your thoughts to the aura..."></textarea>
                </div>

                <div class="flex items-center gap-4 p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                    <span class="text-xl">🩸</span>
                    <div class="flex-1">
                        <span class="block text-[10px] uppercase tracking-widest text-gold/80">Bleeding Flow</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="log-period" class="sr-only peer">
                        <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-900/40"></div>
                    </label>
                </div>
            </div>
        `;

        // Bind mood buttons
        const moodBtns = body.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.onclick = () => {
                moodBtns.forEach(b => b.classList.remove('border-gold/60', 'bg-gold/10'));
                btn.classList.add('border-gold/60', 'bg-gold/10');
                this.selectedMood = btn.dataset.mood;
            };
        });
    }

    async saveDailyLog() {
        const notes = document.getElementById('log-notes')?.value;
        const isPeriod = document.getElementById('log-period')?.checked;
        const date = new Date().toISOString().split('T')[0];

        const logEntry = {
            date,
            mood: this.selectedMood || 'Neutral',
            notes: notes || '',
            isPeriod: isPeriod || false
        };

        try {
            await window.cycleStore.getState().addLog(logEntry);

            // If period started today, update lastPeriodStart
            if (isPeriod) {
                await window.cycleStore.getState().updateSettings({
                    lastPeriodStart: date
                });
            }

            console.log('✅ Log saved successfully');
            this.close('log');

            // Trigger feedback
            if (window.lotusApp) window.lotusApp.refreshUI();
        } catch (err) {
            console.error('❌ Failed to save log:', err);
        }
    }

    renderHistory() {
        const body = document.getElementById('history-body');
        if (!body) return;

        const logs = window.cycleStore.getState().logs || [];

        if (logs.length === 0) {
            body.innerHTML = `
                <div class="text-center py-20 opacity-40 italic">
                    <p>No scrolls found in your history yet.</p>
                </div>
            `;
            return;
        }

        // Sort by date descending
        const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

        body.innerHTML = sortedLogs.map(log => `
            <div class="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] uppercase tracking-[0.3em] text-gold/80">${new Date(log.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    ${log.isPeriod ? '<span class="text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-200 border border-red-900/50">Cycle Day 1</span>' : ''}
                </div>
                <div class="flex items-start gap-4">
                    <span class="text-2xl pt-1">${this.getMoodIcon(log.mood)}</span>
                    <div class="flex-1">
                        <p class="text-sm italic text-[#faf4e4]/90 mb-2 leading-relaxed">"${log.notes || 'No reflections recorded.'}"</p>
                        <p class="text-[9px] uppercase tracking-widest text-gold/40">Mood: ${log.mood}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRituals() {
        const body = document.getElementById('rituals-content');
        if (!body) return;

        const state = window.cycleStore.getState();
        const day = state.getCycleDay();
        const phase = getPhaseFromDay(day, state.settings.cycleLength);
        const data = getPhaseData(phase);

        if (!data || !data.rituals) return;

        body.innerHTML = `
            <div class="space-y-8 animate-fade-in">
                <p class="italic text-[#faf4e4] opacity-80 tracking-wide font-light leading-relaxed">${data.rituals.intro}</p>
                <div class="grid gap-6">
                    ${data.rituals.practices.map(r => `
                        <div class="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <span class="text-2xl">${r.icon}</span>
                            <div>
                                <h4 class="text-gold font-display text-xl mb-2 tracking-wider">${r.name}</h4>
                                <p class="text-sm text-[#faf4e4]/80 leading-relaxed">${r.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getMoodIcon(mood) {
        const moods = {
            'Reflective': '🌙',
            'Emerged': '🌱',
            'Radiant': '☀️',
            'Flowing': '🌊',
            'Sacred': '🕯️'
        };
        return moods[mood] || '✨';
    }
}

// Attach to window so LotusCycleApp can find it
window.ModalController = ModalController;
