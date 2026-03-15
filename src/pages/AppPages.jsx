import React from 'react';
import { Dashboard as DashboardComponent } from './Dashboard';
import { Assessments as AssessmentsComponent } from './Assessments';
import { History as HistoryComponent } from './History';
import { Results as ResultsComponent } from './Results';

const PagePlaceholder = ({ title }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-slate-900">{title}</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <p className="text-slate-600">Welcome to the {title} page. This section is currently under development.</p>
        </div>
    </div>
);

export const Dashboard = () => <DashboardComponent />;
export const Assessments = () => <AssessmentsComponent />;
export const History = () => <HistoryComponent />;
export const Results = () => <ResultsComponent />;

export const Practice = () => <PagePlaceholder title="Practice" />;
export const Resources = () => <PagePlaceholder title="Resources" />;
export const Profile = () => <PagePlaceholder title="Profile" />;
