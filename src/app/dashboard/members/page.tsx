import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Member {
    id: number;
    full_name: string;
    email: string;
    phone_number: string | null;
    role: string | null;
    created_at: string;
}

async function getMembers(): Promise<Member[]> {
    try {
        const res = await pool.query(
            'SELECT id, full_name, email, phone_number, role, created_at FROM users ORDER BY created_at DESC'
        );
        return res.rows;
    } catch {
        return [];
    }
}

export default async function MembersPage() {
    const members = await getMembers();

    async function addMember(formData: FormData) {
        'use server';
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const role = formData.get('role') as string;

        if (!fullName || !email) return;

        try {
            await pool.query(
                'INSERT INTO users (full_name, email, phone_number, role) VALUES ($1, $2, $3, $4)',
                [fullName, email, phone || null, role || 'community_member']
            );
        } catch {
            // Could not insert — likely duplicate email
        }
        revalidatePath('/dashboard/members');
    }

    const getRoleBadge = (role: string | null) => {
        const normalized = (role || 'member').replace(/_/g, ' ');
        const colors: Record<string, string> = {
            'super admin': 'bg-brand-gold/15 text-brand-emerald border-brand-gold/30',
            'committee': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'volunteer': 'bg-blue-50 text-blue-700 border-blue-100',
            'community member': 'bg-brand-cream border-brand-emerald/10 text-foreground/60',
        };
        const color = colors[normalized] || 'bg-brand-cream border-brand-emerald/10 text-foreground/60';
        return { normalized, color };
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-semibold text-brand-emerald tracking-tight mb-2">Members Registry</h1>
                    <p className="text-foreground/60 font-medium">Manage congregants, administrative staff, and access roles.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-emerald/5 border border-brand-emerald/10 rounded-lg">
                    <span className="material-symbols-outlined text-brand-emerald text-lg">group</span>
                    <span className="text-sm font-bold text-brand-emerald">{members.length} Members</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Member Card */}
                <Card className="p-8 col-span-1 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-emerald tracking-tight">Add New Member</h2>
                        <p className="text-xs text-foreground/50 mt-1 font-medium">Register a new soul in the community directory.</p>
                    </div>

                    <form action={addMember} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Full Name</label>
                            <Input name="fullName" required placeholder="Ahmad bin Abdullah" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Email Address</label>
                            <Input name="email" type="email" required placeholder="ahmad@example.com" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Phone Number</label>
                            <Input name="phone" type="tel" placeholder="0123456789" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#707974] block px-1">Access Role</label>
                            <select
                                name="role"
                                className="flex h-10 w-full rounded-lg border border-brand-emerald/20 bg-brand-cream/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="community_member">Community Member</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="committee">Committee Member</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-brand-emerald hover:bg-brand-emerald/90 py-2.5 rounded-lg text-sm font-semibold">
                            Save Member
                        </Button>
                    </form>
                </Card>

                {/* Directory Table Card */}
                <Card className="col-span-1 lg:col-span-2 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]">
                    {members.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-5xl text-brand-emerald/30 mb-4">group</span>
                            <p className="text-xl font-bold text-foreground/40 mb-1">No Members Yet</p>
                            <p className="text-sm text-foreground/30 font-medium max-w-xs">
                                Add your first community member using the form on the left.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-brand-emerald/5 text-brand-emerald border-b border-brand-emerald/10">
                                    <tr>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Name</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Contact Details</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">System Role</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-emerald/5">
                                    {members.map((member) => {
                                        const { normalized, color } = getRoleBadge(member.role);
                                        return (
                                            <tr key={member.id} className="hover:bg-brand-cream/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-brand-emerald/10 border border-brand-emerald/15 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-bold text-brand-emerald">
                                                                {(member.full_name || 'A').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium text-brand-emerald text-sm">{member.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-foreground text-sm font-medium">{member.email}</div>
                                                    <div className="text-foreground/50 text-xs font-semibold mt-0.5">{member.phone_number || '—'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border shadow-sm ${color}`}>
                                                        {normalized}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-foreground/60 text-xs font-medium">
                                                    {new Date(member.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
