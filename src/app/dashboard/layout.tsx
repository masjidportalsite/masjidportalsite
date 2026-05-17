/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from './actions';
import { BrandLogo } from '@/components/ui/brand-logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const rolesList = ['Super Admin', 'Imam / Staff', 'Committee Member', 'Community Member'];
    const [activeRole, setActiveRole] = useState('Super Admin');

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

    const getRoleInitials = (role: string) => {
        return role.split(' ').map(w => w[0]).join('').slice(0, 2);
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
        <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col md:flex-row font-sans islamic-pattern">

            {/* ── Desktop Sidebar (Light) ──────────────────────────────── */}
            <aside className="hidden md:flex md:w-64 bg-[#f8f9ff] border-r border-[#bfc9c3]/30 flex-col h-screen sticky top-0 z-40 justify-between py-6 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {/* Brand */}
                    <div className="px-8 mb-12">
                        <BrandLogo variant="full" size="sm" theme="light" linked />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1 px-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive(item.path)
                                    ? 'bg-[#064e3b] text-[#80bea6] shadow-sm'
                                    : 'text-[#404944] hover:bg-[#e6eeff]/50 hover:text-[#003527]'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl select-none">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom: User Avatar + Logout */}
                <div className="px-4 pt-6 border-t border-[#bfc9c3]/20 flex flex-col gap-2">
                    {/* RBAC Showcase */}
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#707974]/60 block pl-2">Interactive RBAC</span>
                    <button
                        onClick={cycleRole}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#bfc9c3]/30 hover:border-[#064e3b]/20 transition-all duration-200 active:scale-95 bg-white/60 w-full text-left"
                        title="Click to cycle simulated roles"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#95d3ba] flex items-center justify-center text-[#003527] font-bold text-xs flex-shrink-0 shadow-sm">
                            {getRoleInitials(activeRole)}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-bold text-[#121c2a] leading-none truncate">{activeRole}</span>
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
                        {activeRole.split(' ')[0]}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="material-symbols-outlined select-none text-2xl text-[#003527] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-black/5"
                    >
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </button>
                </div>
            </header>

            {/* ── Mobile Dropdown Menu (Absolute Overlay) ──────────────── */}
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

            {/* ── Main Content ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-[100dvh]">
                {/* Top App Bar (desktop) */}
                <header className="hidden md:flex items-center justify-between px-8 min-h-[64px] bg-[#f8f9ff]/70 backdrop-blur-xl border-b border-[#bfc9c3]/20 sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-[#003527]">
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
                        <span className="font-bold text-lg tracking-tight">MasjidPortal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="material-symbols-outlined text-[#404944] hover:bg-[#e6eeff]/50 p-2 min-h-[44px] min-w-[44px] rounded-full transition-all flex items-center justify-center">
                            notifications
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 pb-28 md:pb-10 overflow-auto relative z-10 w-full max-w-full">
                    {children}
                </main>
            </div>

            {/* ── Mobile Bottom Nav ────────────────────────────────────── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#f8f9ff] border-t border-[#bfc9c3]/20 flex md:hidden items-center justify-around z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 px-2">
                <Link href="/dashboard" className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-1 ${pathname === '/dashboard' ? 'text-[#003527]' : 'text-[#707974]'}`}>
                    <span className={`material-symbols-outlined text-[22px] transition-all ${pathname === '/dashboard' ? 'bg-[#b0f0d6]/70 px-4 py-1 rounded-full text-[#014131]' : ''}`}>dashboard</span>
                    <span className="text-[10px] font-semibold text-center leading-none">Home</span>
                </Link>
                <Link href="/dashboard/prayer" className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-1 ${pathname.startsWith('/dashboard/prayer') ? 'text-[#003527]' : 'text-[#707974]'}`}>
                    <span className={`material-symbols-outlined text-[22px] transition-all ${pathname.startsWith('/dashboard/prayer') ? 'bg-[#b0f0d6]/70 px-4 py-1 rounded-full text-[#014131]' : ''}`}>schedule</span>
                    <span className="text-[10px] font-semibold text-center leading-none">Prayer</span>
                </Link>
                <Link href="/dashboard/donations" className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-1 ${pathname.startsWith('/dashboard/donations') ? 'text-[#003527]' : 'text-[#707974]'}`}>
                    <span className={`material-symbols-outlined text-[22px] transition-all ${pathname.startsWith('/dashboard/donations') ? 'bg-[#b0f0d6]/70 px-4 py-1 rounded-full text-[#014131]' : ''}`}>volunteer_activism</span>
                    <span className="text-[10px] font-semibold text-center leading-none">Donate</span>
                </Link>
                <Link href="/dashboard/members" className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] gap-1 ${pathname.startsWith('/dashboard/members') ? 'text-[#003527]' : 'text-[#707974]'}`}>
                    <span className={`material-symbols-outlined text-[22px] transition-all ${pathname.startsWith('/dashboard/members') ? 'bg-[#b0f0d6]/70 px-4 py-1 rounded-full text-[#014131]' : ''}`}>group</span>
                    <span className="text-[10px] font-semibold text-center leading-none">Members</span>
                </Link>
            </nav>

        </div>
    );
}
