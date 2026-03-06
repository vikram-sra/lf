# LotusCycle Aura - Product Requirements Document (PRD) & README

## 1. Product Vitals
*   **Product Name:** LotusCycle Aura
*   **Tagline:** A premium, biophilic menstrual cycle tracker built as a secure, offline-first Progressive Web App.
*   **Core Value Proposition:** Cycle tracking should feel like self-care. LotusCycle Aura replaces clinical charting with a beautiful, fully functional 3D aerial view of a lotus blooming on a deep blue lake. 
*   **Target Audience:** Individuals seeking a privacy-focused, aesthetically rich, and holistic approach to menstrual and body literacy.
*   **App Philosophy:** Data never leaves the device. Complete privacy, complete autonomy, entirely local.

## 2. Technical Stack
*   **Structure & Layout:** HTML5 Semantic Markup
*   **Styling:** Pure CSS (CSS Variables, Flexbox/Grid, heavy CSS3 gradients, backdrop-filters for 3D glass and parchment effects). No CSS frameworks.
*   **Logic:** Vanilla JavaScript (ES6+), avoiding heavy compilation or build steps.
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (via CDN) for predictable UI state flow.
*   **Database:** `IndexedDB` wrapper via [Dexie.js](https://dexie.org/) (via CDN) tailored for offline-first web apps.
*   **PWA Layer:** `manifest.json` and `sw.js` (Service Worker) allowing the app to be installed directly to the home screen and function entirely without an internet connection.

## 3. Core Features & Architecture

### 3.1 Immersive Visual Environment
The hallmark of the app is its "3D Blue Lake Aerial View".
*   **Deep Water SVG:** An infinite, gently swaying dark blue lake composed of overlapping SVG paths powered entirely by CSS keyframe animations. Highly performant, resolving without the need for an HTML canvas.
*   **Blooming Lotus Dial:** A complex, interactive SVG centerpiece visualizing the user's cycle.
    *   **Petal Layers:** 4 layers of grand, overlapping petals that span the entire screen.
    *   **Dynamic Highlighting:** Petals are scaled and illuminated based on the current cycle day.
    *   **Extreme 3D Depth:** Multiple drop-shadow filters on the SVG layers separate the lotus prominently from the water.
*   **Floating Navigation:** Bottom bar elements (`History`, `Log`, `Rituals`) styled as lily pads and lotus cores that bob infinitely over the water.

### 3.2 Daily Log (Interaction)
A daily check-in UI presented as a 3D old-school parchment scroll unrolling.
*   **Toggle Flow:** Checkbox to mark the start/presence of menstruation.
*   **Moods:** Select multiple emotional states (Happy, Anxious, Calm, Irritable, Energetic).
*   **Symptoms:** Range sliders to track exact intensity of Physical Pain and Energy Levels (live-updating text labels).
*   **Notes:** Dedicated textarea for personal journaling. 

### 3.3 History & Insights Dashboard
A scrollable, textured historical ledger.
*   **Cycle Stats:** Shows average cycle length and a dynamic countdown predicting days left in the current phase.
*   **Historical Ledger:** Rendered cards for past logs indicating the date, moods, flow status, and notes. Includes individual delete actions for precision data correction.
*   **Data Portability (Import/Export):** 
    *   **Export JSON/CSV:** Buttons triggering standard file downloads representing the complete state of the user's IndexedDB.
    *   **Import CSV/JSON:** Formatted parsing engine (`modals.js`) that auto-detects column structures and securely ingests historical data into the local DB.
    *   **Reset:** Cleanly wipes the IndexedDB and resets UI state.

### 3.4 Cycle Settings
User-configurable biological constraints.
*   **Average Cycle Length:** Form input determining the total scope of the dial.
*   **Period Duration:** Tracking flow intensity averages.
*   **Last Period Date:** The core anchor connecting real-world calendar dates to the local logic. 

### 3.5 Holistic Support (Rituals & Nourishment)
Instead of purely clinical tracking, the system provides contextual self-care logic based on the user's current phase (Menstrual, Follicular, Ovulatory, Luteal).
*   **Nourishment:** Displays exact recipes and ingredient suggestions (e.g., Jaggery & Sesame for Menstrual).
*   **Asanas (Yoga):** Displays specific physical poses to support the body.
*   **Meditations/Rituals:** Connects user to specific spiritual or calming routines tied to their hormonal shifts.

## 4. UI/UX Design System Guidelines
*   **Color Palette:**
    *   **Background:** Deep Lake (`#051a30`, `#124d80`) transitioning to bright water highlights (`#3da5d9`).
    *   **Accents:** Warm Gold (`#fccb06`), Soft Rose (`#ff7e67`), Spring Green (`#00d084`), Lavender (`#b088f9`).
*   **Modals:** Instead of modern frosted glass, panels represent physical media—specifically unrolled ancient parchment. Deep inset box-shadows simulate rolled edges and curled paper. 
*   **Typography:** A beautiful pairing of `Cormorant Garamond` (elegant, serif, used for headers and numbers) and `Outfit` (clean, sans-serif, used for utility text).

## 5. Security & Privacy Model
1.  **Zero-Knowledge Architecture:** This application has no backend server or cloud sync capabilities.
2.  **Local Storage:** All logs, dates, and settings are saved on the user's device via `IndexedDB`. If the user clears their browser cache or uninstalls the PWA, the data is destroyed.
3.  **Data Freedom:** The built-in Import/Export tools ensure the user physically controls their historical data in standard formats.

## 6. How to Run Locally
No Node.js or `npm install` required. Because this is built using pure web standards and CDNs:
1.  Clone the repository.
2.  Run a local web server (e.g., `python3 -m http.server 8000` or `npx serve .`).
3.  Open the local address in a browser (`http://localhost:8000`).

## 7. Future Roadmap Structure
*   Push Notificiations (via Service Worker) when the phase changes.
*   Integrate a local AI/LLM for entirely private journal sentiment analysis.
*   Visual calendar view integrating log elements into a standard month grid.
