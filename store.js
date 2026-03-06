/**
 * LotusCycle Aura - State + persistence
 */

const db = new Dexie('LotusCycleDB');
db.version(1).stores({
    settings: 'id',
    logs: 'date',
    meta: 'key'
});

const createStore = (typeof zustand !== 'undefined')
    ? zustand.createStore
    : (fn) => {
        let state;
        const listeners = new Set();
        const setState = (partial) => {
            const next = typeof partial === 'function' ? partial(state) : partial;
            state = { ...state, ...next };
            listeners.forEach((listener) => listener(state));
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
    lastPeriodStart: new Date().toISOString().split('T')[0],
    remindersEnabled: false
};

const cycleStore = createStore((set, get) => ({
    settings: DEFAULT_SETTINGS,
    logs: [],
    initialized: false,
    selectedDay: null,
    ready: false,

    init: async () => {
        try {
            const settings = await db.settings.get('user_settings');
            const initialized = await db.meta.get('initialized');
            const logs = await db.logs.toArray();

            set({
                settings: settings || DEFAULT_SETTINGS,
                initialized: initialized?.value || false,
                logs: logs || [],
                ready: true
            });
        } catch (err) {
            console.error('Store init failed, using defaults:', err);
            set({
                settings: DEFAULT_SETTINGS,
                initialized: false,
                logs: [],
                ready: true
            });
        } finally {
            window.dispatchEvent(new CustomEvent('store:ready'));
        }
    },

    getCycleDay: () => {
        const { lastPeriodStart, cycleLength } = get().settings;
        const safeCycle = Number(cycleLength) || 28;

        if (!lastPeriodStart) return 1;

        const start = new Date(lastPeriodStart);
        const today = new Date();
        const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const normalized = ((diffDays % safeCycle) + safeCycle) % safeCycle;
        return normalized + 1;
    },

    getSelectedDay: () => get().selectedDay || get().getCycleDay(),

    setSelectedDay: (day) => {
        const max = Number(get().settings.cycleLength || 28);
        const parsed = Number(day);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > max) return;

        set({ selectedDay: parsed });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    clearSelectedDay: () => {
        set({ selectedDay: null });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    getCurrentPhase: () => {
        return getPhaseFromDay(get().getSelectedDay(), get().settings.cycleLength);
    },

    updateSettings: async (newSettings) => {
        const settings = { ...get().settings, ...newSettings };
        await db.settings.put(settings);
        set({ settings });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    setInitialized: async (value) => {
        await db.meta.put({ key: 'initialized', value: Boolean(value) });
        set({ initialized: Boolean(value) });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    addLog: async (log) => {
        const enriched = {
            ...log,
            symptoms: {
                pain: Number(log?.symptoms?.pain || 0),
                bloating: Number(log?.symptoms?.bloating || 0),
                energy: Number(log?.symptoms?.energy || 0),
                sleep: Number(log?.symptoms?.sleep || 0)
            },
            timestamp: Date.now()
        };

        await db.logs.put(enriched);
        const logs = await db.logs.toArray();
        set({ logs });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    deleteLog: async (date) => {
        await db.logs.delete(date);
        const logs = await db.logs.toArray();
        set({ logs });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    exportData: async () => {
        const settings = await db.settings.get('user_settings');
        const logs = await db.logs.toArray();
        return JSON.stringify({
            settings,
            logs,
            version: '3.0',
            exportedAt: new Date().toISOString()
        }, null, 2);
    },

    importData: async (payload) => {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        const settings = { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) };
        const logs = Array.isArray(parsed.logs) ? parsed.logs : [];

        await db.transaction('rw', db.settings, db.logs, db.meta, async () => {
            await db.settings.put(settings);
            await db.logs.clear();
            if (logs.length) await db.logs.bulkPut(logs);
            await db.meta.put({ key: 'initialized', value: true });
        });

        set({ settings, logs, initialized: true, selectedDay: null });
        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    clearAllData: async () => {
        await db.transaction('rw', db.settings, db.logs, db.meta, async () => {
            await db.settings.clear();
            await db.logs.clear();
            await db.meta.clear();
            await db.settings.put(DEFAULT_SETTINGS);
            await db.meta.put({ key: 'initialized', value: false });
        });

        set({
            settings: DEFAULT_SETTINGS,
            logs: [],
            initialized: false,
            selectedDay: null
        });

        window.dispatchEvent(new CustomEvent('store:updated'));
    },

    getPredictions: () => {
        const { cycleLength, periodLength, lastPeriodStart } = get().settings;
        const cycle = Number(cycleLength) || 28;
        const period = Number(periodLength) || 5;
        const base = new Date(lastPeriodStart);

        const nextPeriodStart = new Date(base);
        nextPeriodStart.setDate(base.getDate() + cycle);

        const fertileStart = new Date(base);
        fertileStart.setDate(base.getDate() + Math.round(cycle - 14) - 2);

        const fertileEnd = new Date(base);
        fertileEnd.setDate(base.getDate() + Math.round(cycle - 14) + 2);

        const nextPeriodEnd = new Date(nextPeriodStart);
        nextPeriodEnd.setDate(nextPeriodStart.getDate() + period - 1);

        return { nextPeriodStart, nextPeriodEnd, fertileStart, fertileEnd };
    }
}));

window.cycleStore = cycleStore;
cycleStore.getState().init();
