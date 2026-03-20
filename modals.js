/**
 * Lady Friend - Modal controller
 * Features: log, history (prominent calendar), rituals, settings, CSV import/export,
 *           onboarding flow, Inner Weather mood picker
 */

class ModalController {
    constructor() {
        this.modals = {
            log: document.getElementById('log-modal'),
            history: document.getElementById('history-modal'),
            rituals: document.getElementById('scroll-rituals'),
            onboarding: document.getElementById('onboarding-modal')
        };

        this.selectedMood = null;
        this.activeType = null;
        this.lastActionTime = 0;
        this.prevFocusedEl = null;
        this.calendarYear = new Date().getFullYear();
        this.calendarMonth = new Date().getMonth();
        this.selectedCalDate = null;
        this.onboardingStep = 0;

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

        // Maya import
        document.getElementById('import-maya-btn')?.addEventListener('click', () => {
            document.getElementById('import-maya-file')?.click();
        });
        document.getElementById('import-maya-file')?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                await this.importMayaData(text);
                showToast('Maya data imported successfully 🌸', 'success');
                this.renderHistory();
            } catch (err) {
                console.error('Maya import failed:', err);
                showToast('Maya import failed. Check file format.', 'error');
            }
            e.target.value = '';
        });

        // Onboarding close
        document.getElementById('onboarding-modal')?.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            // Don't allow closing onboarding by clicking backdrop
        });

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
            { icon: '🌧️', label: 'Stormy' },
            { icon: '🌫️', label: 'Foggy' },
            { icon: '🌙', label: 'Reflective' },
            { icon: '🌱', label: 'Emerging' },
            { icon: '⛅', label: 'Mellow' },
            { icon: '🌊', label: 'Flowing' },
            { icon: '☀️', label: 'Radiant' },
            { icon: '🌈', label: 'Luminous' }
        ];

        body.innerHTML = `
            <section>
                <p class="field-title">Inner Weather</p>
                <p class="field-hint">How does your internal sky feel today?</p>
                <div class="mood-grid">
                    ${moods.map((m) => `
                        <button type="button" class="mood-btn" data-mood="${m.label}">
                            <span class="mood-icon">${m.icon}</span>
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

        const today = new Date();
        const daysUntilPeriod = Math.max(0, Math.ceil((predictions.nextPeriodStart - today) / (1000 * 60 * 60 * 24)));

        const calendarHtml = this.renderCalendarHtml(predictions, logs);
        const dayDetailHtml = this.selectedCalDate ? this.renderDayDetail(this.selectedCalDate, logs) : '';

        const statsHtml = `
            ${calendarHtml}
            ${dayDetailHtml}
            <div class="stats-strip">
                <div class="stat-pill"><span class="stat-pill-label">Next Period</span><span class="stat-pill-value">${this.formatDate(predictions.nextPeriodStart)}</span></div>
                <div class="stat-pill"><span class="stat-pill-label">In</span><span class="stat-pill-value">${daysUntilPeriod}d</span></div>
                <div class="stat-pill"><span class="stat-pill-label">Fertile</span><span class="stat-pill-value">${this.formatDate(predictions.fertileStart)}–${this.formatDate(predictions.fertileEnd)}</span></div>
                ${predictions.avgCycle ? `<div class="stat-pill"><span class="stat-pill-label">Avg Cycle</span><span class="stat-pill-value">${predictions.avgCycle}d</span></div>` : ''}
                ${predictions.historicalStarts?.length > 0 ? `<div class="stat-pill"><span class="stat-pill-label">Periods</span><span class="stat-pill-value">${predictions.historicalStarts.length}</span></div>` : ''}
                <div class="stat-pill"><span class="stat-pill-label">Avg Pain</span><span class="stat-pill-value">${avgPain}</span></div>
                <div class="stat-pill"><span class="stat-pill-label">Mood</span><span class="stat-pill-value">${topMood}</span></div>
                <div class="stat-pill"><span class="stat-pill-label">Entries</span><span class="stat-pill-value">${logs.length}</span></div>
            </div>
        `;

        if (logs.length === 0) {
            container.innerHTML = `${statsHtml}<div class="panel-card" style="color:#4a3620;">No entries yet. Log your first day to unlock trends. 🌸</div>`;
            this.bindCalendarNav(container);
            return;
        }

        const listHtml = logs.slice(0, 10).map((log) => `
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

        container.innerHTML = `${statsHtml}<h3 class="history-entries-heading">Recent Entries</h3><div class="history-list">${listHtml}</div>`;

        this.bindCalendarNav(container);

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

    renderDayDetail(dateStr, logs) {
        const log = logs.find(l => l.date === dateStr);
        const d = new Date(dateStr + 'T12:00:00');
        const display = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

        // Get prediction info for this date
        const predictions = window.cycleStore.getState().getPredictions();
        const year = d.getFullYear();
        const month = d.getMonth();
        const windows = predictions.getWindowsForMonth ? predictions.getWindowsForMonth(year, month) : {};
        const win = windows[dateStr] || {};

        const phaseNames = {
            menstrual: 'Menstrual (Rest & Release)',
            follicular: 'Follicular (Rise & Renew)',
            ovulatory: 'Ovulatory (Radiate & Connect)',
            luteal: 'Luteal (Reflect & Ground)'
        };
        const phaseColors = {
            menstrual: '#E8837C',
            follicular: '#7CD4A8',
            ovulatory: '#FFD166',
            luteal: '#B8A9D4'
        };
        const phaseIcons = {
            menstrual: '🌙',
            follicular: '🌱',
            ovulatory: '☀️',
            luteal: '🍂'
        };

        // Phase prediction block
        let phaseHtml = '';
        if (win.phase) {
            const phaseData = typeof getPhaseData === 'function' ? getPhaseData(win.phase) : null;
            const phaseName = phaseNames[win.phase] || win.phase;
            const phaseColor = phaseColors[win.phase] || '#8B6914';
            const phaseIcon = phaseIcons[win.phase] || '✨';
            const cycleDayLabel = win.cycleDay ? `Day ${win.cycleDay}` : '';

            let predictionBadges = '';
            if (win.period) predictionBadges += '<span class="detail-badge period-badge">Period</span>';
            if (win.ovulation) predictionBadges += '<span class="detail-badge ovul-badge">🥚 Ovulation</span>';
            if (win.fertile && !win.ovulation) predictionBadges += '<span class="detail-badge fertile-badge">Fertile Window</span>';

            // Top food recommendations
            let foodTips = '';
            if (phaseData?.nourishment?.foods) {
                const topFoods = phaseData.nourishment.foods.slice(0, 3);
                foodTips = `<div class="detail-tips">
                    <span class="detail-tips-label">🍽 Nourish</span>
                    ${topFoods.map(f => `<span class="detail-tip-item">${f.name}</span>`).join('')}
                </div>`;
            }

            // Top asana recommendations
            let asanaTips = '';
            if (phaseData?.asanas?.practices) {
                const topAsanas = phaseData.asanas.practices.slice(0, 2);
                asanaTips = `<div class="detail-tips">
                    <span class="detail-tips-label">🧘 Move</span>
                    ${topAsanas.map(a => `<span class="detail-tip-item">${a.name.split('(')[0].trim()}</span>`).join('')}
                </div>`;
            }

            phaseHtml = `
                <div class="detail-phase-block" style="border-left: 3px solid ${phaseColor};">
                    <div class="detail-phase-header">
                        <span>${phaseIcon} ${phaseName}</span>
                        ${cycleDayLabel ? `<span class="detail-cycle-day">${cycleDayLabel}</span>` : ''}
                    </div>
                    ${predictionBadges ? `<div class="detail-badges">${predictionBadges}</div>` : ''}
                    ${phaseData ? `<p class="detail-energy">Energy: ${phaseData.energy}</p>` : ''}
                    ${foodTips}
                    ${asanaTips}
                </div>`;
        }

        // Logged data block
        let logHtml = '';
        if (log) {
            logHtml = `
                <div class="detail-log-block">
                    <div class="day-detail-row">
                        <span class="day-detail-mood">${this.getMoodIcon(log.mood)} ${log.mood}</span>
                        ${log.isPeriod ? '<span class="chip">Period Logged</span>' : ''}
                    </div>
                    ${log.notes ? `<p class="day-detail-notes">"${log.notes}"</p>` : ''}
                    <div class="day-detail-symptoms">
                        <span>Pain ${Number(log?.symptoms?.pain || 0)}</span>
                        <span>Bloating ${Number(log?.symptoms?.bloating || 0)}</span>
                        <span>Energy ${Number(log?.symptoms?.energy || 0)}</span>
                        <span>Sleep ${Number(log?.symptoms?.sleep || 0)}</span>
                    </div>
                </div>`;
        } else {
            logHtml = `<p class="day-detail-empty">No entry logged.</p>`;
        }

        return `
            <div class="day-detail-panel">
                <p class="day-detail-date">${display}</p>
                ${phaseHtml}
                ${logHtml}
            </div>
        `;
    }

    bindCalendarNav(container) {
        container.querySelector('#cal-prev')?.addEventListener('click', () => {
            this.calendarMonth--;
            if (this.calendarMonth < 0) { this.calendarMonth = 11; this.calendarYear--; }
            this.renderHistory();
        });
        container.querySelector('#cal-next')?.addEventListener('click', () => {
            this.calendarMonth++;
            if (this.calendarMonth > 11) { this.calendarMonth = 0; this.calendarYear++; }
            this.renderHistory();
        });
        container.querySelectorAll('.cal-day[data-date]').forEach(cell => {
            cell.addEventListener('click', () => {
                this.selectedCalDate = cell.dataset.date;
                this.renderHistory();
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
            link.download = `lady-friend-export-${new Date().toISOString().slice(0, 10)}.json`;
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
            link.download = `lady-friend-export-${new Date().toISOString().slice(0, 10)}.csv`;
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
            Stormy: '🌧️',
            Foggy: '🌫️',
            Reflective: '🌙',
            Emerging: '🌱',
            Emerged: '🌱',
            Mellow: '⛅',
            Flowing: '🌊',
            Radiant: '☀️',
            Luminous: '🌈',
            Sacred: '🕯️',
            Neutral: '✨'
        };
        return map[mood] || '✨';
    }

    renderCalendarHtml(predictions, logs) {
        const today = new Date();
        const year = this.calendarYear;
        const month = this.calendarMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthLabel = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        const logsMap = new Set(logs.map(l => l.date));

        // Multi-cycle prediction windows for this month
        const windows = predictions.getWindowsForMonth
            ? predictions.getWindowsForMonth(year, month)
            : {};

        const avgInfo = predictions.avgCycle
            ? `<span class="cal-avg-badge">~${predictions.avgCycle}d cycle</span>`
            : '';

        let html = `<div class="calendar-wrapper calendar-hero">
            <div class="cal-nav">
                <button type="button" id="cal-prev" class="cal-nav-btn" aria-label="Previous month">‹</button>
                <h3 class="cal-title">${monthLabel} ${avgInfo}</h3>
                <button type="button" id="cal-next" class="cal-nav-btn" aria-label="Next month">›</button>
            </div>
            <div class="calendar-grid">`;

        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => html += `<div class="cal-header">${d}</div>`);
        
        for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
            const isLogged = logsMap.has(dateStr);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = dateStr === this.selectedCalDate;

            const win = windows[dateStr] || {};
            
            let classes = ['cal-day'];
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            if (isLogged) classes.push('logged');
            if (win.period) classes.push('predicted-period');
            else if (win.ovulation) classes.push('predicted-ovulation');
            else if (win.fertile) classes.push('predicted-fertile');

            // Phase accent stripe
            if (win.phase && !win.period && !win.fertile && !win.ovulation) {
                classes.push('phase-' + win.phase);
            }

            // Cycle day label
            const cycleDayLabel = win.cycleDay ? `<span class="cal-cycle-day">D${win.cycleDay}</span>` : '';
            const ovLabel = win.ovulation ? `<span class="cal-ov-badge">🥚</span>` : '';

            html += `<div class="${classes.join(' ')}" data-date="${dateStr}" role="button" tabindex="0">
                <span class="cal-day-num">${day}</span>
                ${cycleDayLabel}
                ${ovLabel}
                ${isLogged ? '<span class="cal-logged-dot"></span>' : ''}
            </div>`;
        }
        
        html += `</div><div class="cal-legend">
                <span><div class="cal-dot peri"></div> Period</span>
                <span><div class="cal-dot fert"></div> Fertile</span>
                <span><div class="cal-dot ovul"></div> Ovulation</span>
                <span><div class="cal-dot log"></div> Logged</span>
            </div></div>`;
        return html;
    }

    // --- Onboarding Flow ---
    showOnboarding() {
        const modal = this.modals.onboarding;
        if (!modal) return;

        const body = document.getElementById('onboarding-body');
        if (!body) return;

        this.onboardingStep = 0;
        this.renderOnboardingStep(body);

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        this.activeType = 'onboarding';

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content')?.focus();
        });
    }

    renderOnboardingStep(body) {
        const steps = [
            {
                title: 'Welcome to Lady Friend 🌸',
                content: `
                    <div class="onboarding-center">
                        <p class="onboarding-desc">A biophilic cycle companion that honors your body's natural rhythms.</p>
                        <div class="onboarding-features">
                            <div class="onboarding-feat">🌺 <span>Track your cycle phases</span></div>
                            <div class="onboarding-feat">🍃 <span>Phase-based nourishment</span></div>
                            <div class="onboarding-feat">🧘 <span>Yoga & movement guides</span></div>
                            <div class="onboarding-feat">📊 <span>Insights & predictions</span></div>
                        </div>
                    </div>
                `
            },
            {
                title: 'Set Your Cycle ⚙️',
                content: `
                    <div class="onboarding-form">
                        <div class="settings-field"><label for="ob-cycle">Cycle Length (days)</label><input id="ob-cycle" type="number" min="20" max="45" value="28"></div>
                        <div class="settings-field"><label for="ob-period">Period Length (days)</label><input id="ob-period" type="number" min="2" max="10" value="5"></div>
                        <div class="settings-field"><label for="ob-last">Last Period Start</label><input id="ob-last" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
                    </div>
                `
            },
            {
                title: 'Import Your Data 📂',
                content: `
                    <div class="onboarding-center">
                        <p class="onboarding-desc">Import existing data from another tracker, or start fresh.</p>
                        <div class="onboarding-import-options">
                            <button type="button" id="ob-import-csv" class="ghost-btn">Import CSV</button>
                            <button type="button" id="ob-import-json" class="ghost-btn">Import JSON</button>
                            <button type="button" id="ob-import-maya" class="ghost-btn">Import Maya</button>
                        </div>
                        <p class="onboarding-hint">Supports Lady Friend CSV/JSON and Maya period tracker exports.</p>
                    </div>
                `
            }
        ];

        const step = steps[this.onboardingStep];
        const isLast = this.onboardingStep === steps.length - 1;
        const isFirst = this.onboardingStep === 0;

        body.innerHTML = `
            <div class="onboarding-step">
                <div class="onboarding-progress">
                    ${steps.map((_, i) => `<div class="onboarding-dot ${i === this.onboardingStep ? 'active' : (i < this.onboardingStep ? 'done' : '')}"></div>`).join('')}
                </div>
                <h3 class="onboarding-title">${step.title}</h3>
                ${step.content}
                <div class="onboarding-actions">
                    ${!isFirst ? '<button type="button" id="ob-back" class="ghost-btn">Back</button>' : ''}
                    <button type="button" id="ob-next" class="primary-btn">${isLast ? 'Get Started' : 'Continue'}</button>
                </div>
            </div>
        `;

        body.querySelector('#ob-back')?.addEventListener('click', () => {
            this.onboardingStep--;
            this.renderOnboardingStep(body);
        });

        body.querySelector('#ob-next')?.addEventListener('click', async () => {
            if (this.onboardingStep === 1) {
                const cycle = Number(document.getElementById('ob-cycle')?.value) || 28;
                const period = Number(document.getElementById('ob-period')?.value) || 5;
                const lastPeriod = document.getElementById('ob-last')?.value || new Date().toISOString().split('T')[0];
                await window.cycleStore.getState().updateSettings({
                    cycleLength: cycle,
                    periodLength: period,
                    lastPeriodStart: lastPeriod
                });
            }

            if (isLast) {
                await window.cycleStore.getState().setInitialized(true);
                this.close('onboarding');
                showToast('Welcome! Your cycle is set up. 🌸', 'success');
                return;
            }
            this.onboardingStep++;
            this.renderOnboardingStep(body);
        });

        // Import handlers on step 3
        const triggerFileImport = (accept) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.onchange = (e) => this.importData(e);
            input.click();
        };

        body.querySelector('#ob-import-csv')?.addEventListener('click', () => triggerFileImport('.csv'));
        body.querySelector('#ob-import-json')?.addEventListener('click', () => triggerFileImport('application/json'));
        body.querySelector('#ob-import-maya')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                    const text = await file.text();
                    await this.importMayaData(text);
                    showToast('Maya data imported successfully 🌸', 'success');
                } catch (err) {
                    console.error('Maya import failed:', err);
                    showToast('Maya import failed. Check file format.', 'error');
                }
            };
            input.click();
        });
    }

    // --- Maya Period Tracker Import ---
    async importMayaData(csvText) {
        const lines = csvText.split('\n').map(l => l.trim());
        const store = window.cycleStore.getState();

        // Parse the multi-section Maya format
        const sections = {};
        let currentSection = null;
        let sectionLines = [];

        for (const line of lines) {
            // Section headers are single words without commas (e.g., "history_dates", "moods", "symptoms")
            if (!line) continue;
            if (!line.includes(',') && !line.match(/^\d/) && line.match(/^[a-z_]+$/)) {
                if (currentSection) sections[currentSection] = sectionLines;
                currentSection = line;
                sectionLines = [];
            } else {
                sectionLines.push(line);
            }
        }
        if (currentSection) sections[currentSection] = sectionLines;

        // Parse history_dates (start_date, end_date) — these are period start/end
        const periodDates = [];
        const historyLines = sections['history_dates'] || [];
        for (const hl of historyLines) {
            if (hl.startsWith('start_date')) continue;
            const [startStr, endStr] = hl.split(',');
            const start = this.parseMayaDate(startStr?.trim());
            const end = this.parseMayaDate(endStr?.trim());
            if (start) {
                periodDates.push({ start, end });
                // Create log entries for each day of the period
                let current = new Date(start);
                const endDate = end ? new Date(end) : new Date(start);
                while (current <= endDate) {
                    const dateStr = current.toISOString().split('T')[0];
                    await store.addLog({
                        date: dateStr,
                        mood: 'Neutral',
                        notes: '',
                        isPeriod: true,
                        symptoms: { pain: 0, bloating: 0, energy: 5, sleep: 5 }
                    });
                    current.setDate(current.getDate() + 1);
                }
            }
        }

        // Parse moods section
        const moodLines = sections['moods'] || [];
        for (const ml of moodLines) {
            if (ml.startsWith('date')) continue;
            const firstComma = ml.indexOf(',');
            if (firstComma === -1) continue;
            const dateStr = ml.substring(0, firstComma).trim();
            const moodText = ml.substring(firstComma + 1).trim();
            const d = this.parseMayaDate(dateStr);
            if (d) {
                const iso = d.toISOString().split('T')[0];
                await store.addLog({
                    date: iso,
                    mood: this.mapMayaMood(moodText),
                    notes: `Maya mood: ${moodText}`,
                    isPeriod: false,
                    symptoms: { pain: 0, bloating: 0, energy: 5, sleep: 5 }
                });
            }
        }

        // Parse symptoms section
        const symptomLines = sections['symptoms'] || [];
        for (const sl of symptomLines) {
            if (sl.startsWith('date')) continue;
            const firstComma = sl.indexOf(',');
            if (firstComma === -1) continue;
            const dateStr = sl.substring(0, firstComma).trim();
            const sympText = sl.substring(firstComma + 1).trim();
            const d = this.parseMayaDate(dateStr);
            if (d) {
                const iso = d.toISOString().split('T')[0];
                const symptoms = this.mapMayaSymptoms(sympText);
                await store.addLog({
                    date: iso,
                    mood: 'Neutral',
                    notes: `Maya symptoms: ${sympText}`,
                    isPeriod: false,
                    symptoms
                });
            }
        }

        // Set last period start from most recent history_dates entry
        if (periodDates.length > 0) {
            const last = periodDates[periodDates.length - 1];
            await store.updateSettings({ lastPeriodStart: last.start.toISOString().split('T')[0] });
        }
    }

    parseMayaDate(str) {
        if (!str) return null;
        // Format: DD-MMM-YYYY e.g. "25-Jun-2017"
        const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
        const parts = str.split('-');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0]);
        const mon = months[parts[1]];
        const year = parseInt(parts[2]);
        if (isNaN(day) || mon === undefined || isNaN(year)) return null;
        return new Date(year, mon, day);
    }

    mapMayaMood(moodText) {
        const lower = moodText.toLowerCase();
        if (lower.includes('depressed') || lower.includes('sad')) return 'Stormy';
        if (lower.includes('anxious') || lower.includes('stressed') || lower.includes('irritated')) return 'Foggy';
        if (lower.includes('cranky') || lower.includes('frustrated')) return 'Foggy';
        if (lower.includes('happy') || lower.includes('excited') || lower.includes('confident')) return 'Radiant';
        if (lower.includes('peaceful') || lower.includes('calm')) return 'Flowing';
        if (lower.includes('romantic') || lower.includes('sexy') || lower.includes('naughty')) return 'Luminous';
        if (lower.includes('sleepy') || lower.includes('lazy')) return 'Mellow';
        if (lower.includes('emotional') || lower.includes('blue')) return 'Reflective';
        return 'Neutral';
    }

    mapMayaSymptoms(sympText) {
        const lower = sympText.toLowerCase();
        let pain = 0, bloating = 0, energy = 5, sleep = 5;
        if (lower.includes('cramp')) pain += 4;
        if (lower.includes('achy')) pain += 3;
        if (lower.includes('headache')) pain += 3;
        if (lower.includes('bloat')) bloating += 4;
        if (lower.includes('gas')) bloating += 2;
        if (lower.includes('breast_tenderness')) bloating += 2;
        if (lower.includes('tired') || lower.includes('weak')) energy -= 2;
        if (lower.includes('insomnia')) sleep -= 3;
        return {
            pain: Math.min(10, pain),
            bloating: Math.min(10, bloating),
            energy: Math.max(0, energy),
            sleep: Math.max(0, sleep)
        };
    }
}

window.ModalController = ModalController;
