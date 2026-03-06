import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, BarChart3 } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-50">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                    Ace Your Placement
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl">
                    Practice, assess, and prepare for your dream job with our comprehensive tools and resources.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                    Get Started
                </Link>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Practice Problems */}
                    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Code className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Practice Problems</h3>
                        <p className="text-slate-600">Sharpen your coding skills with indexed industry-standard problems.</p>
                    </div>

                    {/* Mock Interviews */}
                    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Video className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Mock Interviews</h3>
                        <p className="text-slate-600">Simulate real-world interviews with video-based practice sessions.</p>
                    </div>

                    {/* Track Progress */}
                    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                        <p className="text-slate-600">Monitor your performance analytics and identify areas for improvement.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-slate-100 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
