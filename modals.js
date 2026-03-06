/**
 * LotusCycle Aura - Modal controller
 * Features: log, history, rituals, settings, CSV import/export, delete entries
 */

class ModalController {
    constructor() {
        this.modals = {
            log: document.getElementById('log-modal'),
            history: document.getElementById('history-modal'),
            rituals: document.getElementById('scroll-rituals')
        };

        this.selectedMood = null;
        this.activeType = null;
        this.lastActionTime = 0;
        this.prevFocusedEl = null;

        this.init();
    }

    init() {
        document.getElementById('close-log-modal')?.addEventListener('click', () => this.close('log'));
        document.getElementById('close-history-modal')?.addEventListener('click', () => this.close('history'));
        document.getElementById('close-rituals-modal')?.addEventListener('click', () => this.close('rituals'));

        Object.entries(this.modals).forEach(([type, modal]) => {
            const backdrop = modal?.querySelector('.modal-backdrop');
            backdrop?.addEventListener('click', () => this.close(type));
        });

        document.getElementById('save-log')?.addEventListener('click', () => this.saveDailyLog());

        document.getElementById('export-json')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('export-csv')?.addEventListener('click', () => this.exportCSV());
        document.getElementById('import-data')?.addEventListener('click', () => {
            document.getElementById('import-file')?.click();
        });
        document.getElementById('import-file')?.addEventListener('change', (e) => this.importData(e));
        document.getElementById('reset-data')?.addEventListener('click', () => this.resetData());
        document.getElementById('save-settings')?.addEventListener('click', () => this.saveSettings());

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onKeyDown(e) {
        if (!this.activeType) return;

        const modal = this.modals[this.activeType];
        if (!modal || modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            this.close(this.activeType);
            return;
        }

        if (e.key !== 'Tab') return;

        const focusables = modal.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    open(type) {
        const now = Date.now();
        if (now - this.lastActionTime < 240) return;
        this.lastActionTime = now;

        const modal = this.modals[type];
        if (!modal) return;

        window.scrollSystem?.closeAll?.();
        this.closeAll();

        if (type === 'log') this.prepareLogForm();
        if (type === 'history') {
            this.renderHistory();
            this.renderSettings();
        }
        if (type === 'rituals') this.renderRituals();

        this.prevFocusedEl = document.activeElement;
        this.activeType = type;

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content')?.focus();
        });
    }

    close(type) {
        const modal = this.modals[type];
        if (!modal) return;

        modal.style.opacity = '0';
        modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            modal.classList.add('hidden');
            if (!document.querySelector('.modal:not(.hidden)')) {
                document.body.classList.remove('modal-open');
                this.activeType = null;
                this.prevFocusedEl?.focus?.();
            }
        }, 220);
    }

    closeAll() {
        Object.values(this.modals).forEach((modal) => {
            if (!modal) return;
            modal.classList.add('hidden');
            modal.style.opacity = '0';
            modal.setAttribute('aria-hidden', 'true');
        });

        this.activeType = null;
        document.body.classList.remove('modal-open');
    }

    prepareLogForm() {
        const body = document.getElementById('log-body');
        if (!body) return;

        const moods = [
            { icon: '🌙', label: 'Reflective' },
            { icon: '🌱', label: 'Emerged' },
            { icon: '☀️', label: 'Radiant' },
            { icon: '🌊', label: 'Flowing' },
            { icon: '🕯️', label: 'Sacred' }
        ];

        body.innerHTML = `
            <section>
                <p class="field-title">Mood Alchemy</p>
                <div class="mood-grid">
                    ${moods.map((m) => `
                        <button type="button" class="mood-btn" data-mood="${m.label}">
                            <span>${m.icon}</span>
                            <small>${m.label}</small>
                        </button>
                    `).join('')}
                </div>
            </section>

            <section>
                <p class="field-title">Daily Reflection</p>
                <textarea id="log-notes" placeholder="Share your thoughts for today..."></textarea>
            </section>

            <section>
                <p class="field-title">Symptoms</p>
                <div class="symptom-grid">
                    <div class="symptom-field"><label for="symptom-pain">Pain <span class="symptom-value" data-for="symptom-pain">0</span></label><input id="symptom-pain" type="range" min="0" max="10" value="0"></div>
                    <div class="symptom-field"><label for="symptom-bloating">Bloating <span class="symptom-value" data-for="symptom-bloating">0</span></label><input id="symptom-bloating" type="range" min="0" max="10" value="0"></div>
                    <div class="symptom-field"><label for="symptom-energy">Energy <span class="symptom-value" data-for="symptom-energy">5</span></label><input id="symptom-energy" type="range" min="0" max="10" value="5"></div>
                    <div class="symptom-field"><label for="symptom-sleep">Sleep <span class="symptom-value" data-for="symptom-sleep">5</span></label><input id="symptom-sleep" type="range" min="0" max="10" value="5"></div>
                </div>
            </section>

            <label class="switch-row" for="log-period">
                <span>Bleeding Flow Today</span>
                <input id="log-period" type="checkbox">
            </label>
        `;

        // Live slider value updates
        body.querySelectorAll('input[type="range"]').forEach((slider) => {
            const valueEl = body.querySelector(`.symptom-value[data-for="${slider.id}"]`);
            if (valueEl) {
                slider.addEventListener('input', () => {
                    valueEl.textContent = slider.value;
                });
            }
        });

        this.selectedMood = null;
        const moodButtons = body.querySelectorAll('.mood-btn');
        moodButtons.forEach((button) => {
            button.addEventListener('click', () => {
                moodButtons.forEach((b) => b.classList.remove('active'));
                button.classList.add('active');
                this.selectedMood = button.dataset.mood;
            });
        });
    }

    async saveDailyLog() {
        const date = new Date().toISOString().split('T')[0];
        const notes = document.getElementById('log-notes')?.value?.trim() || '';
        const isPeriod = document.getElementById('log-period')?.checked || false;

        const entry = {
            date,
            mood: this.selectedMood || 'Neutral',
            notes,
            isPeriod,
            symptoms: {
                pain: Number(document.getElementById('symptom-pain')?.value || 0),
                bloating: Number(document.getElementById('symptom-bloating')?.value || 0),
                energy: Number(document.getElementById('symptom-energy')?.value || 0),
                sleep: Number(document.getElementById('symptom-sleep')?.value || 0)
            }
        };

        try {
            const store = window.cycleStore.getState();
            await store.addLog(entry);

            if (isPeriod) {
                await store.updateSettings({ lastPeriodStart: date });
                store.clearSelectedDay();
            }

            showToast('Entry recorded ✦', 'success');
            this.close('log');
        } catch (err) {
            console.error('Saving log failed:', err);
            showToast('Could not save entry. Please try again.', 'error');
        }
    }

    renderHistory() {
        const container = document.getElementById('history-body');
        if (!container) return;

        const store = window.cycleStore.getState();
        const logs = [...(store.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
        const predictions = store.getPredictions();

        const avgPain = logs.length
            ? (logs.reduce((sum, log) => sum + Number(log?.symptoms?.pain || 0), 0) / logs.length).toFixed(1)
            : '0.0';

        const moodCounts = logs.reduce((acc, log) => {
            acc[log.mood] = (acc[log.mood] || 0) + 1;
            return acc;
        }, {});
        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        // Cycle countdown
        const today = new Date();
        const daysUntilPeriod = Math.max(0, Math.ceil((predictions.nextPeriodStart - today) / (1000 * 60 * 60 * 24)));

        const statsHtml = `
            <div class="stats-grid">
                <article class="stat-card"><p class="stat-label">Next Period</p><p class="stat-value">${this.formatDate(predictions.nextPeriodStart)}</p></article>
                <article class="stat-card"><p class="stat-label">Days Until</p><p class="stat-value">${daysUntilPeriod} day${daysUntilPeriod !== 1 ? 's' : ''}</p></article>
                <article class="stat-card"><p class="stat-label">Fertile Window</p><p class="stat-value">${this.formatDate(predictions.fertileStart)} - ${this.formatDate(predictions.fertileEnd)}</p></article>
                <article class="stat-card"><p class="stat-label">Avg Pain</p><p class="stat-value">${avgPain}/10</p></article>
                <article class="stat-card"><p class="stat-label">Top Mood</p><p class="stat-value">${topMood}</p></article>
                <article class="stat-card"><p class="stat-label">Total Entries</p><p class="stat-value">${logs.length}</p></article>
            </div>
        `;

        if (logs.length === 0) {
            container.innerHTML = `${statsHtml}<div class="panel-card">No entries yet. Log your first day to unlock trends. 🌸</div>`;
            return;
        }

        const listHtml = logs.map((log) => `
            <article class="history-card">
                <div class="history-head">
                    <span class="history-date">${new Date(log.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <div style="display:flex;gap:0.3rem;align-items:center;">
                        ${log.isPeriod ? '<span class="chip">Cycle Day 1</span>' : ''}
                        <button type="button" class="history-delete-btn" data-date="${log.date}" aria-label="Delete entry">🗑️</button>
                    </div>
                </div>
                <p class="history-note">${this.getMoodIcon(log.mood)} ${log.notes || 'No reflection recorded.'}</p>
                <p class="history-meta">Mood: ${log.mood} • Pain ${Number(log?.symptoms?.pain || 0)} • Bloating ${Number(log?.symptoms?.bloating || 0)} • Energy ${Number(log?.symptoms?.energy || 0)} • Sleep ${Number(log?.symptoms?.sleep || 0)}</p>
            </article>
        `).join('');

        container.innerHTML = `${statsHtml}<div class="history-list">${listHtml}</div>`;

        // Bind delete buttons
        container.querySelectorAll('.history-delete-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const date = btn.dataset.date;
                const confirmed = window.confirm(`Delete entry for ${date}?`);
                if (!confirmed) return;

                try {
                    await window.cycleStore.getState().deleteLog(date);
                    showToast('Entry deleted', 'info');
                    this.renderHistory();
                } catch (err) {
                    showToast('Could not delete entry', 'error');
                }
            });
        });
    }

    renderSettings() {
        const grid = document.getElementById('settings-grid');
        if (!grid) return;

        const state = window.cycleStore.getState();
        const settings = state.settings;

        grid.innerHTML = `
            <div class="settings-field">
                <label for="setting-cycle-length">Cycle Length</label>
                <input id="setting-cycle-length" type="number" min="20" max="45" value="${settings.cycleLength || 28}">
            </div>
            <div class="settings-field">
                <label for="setting-period-length">Period Length</label>
                <input id="setting-period-length" type="number" min="2" max="10" value="${settings.periodLength || 5}">
            </div>
            <div class="settings-field">
                <label for="setting-last-period">Last Period</label>
                <input id="setting-last-period" type="date" value="${settings.lastPeriodStart || ''}">
            </div>
        `;
    }

    async saveSettings() {
        const cycleLength = Number(document.getElementById('setting-cycle-length')?.value);
        const periodLength = Number(document.getElementById('setting-period-length')?.value);
        const lastPeriodStart = document.getElementById('setting-last-period')?.value;

        if (!cycleLength || cycleLength < 20 || cycleLength > 45) {
            showToast('Cycle length must be 20-45 days', 'error');
            return;
        }
        if (!periodLength || periodLength < 2 || periodLength > 10) {
            showToast('Period length must be 2-10 days', 'error');
            return;
        }
        if (!lastPeriodStart) {
            showToast('Please set your last period start date', 'error');
            return;
        }

        try {
            await window.cycleStore.getState().updateSettings({ cycleLength, periodLength, lastPeriodStart });
            showToast('Settings saved ✦', 'success');
            this.renderHistory();
        } catch (err) {
            showToast('Could not save settings', 'error');
        }
    }

    renderRituals() {
        const body = document.getElementById('rituals-content');
        if (!body) return;

        const store = window.cycleStore.getState();
        const day = store.getSelectedDay();
        const phase = getPhaseFromDay(day, store.settings.cycleLength);
        const data = getPhaseData(phase);

        body.innerHTML = `
            <div class="panel-stack">
                <p>${data.rituals.intro}</p>
                ${data.rituals.practices.map((ritual) => `
                    <article class="panel-card">
                        <h4>${ritual.icon} ${ritual.name}</h4>
                        <p>${ritual.desc}</p>
                    </article>
                `).join('')}
            </div>
        `;
    }

    async exportJSON() {
        try {
            const payload = await window.cycleStore.getState().exportData();
            const blob = new Blob([payload], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lotuscycle-export-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
            showToast('JSON exported successfully', 'success');
        } catch (err) {
            console.error('Export failed:', err);
            showToast('Export failed', 'error');
        }
    }

    async exportCSV() {
        try {
            const store = window.cycleStore.getState();
            const logs = [...(store.logs || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

            if (logs.length === 0) {
                showToast('No entries to export', 'info');
                return;
            }

            const headers = ['date', 'mood', 'notes', 'isPeriod', 'pain', 'bloating', 'energy', 'sleep'];
            const rows = logs.map((log) => [
                log.date,
                log.mood || '',
                `"${(log.notes || '').replace(/"/g, '""')}"`,
                log.isPeriod ? 'true' : 'false',
                Number(log?.symptoms?.pain || 0),
                Number(log?.symptoms?.bloating || 0),
                Number(log?.symptoms?.energy || 0),
                Number(log?.symptoms?.sleep || 0)
            ].join(','));

            const csvContent = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lotuscycle-export-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
            showToast('CSV exported successfully', 'success');
        } catch (err) {
            console.error('CSV export failed:', err);
            showToast('CSV export failed', 'error');
        }
    }

    async importData(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await file.text();
            const isCSV = file.name.toLowerCase().endsWith('.csv');

            if (isCSV) {
                await this.importCSV(content);
            } else {
                await window.cycleStore.getState().importData(content);
            }

            showToast(`${isCSV ? 'CSV' : 'JSON'} imported successfully 🌸`, 'success');
            this.renderHistory();
        } catch (err) {
            console.error('Import failed:', err);
            showToast('Import failed. Check file format and try again.', 'error');
        } finally {
            event.target.value = '';
        }
    }

    async importCSV(csvText) {
        const lines = csvText.trim().split('\n').map((line) => line.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV needs a header row and at least one data row');

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

        // Find column indices
        const dateIdx = headers.findIndex((h) => h === 'date');
        if (dateIdx === -1) throw new Error('CSV must have a "date" column');

        const moodIdx = headers.findIndex((h) => h === 'mood');
        const notesIdx = headers.findIndex((h) => h === 'notes');
        const isPeriodIdx = headers.findIndex((h) => h.includes('period'));
        const painIdx = headers.findIndex((h) => h === 'pain');
        const bloatingIdx = headers.findIndex((h) => h.includes('bloat'));
        const energyIdx = headers.findIndex((h) => h === 'energy');
        const sleepIdx = headers.findIndex((h) => h === 'sleep');

        const logs = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVRow(lines[i]);
            const date = values[dateIdx]?.trim();
            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

            logs.push({
                date,
                mood: moodIdx !== -1 ? (values[moodIdx]?.trim() || 'Neutral') : 'Neutral',
                notes: notesIdx !== -1 ? (values[notesIdx]?.trim().replace(/^"|"$/g, '') || '') : '',
                isPeriod: isPeriodIdx !== -1 ? (values[isPeriodIdx]?.trim().toLowerCase() === 'true') : false,
                symptoms: {
                    pain: painIdx !== -1 ? Number(values[painIdx]) || 0 : 0,
                    bloating: bloatingIdx !== -1 ? Number(values[bloatingIdx]) || 0 : 0,
                    energy: energyIdx !== -1 ? Number(values[energyIdx]) || 0 : 0,
                    sleep: sleepIdx !== -1 ? Number(values[sleepIdx]) || 0 : 0
                },
                timestamp: Date.now()
            });
        }

        if (logs.length === 0) throw new Error('No valid rows found in CSV');

        const store = window.cycleStore.getState();
        for (const log of logs) {
            await store.addLog(log);
        }
    }

    parseCSVRow(row) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                if (inQuotes && row[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        return values;
    }

    async resetData() {
        const approved = window.confirm('Reset all logs and settings? This action cannot be undone.');
        if (!approved) return;

        await window.cycleStore.getState().clearAllData();
        showToast('All data has been reset', 'info');
        this.renderHistory();
        this.renderSettings();
    }

    formatDate(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    getMoodIcon(mood) {
        const map = {
            Reflective: '🌙',
            Emerged: '🌱',
            Radiant: '☀️',
            Flowing: '🌊',
            Sacred: '🕯️',
            Neutral: '✨'
        };

        return map[mood] || '✨';
    }
}

window.ModalController = ModalController;
