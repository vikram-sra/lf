/**
 * LotusCycle Aura v3 - Hyper-Realistic River Engine
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

        this.initParticles(30);

        this.perlin = new Perlin();
        this.phaseColors = {
            menstrual: { deep: '#1a0505', flow: '#2d0a0a', shimmer: '#d65c5c', caustic: 'rgba(255, 100, 100, 0.2)' },
            follicular: { deep: '#0a1a1a', flow: '#163333', shimmer: '#5ebccf', caustic: 'rgba(94, 188, 207, 0.2)' },
            ovulatory: { deep: '#1a1205', flow: '#36240a', shimmer: '#ffea00', caustic: 'rgba(255, 234, 0, 0.25)' },
            luteal: { deep: '#050a1a', flow: '#0f1e3d', shimmer: '#6ca0e0', caustic: 'rgba(108, 160, 224, 0.2)' }
        };

        this.currentPhase = 'menstrual';
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Listen for mouse/touch for ripples
        window.addEventListener('mousemove', (e) => this.createRipple(e.clientX, e.clientY, 0.3));
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
            opacity: strength * 0.6,
            velocity: 2.5 + strength * 1.5,
            life: 1.0
        });
    }

    animate() {
        const now = Date.now();
        this.time += 0.003; // Slower for more fluid motion
        this.causticTime += 0.001; // Very slow drift for caustics
        this.mistTime += 0.002;

        // Sacred Heartbeat - periodic ripple from center
        if (now - this.lastHeartbeat > 5000) {
            this.createRipple(this.width / 2, this.height / 2, 0.4);
            this.lastHeartbeat = now;
        }

        this.drawRiver();
        this.drawCaustics(); // New caustic light layer
        this.drawMist();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    initParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    drawParticles() {
        this.ctx.save();
        this.particles.forEach(p => {
            p.x += p.vx + Math.sin(this.time + p.phase) * 0.15;
            p.y += p.vy + Math.cos(this.time + p.phase) * 0.15;

            // Wrap around
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            const glow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
            const flicker = (Math.sin(this.time * 2 + p.phase) * 0.3 + 0.7) * p.alpha;

            glow.addColorStop(0, `hsla(45, 100%, 70%, ${flicker})`);
            glow.addColorStop(0.3, `hsla(45, 100%, 50%, ${flicker * 0.6})`);
            glow.addColorStop(1, 'transparent');

            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
            this.ctx.fill();

            // Core spark
            this.ctx.fillStyle = `rgba(255, 255, 200, ${flicker * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    drawRiver() {
        const colors = this.phaseColors[this.currentPhase];

        // Deep Water Base
        this.ctx.fillStyle = colors.deep;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Silky liquid oil surface using sine-wave superposition
        this.drawSilkySurface(colors);

        // Draw Ripples with larger spread
        this.updateRipples();
    }

    drawSilkySurface(colors) {
        this.ctx.save();
        const step = 80;
        for (let x = -step; x < this.width + step; x += step) {
            for (let y = -step; y < this.height + step; y += step) {
                const wave1 = Math.sin(x * 0.002 + this.time * 0.4) * 0.5;
                const wave2 = Math.sin(y * 0.003 + this.time * 0.3) * 0.5;
                const combined = (wave1 + wave2) / 2;
                const normalized = (combined + 1) / 2;

                if (normalized > 0.4) {
                    const size = step * normalized * 2;
                    const alpha = normalized * 0.12;

                    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
                    gradient.addColorStop(0, colors.shimmer + '1a'); // Very low alpha
                    gradient.addColorStop(1, 'transparent');

                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        this.ctx.restore();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '0, 0, 0';
    }

    drawCaustics() {
        // Drifting caustic light layer
        const colors = this.phaseColors[this.currentPhase];
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';

        // Multiple caustic light patterns
        for (let i = 0; i < 5; i++) {
            const offsetX = Math.sin(this.causticTime * 0.5 + i * 1.2) * this.width * 0.3;
            const offsetY = Math.cos(this.causticTime * 0.3 + i * 0.8) * this.height * 0.3;
            const baseX = this.width / 2 + offsetX;
            const baseY = this.height / 2 + offsetY;

            // Create organic caustic patterns using sine waves
            for (let j = 0; j < 3; j++) {
                const angle = (i * 72 + j * 120) * Math.PI / 180;
                const dist = 200 + Math.sin(this.causticTime + i) * 100;
                const x = baseX + Math.cos(angle) * dist;
                const y = baseY + Math.sin(angle) * dist;
                const size = 150 + Math.sin(this.causticTime * 0.7 + i + j) * 50;

                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
                gradient.addColorStop(0, colors.caustic);
                gradient.addColorStop(0.3, colors.caustic.replace(/[\d.]+\)/, '0.08)'));
                gradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.width, this.height);
            }
        }

        this.ctx.restore();
    }

    drawMist() {
        if (!this.mistCtx) return;
        this.mistCtx.clearRect(0, 0, this.width, this.height);

        const gradient = this.mistCtx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.8
        );

        const alpha = 0.04 + Math.sin(this.mistTime) * 0.015;
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        this.mistCtx.fillStyle = gradient;
        this.mistCtx.fillRect(0, 0, this.width, this.height);

        // Drifting ethereal clouds
        for (let i = 0; i < 4; i++) {
            const x = (Math.sin(this.mistTime * 0.4 + i * 1.5) * 0.25 + 0.5) * this.width;
            const y = (Math.cos(this.mistTime * 0.25 + i * 1.2) * 0.25 + 0.5) * this.height;
            const r = (Math.sin(this.mistTime * 0.15 + i) * 80 + 220);

            const cloudGlow = this.mistCtx.createRadialGradient(x, y, 0, x, y, r);
            cloudGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.6})`);
            cloudGlow.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.3})`);
            cloudGlow.addColorStop(1, 'transparent');

            this.mistCtx.fillStyle = cloudGlow;
            this.mistCtx.fillRect(0, 0, this.width, this.height);
        }
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

                const gradient = this.ctx.createRadialGradient(
                    r.x, r.y, ringRadius - 3,
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


