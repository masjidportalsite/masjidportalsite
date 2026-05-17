import { Card } from '@/components/ui/card';

export default function DashboardPage() {
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
                    <p className="text-4xl font-extrabold text-brand-emerald mb-2">1,248</p>
                    <p className="text-sm font-medium text-emerald-600 bg-emerald-50 w-max px-2 bg-opacity-60 rounded">+12 this week</p>
                </Card>
                <Card className="p-6 hover:scale-[1.02] transition-transform">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Monthly Donations</h3>
                    <p className="text-4xl font-extrabold text-brand-emerald mb-2">RM 24,500</p>
                    <p className="text-sm font-medium text-brand-gold bg-amber-50 w-max px-2 rounded">Active Jumuah Campaign</p>
                </Card>
                <div className="bg-brand-emerald text-brand-cream p-6 rounded-2xl shadow-xl shadow-brand-emerald/20 hover:scale-[1.02] transition-transform relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 opacity-10 blur-[1px]">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-brand-gold opacity-90">Next Event</h3>
                        <p className="text-2xl font-semibold leading-tight line-clamp-2">Community Iftar & Guest Lecture</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                        <span className="font-medium opacity-90">Capacity: 80%</span>
                        <span className="bg-brand-gold text-brand-emerald-dim px-2 py-1 rounded font-bold text-xs uppercase shadow">Action Needed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
