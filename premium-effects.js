/**
 * LotusCycle Aura - Premium Interactive Enhancements
 * Adds ripple effects, particle animations, and enhanced feedback
 */

class PremiumEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addRippleEffects();
        this.addFloatingParticles();
        this.enhanceScrollHandles();
        this.addKeyboardNavigation();
    }

    /**
     * Add ripple effect to all interactive buttons
     */
    addRippleEffects() {
        const buttons = document.querySelectorAll('.petal'); // Removed nav-leaf and general buttons

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('button-ripple');

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Create floating particle effects
     */
    addFloatingParticles() {
        const container = document.getElementById('app');
        if (!container) return;

        // Create particles occasionally
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.createParticle(container);
            }
        }, 2000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');

        // Random horizontal position
        const startX = Math.random() * 100;
        particle.style.left = `${startX}%`;
        particle.style.bottom = '0';

        // Random drift direction
        const drift = (Math.random() - 0.5) * 2; // -1 to 1
        particle.style.setProperty('--drift', drift);

        // Random delay
        particle.style.animationDelay = `${Math.random() * 2}s`;

        container.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }

    /**
     * Enhance scroll handles with better feedback
     */
    enhanceScrollHandles() {
        const scrollHandles = document.querySelectorAll('.scroll-handle');

        scrollHandles.forEach(handle => {
            // Add sound feedback (optional - using visual feedback instead)
            handle.addEventListener('mouseenter', () => {
                handle.style.transform = handle.closest('.scroll-right')
                    ? 'scale(1.08) translateX(-8px)'
                    : 'scale(1.08) translateX(8px)';
            });

            handle.addEventListener('mouseleave', () => {
                handle.style.transform = 'scale(1) translateX(0)';
            });
        });
    }

    /**
     * Add keyboard navigation support
     */
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal && window.modalController) {
                    window.modalController.closeAll();
                }
            }

            // Left/Right arrows to change days (if implemented in future)
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // Could trigger day navigation
                // For now, just provide visual feedback
                const dial = document.getElementById('lotus-dial');
                if (dial) {
                    dial.style.transform = e.key === 'ArrowLeft'
                        ? 'rotate(-2deg) scale(0.98)'
                        : 'rotate(2deg) scale(0.98)';

                    setTimeout(() => {
                        dial.style.transform = 'rotate(0deg) scale(1)';
                    }, 200);
                }
            }

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        // Remove keyboard nav class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /**
     * Add loading shimmer effect
     */
    static addShimmer(element) {
        element.classList.add('loading-shimmer');
        setTimeout(() => {
            element.classList.remove('loading-shimmer');
        }, 2000);
    }

    /**
     * Smooth scroll navigation for modals
     */
    static smoothScrollTo(element, duration = 300) {
        const start = element.scrollTop;
        const target = 0;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.scrollTop = start + change * this.easeInOutCubic(progress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    static easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Initialize premium effects after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.premiumEffects = new PremiumEffects();
    console.log('✨ Premium effects initialized');
});

// Export for use in other modules
window.PremiumEffects = PremiumEffects;
