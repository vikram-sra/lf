# 🎭 LotusCycle Aura - Animation Reference Guide

## Mystical Tech Animation System

This guide documents all custom animation curves and keyframes used in the hyper-luxury transformation.

---

## 🎯 **Core Animation Curves**

### 1. **Organic Ease** (Primary Motion)
```css
cubic-bezier(0.25, 1, 0.5, 1)
```
**Use Cases**:
- Scroll handle hover
- Modal open/close
- Navigation leaf interactions
- River ripple propagation

**Characteristics**:
- Slow start (0.25 ease-in)
- Fast middle
- Gentle deceleration (0.5, 1 ease-out)
- Feels: Fluid, organic, meditative

---

### 2. **Elastic Bounce** (Physics-Based)
```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```
**Use Cases**:
- Scroll content reveal
- Petal entrance animation
- Button press feedback
- Modal content appearance

**Characteristics**:
- Overshoots endpoint (1.56 > 1)
- Creates springy "bounce" effect
- Feels: Playful, organic, premium

---

### 3. **Smooth Flow** (Subtle Motion)
```css
ease-in-out
```
**Use Cases**:
- Sun core pulse
- Breathing animation
- Particle drift
- Mist layer movement

**Characteristics**:
- Gentle acceleration and deceleration
- No sudden starts/stops
- Feels: Calm, continuous, ambient

---

## 🌸 **Custom Keyframe Animations**

### 1. Dial Breathing
```css
@keyframes dialBreathe {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}
```
**Duration**: 4s  
**Timing**: `cubic-bezier(0.25, 1, 0.5, 1)`  
**Infinite**: Yes  
**Purpose**: Subtle life-like pulse to lotus dial

---

### 2. Bounce In (Scroll Reveal)
```css
@keyframes bounceIn {
    0% {
        transform: translateY(-50%) scale(0.95);
    }
    50% {
        transform: translateY(-50%) scale(1.02);
    }
    100% {
        transform: translateY(-50%) scale(1);
    }
}
```
**Duration**: 0.6s  
**Timing**: `cubic-bezier(0.34, 1.56, 0.64, 1)`  
**Purpose**: Physics bounce when scroll opens

---

### 3. Bounce Out (Scroll Close)
```css
@keyframes bounceOut {
    0% {
        transform: translateY(-50%) scale(1);
        opacity: 1;
    }
    50% {
        transform: translateY(-50%) scale(0.98);
        opacity: 0.8;
    }
    100% {
        transform: translateY(-50%) scale(0.9);
        opacity: 0;
    }
}
```
**Duration**: 0.4s  
**Timing**: `cubic-bezier(0.25, 1, 0.5, 1)`  
**Purpose**: Smooth reverse animation for closing

---

### 4. Petal Entrance
```css
@keyframes petalEntrance {
    0% {
        opacity: 0;
        transform: scale(0.5) rotate(-20deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}
```
**Duration**: 0.6s  
**Timing**: `cubic-bezier(0.34, 1.56, 0.64, 1)`  
**Stagger**: 25ms per petal  
**Purpose**: Organic bloom effect on load

---

### 5. Active Pulse (Selected Petal)
```css
@keyframes activePulse {
    0%, 100% {
        transform: scale(1.1);
        filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.7));
    }
    50% {
        transform: scale(1.13);
        filter: brightness(1.3) drop-shadow(0 0 30px rgba(255, 215, 0, 0.9));
    }
}
```
**Duration**: 2s  
**Timing**: `ease-in-out`  
**Infinite**: Yes  
**Purpose**: Highlight active day on cycle

---

### 6. Sun Pulse (Core Glow)
```css
@keyframes sunPulse {
    0%, 100% {
        filter: 
            drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))
            drop-shadow(0 0 80px rgba(255, 170, 0, 0.3));
    }
    50% {
        filter: 
            drop-shadow(0 0 60px rgba(255, 215, 0, 0.9))
            drop-shadow(0 0 120px rgba(255, 170, 0, 0.5));
    }
}
```
**Duration**: 3s  
**Timing**: `ease-in-out`  
**Infinite**: Yes  
**Purpose**: Cinematic multi-layered glow pulse

---

### 7. Leaf Sway (Navigation)
```css
@keyframes leafSway {
    0%, 100% {
        transform: rotate(-3deg) translateY(0);
    }
    50% {
        transform: rotate(3deg) translateY(-8px);
    }
}
```
**Duration**: 6s  
**Timing**: `ease-in-out`  
**Infinite**: Yes  
**Stagger**: -2s per leaf (left, center, right)  
**Purpose**: Organic ambient motion

---

### 8. Fade In (General)
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```
**Duration**: 0.5s  
**Timing**: `ease-out`  
**Purpose**: Smooth entrance for content

---

## 🎨 **Staggered Animation Patterns**

### Petal Bloom Sequence
```javascript
// Outer decorative petals
outers.forEach((p, i) => {
    setTimeout(() => {
        p.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        p.style.opacity = '0.7';
        p.style.transform = 'scale(1) rotate(0deg)';
    }, i * 80); // 80ms stagger
});

// Cycle petals
cycles.forEach((p, i) => {
    setTimeout(() => {
        p.classList.add('bloomed');
    }, 400 + (i * 25)); // Base delay + 25ms per petal
});
```

---

### Content Entrance
```javascript
children.forEach((child, i) => {
    setTimeout(() => {
        child.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
    }, i * 50 + 200); // 50ms stagger + 200ms base delay
});
```

---

## 🌊 **River Engine Animations**

### Time Increments
```javascript
this.time += 0.003;        // Main river flow (slow, fluid)
this.causticTime += 0.001; // Caustic light drift (very slow)
this.mistTime += 0.002;    // Mist layer (medium)
```

### Sine Wave Parameters
```javascript
// Wave 1: Primary horizontal flow
const wave1 = Math.sin(x * 0.003 + this.time * 0.5) * 0.5;

// Wave 2: Secondary vertical flow
const wave2 = Math.sin(y * 0.004 + this.time * 0.3) * 0.5;

// Wave 3: Diagonal cross-flow
const wave3 = Math.sin((x + y) * 0.002 + this.time * 0.4) * 0.3;
```

---

## 🎯 **Hover State Transitions**

### Scroll Handle
```css
.scroll-handle:hover {
    transform: scale(1.08) translateX(8px);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
```

### Navigation Leaf
```css
.nav-leaf:hover {
    transform: scale(1.15) translateY(-10px) !important;
    filter: brightness(1.3) saturate(1.3) drop-shadow(0 10px 40px rgba(255, 215, 0, 0.5));
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
```

### Cycle Petal
```css
.cycle-segment:hover {
    filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
    transform: scale(1.05);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
```

---

## ⚡ **Performance Tips**

1. **Use `will-change` sparingly**:
   ```css
   .scroll-content {
       will-change: clip-path, width;
   }
   ```
   Only on elements actively animating.

2. **Prefer `transform` over position**:
   ✅ `transform: translateX(10px)`  
   ❌ `left: 10px`

3. **Use `requestAnimationFrame` for canvas**:
   ```javascript
   animate() {
       // Draw operations
       requestAnimationFrame(() => this.animate());
   }
   ```

4. **Debounce scroll listeners**:
   ```javascript
   let scrollTimeout;
   element.addEventListener('scroll', () => {
       clearTimeout(scrollTimeout);
       scrollTimeout = setTimeout(() => {
           // Handle scroll
       }, 100);
   });
   ```

---

## 🎭 **Animation Philosophy**

### Principles:
1. **Organic Over Mechanical**: Elastic curves feel natural
2. **Stagger for Depth**: Sequential reveals = spatial hierarchy
3. **Subtlety is Luxury**: 2% breathing > 20% bouncing
4. **Consistent Timing**: 0.3-0.6s for most interactions
5. **Physics-Based**: Overshoots mimic real-world motion

### Forbidden:
- ❌ Linear transitions (feels robotic)
- ❌ Instant state changes (jarring)
- ❌ >1s animations (feels sluggish)
- ❌ Complex 3D transforms (performance cost)
- ❌ Wiggle/shake effects (distracting)

---

## 📚 **Quick Reference Table**

| Element | Animation | Duration | Curve | Loop |
|---------|-----------|----------|-------|------|
| Lotus Dial | dialBreathe | 4s | Organic Ease | ✅ |
| Scroll Open | bounceIn | 0.6s | Elastic Bounce | ❌ |
| Scroll Close | bounceOut | 0.4s | Organic Ease | ❌ |
| Petals | petalEntrance | 0.6s | Elastic Bounce | ❌ |
| Active Day | activePulse | 2s | ease-in-out | ✅ |
| Sun Core | sunPulse | 3s | ease-in-out | ✅ |
| Nav Leaves | leafSway | 6s | ease-in-out | ✅ |
| Ripples | N/A | 1.5s | Linear fade | ❌ |
| Particles | floatUp | 8s | ease-in | ✅ |

---

*Master the curves, master the magic.*  
*February 2, 2026*
