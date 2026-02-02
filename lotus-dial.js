/**
 * LotusCycle Aura 2.0 - SVG Lotus Dial Engine
 * Improved dynamic scaling and hyper-realistic petal geometry.
 */

class LotusDial {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.petalsGroup = document.getElementById('petals-group');
        this.sunCore = document.getElementById('sun-center');
        this.dateDayText = document.getElementById('date-day');
        this.datePhaseText = document.getElementById('date-phase');

        this.cycleLength = 28;
        this.currentDay = 1;
        this.centerX = 200;
        this.centerY = 200;

        this.init();
    }

    init() {
        // Initial setup
        this.renderPetals();
        this.animateBloom();
        this.setupEventListeners();

        window.addEventListener('store:ready', () => this.refresh());
        window.addEventListener('resize', () => this.handleResize());
    }

    setupEventListeners() {
        const sunGroup = document.getElementById('sun-core-group');
        sunGroup?.addEventListener('mouseenter', () => this.toggleWhisper(true));
        sunGroup?.addEventListener('mouseleave', () => this.toggleWhisper(false));
        sunGroup?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('modal:open', { detail: { modal: 'log' } }));
        });
    }

    toggleWhisper(show) {
        const standard = document.getElementById('sun-info-standard');
        const whisper = document.getElementById('sun-info-whisper');
        if (standard && whisper) {
            standard.style.opacity = show ? '0' : '1';
            // Use pointer-events to prevent interaction with hidden element
            standard.style.pointerEvents = show ? 'none' : 'auto';

            whisper.style.opacity = show ? '1' : '0';
            whisper.style.transition = 'opacity 0.4s ease';
        }
    }

    handleResize() {
        // The SVG uses viewBox, so we don't need complex math, 
        // but we can trigger a re-render if needed for path precision.
    }

    renderPetals() {
        this.petalsGroup.innerHTML = '';
        this.renderOuterRing();
        this.renderCycleRing();
    }

    renderOuterRing() {
        const count = 12;
        const angleStep = 360 / count;

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const pathData = this.createPetalShape(angle, 100, 60, 70);

            const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
            p.setAttribute('d', pathData);
            p.setAttribute('fill', 'url(#petal-aura-gradient)');
            p.setAttribute('stroke', 'rgba(255, 215, 0, 0.4)'); /* Brightened from 0.15 */
            p.setAttribute('stroke-width', '0.8');
            p.classList.add('petal-outer');

            this.petalsGroup.appendChild(p);
        }
    }

    renderCycleRing() {
        const angleStep = 360 / this.cycleLength;
        const innerRadius = 82;
        const petalHeight = 48;
        const overlapWidth = (360 / this.cycleLength) * 1.1;

        for (let i = 0; i < this.cycleLength; i++) {
            const day = i + 1;
            const angle = (i * angleStep) - 90;
            const phase = getPhaseFromDay(day, this.cycleLength);

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add('petal-container', 'cursor-pointer');
            g.setAttribute('data-day', day);
            g.style.transformOrigin = '200px 200px'; // Ensure scaling happens from center

            // Petal Path
            const pathStr = this.createOrganicPetalPath(angle, innerRadius, overlapWidth, petalHeight);
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute('d', pathStr);
            path.setAttribute('fill', `url(#${phase}-gradient)`);
            path.setAttribute('filter', 'url(#petal-texture)');
            path.setAttribute('stroke', 'rgba(255,255,255,0.4)');
            path.setAttribute('stroke-width', '0.8');
            path.style.filter = 'drop-shadow(0 0 5px rgba(0,0,0,0.3))';
            path.classList.add('petal-path', 'transition-all', 'duration-500');

            // Day Number
            const labelPos = this.getPointAt(angle, innerRadius + petalHeight * 0.5);
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', labelPos.x);
            text.setAttribute('y', labelPos.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', 'rgba(42, 26, 10, 0.7)');
            text.setAttribute('font-size', this.cycleLength > 30 ? '7px' : '9px');
            text.setAttribute('transform', `rotate(${angle + 90}, ${labelPos.x}, ${labelPos.y})`);
            text.classList.add('font-body', 'font-medium', 'pointer-events-none');
            text.textContent = day;

            g.appendChild(path);
            g.appendChild(text);

            g.addEventListener('click', () => this.selectDay(day));
            this.petalsGroup.appendChild(g);
        }

        this.highlightActiveDay();
    }

    createPetalShape(angle, rInner, width, height) {
        const base = this.getPointAt(angle, rInner);
        const tip = this.getPointAt(angle, rInner + height);
        const leftControl = this.getPointAt(angle - 15, rInner + height * 0.4);
        const rightControl = this.getPointAt(angle + 15, rInner + height * 0.4);

        return `M ${base.x} ${base.y} Q ${leftControl.x} ${leftControl.y} ${tip.x} ${tip.y} Q ${rightControl.x} ${rightControl.y} ${base.x} ${base.y} Z`;
    }

    createOrganicPetalPath(angle, r, width, h) {
        const wHalf = width / 2;
        const p1 = this.getPointAt(angle - wHalf, r);
        const p2 = this.getPointAt(angle - wHalf * 0.5, r + h * 0.8);
        const tip = this.getPointAt(angle, r + h + 5);
        const p3 = this.getPointAt(angle + wHalf * 0.5, r + h * 0.8);
        const p4 = this.getPointAt(angle + wHalf, r);

        return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${tip.x} ${tip.y} C ${p3.x} ${p3.y} ${p4.x} ${p4.y} ${p4.x} ${p4.y} A ${r} ${r} 0 0 0 ${p1.x} ${p1.y} Z`;
    }

    getPointAt(angle, r) {
        const rad = (angle * Math.PI) / 180;
        return {
            x: this.centerX + r * Math.cos(rad),
            y: this.centerY + r * Math.sin(rad)
        };
    }

    animateBloom() {
        const outers = document.querySelectorAll('.petal-outer');
        outers.forEach((p, i) => {
            p.style.opacity = '0';
            p.style.transform = 'scale(0.8) rotate(-10deg)';
            setTimeout(() => {
                p.style.transition = 'all 1.5s var(--ease-out-expo)';
                p.style.opacity = '1';
                p.style.transform = 'scale(1) rotate(0deg)';
            }, i * 100);
        });

        const petals = document.querySelectorAll('.petal-container');
        petals.forEach((p, i) => {
            p.style.opacity = '0';
            p.style.transform = 'scale(0.9)';
            setTimeout(() => {
                p.style.transition = 'all 1s var(--ease-out-expo)';
                p.style.opacity = '1';
                p.style.transform = 'scale(1)';
            }, 500 + i * 20);
        });
    }

    updateSunCore() {
        const state = window.cycleStore.getState();
        this.currentDay = state.getCycleDay();
        const phase = state.getCurrentPhase();

        if (this.dateDayText) this.dateDayText.textContent = String(this.currentDay).padStart(2, '0');
        if (this.datePhaseText) this.datePhaseText.textContent = phase ? phase.toUpperCase() : '';

        const whisperText = document.getElementById('horizon-whisper-text');
        if (whisperText) {
            const data = getPhaseData(phase);
            const whisper = data.auraReadings[Math.floor(Math.random() * data.auraReadings.length)];
            whisperText.textContent = whisper;
        }
    }

    highlightActiveDay() {
        const containers = document.querySelectorAll('.petal-container');
        containers.forEach(g => {
            const day = parseInt(g.getAttribute('data-day'));
            const path = g.querySelector('.petal-path');

            if (day === this.currentDay) {
                path.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)) brightness(1.3)';
                path.style.stroke = '#fff';
                path.style.strokeWidth = '2px';
                g.style.transform = 'scale(1.15)';
            } else {
                path.style.filter = 'url(#petal-texture) brightness(1.1)';
                path.style.stroke = 'rgba(255,255,255,0.3)';
                path.style.strokeWidth = '0.8px';
                g.style.transform = 'scale(1)';
            }
        });
    }

    selectDay(day) {
        this.currentDay = day;
        this.highlightActiveDay();
        this.updateSunCore();

        if (window.riverEngine) {
            // Ripple effect logic here
        }

        window.dispatchEvent(new CustomEvent('dial:dayChanged', { detail: { day } }));
    }

    refresh() {
        const state = window.cycleStore.getState();
        this.cycleLength = state.settings.cycleLength || 28;
        this.renderPetals();
        this.updateSunCore();
    }

    updatePhase(phase, day) {
        this.currentDay = day;
        this.highlightActiveDay();
        this.updateSunCore();
    }

    handleSelectedDay(day) {
        this.selectDay(day);
    }
}
