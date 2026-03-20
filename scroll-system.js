/**
 * Lady Friend - Side panel controller
 */

class ParchmentScrolls {
    constructor() {
        this.tabs = Array.from(document.querySelectorAll('.scroll-tab'));
        this.lastToggleTime = 0;
        this.overridePhase = null;
        this.init();
    }

    init() {
        this.tabs.forEach((tab) => {
            const closeBtn = tab.querySelector('.scroll-close-btn');
            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAll();
            });
        });

        document.addEventListener('click', (e) => {
            const openTab = document.querySelector('.scroll-tab.open');
            if (!openTab) return;

            const clickedInPanel = e.target.closest('.scroll-content');
            const clickedAction = e.target.closest('.fast-action-btn');
            if (!clickedInPanel && !clickedAction) {
                this.closeAll();
            }
        }, true);

        window.addEventListener('dial:dayChanged', (e) => {
            this.updateContent(e.detail.day);
        });
    }

    toggleScroll(tab) {
        const now = Date.now();
        if (now - this.lastToggleTime < 260) return;
        this.lastToggleTime = now;

        if (!tab) return;

        const isOpen = tab.classList.contains('open');
        this.closeAll();

        if (!isOpen) {
            this.overridePhase = null;
            tab.classList.add('open');
            tab.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-mode-active');
            const type = tab.getAttribute('data-scroll');
            this.loadScrollContent(type);
            this.playOpenAnimation(tab);
        }
    }

    closeAll() {
        this.tabs.forEach((tab) => {
            if (tab.classList.contains('open')) {
                this.playCloseAnimation(tab);
                tab.classList.remove('open');
                tab.setAttribute('aria-hidden', 'true');
            }
        });
        document.body.classList.remove('scroll-mode-active');
    }

    playOpenAnimation(tab) {
        const content = tab.querySelector('.scroll-content');
        if (!content) return;
        content.style.animation = 'none';
        void content.offsetWidth;
        content.style.animation = 'bounceIn 0.45s var(--ease-soft) forwards';
    }

    playCloseAnimation(tab) {
        const content = tab.querySelector('.scroll-content');
        if (!content) return;
        content.style.animation = 'bounceOut 0.24s var(--ease-soft) forwards';
        setTimeout(() => {
            content.style.animation = '';
        }, 260);
    }

    loadScrollContent(type, providedDay = null) {
        const state = window.cycleStore.getState();
        const day = providedDay || state.getSelectedDay();
        const currentPhase = getPhaseFromDay(day, state.settings.cycleLength);

        // Use override phase if set, otherwise current
        const phase = this.overridePhase || currentPhase;
        const data = getPhaseData(phase);

        const container = document.getElementById(`${type}-content`);
        if (!container || !data) return;

        // Build phase tabs
        const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
        const phaseLabels = { menstrual: 'Menstrual', follicular: 'Follicular', ovulatory: 'Ovulatory', luteal: 'Luteal' };
        const tabsHtml = `<div class="phase-tabs">${phases.map(p => 
            `<button type="button" class="phase-tab ${p === phase ? 'active' : ''}" data-phase="${p}">${phaseLabels[p]}</button>`
        ).join('')}</div>`;

        if (type === 'nourishment') {
            this.renderNourishment(container, data.nourishment, tabsHtml);
        }

        if (type === 'asanas') {
            this.renderAsanas(container, data.asanas, tabsHtml);
        }

        // Bind phase tab clicks
        container.querySelectorAll('.phase-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.overridePhase = tab.dataset.phase;
                this.loadScrollContent(type, day);
            });
        });
    }

    renderNourishment(el, info, tabsHtml = '') {
        el.innerHTML = `
            ${tabsHtml}
            <div class="panel-stack">
                <p>${info.intro}</p>
                ${info.foods.map((food) => `
                    <div class="panel-card food-card">
                        <div class="food-header">
                            <strong>${food.name}</strong>
                            <span class="food-benefit">${food.benefit}</span>
                        </div>
                        ${food.detail ? `<p class="food-detail">${food.detail}</p>` : ''}
                        ${food.link ? `<a href="${food.link}" target="_blank" rel="noopener" class="food-link">🔗 Recipe / Reference</a>` : ''}
                    </div>
                `).join('')}
                ${info.avoid?.length ? `<div class="panel-card panel-avoid"><strong>🚫 Avoid:</strong><ul class="avoid-list">${info.avoid.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                <div class="panel-card panel-highlight">💡 ${info.highlight}</div>
            </div>
        `;
    }

    renderAsanas(el, info, tabsHtml = '') {
        el.innerHTML = `
            ${tabsHtml}
            <div class="panel-stack">
                <p>${info.intro}</p>
                ${info.practices.map((item) => `
                    <div class="panel-card asana-card">
                        <div class="asana-header">
                            <h4>${item.name}</h4>
                            <span class="asana-duration">${item.duration}</span>
                        </div>
                        <p>${item.desc}</p>
                        ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener" class="food-link">📖 Learn More</a>` : ''}
                    </div>
                `).join('')}
                ${info.avoid?.length ? `<div class="panel-card panel-avoid"><strong>🚫 Avoid:</strong><ul class="avoid-list">${info.avoid.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                <div class="panel-card panel-highlight">💡 ${info.highlight}</div>
            </div>
        `;
    }

    updateContent(day) {
        const openTab = document.querySelector('.scroll-tab.open');
        if (!openTab) return;

        const type = openTab.getAttribute('data-scroll');
        this.loadScrollContent(type, day);
    }
}

window.ParchmentScrolls = ParchmentScrolls;
