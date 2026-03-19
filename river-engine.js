/**
 * Lady Friend v3 - Hyper-Realistic River Engine
 * Implements sine-wave superposition for silky liquid oil look with caustic light layers.
 */

class Perlin {
    constructor() {
        this.p = new Uint8Array(512);
        this.permutation = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.permutation[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }
        for (let i = 0; i < 256; i++) {
            this.p[i] = this.permutation[i];
            this.p[i + 256] = this.permutation[i];
        }
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

    lerp(t, a, b) { return a + t * (b - a); }

    grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y, z = 0) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z),
            this.grad(this.p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(this.p[AB], x, y - 1, z),
                this.grad(this.p[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1),
                this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1),
                    this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
    }
}

class RiverEngine {
    constructor(riverCanvasId, mistCanvasId) {
        this.canvas = document.getElementById(riverCanvasId);
        this.ctx = this.canvas.getContext('2d');
        this.mistCanvas = document.getElementById(mistCanvasId);
        this.mistCtx = this.mistCanvas?.getContext('2d');

        this.width = 0;
        this.height = 0;
        this.time = 0;
        this.ripples = [];
        this.particles = [];
        this.causticTime = 0;
        this.mistTime = 0;
        this.lastHeartbeat = 0;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.perlin = new Perlin();
        // Deep aquatic phase colors for the pond background
        this.phaseColors = {
            menstrual: { deep: '#07151f', flow: '#0f293d', shimmer: '#ff7e67', caustic: 'rgba(255,126,103,0.18)' },
            follicular: { deep: '#061a1f', flow: '#0e3b48', shimmer: '#00d084', caustic: 'rgba(0,208,132,0.18)' },
            ovulatory: { deep: '#121815', flow: '#22382c', shimmer: '#ffb703', caustic: 'rgba(255,183,3,0.15)' },
            luteal: { deep: '#0b1122', flow: '#1a2444', shimmer: '#b088f9', caustic: 'rgba(176,136,249,0.15)' }
        };

        this.currentPhase = 'menstrual';
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Listen for mouse/touch for ripples
        if (!this.reducedMotion) {
            window.addEventListener('mousemove', (e) => this.createRipple(e.clientX, e.clientY, 0.2), { passive: true });
        }
        window.addEventListener('mousedown', (e) => this.createRipple(e.clientX, e.clientY, 1.0));
        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.createRipple(touch.clientX, touch.clientY, 1.0);
        }, { passive: true });

        this.animate();
    }

    updatePhase() {
        if (window.cycleStore) {
            this.currentPhase = window.cycleStore.getState().getCurrentPhase();
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.mistCanvas) {
            this.mistCanvas.width = this.width;
            this.mistCanvas.height = this.height;
        }
    }

    createRipple(x, y, strength) {
        this.ripples.push({
            x, y, r: 0,
            opacity: strength * 0.8,
            velocity: 2.5 + strength * 2.0,
            life: 1.0
        });
    }

    animate() {
        const now = Date.now();

        // Throttling to ~30fps for CPU relief
        if (!this.lastFrameTime) this.lastFrameTime = now;
        const delta = now - this.lastFrameTime;
        const minFrame = this.reducedMotion ? 48 : 32;
        if (delta < minFrame) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        this.lastFrameTime = now;

        this.time += 0.005;
        this.causticTime += 0.002;
        this.mistTime += 0.001;

        if (!this.reducedMotion) {
            this.updatePhase();
            this.drawRiver();
            this.drawMist();
        } else {
            this.drawStaticBackground();
        }

        requestAnimationFrame(() => this.animate());
    }

    drawStaticBackground() {
        const colors = this.phaseColors[this.currentPhase];
        let grad = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width);
        grad.addColorStop(0, colors.flow);
        grad.addColorStop(1, colors.deep);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawRiver() {
        const colors = this.phaseColors[this.currentPhase];

        // 1. Deep Water Base Gradient
        let bgGrad = this.ctx.createRadialGradient(this.width / 2, this.height * 0.4, 0, this.width / 2, this.height * 0.4, this.width * 0.8);
        bgGrad.addColorStop(0, colors.flow);
        bgGrad.addColorStop(1, colors.deep);
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. Aerial Pond Caustics (Voronoi-ish overlapping shapes)
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        const step = 200;
        for (let x = -step; x < this.width + step; x += step) {
            for (let y = -step; y < this.height + step; y += step) {
                // Multi-layered sine interference for organic caustics
                const cx = x + Math.sin(this.causticTime * 2 + y * 0.005) * 60;
                const cy = y + Math.cos(this.causticTime * 1.5 + x * 0.004) * 60;

                const wave1 = Math.sin(cx * 0.006 - this.time);
                const wave2 = Math.cos(cy * 0.005 + this.time * 0.8);
                const noise = (wave1 * wave2 + 1) / 2; // 0 to 1

                if (noise > 0.45) {
                    const intensity = Math.pow((noise - 0.45) * 1.8, 2);
                    const size = step * 0.8 * intensity;

                    const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
                    grad.addColorStop(0, colors.caustic);
                    grad.addColorStop(1, 'transparent');

                    this.ctx.fillStyle = grad;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        this.ctx.restore();

        // 3. User Ripples
        this.updateRipples();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '0, 0, 0';
    }

    drawCaustics() {
        const colors = this.phaseColors[this.currentPhase];
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';

        // Reduced number of caustic patterns
        for (let i = 0; i < 3; i++) {
            const offsetX = Math.sin(this.causticTime * 0.4 + i * 1.5) * this.width * 0.25;
            const offsetY = Math.cos(this.causticTime * 0.2 + i * 1.1) * this.height * 0.25;
            const baseX = this.width / 2 + offsetX;
            const baseY = this.height / 2 + offsetY;

            const angle = (i * 120) * Math.PI / 180;
            const dist = 180 + Math.sin(this.causticTime + i) * 80;
            const x = baseX + Math.cos(angle) * dist;
            const y = baseY + Math.sin(angle) * dist;
            const size = 200 + Math.sin(this.causticTime * 0.6 + i) * 60;

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, colors.caustic);
            gradient.addColorStop(0.4, 'transparent');

            this.ctx.fillStyle = gradient;
            // Only draw where the caustic is, not full screen
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawMist() {
        if (!this.mistCtx) return;
        this.mistCtx.clearRect(0, 0, this.width, this.height);

        const alpha = 0.04 + Math.sin(this.mistTime) * 0.01;

        // Single, simpler background drift
        const x = (Math.sin(this.mistTime * 0.3) * 0.2 + 0.5) * this.width;
        const y = (Math.cos(this.mistTime * 0.2) * 0.2 + 0.5) * this.height;
        const r = this.width * 0.7;

        const cloudGlow = this.mistCtx.createRadialGradient(x, y, 0, x, y, r);
        cloudGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        cloudGlow.addColorStop(1, 'transparent');

        this.mistCtx.fillStyle = cloudGlow;
        this.mistCtx.fillRect(0, 0, this.width, this.height);
    }

    updateRipples() {
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const r = this.ripples[i];
            r.r += r.velocity;
            r.life -= 0.012;

            if (r.life <= 0) {
                this.ripples.splice(i, 1);
                continue;
            }

            // Softer, wider ripple spread
            this.ctx.save();
            this.ctx.globalAlpha = r.life * 0.4;

            // Multiple concentric rings for depth
            for (let ring = 0; ring < 3; ring++) {
                this.ctx.beginPath();
                const ringRadius = r.r + ring * 15;
                this.ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);

                const innerRadius = Math.max(0, ringRadius - 3); // Prevent negative radius
                const gradient = this.ctx.createRadialGradient(
                    r.x, r.y, innerRadius,
                    r.x, r.y, ringRadius + 3
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${r.life * 0.2})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            this.ctx.restore();
        }
    }
}

