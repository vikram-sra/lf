# 🪷 LotusCycle Aura

**LotusCycle Aura** is a hyper-luxury, biophilic, and mystical menstrual cycle tracker designed to harmonize your sacred rhythm. Inspired by Ayurvedic wisdom and natural flows, it transforms traditional cycle tracking into a meditative, interactive experience.

![Aesthetic Preview](https://via.placeholder.com/800x400.png?text=LotusCycle+Aura+Aesthetic+Preview+Placeholder)

## ✨ Core Features

### ☸️ The Living Mandala (Lotus Dial)
An interactive SVG-based engine that visualizes your cycle as a blooming lotus.
- **Pulse Navigation:** Rotate through your cycle to explore future phases.
- **Crystal Core:** A central "Sun Core" that reflects your current day and phase name.
- **Whisper Mode:** Hover over the core to receive "Aura Readings" and mystical insights.

### 🌊 Environmental Engine (River & Mist)
A dynamic, canvas-driven background that reacts to your cycle phase.
- **Flow State:** The "River Engine" adjusts current speed and color based on hormonal energy (e.g., calm rivers during Menstrual, vibrant flow during Ovulatory).
- **Sacred Geometry:** Subtle background overlays and silk-grain filters for a premium tactile feel.

### 📜 Sacred Scrolls
Interactive side-navigation tabs that provide phase-specific wisdom:
- **🍃 Nourish:** Ayurvedic food recommendations to balance Doshas (Vata, Pitta, Kapha).
- **🧘 Asanas:** Curated yoga practices (Sadhana) tailored to your energy levels.
- **🕯️ Rituals:** Daily practices to align your spirit with your cycle's internal winter, spring, summer, and autumn.

### 🖋️ Sacred Log & History
- **Mood Alchemy:** Track your emotional state with curated icons.
- **Persistence:** All data is stored locally on your device using **Dexie (IndexedDB)**, ensuring your sacred data remains private and accessible offline.

## 🛠️ Technology Stack

- **Core:** HTML5, Vanilla JavaScript (ES6+), CSS3 (Modern Flex/Grid).
- **Visuals:** SVG Physics, Canvas API (2D Rendering), Glassmorphism, CSS Animations.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Vanilla) for reactive UI updates.
- **Persistence:** [Dexie.js](https://dexie.org/) for secure, high-performance local storage.
- **Typography:** Google Fonts (Cormorant Garamond, Outfit).

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Safari, Firefox, or Edge).
- A local server (optional, but recommended for some features).

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/lotus-cycle-aura.git
   ```
2. Navigate to the project directory:
   ```bash
   cd lotus-cycle-aura
   ```
3. Open `index.html` in your browser or serve it using a local server like `npx serve .`.

## 📂 Project Structure

```text
├── index.html          # Main application structure
├── styles.css          # Core design system & layout
├── app.js              # Application entry point & controller
├── lotus-dial.js       # SVG Lotus engine & interactions
├── river-engine.js     # Canvas-based background effects
├── scroll-system.js    # Logic for side-tabs and navigation
├── modals.js           # Log entry and history UI logic
├── store.js            # Zustand state & Dexie DB initialization
├── data.js             # Ayurvedic content & phase mappings
└── premium-effects.js  # Interaction particles & micro-animations
```

## 🌙 Design Philosophy

LotusCycle Aura moves away from "clinical" trackers towards a "biophilic" approach. It acknowledges that the menstrual cycle is not just a physiological process, but a sacred rhythm connected to the elements and seasons of the soul.

---

*Made with 🪷 for the Sacred Self.*
