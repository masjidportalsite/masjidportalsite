import { Card } from '@/components/ui/card';
import pool from '@/lib/db';

export default async function DashboardPage() {
    // 1. Total Members
    const membersRes = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalMembers = membersRes.rows[0]?.count || 0;

    // 2. Monthly Donations (Sum of all completed donations this month)
    const donationsRes = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM donations 
        WHERE status = 'successful' 
        AND extract(month from created_at) = extract(month from current_date)
        AND extract(year from created_at) = extract(year from current_date)
    `);
    const monthlyDonations = donationsRes.rows[0]?.total || 0;
    const formattedDonations = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(monthlyDonations);

    // 3. Next Event
    const eventRes = await pool.query(`
        SELECT id, title, capacity, start_time 
        FROM events 
        WHERE start_time > NOW() 
        ORDER BY start_time ASC LIMIT 1
    `);
    const nextEvent = eventRes.rows[0];
    let eventCapacityLabel = "N/A";

    if (nextEvent && nextEvent.capacity) {
        const rsvpRes = await pool.query('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1', [nextEvent.id]);
        const rsvpCount = parseInt(rsvpRes.rows[0]?.count || '0', 10);
        const percentage = Math.round((rsvpCount / nextEvent.capacity) * 100);
        eventCapacityLabel = `Capacity: ${percentage}%`;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome back. Here is the operational overview of your community.</p>
                </div>
                <button className="px-6 py-2.5 bg-brand-emerald text-brand-cream rounded-lg hover:bg-brand-emerald-dim transition delay-50 shadow-md font-medium text-sm">
                    Generate Report
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 hover:scale-[1.02] transition-transform">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Total Members</h3>
                    <p className="text-4xl font-extrabold text-brand-emerald mb-2">{totalMembers}</p>
                    <p className="text-sm font-medium text-emerald-600 bg-emerald-50 w-max px-2 bg-opacity-60 rounded">Live Tracking</p>
                </Card>
                <Card className="p-6 hover:scale-[1.02] transition-transform">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Monthly Donations</h3>
                    <p className="text-4xl font-extrabold text-brand-emerald mb-2">{formattedDonations}</p>
                    <p className="text-sm font-medium text-brand-gold bg-amber-50 w-max px-2 rounded">Active Jumuah Campaign</p>
                </Card>
                <div className="bg-brand-emerald text-brand-cream p-6 rounded-2xl shadow-xl shadow-brand-emerald/20 hover:scale-[1.02] transition-transform relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 opacity-10 blur-[1px]">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-brand-gold opacity-90">Next Event</h3>
                        <p className="text-2xl font-semibold leading-tight line-clamp-2">
                            {nextEvent ? nextEvent.title : "No upcoming events"}
                        </p>
                    </div>
                    {nextEvent && (
                        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                            <span className="font-medium opacity-90">{eventCapacityLabel}</span>
                            <span className="bg-brand-gold text-brand-emerald-dim px-2 py-1 rounded font-bold text-xs uppercase shadow">Action Needed</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
