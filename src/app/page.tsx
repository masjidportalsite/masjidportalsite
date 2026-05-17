import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { BrandLogo } from '@/components/ui/brand-logo';
import React from 'react';

export default function Home() {
  // Static Prayer Times for community guest lookup
  const localPrayerTimes = [
    { name: 'Fajr', time: '05:46 AM', active: false },
    { name: 'Dhuhr', time: '01:15 PM', active: false },
    { name: 'Asr', time: '04:38 PM', active: false },
    { name: 'Maghrib', time: '07:22 PM', active: true }, // Highlighted as active
    { name: 'Isha', time: '08:35 PM', active: false }
  ];

  return (
    <main
      className="flex min-h-screen flex-col items-center pt-24 bg-brand-cream text-on-surface font-sans selection:bg-brand-gold/30 relative overflow-hidden"
      style={{
        backgroundColor: '#f8f9ff',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l2.5 7.5L40 10l-7.5 2.5L30 20l-2.5-7.5L20 10l7.5-2.5L30 0zm0 40l2.5 7.5L40 50l-7.5 2.5L30 60l-2.5-7.5L20 50l7.5-2.5L30 40zM0 30l7.5 2.5L10 40l2.5-7.5L20 30l-7.5-2.5L10 20l-2.5 7.5L0 30zm40 0l7.5 2.5L50 40l2.5-7.5L60 30l-7.5-2.5L50 20l-2.5 7.5L40 30z\' fill=\'%23003527\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
      }}
    >
      {/* Top AppBar matching login styles */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-[#f8f9ff]/70 backdrop-blur-md border-b border-[#bfc9c3]/20 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <BrandLogo variant="full" size="sm" theme="light" linked />
          </div>
          <nav className="flex items-center gap-8">
            <span className="hidden md:inline text-[#404944]/80 text-xs font-bold uppercase tracking-widest bg-brand-gold/15 text-brand-emerald px-3 py-1.5 rounded-full border border-brand-gold/20 shadow-sm">
              Kuala Lumpur Sanctuary
            </span>
            <Link href="/login" className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald/90 text-white rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-brand-emerald/10">
              Administrator SignIn
            </Link>
          </nav>
        </div>
      </header>

      {/* Content Container */}
      <div className="mt-20 max-w-5xl text-center px-6 w-full flex flex-col items-center gap-14 z-10">
        {/* Hero Headline */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-brand-emerald font-display leading-[1.1] md:leading-[1.15]">
            The Operational Rhythm <br />
            <span className="text-brand-emerald/75">of Spiritual Sanctuary</span>
          </h1>
          <p className="text-lg md:text-xl text-[#404944] max-w-2xl mx-auto font-medium leading-relaxed">
            Experience transparent donation ledger analytics, modular community registry, automated volunteer rosters, and active event calendars.
          </p>
        </div>

        {/* Main Double Grid: Guest Prayer Widget and CTA login indicators */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full items-stretch">
          {/* Guest Prayer Times Widget (2/5 Grid on Desktop) */}
          <Card className="md:col-span-3 p-8 border border-brand-emerald/10 shadow-[0_30px_60px_-15px_rgba(6,78,59,0.06)] bg-white/75 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-brand-emerald">schedule</span>
                <h3 className="text-lg font-bold text-brand-emerald tracking-tight">Congregation Prayer Schedule</h3>
              </div>

              <div className="space-y-2.5">
                {localPrayerTimes.map((pt) => (
                  <div
                    key={pt.name}
                    className={`flex justify-between items-center p-3.5 rounded-xl border ${pt.active
                      ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-md translate-x-1 ring-1 ring-brand-gold/20'
                      : 'bg-white/40 border-brand-emerald/5 hover:bg-brand-cream/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${pt.active ? 'bg-brand-gold animate-pulse' : 'bg-transparent'}`}></span>
                      <span className={`font-semibold text-sm ${pt.active ? 'text-brand-emerald font-bold' : 'text-foreground/75'}`}>{pt.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${pt.active ? 'text-brand-emerald font-bold' : 'text-foreground/50'}`}>{pt.time}</span>
                      {pt.active && (
                        <span className="text-[9px] font-bold tracking-wider text-brand-emerald bg-brand-gold/30 px-2 py-0.5 rounded-full uppercase border border-brand-gold/30">Next Jamaat</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Access Card with Demo Credentials list (3/5 Grid on Desktop) */}
          <Card className="md:col-span-2 p-8 border border-brand-emerald/10 shadow-[0_30px_60px_-15px_rgba(6,78,59,0.06)] bg-brand-emerald text-brand-cream flex flex-col justify-between relative overflow-hidden text-left">
            {/* Star visual element */}
            <div className="absolute -bottom-10 -left-10 opacity-10 blur-[1px]">
              <svg className="w-52 h-52 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>

            <div className="space-y-6 relative z-10 w-full">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold bg-brand-emerald-dim px-3 py-1.5 rounded-full inline-block mb-3 border border-brand-gold/15 leading-none">System Demo Mode</span>
                <h3 className="text-2xl font-bold text-brand-cream leading-tight">Explore the operational dashboard</h3>
                <p className="text-xs text-brand-cream/80 mt-2 font-medium">Use the local credentials listed below to review the administrative layers.</p>
              </div>

              {/* Credentials layout */}
              <div className="bg-brand-emerald-dim/40 border border-white/10 rounded-xl p-4 space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="opacity-60 uppercase tracking-widest">Username</span>
                  <span className="text-brand-gold font-bold">admin@masjid.local</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60 uppercase tracking-widest">Password</span>
                  <span className="font-bold text-brand-cream">Demo123!</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <Link href="/login" className="w-full py-3 bg-brand-gold hover:bg-amber-400 text-brand-emerald rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98">
                Navigate to Portal Access
                <span className="material-symbols-outlined text-sm font-bold">login</span>
              </Link>
            </div>
          </Card>
        </div>

        {/* Secondary Features Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-4 mb-20">
          <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] hover:scale-[1.02] transition-transform">
            <span className="material-symbols-outlined text-brand-emerald p-3 bg-brand-cream rounded-full mb-6 inline-block">group</span>
            <h3 className="text-xl font-bold text-brand-emerald tracking-tight mb-2">Registry Division</h3>
            <p className="text-sm text-[#404944] font-medium leading-relaxed">
              Organize community member registers, track active congregants lists, and delegate custom administrative roles securely.
            </p>
          </Card>

          <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] hover:scale-[1.02] transition-transform">
            <span className="material-symbols-outlined text-brand-emerald p-3 bg-brand-cream rounded-full mb-6 inline-block">volunteer_activism</span>
            <h3 className="text-xl font-bold text-brand-emerald tracking-tight mb-2">Sadqah & Zakat Ledgers</h3>
            <p className="text-sm text-[#404944] font-medium leading-relaxed">
              Record local and campaign donations immediately, compute Ramadan renovation progress targets, and print donor receipts transparently.
            </p>
          </Card>

          <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] hover:scale-[1.02] transition-transform">
            <span className="material-symbols-outlined text-brand-emerald p-3 bg-brand-cream rounded-full mb-6 inline-block">event_available</span>
            <h3 className="text-xl font-bold text-brand-emerald tracking-tight mb-2">Program Scheduling</h3>
            <p className="text-sm text-[#404944] font-medium leading-relaxed">
              Publish educational series rosters, manage volunteer shifts triggers, and track community prayer halls capacity indicators.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
