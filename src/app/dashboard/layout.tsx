'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
        { name: 'Members', path: '/dashboard/members', icon: 'group' },
        { name: 'Donations', path: '/dashboard/donations', icon: 'volunteer_activism' },
        { name: 'Events & Classes', path: '/dashboard/events', icon: 'calendar_month' },
        { name: 'Volunteers', path: '/dashboard/volunteers', icon: 'person_apron' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: 'trending_up' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    ]

    return (
        <div className="min-h-screen bg-brand-cream text-foreground flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="flex md:hidden justify-between items-center bg-brand-emerald text-brand-cream p-4 shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
                    <div className="w-5 h-5 rounded bg-brand-gold"></div>
                    MasjidPortal
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="material-symbols-outlined select-none text-2xl"
                >
                    {isMobileMenuOpen ? 'close' : 'menu'}
                </button>
            </header>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-brand-emerald text-brand-cream p-6 flex flex-col gap-4 font-medium sticky top-[56px] z-40 border-b border-brand-emerald-dim shadow-xl">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
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
                        )
                    })}
                </nav>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-brand-emerald text-brand-cream p-6 flex-col h-screen sticky top-0 border-r border-[#bfc9c3]/10 shadow-xl z-20 justify-between">
                <div>
                    <div className="font-bold tracking-wider mb-10 text-xl border-b border-brand-emerald-dim pb-5 flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-brand-gold animate-pulse"></div>
                        MasjidPortal<span className="text-brand-gold">.</span>
                    </div>
                    <nav className="flex flex-col gap-2 font-medium">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-100 ${isActive
                                            ? 'bg-brand-emerald-dim text-brand-gold border-l-4 border-brand-gold font-semibold shadow-md'
                                            : 'hover:bg-brand-emerald-dim/40 hover:text-brand-gold text-brand-cream/80'
                                        }`}
                                >
                                    <span className="material-symbols-outlined select-none mr-3 text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-brand-emerald-dim text-xs opacity-60 flex items-center gap-2">
                    <span className="material-symbols-outlined scale-75">verified_user</span>
                    Role: Administrator
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-auto relative">
                {children}
            </main>
        </div>
    )
}
