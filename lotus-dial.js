/**
 * LotusCycle Aura - Enhanced SVG Lotus Dial
 * Rich multi-layer petals with wind sway, organic shapes, high contrast
 */

class LotusDial {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.outerPetalsGroup = document.getElementById('outer-petals-group');
        this.midPetalsGroup = document.getElementById('mid-petals-group');
        this.innerPetalsGroup = document.getElementById('inner-petals-group');
        this.dateDayText = document.getElementById('date-day');
        this.datePhaseText = document.getElementById('date-phase');

        this.centerX = 200;
        this.centerY = 200;
        this.cycleLength = 28;
        this.currentDay = 1;
        this.windTime = 0;
        this.windRAF = null;

        this.init();
    }

    init() {
        this.renderPetals();
        this.setupEvents();
        this.startWindAnimation();

        window.addEventListener('store:ready', () => this.refresh());
        window.addEventListener('store:updated', () => this.refresh());
    }

    setupEvents() {
        const sunGroup = document.getElementById('sun-core-group');
        sunGroup?.addEventListener('pointerenter', () => this.toggleInsight(true));
        sunGroup?.addEventListener('pointerleave', () => this.toggleInsight(false));
        sunGroup?.addEventListener('focus', () => this.toggleInsight(true));
        sunGroup?.addEventListener('blur', () => this.toggleInsight(false));
        sunGroup?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('modal:open', { detail: { modal: 'log' } }));
        });

        sunGroup?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('modal:open', { detail: { modal: 'log' } }));
            }
        });
    }

    toggleInsight(show) {
        const sunGroup = document.getElementById('sun-core-group');
        if (!sunGroup) return;
        if (show === this.insightVisible) return;
        this.insightVisible = show;
        sunGroup.classList.toggle('is-insight', show);
    }

    startWindAnimation() {
        const animate = () => {
            this.windTime += 0.008;

            // Gentle wind sway on outer decorative layers
            if (this.outerPetalsGroup) {
                const outerScale = 1 + Math.sin(this.windTime * 0.3) * 0.008;
                this.outerPetalsGroup.style.transformOrigin = '200px 200px';
                this.outerPetalsGroup.style.transform = `rotate(${this.windTime * 0.3}deg) scale(${outerScale})`;
            }

            if (this.midPetalsGroup) {
                const midSway = Math.sin(this.windTime * 0.9 + 0.5) * 1.0;
                this.midPetalsGroup.style.transform = `rotate(${-midSway}deg)`;
                this.midPetalsGroup.style.transformOrigin = '200px 200px';
            }

            this.windRAF = requestAnimationFrame(animate);
        };
        animate();
    }

    refresh() {
        const state = window.cycleStore?.getState?.();
        if (!state) return;

        this.cycleLength = Number(state.settings?.cycleLength || 28);
        this.currentDay = state.getSelectedDay();
        this.renderPetals();
        this.updateSunCore();
    }

    renderPetals() {
        this.outerPetalsGroup.innerHTML = '';
        this.midPetalsGroup.innerHTML = '';
        this.innerPetalsGroup.innerHTML = '';

        // 4 decorative layers (outermost → innermost), then cycle petals
        this.renderLayer4(); // largest, most transparent
        this.renderLayer3(); // large
        this.renderOuterRing(); // medium (existing)
        this.renderMidRing(); // small (existing)
        this.renderCycleRing(); // functional cycle petals
    }

    // --- Layer 4: Outermost grand petals ---
    renderLayer4() {
        const count = 12;
        const step = 360 / count;
        // Offset so they peek between the Layer 3 petals
        for (let i = 0; i < count; i++) {
            const angle = i * step + 15;
            // Extremely large, wide petals that stretch far out filling the screen
            const path = this.createSVGPath(
                this.createRichPetalPath(angle, 150, 200, 1.8), // MASSIVE multiplier

                'url(#petal-layer4-gradient)',
                'rgba(212,160,23,0.12)',
                '0.4'
            );
            path.style.opacity = '0.55';
            path.classList.add('wind-petal', 'wind-slow');
            this.outerPetalsGroup.appendChild(path);
        }
    }

    // --- Layer 3: Large layered petals ---
    renderLayer3() {
        const count = 12;
        const step = 360 / count;

        for (let i = 0; i < count; i++) {
            const angle = i * step;
            // Large, full petals
            const path = this.createSVGPath(
                this.createRichPetalPath(angle, 130, 160, 1.5),

                'url(#petal-layer3-gradient)',
                'rgba(212,160,23,0.18)',
                '0.5'
            );
            path.style.opacity = '0.70';
            path.classList.add('wind-petal', 'wind-medium');
            this.outerPetalsGroup.appendChild(path);
        }
    }

    // --- Layer 2: Outer ring ---
    renderOuterRing() {
        const count = 12;
        const step = 360 / count;
        const offset = step / 2;

        for (let i = 0; i < count; i++) {
            const angle = i * step + offset;
            const path = this.createSVGPath(
                this.createRichPetalPath(angle, 118, 120, 1.3),

                'url(#petal-aura-gradient)',
                'rgba(212,160,23,0.3)',
                '0.6'
            );
            path.style.opacity = '0.85';
            path.classList.add('wind-petal', 'wind-fast');
            this.outerPetalsGroup.appendChild(path);
        }
    }

    // --- Layer 1: Mid ring ---
    renderMidRing() {
        const count = 16;
        const step = 360 / count;

        for (let i = 0; i < count; i++) {
            const angle = i * step;
            const path = this.createSVGPath(
                this.createRichPetalPath(angle, 80, 65, 0.9),
                'url(#petal-mid-gradient)',
                'rgba(212,160,23,0.4)',
                '0.7'
            );
            path.style.opacity = '0.80';
            this.midPetalsGroup.appendChild(path);
        }
    }

    // --- Rich organic petal shape (wide, plump, lotus-like) ---
    createRichPetalPath(angle, radius, height, widthMult = 1.0) {
        const base = this.getPointAt(angle, radius);
        const tip = this.getPointAt(angle, radius + height);

        // Make the petals much wider and more bulbous like a real lotus
        const leftBase = this.getPointAt(angle - (20 * widthMult), radius + height * 0.15);
        const rightBase = this.getPointAt(angle + (20 * widthMult), radius + height * 0.15);

        const leftMid = this.getPointAt(angle - (28 * widthMult), radius + height * 0.45);
        const rightMid = this.getPointAt(angle + (28 * widthMult), radius + height * 0.45);

        const leftUpper = this.getPointAt(angle - (14 * widthMult), radius + height * 0.82);
        const rightUpper = this.getPointAt(angle + (14 * widthMult), radius + height * 0.82);

        return `M ${base.x} ${base.y}
                C ${leftBase.x} ${leftBase.y} ${leftMid.x} ${leftMid.y} ${leftUpper.x} ${leftUpper.y}
                Q ${leftUpper.x} ${leftUpper.y} ${tip.x} ${tip.y}
                Q ${rightUpper.x} ${rightUpper.y} ${rightUpper.x} ${rightUpper.y}
                C ${rightMid.x} ${rightMid.y} ${rightBase.x} ${rightBase.y} ${base.x} ${base.y} Z`;
    }

    createSVGPath(d, fill, stroke, strokeWidth) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', strokeWidth);
        return path;
    }

    // --- Cycle ring (functional) ---
    renderCycleRing() {
        const state = window.cycleStore.getState();
        const currentPhase = state.getCurrentPhase();

        const step = 360 / this.cycleLength;
        const innerRadius = 85;
        const petalHeight = 65;
        const overlap = step * 1.5;

        for (let i = 0; i < this.cycleLength; i++) {
            const day = i + 1;
            const angle = i * step - 90;
            const phase = getPhaseFromDay(day, this.cycleLength);
            const phaseData = getPhaseData(phase);

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('petal-container');
            group.setAttribute('data-day', String(day));
            group.style.transformOrigin = '200px 200px';
            group.style.cursor = 'pointer';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // Plump cycle petals
            path.setAttribute('d', this.createOrganicPetalPath(angle, innerRadius, overlap, petalHeight));
            path.setAttribute('fill', phaseData.color);
            path.setAttribute('stroke', day === this.currentDay ? '#ffffff' : (phaseData.colorDark || phaseData.color));
            path.setAttribute('stroke-width', day === this.currentDay ? '2.4' : '0.8');
            path.setAttribute('fill-opacity', day === this.currentDay ? '1' : (phase === currentPhase ? '0.70' : '0.35'));
            path.classList.add('petal-path');

            const labelPos = this.getPointAt(angle, innerRadius + petalHeight * 0.55);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelPos.x);
            text.setAttribute('y', labelPos.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', day === this.currentDay ? '#1a2f3a' : '#ffffff');
            text.setAttribute('fill-opacity', day === this.currentDay ? '1' : '0.8');
            text.setAttribute('font-size', this.cycleLength > 30 ? '9px' : '11px');
            text.setAttribute('font-weight', day === this.currentDay ? '800' : '500');
            text.setAttribute('transform', `rotate(${angle + 90}, ${labelPos.x}, ${labelPos.y})`);
            text.style.pointerEvents = 'none';
            text.textContent = String(day);

            group.appendChild(path);
            group.appendChild(text);
            group.addEventListener('click', () => this.selectDay(day));
            this.innerPetalsGroup.appendChild(group);
        }

        this.highlightActiveDay();
    }

    selectDay(day) {
        const state = window.cycleStore.getState();
        state.setSelectedDay(day);
        this.currentDay = day;
        this.highlightActiveDay();
        this.updateSunCore();
        window.dispatchEvent(new CustomEvent('dial:dayChanged', { detail: { day } }));
    }

    updateSunCore() {
        const state = window.cycleStore.getState();
        const day = state.getSelectedDay();
        const phase = state.getCurrentPhase();
        const phaseData = getPhaseData(phase);

        this.currentDay = day;

        if (this.dateDayText) this.dateDayText.textContent = String(day).padStart(2, '0');
        if (this.datePhaseText) this.datePhaseText.textContent = phaseData.name.toUpperCase();

        const insight = document.getElementById('daily-insight-text');
        if (insight && phaseData.auraReadings?.length) {
            insight.textContent = phaseData.auraReadings[(day - 1) % phaseData.auraReadings.length];
        }
    }

    highlightActiveDay() {
        const state = window.cycleStore.getState();
        const activePhase = state.getCurrentPhase();

        const petals = this.innerPetalsGroup.querySelectorAll('.petal-container');
        petals.forEach((group) => {
            const day = Number(group.getAttribute('data-day'));
            const phase = getPhaseFromDay(day, this.cycleLength);
            const phaseData = getPhaseData(phase);
            const path = group.querySelector('.petal-path');
            const text = group.querySelector('text');
            if (!path) return;

            if (day === this.currentDay) {
                path.style.fill = phaseData.color;
                path.style.fillOpacity = '0.95';
                path.style.stroke = '#2d1b0e';
                path.style.strokeWidth = '2px';
                path.style.filter = `drop-shadow(0 0 12px ${phaseData.color}) drop-shadow(0 0 4px rgba(212,160,23,0.3))`;
                group.style.transform = 'scale(1.14)';
                if (text) { text.style.fillOpacity = '1'; text.setAttribute('fill', '#2d1b0e'); text.setAttribute('font-weight', '700'); }
            } else if (phase === activePhase) {
                path.style.fill = phaseData.color;
                path.style.fillOpacity = '0.55';
                path.style.stroke = phaseData.colorDark || phaseData.color;
                path.style.strokeWidth = '0.8px';
                path.style.filter = 'none';
                group.style.transform = 'scale(1.03)';
                if (text) { text.style.fillOpacity = '0.85'; text.setAttribute('fill', '#5a3e0a'); text.setAttribute('font-weight', '500'); }
            } else {
                path.style.fill = phaseData.color;
                path.style.fillOpacity = '0.22';
                path.style.stroke = phaseData.color;
                path.style.strokeWidth = '0.5px';
                path.style.filter = 'none';
                group.style.transform = 'scale(1)';
                if (text) { text.style.fillOpacity = '0.55'; text.setAttribute('fill', '#5a3e0a'); text.setAttribute('font-weight', '400'); }
            }
        });
    }

    createOrganicPetalPath(angle, r, width, h) {
        const half = width / 2;
        const p1 = this.getPointAt(angle - half, r);
        const p2 = this.getPointAt(angle - half * 0.5, r + h * 0.78);
        const tip = this.getPointAt(angle, r + h + 6);
        const p3 = this.getPointAt(angle + half * 0.5, r + h * 0.78);
        const p4 = this.getPointAt(angle + half, r);
        return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${tip.x} ${tip.y} C ${p3.x} ${p3.y} ${p4.x} ${p4.y} ${p4.x} ${p4.y} A ${r} ${r} 0 0 0 ${p1.x} ${p1.y} Z`;
    }

    getPointAt(angle, radius) {
        const rad = (angle * Math.PI) / 180;
        return {
            x: this.centerX + radius * Math.cos(rad),
            y: this.centerY + radius * Math.sin(rad)
        };
    }

    updatePhase(_phase, day) {
        this.currentDay = day;
        this.highlightActiveDay();
        this.updateSunCore();
    }
}

window.LotusDial = LotusDial;
