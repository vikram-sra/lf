/**
 * LotusCycle Aura - State Management with Zustand & IndexedDB (Dexie)
 * Handles cycle data, logs, and settings with secure, offline-first persistence.
 */

// Initialize Dexie database
const db = new Dexie("LotusCycleDB");
db.version(1).stores({
    settings: "id", // id = 'user_settings'
    logs: "date", // Log date as primary key
    meta: "key"   // For other metadata
});

// Create store using vanilla Zustand
const createStore = (typeof zustand !== 'undefined') ? zustand.createStore :
    (fn) => {
        let state;
        const listeners = new Set();
        const setState = (partial) => {
            const newState = typeof partial === 'function' ? partial(state) : partial;
            state = { ...state, ...newState };
            listeners.forEach(listener => listener(state));
        };
        const getState = () => state;
        const subscribe = (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        };
        state = fn(setState, getState);
        return { setState, getState, subscribe };
    };

const DEFAULT_SETTINGS = {
    id: 'user_settings',
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: new Date().toISOString().split('T')[0]
};

const cycleStore = createStore((set, get) => ({
    settings: DEFAULT_SETTINGS,
    logs: [],
    initialized: false,
    selectedDay: null,

    // Initialization logic
    init: async () => {
        try {
            const settings = await db.settings.get('user_settings');
            const initialized = await db.meta.get('initialized');
            const logs = await db.logs.toArray();

            set({
                settings: settings || DEFAULT_SETTINGS,
                initialized: initialized?.value || false,
                logs: logs || []
            });
        } catch (err) {
            console.error("Failed to init store from DB, using defaults:", err);
            // Set defaults even if DB fails
            set({
                settings: DEFAULT_SETTINGS,
                initialized: false,
                logs: []
            });
        } finally {
            // Always emit ready event so app can start
            window.dispatchEvent(new CustomEvent('store:ready'));
            console.log('✅ Store initialized and ready');
        }
    },

    getCycleDay: () => {
        const { lastPeriodStart, cycleLength } = get().settings;
        if (!lastPeriodStart) return 1;

        const start = new Date(lastPeriodStart);
        const today = new Date();
        const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        return (diffDays % cycleLength) + 1;
    },

    getCurrentPhase: () => {
        const cycleDay = get().getCycleDay();
        return getPhaseFromDay(cycleDay, get().settings.cycleLength);
    },

    updateSettings: async (newSettings) => {
        const settings = { ...get().settings, ...newSettings };
        await db.settings.put(settings);
        set({ settings });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    setInitialized: async (val) => {
        await db.meta.put({ key: 'initialized', value: val });
        set({ initialized: val });
    },

    addLog: async (log) => {
        const enrichedLog = { ...log, timestamp: Date.now() };
        await db.logs.put(enrichedLog);
        const logs = await db.logs.toArray();
        set({ logs });
    },

    exportData: async () => {
        const settings = await db.settings.get('user_settings');
        const logs = await db.logs.toArray();
        return JSON.stringify({ settings, logs, version: "2.0" }, null, 2);
    }
}));

// Attach to window first
window.cycleStore = cycleStore;

// Then auto-init the store (async) - call through getState since it's part of the state
cycleStore.getState().init();
