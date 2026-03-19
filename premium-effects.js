/**
 * Lady Friend - Premium effects: floating leaves, particles, keyboard state
 */

class PremiumEffects {
    constructor() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.particleInterval = null;
        this.leafInterval = null;
        this.init();
    }

    init() {
        this.setupKeyboardState();
        if (!this.reducedMotion) {
            this.startParticles();
            this.startFloatingLeaves();
        }
    }

    setupKeyboardState() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
        });
        document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));
        document.addEventListener('touchstart', () => document.body.classList.remove('keyboard-nav'), { passive: true });
    }

    startParticles() {
        const app = document.getElementById('app');
        if (!app) return;

        this.particleInterval = setInterval(() => {
            if (Math.random() < 0.72) return;
            this.spawnParticle(app);
        }, 1800);
    }

    spawnParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = '0';
        particle.style.setProperty('--drift', (Math.random() - 0.5).toFixed(2));
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 7600);
    }

    startFloatingLeaves() {
        const app = document.getElementById('app');
        if (!app) return;

        // Spawn a leaf every 3-6 seconds
        const spawnLeaf = () => {
            this.createFloatingLeaf(app);
            this.leafInterval = setTimeout(spawnLeaf, 3000 + Math.random() * 3000);
        };
        spawnLeaf();
    }

    createFloatingLeaf(container) {
        const leaf = document.createElement('div');
        leaf.className = 'floating-leaf';

        // Random leaf type
        const leafTypes = ['leaf-1', 'leaf-2', 'leaf-3'];
        leaf.classList.add(leafTypes[Math.floor(Math.random() * leafTypes.length)]);

        // Start from random side (left, right, or top)
        const side = Math.random();
        if (side < 0.4) {
            // From left
            leaf.style.left = '-30px';
            leaf.style.top = `${20 + Math.random() * 60}%`;
            leaf.classList.add('drift-right');
        } else if (side < 0.8) {
            // From right
            leaf.style.right = '-30px';
            leaf.style.top = `${20 + Math.random() * 60}%`;
            leaf.classList.add('drift-left');
        } else {
            // From top
            leaf.style.left = `${10 + Math.random() * 80}%`;
            leaf.style.top = '-30px';
            leaf.classList.add('drift-down');
        }

        // Random spin speed & rotation
        leaf.style.setProperty('--leaf-spin', `${6 + Math.random() * 8}s`);
        leaf.style.setProperty('--leaf-start-rotation', `${Math.random() * 360}deg`);
        leaf.style.setProperty('--leaf-size', `${14 + Math.random() * 12}px`);

        container.appendChild(leaf);
        setTimeout(() => leaf.remove(), 12000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.premiumEffects = new PremiumEffects();
});

window.PremiumEffects = PremiumEffects;
