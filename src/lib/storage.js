// src/lib/storage.js

const HISTORY_KEY = 'jd_history';

export const saveAnalysis = (analysisData) => {
    try {
        const history = getHistory();
        const newEntry = {
            ...analysisData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        // Add to beginning of array
        history.unshift(newEntry);

        // cap at 50 to not blow up localstorage
        if (history.length > 50) {
            history.pop();
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return newEntry;
    } catch (error) {
        console.error("Local storage error saving analysis:", error);
        return null;
    }
};

export const getHistory = () => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Local storage error getting history:", error);
        return [];
    }
};

export const getAnalysisById = (id) => {
    const history = getHistory();
    return history.find(entry => entry.id === id) || null;
};

export const updateAnalysis = (id, updates) => {
    try {
        const history = getHistory();
        const index = history.findIndex(entry => entry.id === id);
        if (index !== -1) {
            history[index] = { ...history[index], ...updates };
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            return history[index];
        }
        return null;
    } catch (error) {
        console.error("Local storage error updating analysis:", error);
        return null;
    }
};
