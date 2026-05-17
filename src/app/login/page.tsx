'use client'

import React, { useActionState } from 'react'
import { loginAction } from './actions'
import { BrandLogo } from '@/components/ui/brand-logo'

export default function LoginPage() {
    const [state, action, isPending] = useActionState(loginAction, undefined)

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-8 bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed" style={{
            backgroundColor: '#f8f9ff',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l2.5 7.5L40 10l-7.5 2.5L30 20l-2.5-7.5L20 10l7.5-2.5L30 0zm0 40l2.5 7.5L40 50l-7.5 2.5L30 60l-2.5-7.5L20 50l7.5-2.5L30 40zM0 30l7.5 2.5L10 40l2.5-7.5L20 30l-7.5-2.5L10 20l-2.5 7.5L0 30zm40 0l7.5 2.5L50 40l2.5-7.5L60 30l-7.5-2.5L50 20l-2.5 7.5L40 30z\' fill=\'%23003527\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }}>
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/70 backdrop-blur-md border-b border-[#bfc9c3]/20 shadow-sm">
                <div className="flex justify-between items-center px-6 py-2 w-full max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-3">
                        <BrandLogo variant="full" size="sm" theme="light" linked />
                    </div>
                    <nav className="flex items-center gap-8">
                        <a className="text-[#404944] hover:text-[#e9c349] transition-colors duration-200" href="#">Support</a>
                        <a className="text-[#404944] hover:text-[#e9c349] transition-colors duration-200" href="#">Pricing</a>
                        <button className="material-symbols-outlined text-[#404944] hover:text-[#e9c349]">language</button>
                    </nav>
                </div>
            </header>

            {/* Login Card */}
            <div
                className="w-full max-w-[480px] rounded-[24px] p-8 md:p-12 flex flex-col items-center relative z-10"
                style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(191, 201, 195, 0.3)',
                    boxShadow: '0 40px 100px -20px rgba(6, 78, 59, 0.15)'
                }}
            >
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <BrandLogo variant="full" size="lg" theme="light" linked />
                    </div>
                    <h1 className="text-4xl font-semibold text-[#003527] mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-[#404944]">Sign in to manage your sanctuary.</p>
                </div>

                <form className="w-full space-y-6" action={action}>
                    {state?.error && (
                        <div className="p-3 mb-4 rounded bg-[#ffdad6] text-[#93000a] text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#404944] uppercase tracking-widest block px-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[#707974] select-none">mail</span>
                            <input
                                className="w-full pl-[52px] pr-6 py-3 bg-white/50 border border-[#bfc9c3] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all placeholder:text-[#707974]/50"
                                id="email"
                                name="email"
                                placeholder="name@masjid.local"
                                type="email"
                                defaultValue="admin@masjid.local"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1 mt-6">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-xs font-semibold text-[#404944] uppercase tracking-widest block" htmlFor="password">Password</label>
                            <a className="text-sm text-[#735c00] hover:text-[#e9c349] transition-colors" href="#">Forgot Password?</a>
                        </div>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[#707974] select-none">lock</span>
                            <input
                                className="w-full pl-[52px] pr-6 py-3 bg-white/50 border border-[#bfc9c3] rounded-lg text-[#121c2a] focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all placeholder:text-[#707974]/50"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                defaultValue="Demo123!"
                                required
                            />
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-3 py-2 mt-4">
                        <input className="w-5 h-5 rounded border-[#bfc9c3] text-[#003527] focus:ring-[#ffe088] cursor-pointer" id="remember" type="checkbox" />
                        <label className="text-[#404944] cursor-pointer select-none" htmlFor="remember">Remember this device</label>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-8 py-3 bg-[#064e3b] text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0b513d] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Authenticating...' : 'Sign In'}
                        {!isPending && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>

                    {/* SSO / Divider */}
                    <div className="relative py-6 mt-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#bfc9c3]/30"></div></div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest bg-transparent">
                            <span className="bg-[#f8f9ff] px-3 py-1 rounded-full text-[#707974]">or</span>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white/60 border border-[#735c00] text-[#735c00] font-medium rounded-lg hover:bg-[#e9c349]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="button">
                        <span className="material-symbols-outlined">corporate_fare</span>
                        Organization Login (SSO)
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[#404944]/80">
                        Don&apos;t have an account? <a className="text-[#003527] font-medium hover:underline" href="#">Contact your administrator</a>
                    </p>
                </div>
            </div>
        </main>
    )
}
