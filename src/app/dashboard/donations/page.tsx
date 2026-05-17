import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Donation {
    id: number;
    amount: number;
    currency: string;
    status: string;
    type: string;
    created_at: string;
    donor_name: string | null;
}
interface User { id: number; full_name: string; email: string; }

async function getData(): Promise<{ donations: Donation[]; users: User[] }> {
    try {
        const [donRes, usersRes] = await Promise.all([
            pool.query(`
                SELECT d.id, d.amount, d.currency, d.status, d.type, d.created_at, u.full_name as donor_name 
                FROM donations d 
                LEFT JOIN users u ON d.user_id = u.id 
                ORDER BY d.created_at DESC LIMIT 50
            `),
            pool.query('SELECT id, full_name, email FROM users ORDER BY full_name ASC')
        ]);
        return { donations: donRes.rows, users: usersRes.rows };
    } catch {
        return { donations: [], users: [] };
    }
}

export default async function DonationsPage() {
    const { donations, users } = await getData();

    const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const campaignTarget = 50000;
    const progressPercentage = Math.min(Math.round((totalAmount / campaignTarget) * 100), 100);

    async function recordDonation(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const amount = parseFloat(formData.get('amount') as string);
        const type = formData.get('type') as string;

        if (!userId || isNaN(amount) || amount <= 0) return;

        try {
            await pool.query(
                'INSERT INTO donations (user_id, amount, type, status) VALUES ($1, $2, $3, $4)',
                [userId, amount, type || 'general', 'successful']
            );
        } catch { /* handle gracefully */ }
        revalidatePath('/dashboard/donations');
    }

    const typeColors: Record<string, string> = {
        zakat: 'bg-[#95d3ba]/20 text-[#003527] border-[#003527]/10',
        sadaqah: 'bg-[#003527] text-white border-[#064e3b]',
        general: 'bg-white border-[#bfc9c3]/40 text-[#404944]',
        campaign: 'bg-[#fed65b]/20 text-[#735c00] border-[#fed65b]/40',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans w-full overflow-hidden">
            <header className="mb-6 md:mb-10 flex flex-col justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#003527] tracking-tight mb-2">Campaigns & Donations</h1>
                    <p className="text-foreground/60 font-medium text-sm md:text-base max-w-sm md:max-w-none">Log and monitor community contributions, charity distributions, and Zakat funds.</p>
                </div>
            </header>

            {/* Campaign Progress Widget */}
            <Card className="p-6 md:p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70 w-full overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#241a00] bg-[#fed65b] px-3 py-1.5 rounded-full inline-block mb-3 border border-[#735c00]/20 shadow-sm">Active Campaign</span>
                        <h2 className="text-xl md:text-2xl font-bold text-[#003527] tracking-tight">Ramadan Sanctuary Renovation & Zakat</h2>
                        <p className="text-foreground/60 text-xs md:text-sm mt-1 font-medium leading-relaxed max-w-xl">Targeted funds for maintenance, carpet upgrades, and local aid programs.</p>
                    </div>
                    <div className="text-left lg:text-right flex flex-col justify-center bg-[#f8f9ff] lg:bg-transparent p-4 lg:p-0 rounded-xl border border-[#bfc9c3]/30 lg:border-none">
                        <span className="text-xs font-semibold text-[#707974] uppercase tracking-widest">Fund Progress</span>
                        <div className="flex items-baseline lg:items-end gap-2 mt-1">
                            <span className="text-3xl md:text-4xl font-extrabold text-[#003527] tracking-tighter">
                                {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(totalAmount)}
                            </span>
                            <span className="text-xs font-semibold text-[#707974] whitespace-nowrap">of MYR {campaignTarget.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-4 bg-[#bfc9c3]/20 rounded-full overflow-hidden shadow-inner border border-[#bfc9c3]/10">
                    <div
                        className="h-full bg-gradient-to-r from-[#fed65b] to-[#014131] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(progressPercentage, 5)}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px] md:text-xs font-semibold text-[#707974] px-1 mt-3">
                    <span>{progressPercentage}% Completed</span>
                    <span className="flex items-center gap-1.5 text-[#003527]">
                        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#fed65b] animate-ping"></span>
                        Auto-calculating Ledger
                    </span>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-hidden w-full">
                {/* Record Donation Form */}
                <Card className="col-span-1 lg:col-span-4 p-5 md:p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Record Contribution</h2>
                        <p className="text-[11px] md:text-xs text-foreground/50 mt-1 font-medium leading-relaxed">Log a manual or walk-in congregational donation offline.</p>
                    </div>

                    <form action={recordDonation} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Donor Name</label>
                            <select
                                name="userId"
                                required
                                className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="">Select Donor...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5 border-b border-[#bfc9c3]/20 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Amount (MYR)</label>
                            <Input name="amount" type="number" step="0.01" min="1" required placeholder="100.00" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base font-bold text-lg text-[#003527]" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Donation Category</label>
                            <select
                                name="type"
                                className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="general">General Upkeep</option>
                                <option value="sadaqah">Sadaqah</option>
                                <option value="zakat">Zakat Distribution</option>
                                <option value="campaign">Active Campaign Fund</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full mt-2 min-h-[48px] md:min-h-[44px] bg-[#fed65b] hover:bg-[#e5c152] text-[#241a00] py-3 rounded-lg text-sm md:text-base font-bold shadow-lg shadow-[#fed65b]/20 active:scale-[0.98] transition-transform">
                            Save Financial Record
                        </Button>
                    </form>
                </Card>

                {/* Donations Ledger Display */}
                <Card className="col-span-1 lg:col-span-8 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] w-full flex flex-col">
                    {donations.length === 0 ? (
                        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center opacity-80 h-full min-h-[250px]">
                            <span className="material-symbols-outlined text-4xl md:text-5xl text-[#003527]/30 mb-4">volunteer_activism</span>
                            <p className="text-lg md:text-xl font-bold text-[#404944] mb-1">No Donations Recorded</p>
                            <p className="text-xs md:text-sm text-foreground/40 font-medium max-w-xs">
                                Record your first community contribution using the form to build a ledger track.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* --- Mobile View (Card Stack) --- */}
                            <div className="md:hidden flex flex-col divide-y divide-[#bfc9c3]/20 w-full overflow-hidden">
                                {donations.map((d) => (
                                    <div key={d.id} className="p-5 flex flex-col gap-3 bg-white w-full group">
                                        <div className="flex justify-between items-start gap-3 w-full">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-full bg-[#e6eeff] border border-[#bfc9c3]/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-sm text-[#003527] font-bold">payments</span>
                                                </div>
                                                <div className="truncate min-w-0">
                                                    <span className="font-bold text-[#003527] text-base truncate block">{d.donor_name || 'Anonymous Donor'}</span>
                                                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest border shadow-sm ${typeColors[d.type] || typeColors.general}`}>
                                                        {d.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end whitespace-nowrap">
                                                <span className="font-extrabold text-[#003527] text-lg leading-none">
                                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(d.amount)}
                                                </span>
                                                <span className="text-[10px] font-semibold text-[#707974] mt-1">
                                                    {new Date(d.created_at).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- Desktop View (Table) --- */}
                            <div className="hidden md:block overflow-x-auto w-full">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#f8f9ff] text-[#003527] border-b border-[#bfc9c3]/30">
                                        <tr>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Donor Log</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Contribution</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs">Category</th>
                                            <th className="p-4 font-bold uppercase tracking-wider text-xs whitespace-nowrap">Date Logged</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#bfc9c3]/20">
                                        {donations.map((d) => (
                                            <tr key={d.id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-[#bfc9c3]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <span className="text-[#003527] text-[10px] font-bold">
                                                                {(d.donor_name || 'A').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-[#003527] text-sm">{d.donor_name || 'Anonymous Donor'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-extrabold text-[#003527] text-base whitespace-nowrap">
                                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(d.amount)}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1.5 rounded-full text-[10px] md:text-xs uppercase font-bold tracking-widest border shadow-sm ${typeColors[d.type] || typeColors.general}`}>
                                                        {d.type}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[#707974] text-xs font-semibold whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f8f9ff] border border-[#bfc9c3]/30 rounded-md shadow-sm">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                        {new Date(d.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
