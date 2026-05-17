import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';

export default async function DonationsPage() {
    // 1. Fetch Donations
    const res = await pool.query('SELECT d.id, d.amount, d.currency, d.status, d.type, d.created_at, u.full_name as donor_name FROM donations d LEFT JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC LIMIT 50');
    const donations = res.rows;

    // 2. Fetch Users to populate the dropdown
    const usersRes = await pool.query('SELECT id, full_name, email FROM users ORDER BY full_name ASC');
    const users = usersRes.rows;

    async function recordDonation(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const amount = parseFloat(formData.get('amount') as string);
        const type = formData.get('type') as string;

        if (!userId || isNaN(amount)) return;

        await pool.query(
            'INSERT INTO donations (user_id, amount, type, status) VALUES ($1, $2, $3, $4)',
            [userId, amount, type, 'successful']
        );
        revalidatePath('/dashboard/donations');
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Donations</h1>
                    <p className="text-gray-500">Track incoming congregational and campaign donations.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 col-span-1 border border-brand-emerald-dim shadow shadow-brand-emerald/10 h-max">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Record Donation</h2>
                    <form action={recordDonation} className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Donor</label>
                            <select name="userId" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald">
                                <option value="">Select Donor...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Amount (MYR)</label>
                            <input name="amount" type="number" step="0.01" min="1" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="100.00" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Type</label>
                            <select name="type" className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald">
                                <option value="general">General</option>
                                <option value="sadaqah">Sadaqah</option>
                                <option value="zakat">Zakat</option>
                                <option value="campaign">Campaign</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full mt-4 bg-brand-gold text-brand-emerald-dim rounded p-2 font-bold hover:bg-amber-400 transition-colors shadow">
                            Save Record
                        </button>
                    </form>
                </Card>

                <Card className="col-span-1 lg:col-span-2 overflow-hidden shadow-xl shadow-brand-emerald/5 border-t border-brand-emerald-dim">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1f2937] text-white">
                                <tr>
                                    <th className="p-4 font-semibold">Donor</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">No donations found.</td>
                                    </tr>
                                ) : donations.map((d) => (
                                    <tr key={d.id} className="hover:bg-brand-cream transition-colors">
                                        <td className="p-4 font-medium">{d.donor_name || 'Anonymous'}</td>
                                        <td className="p-4 font-bold text-brand-emerald">
                                            {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(d.amount)}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs uppercase font-bold tracking-wider bg-gray-100 text-gray-600">
                                                {d.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(d.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
