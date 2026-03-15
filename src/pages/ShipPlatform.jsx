import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Lock, Rocket, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const ShipPlatform = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [passedCount, setPassedCount] = useState(0);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('prp_tests_passed');
            if (stored) {
                const passed = JSON.parse(stored);
                if (Array.isArray(passed)) {
                    setPassedCount(passed.length);
                    if (passed.length === 10) {
                        setIsLocked(false);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to read test state", e);
        }
    }, []);

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white">
                <Card className="bg-slate-800 border-slate-700 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-500">
                    <CardContent className="p-12 pb-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <Lock className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-black mb-3">Deployment Locked</h1>
                        <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                            Access Denied. You must pass all 10 QA tests before the system will authorize shipping the Placement Readiness Platform.
                            <br /><br />
                            Current Status: <strong className="text-orange-400">{passedCount}/10 passed</strong>
                        </p>

                        <Link to="/prp/07-test" className="w-full">
                            <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors flex justify-center items-center group">
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Return to Test Checklist
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-center text-white">
            <div className="max-w-2xl w-full flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700">
                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-8 shadow-2xl border-4 border-white/20">
                    <Rocket className="w-16 h-16 text-white" />
                </div>

                <h1 className="text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
                    Ready for Launch.
                </h1>

                <p className="text-xl text-indigo-100 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                    All 10 critical QA gates have been verified. The Placement Readiness Platform is certified stable and resilient.
                </p>

                <div className="bg-indigo-700 rounded-2xl p-6 border border-indigo-500/50 flex flex-col items-center max-w-sm w-full shadow-xl">
                    <ShieldCheck className="w-12 h-12 text-green-400 mb-3" />
                    <h3 className="text-lg font-bold">10/10 Tests Passed</h3>
                    <p className="text-sm tracking-widest uppercase font-semibold text-indigo-300 mt-1">Verified Payload</p>
                </div>
            </div>
        </div>
    );
};
