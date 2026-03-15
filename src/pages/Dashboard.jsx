import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, ChevronRight, Play } from 'lucide-react';

const mockRadarData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

export const Dashboard = () => {
    const [readinessScore, setReadinessScore] = useState(0);

    // Animate the progress circle on load
    useEffect(() => {
        const timer = setTimeout(() => {
            setReadinessScore(72);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back. Here's your placement prep overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Overall Readiness */}
                <Card className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center mt-4">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    className="stroke-slate-200"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    className="stroke-indigo-600 transition-all duration-1000 ease-in-out"
                                    strokeWidth="8"
                                    strokeDasharray={`${(readinessScore / 100) * 251.2} 251.2`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-bold text-slate-900">{readinessScore}</span>
                                <span className="text-sm text-slate-500 font-medium">/ 100</span>
                            </div>
                        </div>
                        <p className="mt-6 text-sm font-medium text-slate-600">Readiness Score</p>
                    </CardContent>
                </Card>

                {/* 2. Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                        <CardDescription>Your performance across key categories</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#4f46e5"
                                    fill="#4f46e5"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Continue Practice */}
                <Card className="group cursor-pointer hover:border-indigo-200">
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <h4 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">Dynamic Programming</h4>
                                <p className="text-sm text-slate-500 mt-1">3/10 completed</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                <Play className="h-5 w-5 fill-indigo-600 text-indigo-600 group-hover:fill-white group-hover:text-white transition-colors ml-1" />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: '30%' }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Weekly Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-700">Problems Solved</span>
                                <span className="font-bold text-indigo-600">12/20 this week</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: '60%' }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center px-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                    const isActive = i === 1 || i === 2 || i === 4; // Tues, Wed, Fri
                                    const isToday = i === 5; // Sat
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                        ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
                        ${isToday ? 'ring-2 ring-indigo-200 ring-offset-2' : ''}
                      `}>
                                                {isActive ? '✓' : ''}
                                            </div>
                                            <span className={`text-[10px] uppercase font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Upcoming Assessments (Spans full width on desktop if it's the last odd item, but here it's 5th, so we make it span full) */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                        <CardDescription>Your scheduled mock tests and reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">

                            {/* Item 1 */}
                            <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900">DSA Mock Test</h4>
                                    <p className="text-sm text-slate-500 mt-1">Tomorrow, 10:00 AM</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 self-center" />
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900">System Design Review</h4>
                                    <p className="text-sm text-slate-500 mt-1">Wed, 2:00 PM</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 self-center" />
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900">HR Interview Prep</h4>
                                    <p className="text-sm text-slate-500 mt-1">Friday, 11:00 AM</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 self-center" />
                            </div>

                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Dashboard;
