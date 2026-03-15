import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { getHistory } from '../lib/storage';
import { Clock, Briefcase, Building, ChevronRight } from 'lucide-react';

export const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analysis History</h1>
                <p className="text-slate-500 mt-2">Relive or resume a past Job Description analysis tailored for your prep.</p>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Past Analyses</h3>
                    <p className="text-slate-500">You haven't analyzed any job descriptions yet. Head over to Assessments to start one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
                            onClick={() => navigate(`/results/${item.id}`)}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Briefcase className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {item.role || "Unknown Role"}
                                            </h3>
                                            <div className="flex items-center text-slate-500 text-sm mt-1 space-x-3">
                                                <div className="flex items-center">
                                                    <Building className="w-4 h-4 mr-1" />
                                                    {item.company || "Unknown Company"}
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {formatDate(item.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-center hidden sm:block">
                                            <p className="text-sm font-medium text-slate-500">Readiness</p>
                                            <p className="text-xl font-bold text-indigo-600">{item.readinessScore}/100</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
