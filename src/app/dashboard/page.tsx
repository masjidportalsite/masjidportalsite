import { Card } from '@/components/ui/card';
import pool from '@/lib/db';
import React from 'react';

interface StatData {
    totalMembers: number;
    monthlyDonations: number;
    nextEvent: { id: number; title: string; capacity: number; start_time: string } | null;
    eventCapacityLabel: string;
}

async function getDashboardStats(): Promise<StatData> {
    try {
        const [membersRes, donationsRes, eventRes] = await Promise.all([
            pool.query('SELECT COUNT(*) as count FROM users'),
            pool.query(`
                SELECT COALESCE(SUM(amount), 0) as total 
                FROM donations 
                WHERE status = 'successful' 
                AND extract(month from created_at) = extract(month from current_date)
                AND extract(year from created_at) = extract(year from current_date)
            `),
            pool.query(`
                SELECT id, title, capacity, start_time 
                FROM events 
                WHERE start_time > NOW() 
                ORDER BY start_time ASC LIMIT 1
            `)
        ]);

        const totalMembers = parseInt(membersRes.rows[0]?.count || '0', 10);
        const monthlyDonations = parseFloat(donationsRes.rows[0]?.total || '0');
        const nextEvent = eventRes.rows[0] || null;

        let eventCapacityLabel = 'No capacity set';
        if (nextEvent?.capacity) {
            try {
                const rsvpRes = await pool.query(
                    'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1',
                    [nextEvent.id]
                );
                const rsvpCount = parseInt(rsvpRes.rows[0]?.count || '0', 10);
                const percentage = Math.round((rsvpCount / nextEvent.capacity) * 100);
                eventCapacityLabel = `${percentage}% filled (${rsvpCount}/${nextEvent.capacity})`;
            } catch {
                eventCapacityLabel = `Capacity: ${nextEvent.capacity}`;
            }
        }

        return { totalMembers, monthlyDonations, nextEvent, eventCapacityLabel };
    } catch {
        return { totalMembers: 0, monthlyDonations: 0, nextEvent: null, eventCapacityLabel: 'N/A' };
    }
}

export default async function DashboardPage() {
    const { totalMembers, monthlyDonations, nextEvent, eventCapacityLabel } = await getDashboardStats();

    const formattedDonations = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(monthlyDonations);

    // Static Prayer Times for the sanctuary widget
    const prayerTimes = [
        { name: 'Fajr', time: '05:46 AM', active: false },
        { name: 'Dhuhr', time: '01:15 PM', active: false },
        { name: 'Asr', time: '04:38 PM', active: false },
        { name: 'Maghrib', time: '07:22 PM', active: true },
        { name: 'Isha', time: '08:35 PM', active: false }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* Header */}
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-brand-emerald tracking-tight mb-2">
                        Sanctuary Overview
                    </h1>
                    <p className="text-foreground/60 font-medium">
                        Welcome back, Administrator. Manage the operational peace of your community.
                    </p>
                </div>
                <a
                    href="/dashboard/analytics"
                    className="px-6 py-3 bg-brand-emerald hover:bg-brand-emerald/90 text-white rounded-lg shadow-lg shadow-brand-emerald/20 transition-all font-semibold text-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">analytics</span>
                    View Analytics
                </a>
            </header>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 — Total Members */}
                <Card className="p-8 relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs uppercase tracking-widest text-[#707974] font-bold block">Total Members</span>
                            <span className="material-symbols-outlined text-[#707974]/80 p-2 bg-brand-cream rounded-full">group</span>
                        </div>
                        <p className="text-5xl font-semibold text-brand-emerald mb-2 tracking-tight">{totalMembers}</p>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 w-max px-3.5 py-1.5 rounded-full mt-4 flex items-center gap-1.5 shadow-sm border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        Live Tracking Connected
                    </p>
                </Card>

                {/* Metric 2 — Monthly Donations */}
                <Card className="p-8 relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs uppercase tracking-widest text-[#707974] font-bold block">Monthly Zakat & Sadqah</span>
                            <span className="material-symbols-outlined text-[#707974]/80 p-2 bg-brand-cream rounded-full">volunteer_activism</span>
                        </div>
                        <p className="text-4xl font-semibold text-brand-emerald mb-2 tracking-tight">{formattedDonations}</p>
                    </div>
                    <p className="text-xs font-semibold text-brand-gold bg-amber-50 w-max px-3.5 py-1.5 rounded-full mt-4 flex items-center gap-1.5 shadow-sm border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce"></span>
                        Jumuah Campaign Active
                    </p>
                </Card>

                {/* Metric 3 — Next Event (Dark Emerald Card) */}
                <div className="bg-brand-emerald text-brand-cream p-8 rounded-[24px] shadow-xl shadow-brand-emerald/10 hover:scale-[1.02] transition-transform relative overflow-hidden flex flex-col justify-between border border-[#bfc9c3]/10">
                    <div className="absolute -top-10 -right-10 opacity-10 blur-[1px]">
                        <svg className="w-52 h-52 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs uppercase tracking-widest font-bold text-brand-gold block">Next Program</span>
                            <span className="material-symbols-outlined text-brand-gold p-2 bg-brand-emerald-dim rounded-full">calendar_today</span>
                        </div>
                        <p className="text-2xl font-medium leading-snug line-clamp-2 mb-2">
                            {nextEvent ? nextEvent.title : 'No upcoming programs'}
                        </p>
                        {nextEvent && (
                            <p className="text-xs opacity-75 mt-1 font-medium">
                                {new Date(nextEvent.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>
                    {nextEvent && (
                        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                            <span className="font-semibold opacity-90">{eventCapacityLabel}</span>
                            <span className="bg-brand-gold text-brand-emerald px-3 py-1.5 rounded-full font-bold uppercase shadow-sm tracking-wider">Active</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Specialty Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prayer Time Widget */}
                <Card className="p-8 col-span-1 lg:col-span-2 flex flex-col justify-between border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-emerald">schedule</span>
                                <h3 className="text-lg font-bold text-brand-emerald tracking-tight">Active Prayer Times</h3>
                            </div>
                            <span className="text-xs font-semibold text-brand-emerald/60 px-2 py-1 bg-brand-cream border border-brand-emerald/10 rounded-full">Kuala Lumpur</span>
                        </div>

                        <div className="space-y-3">
                            {prayerTimes.map((pt) => (
                                <div
                                    key={pt.name}
                                    className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 border ${pt.active
                                        ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-md translate-x-1 ring-1 ring-brand-gold/20'
                                        : 'bg-white/40 border-brand-emerald/5 hover:bg-brand-cream/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${pt.active ? 'bg-brand-gold animate-pulse' : 'bg-transparent'}`}></span>
                                        <span className={`font-semibold text-sm ${pt.active ? 'text-brand-emerald font-bold' : 'text-foreground/70'}`}>{pt.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${pt.active ? 'text-brand-emerald font-bold' : 'text-foreground/60'}`}>{pt.time}</span>
                                        {pt.active && (
                                            <span className="text-[10px] font-bold tracking-wider text-brand-emerald bg-brand-gold/30 px-2.5 py-1 rounded-full uppercase border border-brand-gold/30">Active</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Qibla Compass Widget */}
                <Card className="p-8 col-span-1 flex flex-col items-center text-center border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-6 text-left">
                            <span className="material-symbols-outlined text-brand-emerald">explore</span>
                            <h3 className="text-lg font-bold text-brand-emerald tracking-tight">Qibla Direction</h3>
                        </div>

                        <div className="relative w-44 h-44 mx-auto my-4 rounded-full bg-brand-cream border-2 border-brand-emerald/10 flex items-center justify-center shadow-inner">
                            <span className="absolute top-2.5 text-[9px] font-bold text-[#707974]">N</span>
                            <span className="absolute bottom-2.5 text-[9px] font-bold text-[#707974]">S</span>
                            <span className="absolute right-3 text-[9px] font-bold text-[#707974]">E</span>
                            <span className="absolute left-3 text-[9px] font-bold text-[#707974]">W</span>

                            <div className="w-36 h-36 rounded-full border border-brand-emerald/5 flex items-center justify-center relative">
                                <div className="absolute top-0 w-1.5 h-1.5 bg-brand-emerald/20 rounded-full"></div>
                                <div className="w-full h-1 relative transition-all duration-1000 ease-out" style={{ transform: 'rotate(292deg)' }}>
                                    <div className="absolute right-1/2 -top-1.5 w-16 h-4 flex items-center justify-end">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[16px] border-r-brand-gold drop-shadow-md"></div>
                                        <div className="h-1 bg-brand-gold w-8"></div>
                                    </div>
                                    <div className="absolute left-1/2 top-0 w-8 h-0.5 bg-primary/20"></div>
                                </div>
                            </div>

                            <div className="w-3 h-3 bg-brand-emerald rounded-full border border-brand-gold shadow z-10"></div>
                        </div>

                        <div className="mt-4">
                            <p className="font-bold text-brand-emerald text-sm">292.4° Northwest</p>
                            <p className="text-xs text-foreground/50 mt-1">Calculated for sanctuary coordinates</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Add Member', icon: 'person_add', href: '/dashboard/members', color: 'bg-brand-emerald text-white' },
                    { label: 'Record Donation', icon: 'payments', href: '/dashboard/donations', color: 'bg-brand-gold text-brand-emerald' },
                    { label: 'Schedule Event', icon: 'event', href: '/dashboard/events', color: 'bg-white border border-brand-emerald/20 text-brand-emerald' },
                    { label: 'Post Announcement', icon: 'campaign', href: '/dashboard/announcements', color: 'bg-white border border-brand-emerald/20 text-brand-emerald' },
                ].map((action) => (
                    <a
                        key={action.label}
                        href={action.href}
                        className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[20px] font-semibold text-sm text-center hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-sm ${action.color}`}
                    >
                        <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                        {action.label}
                    </a>
                ))}
            </div>
        </div>
    );
}
