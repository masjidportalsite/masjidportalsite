/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/app/dashboard/actions';
import { BrandLogo } from '@/components/ui/brand-logo';
import { User, UserRole, RoleLabels } from '@/types/auth';

interface DashboardNavProps {
    user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // RBAC Simulation logic (preserved for development/demo)
    const rolesList = React.useMemo(() => [
        UserRole.SUPER_ADMIN,
        UserRole.MOSQUE_ADMIN,
        UserRole.IMAM,
        UserRole.TREASURER,
        UserRole.COMMUNITY_MEMBER
    ], []);
    const [activeRole, setActiveRole] = useState<UserRole>(user.role);

    useEffect(() => {
        const storedRole = localStorage.getItem('simulated_role') as UserRole;
        if (storedRole && rolesList.includes(storedRole)) {
            setActiveRole(storedRole);
        } else if (user.role) {
            setActiveRole(user.role);
        }
    }, [user.role, rolesList]);

    const cycleRole = () => {
        const nextIndex = (rolesList.indexOf(activeRole) + 1) % rolesList.length;
        const nextRole = rolesList[nextIndex];
        setActiveRole(nextRole);
        localStorage.setItem('simulated_role', nextRole);
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Prayer Times', path: '/dashboard/prayer', icon: 'schedule' },
        { name: 'Donations', path: '/dashboard/donations', icon: 'volunteer_activism' },
        { name: 'Members', path: '/dashboard/members', icon: 'group' },
        { name: 'Events & Classes', path: '/dashboard/events', icon: 'calendar_month' },
        { name: 'Volunteers', path: '/dashboard/volunteers', icon: 'person_apron' },
        { name: 'Announcements', path: '/dashboard/announcements', icon: 'campaign' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: 'trending_up' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    ];

    const getRoleInitials = (role: UserRole) => {
        return RoleLabels[role].split(' ').map(w => w[0]).join('').slice(0, 2);
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logoutAction();
    };

    return (
        <>
            {/* ── Desktop Sidebar (Light) ──────────────────────────────── */}
            <aside className="hidden md:flex md:w-64 bg-[#f8f9ff] border-r border-[#bfc9c3]/30 flex-col h-screen sticky top-0 z-40 justify-between py-6 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    <div className="px-8 mb-12">
                        <BrandLogo variant="full" size="sm" theme="light" linked />
                    </div>
                    <nav className="flex flex-col gap-1 px-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium active:scale-95 ${isActive(item.path)
                                    ? 'bg-[#064e3b] text-[#80bea6] shadow-md scale-[1.02]'
                                    : 'text-[#404944] hover:bg-[#e6eeff]/50 hover:text-[#003527]'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl select-none">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="px-4 pt-6 border-t border-[#bfc9c3]/20 flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#707974]/60 block pl-2">Authenticated as {user.full_name || user.email}</span>
                    <button
                        onClick={cycleRole}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#bfc9c3]/30 hover:border-[#064e3b]/20 transition-all duration-200 active:scale-95 bg-white/60 w-full text-left"
                        title="Click to cycle simulated roles"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#95d3ba] flex items-center justify-center text-[#003527] font-bold text-xs flex-shrink-0 shadow-sm">
                            {getRoleInitials(activeRole)}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-bold text-[#121c2a] leading-none truncate">{RoleLabels[activeRole]}</span>
                            <span className="text-[9px] text-[#707974] mt-0.5 font-medium">Simulated Identity</span>
                        </div>
                        <span className="material-symbols-outlined text-xs text-[#707974]">sync</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-all duration-200 font-semibold text-sm active:scale-95 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined select-none mr-3 text-lg">logout</span>
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* ── Mobile Header ────────────────────────────────────────── */}
            <header className="flex md:hidden justify-between items-center bg-[#f8f9ff] border-b border-[#bfc9c3]/20 text-[#121c2a] p-4 shadow-sm relative z-50">
                <BrandLogo variant="full" size="sm" theme="light" linked />
                <div className="flex items-center gap-3">
                    <button
                        onClick={cycleRole}
                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 min-h-[44px] rounded-full border border-[#bfc9c3]/40 bg-[#e6eeff] text-[#003527] flex items-center gap-1 active:scale-95 transition-transform"
                    >
                        {RoleLabels[activeRole].split(' ')[0]}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="material-symbols-outlined select-none text-2xl text-[#003527] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-black/5"
                    >
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </button>
                </div>
            </header>

            {/* ── Mobile Dropdown Menu ──────────────── */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute inset-0 top-[72px] bg-[#121c2a]/20 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <nav className="bg-[#f8f9ff] border-b border-[#bfc9c3]/20 p-4 flex flex-col gap-2 font-medium shadow-2xl animate-in slide-in-from-top-4" onClick={(e) => e.stopPropagation()}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3 min-h-[44px] rounded-lg transition-all duration-200 text-sm ${isActive(item.path)
                                    ? 'bg-[#064e3b] text-[#80bea6] font-semibold'
                                    : 'text-[#404944] hover:bg-[#e6eeff]/50 hover:text-[#003527]'
                                    }`}
                            >
                                <span className="material-symbols-outlined select-none mr-3 text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        <div className="border-t border-[#bfc9c3]/20 pt-3 mt-1">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center w-full px-4 py-3 min-h-[44px] rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-all duration-200 font-semibold text-sm"
                            >
                                <span className="material-symbols-outlined select-none mr-3 text-xl">logout</span>
                                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                            </button>
                        </div>
                    </nav>
                </div>
            )}

            {/* ── Mobile Bottom Nav ────────────────────────────────────── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#f8f9ff] border-t border-[#bfc9c3]/20 flex md:hidden items-center justify-around z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 px-2">
                {navItems.slice(0, 4).map((item) => (
                    <Link key={item.path} href={item.path} className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-1 ${isActive(item.path) ? 'text-[#003527]' : 'text-[#707974]'}`}>
                        <span className={`material-symbols-outlined text-[22px] transition-all ${isActive(item.path) ? 'bg-[#b0f0d6]/70 px-4 py-1 rounded-full text-[#014131]' : ''}`}>{item.icon}</span>
                        <span className="text-[10px] font-semibold text-center leading-none">{item.name.split(' ')[0]}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}
