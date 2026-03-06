/**
 * LotusCycle Aura - Side panel controller
 */

class ParchmentScrolls {
    constructor() {
        this.tabs = Array.from(document.querySelectorAll('.scroll-tab'));
        this.lastToggleTime = 0;
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
        const phase = getPhaseFromDay(day, state.settings.cycleLength);
        const data = getPhaseData(phase);

        const container = document.getElementById(`${type}-content`);
        if (!container || !data) return;

        if (type === 'nourishment') {
            this.renderNourishment(container, data.nourishment);
        }

        if (type === 'asanas') {
            this.renderAsanas(container, data.asanas);
        }
    }

    renderNourishment(el, info) {
        el.innerHTML = `
            <div class="panel-stack">
                <p>${info.intro}</p>
                <ul>
                    ${info.foods.map((food) => `
                        <li><strong>${food.name}:</strong> ${food.benefit}</li>
                    `).join('')}
                </ul>
                <div class="panel-card panel-highlight">${info.highlight}</div>
            </div>
        `;
    }

    renderAsanas(el, info) {
        el.innerHTML = `
            <div class="panel-stack">
                <p>${info.intro}</p>
                ${info.practices.map((item) => `
                    <div class="panel-card">
                        <h4>${item.name}</h4>
                        <p class="history-meta">${item.duration}</p>
                        <p>${item.desc}</p>
                    </div>
                `).join('')}
                <div class="panel-card panel-highlight">${info.highlight}</div>
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
