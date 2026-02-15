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

        window.addEventListener('modal:open', (e) => {
            if (window.modalController) {
                window.modalController.open(e.detail.modal);
            }
        });
    }

    checkOnboarding() {
        if (window.cycleStore) {
            const state = window.cycleStore.getState();
            if (!state.initialized) {
                // In a full implementation, this triggers the onboarding modal
                // For this hyper-real polish, we ensure defaults are set
                state.setInitialized(true);
            }
        }
    }

    setupNavigation() {
        console.log('🔗 Setting up navigation listeners...');

        // 1. Core Bottom Nav (Leaves)
        const bindNav = () => {
            const historyBtn = document.getElementById('nav-history');
            const logBtn = document.getElementById('nav-log');
            const ritualsBtn = document.getElementById('nav-rituals');

            if (historyBtn && logBtn && ritualsBtn && window.modalController) {
                console.log('✅ Binding bottom navigation...');
                const openHistory = (e) => { e.preventDefault(); e.stopPropagation(); window.modalController.open('history'); };
                const openLog = (e) => { e.preventDefault(); e.stopPropagation(); window.modalController.open('log'); };
                const openRituals = (e) => { e.preventDefault(); e.stopPropagation(); window.modalController.open('rituals'); };

                historyBtn.addEventListener('click', openHistory);
                logBtn.addEventListener('click', openLog);
                ritualsBtn.addEventListener('click', openRituals);
            }
        };

        // 2. Center Action Buttons (Robust Binding)
        let retryCount = 0;
        const bindActions = () => {
            const nourishAction = document.getElementById('action-nourish');
            const exerciseAction = document.getElementById('action-exercise');

            if (nourishAction && exerciseAction && window.scrollSystem) {
                console.log('✅ Binding Fast Action buttons (Direct)...');

                nourishAction.onclick = (e) => {
                    console.log('🍃 CLICK: Nourish Button Layer');
                    e.preventDefault();
                    e.stopPropagation();
                    const tab = document.querySelector('[data-scroll="nourishment"]');
                    if (tab && window.scrollSystem) {
                        window.scrollSystem.toggleScroll(tab);
                    } else {
                        console.error('❌ Could not find nourishment tab or scrollSystem!');
                    }
                };

                exerciseAction.onclick = (e) => {
                    console.log('🧘 CLICK: Exercise Button Layer');
                    e.preventDefault();
                    e.stopPropagation();
                    const tab = document.querySelector('[data-scroll="asanas"]');
                    if (tab && window.scrollSystem) {
                        window.scrollSystem.toggleScroll(tab);
                    } else {
                        console.error('❌ Could not find asanas tab or scrollSystem!');
                    }
                };

            } else if (retryCount < 20) {
                retryCount++;
                setTimeout(bindActions, 150);
            }
        };

        bindNav();
        bindActions();
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
            // The sun core elements are the primary display
            const sunCoreDay = document.getElementById('date-day');
            const sunCorePhase = document.getElementById('date-phase');

            if (sunCoreDay) sunCoreDay.textContent = String(day).padStart(2, '0');
            if (sunCorePhase) sunCorePhase.textContent = data.name;

            // Update Subtitle
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

            // NEW: Update Action Ribbons with specific recommendations
            const nourishText = document.querySelector('#action-nourish .btn-text');
            const exerciseText = document.querySelector('#action-exercise .btn-text');

            if (nourishText && data.nourishment?.foods?.length > 0) {
                // Pick a random food or the first one as representative
                const food = data.nourishment.foods[0].name;
                nourishText.textContent = food;
            }

            if (exerciseText && data.asanas?.practices?.length > 0) {
                const practice = data.asanas.practices[0].name;
                exerciseText.textContent = practice;
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
