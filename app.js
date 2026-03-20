/**
 * Lady Friend - Application controller
 */

class LadyFriendApp {
    constructor() {
        this.enginesInitialized = false;
        this.subscriptionsBound = false;
        this.navBound = false;
        this.actionBound = false;
        this.init();
    }

    init() {
        const boot = () => {
            this.setupEngines();
            this.setupSubscriptions();
            this.checkOnboarding();
            this.setupNavigation();
            this.refreshUI();
        };

        const ready = window.cycleStore?.getState?.()?.ready;
        if (ready) {
            boot();
        } else {
            window.addEventListener('store:ready', boot, { once: true });
        }
    }

    setupEngines() {
        if (this.enginesInitialized) return;
        this.enginesInitialized = true;

        try {
            if (typeof RiverEngine !== 'undefined') {
                window.riverEngine = new RiverEngine('river-canvas', 'mist-canvas');
            }
        } catch (err) {
            console.error('RiverEngine init failed:', err);
        }

        try {
            if (typeof LotusDial !== 'undefined') {
                window.lotusDial = new LotusDial('lotus-dial');
            }
        } catch (err) {
            console.error('LotusDial init failed:', err);
        }

        try {
            if (typeof ParchmentScrolls !== 'undefined') {
                window.scrollSystem = new ParchmentScrolls();
            }
        } catch (err) {
            console.error('ParchmentScrolls init failed:', err);
        }

        try {
            if (typeof ModalController !== 'undefined') {
                window.modalController = new ModalController();
            }
        } catch (err) {
            console.error('ModalController init failed:', err);
        }

        document.getElementById('app')?.classList.add('loaded');
    }

    setupSubscriptions() {
        if (this.subscriptionsBound) return;
        this.subscriptionsBound = true;

        window.cycleStore?.subscribe?.(() => this.refreshUI());

        window.addEventListener('store:updated', () => this.refreshUI());

        window.addEventListener('dial:dayChanged', (e) => {
            this.handleSelectedDay(e.detail.day);
        });

        window.addEventListener('modal:open', (e) => {
            window.modalController?.open?.(e.detail.modal);
        });
    }

    checkOnboarding() {
        const state = window.cycleStore?.getState?.();
        if (!state) return;

        if (!state.initialized) {
            // Show onboarding wizard for first-time users
            setTimeout(() => {
                window.modalController?.showOnboarding?.();
            }, 600);
        }
    }

    setupNavigation() {
        if (!this.navBound) {
            this.navBound = true;

            document.getElementById('nav-history')?.addEventListener('click', () => {
                window.modalController?.open?.('history');
            });

            document.getElementById('nav-log')?.addEventListener('click', () => {
                window.modalController?.open?.('log');
            });

            document.getElementById('nav-rituals')?.addEventListener('click', () => {
                window.modalController?.open?.('rituals');
            });
        }

        if (!this.actionBound) {
            this.actionBound = true;

            document.getElementById('action-nourish')?.addEventListener('click', () => {
                const tab = document.querySelector('[data-scroll="nourishment"]');
                if (tab) window.scrollSystem?.toggleScroll(tab);
            });

            document.getElementById('action-exercise')?.addEventListener('click', () => {
                const tab = document.querySelector('[data-scroll="asanas"]');
                if (tab) window.scrollSystem?.toggleScroll(tab);
            });
        }
    }

    handleSelectedDay(day) {
        window.cycleStore?.getState?.().setSelectedDay(day);
    }

    refreshUI() {
        const state = window.cycleStore?.getState?.();
        if (!state) return;

        const day = state.getSelectedDay();
        const phase = getPhaseFromDay(day, state.settings.cycleLength);
        const data = getPhaseData(phase);

        const dayEl = document.getElementById('date-day');
        const phaseEl = document.getElementById('date-phase');
        const subtitleEl = document.getElementById('phase-subtitle');

        if (dayEl) dayEl.textContent = String(day).padStart(2, '0');
        if (phaseEl) phaseEl.textContent = data.name.toUpperCase();
        if (subtitleEl) subtitleEl.textContent = data.subtitle;

        const insightEl = document.getElementById('daily-insight-text');
        if (insightEl && data.auraReadings?.length) {
            insightEl.textContent = data.auraReadings[(day - 1) % data.auraReadings.length];
        }

        const nourishText = document.querySelector('#action-nourish .btn-text');
        const asanasText = document.querySelector('#action-exercise .btn-text');

        if (nourishText && data.nourishment?.foods?.length) {
            nourishText.textContent = data.nourishment.foods[0].name;
        }

        if (asanasText && data.asanas?.practices?.length) {
            asanasText.textContent = data.asanas.practices[0].name;
        }

        if (window.lotusDial) {
            window.lotusDial.updatePhase(phase, day);
        }

        if (window.riverEngine) {
            window.riverEngine.currentPhase = phase;
        }

        if (window.scrollSystem) {
            window.scrollSystem.updateContent(day);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.ladyFriendApp = new LadyFriendApp();
});
