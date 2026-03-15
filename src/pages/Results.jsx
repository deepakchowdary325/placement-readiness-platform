import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { getAnalysisById, getHistory } from '../lib/storage';
import { CheckCircle2, CalendarDays, BrainCircuit, MessageSquare, ArrowLeft } from 'lucide-react';

export const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id) {
            const entry = getAnalysisById(id);
            if (entry) {
                setData(entry);
            } else {
                navigate('/history');
            }
        } else {
            // Load latest if no ID
            const history = getHistory();
            if (history.length > 0) {
                setData(history[0]);
            } else {
                navigate('/assessments');
            }
        }
    }, [id, navigate]);

    if (!data) return null; // loading or redirecting

    const { company, role, extractedSkills, generateChecklist, plan, questions, readinessScore } = data;
    // Fix: Using the stored plan and questions from payload instead of re-generating to ensure 100% permanence 
    // Wait, the payload uses names: `checklist`, `plan`, `questions`. 
    const checklist = data.checklist || [];
    const planItems = data.plan || [];
    const savedQuestions = data.questions || [];

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
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Readiness Score</p>
                        <p className="text-4xl font-extrabold text-indigo-600">{readinessScore}<span className="text-2xl text-slate-300">/100</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Skills Extracted */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl">
                                <BrainCircuit className="w-6 h-6 mr-2 text-indigo-500" />
                                Key Skills Detected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Object.entries(extractedSkills).map(([category, skills]) => (
                                    <div key={category} className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">{category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Rounds Checklist */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl">
                                <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
                                Round-wise Preparation Checklist
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
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl text-white">
                                <CalendarDays className="w-6 h-6 mr-2 text-indigo-400" />
                                7-Day Action Plan
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
                            <CardTitle className="flex items-center text-xl">
                                <MessageSquare className="w-6 h-6 mr-2 text-rose-500" />
                                Likely Interview Questions
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
        </div>
    );
};

export default Results;
