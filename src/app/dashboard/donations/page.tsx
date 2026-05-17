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
        zakat: 'bg-brand-gold/15 text-brand-emerald border-brand-gold/20',
        sadaqah: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        general: 'bg-brand-cream border-brand-emerald/10 text-foreground/60',
        campaign: 'bg-blue-50 text-blue-700 border-blue-100',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">Campaigns & Donations</h1>
                    <p className="text-foreground/60 font-medium">Log and monitor community contributions, charity distributions, and Zakat funds.</p>
                </div>
            </header>

            {/* Campaign Progress Widget */}
            <Card className="p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] bg-white/70">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold bg-brand-emerald px-3 py-1.5 rounded-full inline-block mb-3 border border-brand-gold/15">Active Campaign</span>
                        <h2 className="text-2xl font-bold text-brand-emerald tracking-tight">Ramadan Sanctuary Renovation & Zakat</h2>
                        <p className="text-foreground/60 text-sm mt-1 font-medium">Targeted funds for maintenance, carpet upgrades, and local aid programs.</p>
                    </div>
                    <div className="text-right flex flex-col md:items-end justify-center">
                        <span className="text-sm font-semibold text-foreground/50">Fund Progress</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-brand-emerald">
                                {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(totalAmount)}
                            </span>
                            <span className="text-xs font-semibold text-[#707974]">of MYR {campaignTarget.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-4 bg-brand-emerald/10 rounded-full overflow-hidden shadow-inner border border-brand-emerald/5">
                    <div
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-emerald rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(progressPercentage, 2)}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-[#707974] px-1 mt-2">
                    <span>{progressPercentage}% Completed</span>
                    <span className="flex items-center gap-1.5 text-brand-emerald">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
                        Auto-calculating Contributions
                    </span>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Record Donation Form */}
                <Card className="p-8 col-span-1 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Record Contribution</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Log a manual or walk-in congregational donation offline.</p>
                    </div>

                    <form action={recordDonation} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Donor Name</label>
                            <select
                                name="userId"
                                required
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="">Select Donor...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Amount (MYR)</label>
                            <Input name="amount" type="number" step="0.01" min="1" required placeholder="100.00" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Donation Category</label>
                            <select
                                name="type"
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="general">General Upkeep</option>
                                <option value="sadaqah">Sadaqah</option>
                                <option value="zakat">Zakat Distribution</option>
                                <option value="campaign">Active Campaign Fund</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-brand-gold hover:bg-amber-400 text-brand-emerald py-2.5 rounded-lg text-sm font-bold shadow-md shadow-brand-gold/10">
                            Save Record
                        </Button>
                    </form>
                </Card>

                {/* Donations Ledger */}
                <Card className="col-span-1 lg:col-span-2 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]">
                    {donations.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-5xl text-brand-emerald/30 mb-4">volunteer_activism</span>
                            <p className="text-xl font-bold text-foreground/40 mb-1">No Donations Recorded</p>
                            <p className="text-sm text-foreground/30 font-medium max-w-xs">
                                Record your first community contribution using the form on the left.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-brand-emerald/5 text-brand-emerald border-b border-brand-emerald/10">
                                    <tr>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Donor</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Contribution</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Category</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Date Logged</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-emerald/5">
                                    {donations.map((d) => (
                                        <tr key={d.id} className="hover:bg-brand-cream/50 transition-colors">
                                            <td className="p-4 font-medium text-foreground text-sm">{d.donor_name || 'Anonymous Donor'}</td>
                                            <td className="p-4 font-bold text-brand-emerald text-sm">
                                                {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(d.amount)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border shadow-sm ${typeColors[d.type] || typeColors.general}`}>
                                                    {d.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-foreground/60 text-xs font-medium">
                                                {new Date(d.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
