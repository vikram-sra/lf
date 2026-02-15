/**
 * LotusCycle Aura - Parchment Scrolls
 * Handles clip-path center-out reveal with physics bounce animation.
 */

class ParchmentScrolls {
    constructor() {
        this.tabs = document.querySelectorAll('.scroll-tab');
        this.lastToggleTime = 0;
        this.init();
    }

    init() {
        // Handle logic removed as it's now managed by central action buttons in app.js

        // Bind close buttons
        this.tabs.forEach(tab => {
            const closeBtn = tab.querySelector('.scroll-close-btn');
            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAll();
            });
        });

        // Close on outside click (ignore if clicking on interactive elements)
        document.addEventListener('click', (e) => {
            const isAnyScrollOpen = Array.from(this.tabs).some(tab => tab.classList.contains('open'));
            const isAnyModalOpen = document.body.classList.contains('modal-open');

            if (!isAnyScrollOpen && !isAnyModalOpen) return;

            // IGNORE if the menu was just opened (within 400ms)
            const scrollNow = Date.now();
            if (this.lastToggleTime && (scrollNow - this.lastToggleTime < 400)) {
                console.log('🛡️ scrollSystem: Ignoring click (Open transition active)');
                return;
            }
            if (window.modalController && (scrollNow - window.modalController.lastActionTime < 400)) {
                console.log('🛡️ scrollSystem: Ignoring click (Modal transition active)');
                return;
            }

            const isTab = e.target.closest('.scroll-tab');
            const isModal = e.target.closest('.modal');
            const isNav = e.target.closest('nav') || e.target.closest('.nav-leaf');
            const isActionBtn = e.target.closest('.fast-action-btn');
            const isSunCore = e.target.closest('#sun-core-group');

            if (!isTab && !isModal && !isNav && !isActionBtn && !isSunCore) {
                console.log('🌑 scrollSystem: Outside click closing all. Target:', e.target.tagName);
                this.closeAll('outside-click');
                if (window.modalController) window.modalController.closeAll('outside-click');
            }
        }, true); // Use capture to ensure we intercept before bubbling

        // Update content on day change
        window.addEventListener('dial:dayChanged', (e) => this.updateContent(e.detail.day));
    }

    toggleScroll(tab) {
        if (!tab) {
            console.error('❌ toggleScroll: Tab is null');
            return;
        }

        const now = Date.now();
        if (now - this.lastToggleTime < 350) {
            console.log('⏳ toggleScroll: Rate limited, ignoring');
            return;
        }
        this.lastToggleTime = now;

        const scrollType = tab.getAttribute('data-scroll');
        const isOpen = tab.classList.contains('open');
        console.log(`📜 toggleScroll: ${isOpen ? 'CLOSING' : 'OPENING'} ${scrollType}`);

        this.closeAll('toggleScroll-internal');

        if (!isOpen) {
            tab.classList.add('open');
            this.addBounceAnimation(tab);
            document.body.classList.add('scroll-mode-active');
            this.loadScrollContent(scrollType);
        }
    }

    addBounceAnimation(element) {
        // Add physics bounce at the end of opening animation
        const content = element.querySelector('.scroll-content');
        if (!content) return;

        // Remove any existing animation
        content.style.animation = 'none';

        // Trigger reflow
        void content.offsetWidth;

        // Apply bounce animation
        content.style.animation = 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    closeScrollWithAnimation(scroll) {
        if (!scroll) return;

        const content = scroll.querySelector('.scroll-content');
        if (content) {
            // Reverse animation
            content.style.animation = 'bounceOut 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        }

        scroll.classList.remove('open');
        setTimeout(() => {
            scroll.classList.add('hidden');
            if (content) content.style.animation = '';
        }, 400);
    }

    closeAll(source = 'unknown') {
        console.log(`🌑 scrollSystem.closeAll() called [Source: ${source}]`);
        this.tabs.forEach(tab => {
            if (tab.classList.contains('open')) {
                const content = tab.querySelector('.scroll-content');
                if (content) {
                    content.style.animation = 'bounceOut 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                }
                tab.classList.remove('open');

                setTimeout(() => {
                    if (content) content.style.animation = '';
                }, 400);
            }
        });

        document.body.classList.remove('scroll-mode-active');
    }

    loadScrollContent(type) {
        const state = window.cycleStore.getState();
        const day = state.selectedDay || state.getCycleDay();
        const phase = getPhaseFromDay(day, state.settings.cycleLength);
        const data = getPhaseData(phase);

        const container = document.getElementById(`${type}-content`);
        if (!container || !data) return;

        if (type === 'nourishment') {
            this.renderNourishment(container, data.nourishment);
        } else if (type === 'asanas') {
            this.renderAsanas(container, data.asanas);
        }

        // Add entrance animations to content
        this.animateContentEntrance(container);
    }

    animateContentEntrance(container) {
        const children = container.querySelectorAll('div > *');
        children.forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(10px)';
            setTimeout(() => {
                child.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, i * 50 + 200);
        });
    }

    renderNourishment(el, info) {
        el.innerHTML = `
            <div class="animate-fade-in silk-texture">
                <p class="italic mb-6 text-[#faf4e4] opacity-80 tracking-wide font-light" style="line-height: 1.8;">${info.intro}</p>
                <div class="space-y-8">
                    <div>
                        <h4 class="font-display text-2xl font-light mb-4 text-[#ffd700] tracking-[0.15em]">Recommended Foods</h4>
                        <ul class="space-y-6">
                            ${info.foods.map(f => `
                                <li class="flex items-start gap-3">
                                    <span class="text-[#ffd700] mt-1 text-lg">✦</span>
                                    <span class="tracking-wide" style="line-height: 1.8;"><strong class="text-[#fff] font-medium">${f.name}:</strong> ${f.benefit}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="mt-8 p-6 bg-[#ffd700]/10 border-l-2 border-[#ffd700] italic text-sm backdrop-blur-sm tracking-wide" style="line-height: 1.8;">
                            ${info.highlight}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAsanas(el, info) {
        el.innerHTML = `
            <div class="animate-fade-in silk-texture">
                <p class="italic mb-6 text-[#faf4e4] opacity-80 tracking-wide font-light" style="line-height: 1.8;">${info.intro}</p>
                <div class="grid gap-8">
                    ${info.practices.map(p => `
                        <div class="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                            <h4 class="font-display text-xl font-light text-[#ffd700] tracking-[0.12em]">${p.name}</h4>
                            <p class="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-3 mt-1 font-light">${p.duration}</p>
                            <p class="text-sm leading-relaxed tracking-wide text-[#faf4e4]/90" style="line-height: 1.8;">${p.desc}</p>
                        </div>
                    `).join('')}
                    <div class="mt-4 p-6 bg-[#2a6a3a]/10 border-l-2 border-[#2a6a3a] italic text-sm tracking-wide" style="line-height: 1.8;">
                        ${info.highlight}
                    </div>
                </div>
            </div>
        `;
    }

    updateContent(day) {
        const openTab = document.querySelector('.scroll-tab.open');
        if (openTab) {
            this.loadScrollContent(openTab.getAttribute('data-scroll'));
        }
    }
}
