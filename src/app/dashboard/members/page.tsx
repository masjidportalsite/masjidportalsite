import { revalidatePath } from 'next/cache';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MembersSearch } from '@/components/ui/members-search';
import { requireAuth } from '@/lib/auth';
import { getTenantContext } from '@/services/core/tenant';
import { UserService, UserSummary } from '@/services/user.service';
import { UserRole } from '@/types/auth';

async function getMembers(): Promise<UserSummary[]> {
    const user = await requireAuth();
    const context = getTenantContext(user);
    const userService = new UserService(context);
    
    const result = await userService.getOrganizationUsers();
    return result.data || [];
}

export default async function MembersPage() {
    const members = await getMembers();

    async function addMember(formData: FormData) {
        'use server';
        const user = await requireAuth();
        const context = getTenantContext(user);
        const userService = new UserService(context);

        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const role = formData.get('role') as UserRole;

        if (!fullName || !email) return;

        const result = await userService.addMember({
            fullName,
            email,
            phoneNumber: phone,
            role
        });

        if (result.error) {
            console.error('[MembersPage] Failed to add member:', result.error.message);
        }

        revalidatePath('/dashboard/members');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRoleBadge = (role: string | null) => {
        const normalized = (role || 'member').replace(/_/g, ' ');
        const colors: Record<string, string> = {
            'super admin': 'bg-brand-gold/15 text-[#735c00] border-brand-gold/30',
            'committee': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'volunteer': 'bg-blue-50 text-blue-700 border-blue-100',
            'community member': 'bg-brand-cream border-[#bfc9c3]/30 text-foreground/60',
        };
        const color = colors[normalized] || 'bg-brand-cream border-[#bfc9c3]/30 text-foreground/60';
        return { normalized, color };
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans w-full overflow-hidden">
            <header className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#003527] tracking-tight mb-2">Members Registry</h1>
                    <p className="text-foreground/60 font-medium text-sm md:text-base max-w-sm md:max-w-none">Manage congregants, administrative staff, and access roles.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#003527]/5 border border-[#003527]/10 rounded-lg min-h-[44px]">
                    <span className="material-symbols-outlined text-[#003527] text-lg">group</span>
                    <span className="text-sm font-bold text-[#003527]">{members.length} Members</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-hidden w-full">
                {/* Add New Member Card (Mobile Optimized Form) */}
                <Card className="col-span-1 lg:col-span-4 p-5 md:p-8 border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] h-max flex flex-col gap-6 w-full">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-[#003527] tracking-tight">Add New Member</h2>
                        <p className="text-[11px] md:text-xs text-foreground/50 mt-1 font-medium leading-relaxed">Register a new soul in the community directory immediately available for event tracking.</p>
                    </div>

                    <form action={addMember} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5 border-b border-brand-emerald/10 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Full Name</label>
                            <Input name="fullName" required placeholder="Ahmad bin Abdullah" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>
                        <div className="space-y-1.5 border-b border-brand-emerald/10 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Email Address</label>
                            <Input name="email" type="email" required placeholder="ahmad@example.com" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>
                        <div className="space-y-1.5 border-b border-brand-emerald/10 pb-4 md:border-0 md:pb-0">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Phone Number</label>
                            <Input name="phone" type="tel" placeholder="0123456789" className="min-h-[48px] bg-[#f8f9ff]/50 md:min-h-[44px] text-base" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#707974] block px-1">Access Role</label>
                            <select
                                name="role"
                                className="flex min-h-[48px] md:min-h-[44px] w-full rounded-lg border border-brand-emerald/20 bg-[#f8f9ff]/50 px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200"
                            >
                                <option value="community_member">Community Member</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="committee">Committee Member</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full mt-2 min-h-[48px] md:min-h-[44px] bg-[#003527] hover:bg-[#064e3b] text-white py-3 rounded-lg text-sm md:text-base font-semibold shadow-lg shadow-[#003527]/20 active:scale-[0.98] transition-transform">
                            Save Member
                        </Button>
                    </form>
                </Card>

                {/* Directory Display — Client-side searchable */}
                <Card className="col-span-1 lg:col-span-8 overflow-hidden border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)] w-full">
                    {members.length === 0 ? (
                        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-4xl md:text-5xl text-[#003527]/30 mb-4">group</span>
                            <p className="text-lg md:text-xl font-bold text-[#404944] mb-1">No Members Yet</p>
                            <p className="text-xs md:text-sm text-foreground/30 font-medium max-w-xs">
                                Add your first community member using the form to start populating the directory.
                            </p>
                        </div>
                    ) : (
                        <MembersSearch members={members} />
                    )}
                </Card>
            </div>
        </div>
    );
}
