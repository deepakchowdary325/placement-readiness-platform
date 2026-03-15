import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CheckSquare, Square, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const TESTS = [
    { id: "v_jd_req", title: "JD required validation works", hint: "Submit empty form on /assessments" },
    { id: "v_jd_short", title: "Short JD warning shows for <200 chars", hint: "Submit tiny snippet on /assessments" },
    { id: "e_skills_group", title: "Skills extraction groups correctly", hint: "Ensure Python is in Languages, CI/CD in Cloud" },
    { id: "m_rounds", title: "Round mapping changes based on company + skills", hint: "Compare Amazon (4 rounds) vs Unknown Startup (3 rounds)" },
    { id: "s_calc", title: "Score calculation is deterministic", hint: "Same JD returns exact same base score" },
    { id: "s_live", title: "Skill toggles update score live", hint: "Click 'I know this' on Results page" },
    { id: "s_persist", title: "Changes persist after refresh", hint: "Toggle a skill, refresh the Results page" },
    { id: "h_save", title: "History saves and loads correctly", hint: "Verify entries appear strictly on /history" },
    { id: "u_export", title: "Export buttons copy the correct content", hint: "Click 'Copy 7-day plan' and check clipboard" },
    { id: "u_console", title: "No console errors on core pages", hint: "Check devtools during a full run" }
];

const STORAGE_KEY = 'prp_tests_passed';

export const TestChecklist = () => {
    const [passed, setPassed] = useState([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setPassed(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to load test history", e);
        }
    }, []);

    const toggleTest = (id) => {
        setPassed(prev => {
            const updated = prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const resetTests = () => {
        setPassed([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const passedCount = passed.length;
    const isComplete = passedCount === 10;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-12">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Test Readiness Checklist</h1>
                        <p className="text-slate-500 mt-2 font-medium">Verify absolute stability before shipment lock.</p>
                    </div>
                    <button
                        onClick={resetTests}
                        className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset checklist
                    </button>
                </div>

                {/* Score Summary Banner */}
                <div className={cn(
                    "p-6 rounded-xl border-2 flex items-center justify-between shadow-sm transition-all relative overflow-hidden",
                    isComplete
                        ? "bg-green-50 border-green-500 text-green-900"
                        : "bg-orange-50 border-orange-400 text-orange-900"
                )}>
                    <div>
                        <p className="text-sm font-bold tracking-widest uppercase mb-1 opacity-80">Shipment Status</p>
                        <h2 className="text-4xl font-black">
                            {passedCount} / 10
                            <span className="text-lg font-medium ml-2 opacity-75">Tests Passed</span>
                        </h2>
                        {!isComplete && (
                            <div className="flex items-center mt-3 text-sm font-bold text-orange-700 bg-orange-200/50 inline-flex px-3 py-1 rounded-md">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Fix issues before shipping.
                            </div>
                        )}
                        {isComplete && (
                            <div className="flex items-center mt-3 text-sm font-bold text-green-700 bg-green-200/50 inline-flex px-3 py-1 rounded-md">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                All gates passed. Ready for deployment.
                            </div>
                        )}
                    </div>
                    {isComplete ? (
                        <CheckCircle2 className="w-24 h-24 text-green-500 opacity-20 absolute -right-4 -bottom-4 transform rotate-12" />
                    ) : (
                        <div className="w-24 h-24 border-8 border-orange-500 border-dashed rounded-full opacity-10 absolute -right-4 -bottom-4 animate-spin-slow" />
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                    {TESTS.map((test) => {
                        const isChecked = passed.includes(test.id);
                        return (
                            <div
                                key={test.id}
                                onClick={() => toggleTest(test.id)}
                                className={cn(
                                    "p-4 rounded-xl border flex items-center cursor-pointer transition-all hover:shadow-md",
                                    isChecked
                                        ? "bg-white border-green-200 shadow-sm"
                                        : "bg-white border-slate-200 hover:border-indigo-300"
                                )}
                            >
                                <button className="mr-4 shrink-0 focus:outline-none">
                                    {isChecked
                                        ? <CheckSquare className="w-6 h-6 text-green-500" />
                                        : <Square className="w-6 h-6 text-slate-300" />
                                    }
                                </button>
                                <div>
                                    <h3 className={cn(
                                        "font-bold text-lg select-none",
                                        isChecked ? "text-slate-800 line-through decoration-green-500/30" : "text-slate-900"
                                    )}>
                                        {test.title}
                                    </h3>
                                    {test.hint && (
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                                            Hint: {test.hint}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {isComplete && (
                    <div className="pt-8 text-center animate-in fade-in slide-in-from-bottom-4">
                        <Link to="/prp/08-ship" className="inline-flex flex-col items-center group">
                            <button className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all group-hover:scale-105">
                                Proceed to Shipping Dock &rarr;
                            </button>
                            <span className="text-xs text-slate-400 mt-2 font-medium">Verify deployment payload</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
