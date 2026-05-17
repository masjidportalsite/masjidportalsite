import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';

export default async function MembersPage() {
    const res = await pool.query('SELECT id, full_name, email, phone_number, role, created_at FROM users ORDER BY created_at DESC');
    const members = res.rows;

    async function addMember(formData: FormData) {
        'use server';
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const role = formData.get('role') as string;

        if (!fullName || !email) return;

        await pool.query(
            'INSERT INTO users (full_name, email, phone_number, role) VALUES ($1, $2, $3, $4)',
            [fullName, email, phone, role]
        );
        revalidatePath('/dashboard/members');
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Members</h1>
                    <p className="text-gray-500">Manage your congregants and community members.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 col-span-1 border border-brand-emerald-dim shadow shadow-brand-emerald/10 h-max">
                    <h2 className="text-xl font-bold mb-4 text-brand-emerald">Add New Member</h2>
                    <form action={addMember} className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Full Name</label>
                            <input name="fullName" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Email</label>
                            <input name="email" type="email" required className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Phone</label>
                            <input name="phone" type="tel" className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald" placeholder="0123456789" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 block">Role</label>
                            <select name="role" className="w-full bg-brand-cream border border-brand-emerald-dim p-2 rounded focus:outline-brand-emerald">
                                <option value="community_member">Community Member</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="committee">Committee</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full mt-4 bg-brand-emerald text-white rounded p-2 font-bold hover:bg-brand-emerald-dim transition-colors">
                            Save Member
                        </button>
                    </form>
                </Card>

                <Card className="col-span-1 lg:col-span-2 overflow-hidden shadow-xl shadow-brand-emerald/5 border-t border-brand-emerald-dim">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-brand-emerald text-brand-cream">
                                <tr>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Contact</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">No members found.</td>
                                    </tr>
                                ) : members.map((member) => (
                                    <tr key={member.id} className="hover:bg-brand-cream transition-colors">
                                        <td className="p-4 font-medium">{member.full_name}</td>
                                        <td className="p-4">
                                            <div className="text-gray-900">{member.email}</div>
                                            <div className="text-gray-500 text-xs">{member.phone_number || 'No phone'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs uppercase font-bold tracking-wider bg-brand-gold bg-opacity-20 text-brand-emerald">
                                                {member.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(member.created_at).toLocaleDateString()}
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
