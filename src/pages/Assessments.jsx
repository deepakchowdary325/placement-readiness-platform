import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { extractSkills, generateChecklist, generatePlan, generateQuestions, calculateReadiness, generateCompanyIntel } from '../lib/analyzer';
import { saveAnalysis } from '../lib/storage';
import { Wand2, History as HistoryIcon, FileText } from 'lucide-react';

export const Assessments = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = (e) => {
        e.preventDefault();

        if (!jdText.trim()) return;
        setIsAnalyzing(true);

        // Simulate a slight delay to feel like "AI working" (optional, but requested premium UX)
        setTimeout(() => {
            const extractedSkills = extractSkills(jdText);
            const readinessScore = calculateReadiness(extractedSkills, company, role, jdText);
            const companyIntel = generateCompanyIntel(company);
            const checklist = generateChecklist(extractedSkills, companyIntel);
            const plan = generatePlan(extractedSkills);
            const questions = generateQuestions(extractedSkills);

            const payload = {
                company: company.trim(),
                role: role.trim(),
                jdText: jdText.trim(),
                extractedSkills,
                checklist,
                plan,
                questions,
                readinessScore,
                companyIntel
            };

            const savedEntry = saveAnalysis(payload);
            setIsAnalyzing(false);

            if (savedEntry) {
                navigate(`/results/${savedEntry.id}`);
            }
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Analysis</h1>
                    <p className="text-slate-500 mt-2">Paste a Job Description (JD) to get a custom prep plan and interview questions.</p>
                </div>
                <button
                    onClick={() => navigate('/history')}
                    className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    <HistoryIcon className="w-4 h-4 mr-2" />
                    View Past Analyses
                </button>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                        <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                        Enter Job Details
                    </CardTitle>
                    <CardDescription>We'll analyze the text offline to build your readiness strategy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnalyze} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company Name (Optional)</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="e.g. Google, Amazon, Startup Inc"
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Role Title (Optional)</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Frontend Engineer, SDE-1"
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 text-left w-full block">Job Description <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste the full job description here... (Key requirements, tech stack, responsibilities)"
                                className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[250px] resize-y font-mono text-sm transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!jdText.trim() || isAnalyzing}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${!jdText.trim() || isAnalyzing
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Analyzing JD...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    Analyze & Generate Plan
                                </>
                            )}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Assessments;
