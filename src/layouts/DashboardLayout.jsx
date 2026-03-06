import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    ClipboardCheck,
    Library,
    UserCircle,
    Bell
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`
        }
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Code2 className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Placement Prep</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/practice" icon={Code2} label="Practice" />
                    <SidebarItem to="/assessments" icon={ClipboardCheck} label="Assessments" />
                    <SidebarItem to="/resources" icon={Library} label="Resources" />
                    <SidebarItem to="/profile" icon={UserCircle} label="Profile" />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <SidebarItem to="/settings" icon={Bell} label="Notifications" />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Placement Prep</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
