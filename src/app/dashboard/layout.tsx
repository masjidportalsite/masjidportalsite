'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Interactive Simulated Roles List
    const rolesList = ['Super Admin', 'Imam / Staff', 'Committee Member', 'Community Member'];
    const [activeRole, setActiveRole] = useState('Super Admin');

    // Retrieve previous simulated state from localStorage if available
    useEffect(() => {
        const storedRole = localStorage.getItem('simulated_role');
        if (storedRole && rolesList.includes(storedRole)) {
            setActiveRole(storedRole);
        }
    }, []);

    const cycleRole = () => {
        const nextIndex = (rolesList.indexOf(activeRole) + 1) % rolesList.length;
        const nextRole = rolesList[nextIndex];
        setActiveRole(nextRole);
        localStorage.setItem('simulated_role', nextRole);
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
        { name: 'Members', path: '/dashboard/members', icon: 'group' },
        { name: 'Donations', path: '/dashboard/donations', icon: 'volunteer_activism' },
        { name: 'Events & Classes', path: '/dashboard/events', icon: 'calendar_month' },
        { name: 'Volunteers', path: '/dashboard/volunteers', icon: 'person_apron' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: 'trending_up' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    ];

    // Decorative Icon mapping for roles
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'vpn_key';
            case 'Imam / Staff': return 'menu_book';
            case 'Committee Member': return 'shield_person';
            case 'Community Member': return 'home_pin';
            default: return 'person';
        }
    };

    // Role-specific badge styles
    const getBadgeStyle = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'bg-brand-gold text-brand-emerald border-brand-gold';
            case 'Imam / Staff': return 'bg-white/10 text-white border-white/20';
            case 'Committee Member': return 'bg-[#8FBC8F]/20 text-[#8FBC8F] border-[#8FBC8F]/30';
            case 'Community Member': return 'bg-white/5 text-white/70 border-white/10';
            default: return 'bg-white/10 text-white border-white/10';
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream text-foreground flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="flex md:hidden justify-between items-center bg-brand-emerald text-brand-cream p-4 shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
                    <span className="material-symbols-outlined text-brand-gold scale-90">mosque</span>
                    MasjidPortal
                </div>
                <div className="flex items-center gap-3">
                    {/* Compact Interactive Role Badge on Mobile */}
                    <button
                        onClick={cycleRole}
                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border bg-white/10 text-white flex items-center gap-1 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-[10px]">{getRoleIcon(activeRole)}</span>
                        {activeRole.split(' ')[0]}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="material-symbols-outlined select-none text-2xl"
                    >
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-brand-emerald text-brand-cream p-6 flex flex-col gap-4 font-medium sticky top-[56px] z-40 border-b border-brand-emerald-dim shadow-xl">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-brand-emerald-dim text-brand-gold border-l-4 border-brand-gold font-semibold'
                                    : 'hover:bg-brand-emerald-dim/50 hover:text-brand-gold'
                                    }`}
                            >
                                <span className="material-symbols-outlined select-none mr-3 text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-brand-emerald text-brand-cream p-6 flex-col h-screen sticky top-0 border-r border-[#bfc9c3]/10 shadow-xl z-20 justify-between">
                <div>
                    <div className="font-bold tracking-wider mb-10 text-xl border-b border-[#bfc9c3]/15 pb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-gold">mosque</span>
                        MasjidPortal<span className="text-brand-gold">.</span>
                    </div>

                    <nav className="flex flex-col gap-2 font-medium">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-100 ${isActive
                                        ? 'bg-[#002f23] text-brand-gold border-l-4 border-brand-gold font-semibold shadow-md'
                                        : 'hover:bg-brand-[#00382a]/55 hover:text-brand-gold text-brand-cream/80'
                                        }`}
                                >
                                    <span className="material-symbols-outlined select-none mr-3 text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Highly Interactive Simulated Role Selector Bottom Sidebar Segment */}
                <div className="pt-6 border-t border-[#bfc9c3]/15 flex flex-col gap-3">
                    <span className="text-[9px] uppercase tracking-widest font-bold opacity-50 block pl-1">Interactive RBAC Showcase</span>
                    <button
                        onClick={cycleRole}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 active:scale-95 shadow-sm ${getBadgeStyle(activeRole)}`}
                        title="Click to cycle simulated roles and preview user permission access."
                    >
                        <div className="flex items-center gap-2 text-left">
                            <span className="material-symbols-outlined text-sm font-bold">{getRoleIcon(activeRole)}</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold leading-none">{activeRole}</span>
                                <span className="text-[8px] opacity-75 mt-0.5 font-medium leading-none">Simulated Identity</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-xs opacity-60 leading-none">sync</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
