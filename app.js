/**
 * LotusCycle Aura - Main Application Controller
 * Coordinates the biophilic UI elements, state, and hyper-realistic interactions.
 */

class LotusCycleApp {
    constructor() {
        console.log('🚀 LotusCycleApp constructor starting...');

        // Debug all clicks globally
        document.addEventListener('click', (e) => {
            console.log('🖱️ CLICK:', e.target.tagName, e.target.id, e.target.className);
        }, true);

        this.init();
    }

    async init() {
        const checkStore = () => {
            if (window.cycleStore) {
                const state = window.cycleStore.getState();
                // If already initialized, setup immediately
                if (state) {
                    this.setupEngines();
                    this.checkOnboarding();
                    this.setupSubscriptions();
                    return true;
                }
            }
            return false;
        };

        // Try immediate check
        if (!checkStore()) {
            // Otherwise wait for the ready signal
            window.addEventListener('store:ready', () => {
                this.setupEngines();
                this.checkOnboarding();
                this.setupSubscriptions();
            });
        }

        // Navigation Leaves
        this.setupNavigation();
    }

    setupEngines() {
        if (this.enginesInitialized) return;
        this.enginesInitialized = true;
        console.log('🔧 Starting setupEngines...');

        // 1. River Engine
        try {
            console.log('1. Initializing RiverEngine...');
            if (typeof RiverEngine !== 'undefined') {
                window.riverEngine = new RiverEngine('river-canvas', 'mist-canvas');
            } else {
                console.error('❌ RiverEngine class is undefined');
            }
        } catch (err) {
            console.error('❌ Failed to init RiverEngine:', err);
        }

        // 2. Lotus Dial
        try {
            console.log('2. Initializing LotusDial...');
            if (typeof LotusDial !== 'undefined') {
                window.lotusDial = new LotusDial('lotus-dial');
            } else {
                console.error('❌ LotusDial class is undefined');
            }
        } catch (err) {
            console.error('❌ Failed to init LotusDial:', err);
        }

        // 3. Scroll System
        try {
            console.log('3. Initializing ParchmentScrolls...');
            if (typeof ParchmentScrolls !== 'undefined') {
                window.scrollSystem = new ParchmentScrolls();
            } else {
                console.error('❌ ParchmentScrolls class is undefined');
            }
        } catch (err) {
            console.error('❌ Failed to init ParchmentScrolls:', err);
        }

        // 4. Modal Controller
        try {
            console.log('4. Initializing ModalController...');
            if (typeof ModalController !== 'undefined') {
                window.modalController = new ModalController();
            } else {
                console.error('❌ ModalController class is undefined');
            }
        } catch (err) {
            console.error('❌ Failed to init ModalController:', err);
        }

        // 5. Reveal UI
        try {
            const app = document.getElementById('app');
            if (app) {
                console.log('5. Adding loaded class to #app');
                app.classList.add('loaded');
            } else {
                console.error('❌ Element #app not found');
            }
        } catch (err) {
            console.error('❌ Failed to reveal UI:', err);
        }

        console.log('✨ Engine setup complete (with potential errors logged)');
        this.refreshUI();
    }

    setupSubscriptions() {
        // Subscribe to store updates
        if (window.cycleStore) {
            window.cycleStore.subscribe((state) => {
                this.refreshUI();
            });
        }

        // Internal Custom Events
        window.addEventListener('dial:dayChanged', (e) => {
            this.handleSelectedDay(e.detail.day);
        });

        window.addEventListener('store:updated', () => {
            this.refreshUI();
        });
    }

    checkOnboarding() {
        if (window.cycleStore) {
            const state = window.cycleStore.getState();
            if (!state.initialized) {
                // In a full implementation, this triggers the onboarding modal
                // For this hyper-real polish, we ensure defaults are set
                window.cycleStore.setInitialized(true);
            }
        }
    }

    setupNavigation() {
        console.log('🔗 Setting up navigation listeners...');

        // Wait a tick to ensure DOM is fully ready
        setTimeout(() => {
            // Verify buttons exist
            const historyBtn = document.getElementById('nav-history');
            const logBtn = document.getElementById('nav-log');
            const ritualsBtn = document.getElementById('nav-rituals');

            console.log('Button check:', {
                history: !!historyBtn,
                log: !!logBtn,
                rituals: !!ritualsBtn
            });

            if (!historyBtn || !logBtn || !ritualsBtn) {
                console.error('❌ One or more buttons not found in DOM');
                return;
            }

            // History Button
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📜 History clicked!');

                if (window.modalController) {
                    window.modalController.open('history');
                } else {
                    console.warn('ModalController not ready, using fallback');
                    const modal = document.getElementById('history-modal');
                    if (modal) modal.classList.remove('hidden');
                }
            }, { capture: true });

            // Log Button
            logBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📝 Log clicked!');

                if (window.modalController) {
                    window.modalController.open('log');
                } else {
                    console.warn('ModalController not ready, using fallback');
                    const modal = document.getElementById('log-modal');
                    if (modal) modal.classList.remove('hidden');
                }
            }, { capture: true });

            // Rituals Button
            ritualsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🌿 Rituals clicked!');

                if (window.scrollSystem) {
                    window.scrollSystem.openRituals();
                } else {
                    console.warn('ScrollSystem not ready');
                }
            }, { capture: true });

            console.log('✅ All navigation listeners bound successfully');

        }, 100);
    }

    createBurst(el) {
        if (!el || !window.riverEngine) return;
        const rect = el.getBoundingClientRect();
        window.riverEngine.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, 2.0);
    }

    // handleSelectedDay is now integrated into refreshUI

    refreshUI() {
        if (!window.cycleStore) return;

        try {
            const state = window.cycleStore.getState();
            const day = state.getCycleDay(); // Get the current selected day from the store
            const phase = getPhaseFromDay(day, state.settings.cycleLength);
            const data = getPhaseData(phase);

            // Update Global UI elements (Day and Phase Name)
            // Update Global UI elements (Day and Phase Name)
            const currentDayLabel = document.getElementById('current-cycle-day');
            const phaseNameLabel = document.getElementById('phase-name');

            // Additional day element inside sun core
            const sunCoreDay = document.getElementById('date-day');
            const sunCorePhase = document.getElementById('date-phase');

            if (currentDayLabel) currentDayLabel.textContent = day;
            if (phaseNameLabel) phaseNameLabel.textContent = data.name;

            if (sunCoreDay) sunCoreDay.textContent = String(day).padStart(2, '0');
            if (sunCorePhase) sunCorePhase.textContent = data.name;

            // Update Subtitle & Colors
            const subtitle = document.getElementById('phase-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;

            // Update Horizon Prediction with a "Whisper" - Now inside the Dial
            const whisperText = document.getElementById('horizon-whisper-text');
            if (whisperText && data.auraReadings) {
                const whisper = data.auraReadings[Math.floor(Math.random() * data.auraReadings.length)];
                // Store the original whisper to toggle later if needed
                if (whisperText.textContent !== whisper) {
                    whisperText.textContent = whisper;
                }
            }

            // Update Dial
            if (window.lotusDial) {
                window.lotusDial.updatePhase(phase, day);
            }

            // Update River
            if (window.riverEngine) {
                window.riverEngine.currentPhase = phase;
            }

            // Refresh Scrolls if open
            if (window.scrollSystem) {
                window.scrollSystem.updateContent(day);
            }
        } catch (err) {
            console.error('❌ Error in refreshUI:', err);
        }
    }
}

// Global App Instance
window.addEventListener('DOMContentLoaded', () => {
    window.lotusApp = new LotusCycleApp();
});
