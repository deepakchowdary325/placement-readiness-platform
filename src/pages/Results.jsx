import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { getAnalysisById, getHistory, updateAnalysis } from '../lib/storage';
import { CheckCircle2, CalendarDays, BrainCircuit, MessageSquare, ArrowLeft, Copy, Download, ArrowRightCircle } from 'lucide-react';
import { cn } from '../lib/utils'; // Make sure utils are accessible for class merging

export const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [skillConfidence, setSkillConfidence] = useState({});
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        let entry;
        if (id) {
            entry = getAnalysisById(id);
            if (!entry) navigate('/history');
        } else {
            const history = getHistory();
            if (history.length > 0) {
                entry = history[0];
            } else {
                navigate('/assessments');
            }
        }

        if (entry) {
            setData(entry);

            // Initialize local states
            // Start with base calculated score if readinessScore not present as current
            setCurrentScore(entry.readinessScore || 0);

            // Reconstruct confidence map: prioritize stored map, fallback to everything = "practice"
            const storedMap = entry.skillConfidenceMap || {};
            const initialMap = {};

            Object.values(entry.extractedSkills || {}).forEach(skillArray => {
                skillArray.forEach(skill => {
                    initialMap[skill] = storedMap[skill] || 'practice';
                });
            });

            setSkillConfidence(initialMap);
        }
    }, [id, navigate]);

    // Handle copying text to clipboard
    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        alert(`Copied ${label} to clipboard!`);
    };

    // Handle downloading full analysis as a single TXT file
    const handleDownloadTxt = () => {
        if (!data) return;

        const { company, role, checklist, plan, questions } = data;
        let content = `Placement Readiness Analysis\n`;
        content += `============================\n`;
        content += `Role: ${role || "Unknown Role"}\n`;
        content += `Company: ${company || "Unknown Company"}\n`;
        content += `Readiness Score: ${currentScore}/100\n\n`;

        content += `YOUR PROGRESS ON CATEGORIES:\n`;
        Object.entries(skillConfidence).forEach(([skill, status]) => {
            content += `- ${skill}: ${status === 'know' ? 'I know this' : 'Need practice'}\n`;
        });
        content += `\n`;

        content += `ROUND-WISE PREPARATION CHECKLIST:\n`;
        checklist.forEach(round => {
            content += `\n[${round.title}]\n`;
            round.items.forEach(item => content += `  - ${item}\n`);
        });
        content += `\n`;

        content += `7-DAY STUDY PLAN:\n`;
        plan.forEach(p => {
            content += `\n[${p.day}: ${p.title}]\n  ${p.desc}\n`;
        });
        content += `\n`;

        content += `10 LIKELY INTERVIEW QUESTIONS:\n\n`;
        questions.forEach((q, i) => {
            content += `${i + 1}. ${q}\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Prep_Analysis_${(company || "Company").replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Handle toggling skill confidence globally
    const toggleSkillConfidence = (skill) => {
        const currentStatus = skillConfidence[skill];
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';

        const newConfidenceMap = {
            ...skillConfidence,
            [skill]: newStatus
        };

        // Calculate new score differential
        // +2 for moving practice->know, -2 for moving know->practice
        let scoreDiff = newStatus === 'know' ? 2 : -2;
        let newScore = Math.min(Math.max(currentScore + scoreDiff, 0), 100);

        setSkillConfidence(newConfidenceMap);
        setCurrentScore(newScore);

        // Save back to localStorage immediately
        if (data && data.id) {
            updateAnalysis(data.id, {
                skillConfidenceMap: newConfidenceMap,
                readinessScore: newScore
            });
        }
    };

    if (!data) return null; // loading or redirecting

    const { company, role, extractedSkills } = data;
    const checklist = data.checklist || [];
    const planItems = data.plan || [];
    const savedQuestions = data.questions || [];

    // Derive top 3 weak skills for the "Action Next" box
    const weakSkills = Object.entries(skillConfidence)
        .filter(([_, status]) => status === 'practice')
        .map(([skill]) => skill)
        .slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analysis Results</h1>
                    <p className="text-xl text-slate-600 mt-2">
                        {role || "Unknown Role"} <span className="text-slate-400 font-normal">at</span> {company || "Unknown Company"}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDownloadTxt}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download as TXT
                    </button>

                    <div className="text-right ml-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Readiness Score</p>
                        <p className="text-4xl font-extrabold text-indigo-600 transition-all duration-300">
                            {currentScore}<span className="text-2xl text-slate-300">/100</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Skills Extracted */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl justify-between">
                                <div className="flex items-center">
                                    <BrainCircuit className="w-6 h-6 mr-2 text-indigo-500" />
                                    Key Skills Detected
                                </div>
                                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                    Click to toggle status
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Object.entries(extractedSkills).map(([category, skills]) => (
                                    <div key={category} className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">{category}</h4>
                                        <div className="flex flex-col gap-2">
                                            {skills.map(skill => {
                                                const isKnown = skillConfidence[skill] === 'know';

                                                return (
                                                    <div
                                                        key={skill}
                                                        onClick={() => toggleSkillConfidence(skill)}
                                                        className={cn(
                                                            "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border",
                                                            isKnown
                                                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                                                : "bg-orange-50 border-orange-200 hover:bg-orange-100"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "text-sm font-medium",
                                                            isKnown ? "text-green-800" : "text-orange-800"
                                                        )}>
                                                            {skill}
                                                        </span>
                                                        <span className={cn(
                                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                                            isKnown ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"
                                                        )}>
                                                            {isKnown ? "I know this" : "Need practice"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Rounds Checklist */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-xl">
                                <div className="flex items-center">
                                    <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
                                    Round-wise Preparation Checklist
                                </div>
                                <button
                                    onClick={() => handleCopy(
                                        checklist.map(r => `[${r.title}]\n` + r.items.map(i => `- ${i}`).join('\n')).join('\n\n'),
                                        "Round Checklist"
                                    )}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Copy checklist"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {checklist.map((round, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-3">{round.title}</h3>
                                    <ul className="space-y-2">
                                        {round.items.map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="text-green-500 mr-2 mt-0.5">•</span>
                                                <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar Column (1/3 width) */}
                <div className="space-y-8">

                    {/* 7-Day Plan */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-xl text-white">
                                <div className="flex items-center">
                                    <CalendarDays className="w-6 h-6 mr-2 text-indigo-400" />
                                    7-Day Action Plan
                                </div>
                                <button
                                    onClick={() => handleCopy(
                                        planItems.map(p => `[${p.day}: ${p.title}]\n- ${p.desc}`).join('\n\n'),
                                        "7-Day Plan"
                                    )}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors z-10"
                                    title="Copy plan"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-slate-700 ml-3 space-y-6 pb-2">
                                {planItems.map((dayPlan, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-800"></span>
                                        <h4 className="font-bold text-sm text-indigo-300">{dayPlan.day}: {dayPlan.title}</h4>
                                        <p className="text-sm text-slate-300 mt-1 leading-snug">{dayPlan.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Questions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-xl">
                                <div className="flex items-center">
                                    <MessageSquare className="w-6 h-6 mr-2 text-rose-500" />
                                    Likely Interview Questions
                                </div>
                                <button
                                    onClick={() => handleCopy(
                                        savedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n'),
                                        "10 Questions"
                                    )}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Copy questions"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {savedQuestions.map((q, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start">
                                        <span className="font-bold text-slate-300 mr-3 w-5 text-right shrink-0">{i + 1}.</span>
                                        <span className="leading-snug">{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* Action Next Box */}
            <div className="mt-8">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Ready to take Action Next?</h3>
                        {weakSkills.length > 0 ? (
                            <p className="text-indigo-700">
                                You currently need practice on: <span className="font-bold">{weakSkills.join(', ')}</span>.
                            </p>
                        ) : (
                            <p className="text-indigo-700">
                                You're perfectly prepared for everything detected! Great job.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => alert("Action triggered: In a full app, this might navigate to Day 1 Practice Mode.")}
                        className="mt-6 md:mt-0 flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:bg-indigo-500 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all"
                    >
                        Start Day 1 plan now
                        <ArrowRightCircle className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Results;
