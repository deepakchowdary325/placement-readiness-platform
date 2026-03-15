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
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Strict schema validation filter
        const validEntries = parsed.filter(item => {
            if (!item || typeof item !== 'object') return false;
            // Legacy items might not have baseScore, allow readinessScore as fallback for backward comp if needed,
            // but strict schema demands these core properties going forward:
            const hasId = !!item.id;
            const hasJdText = !!item.jdText;
            const hasValidScore = item.baseScore !== undefined || item.readinessScore !== undefined;
            return hasId && hasJdText && hasValidScore;
        });

        return validEntries;
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
