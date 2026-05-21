'use client';

import { useState, useMemo } from 'react';

import { UserRole } from '@/types/auth';

interface Member {
    id: string;
    full_name: string | null;
    email: string;
    phone_number: string | null;
    role: UserRole | string | null;
    created_at: string;
}

const getRoleBadge = (role: string | null) => {
    const normalized = (role || 'member').replace(/_/g, ' ');
    const colors: Record<string, string> = {
        'super admin': 'bg-[#fed65b]/15 text-[#735c00] border-[#fed65b]/30',
        'committee': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'volunteer': 'bg-blue-50 text-blue-700 border-blue-100',
        'community member': 'bg-[#f8f9ff] border-[#bfc9c3]/30 text-[#404944]',
    };
    const color = colors[normalized] || 'bg-[#f8f9ff] border-[#bfc9c3]/30 text-[#404944]';
    return { normalized, color };
};

export function MembersSearch({ members }: { members: Member[] }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const roles = useMemo(() => {
        const unique = new Set(members.map(m => (m.role || 'community_member').replace(/_/g, ' ')));
        return Array.from(unique);
    }, [members]);

    const filtered = useMemo(() => {
        return members.filter(m => {
            const matchesSearch = !search || [m.full_name || '', m.email, m.phone_number || ''].some(v => v.toLowerCase().includes(search.toLowerCase()));
            const matchesRole = roleFilter === 'all' || (m.role || 'community_member').replace(/_/g, ' ') === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [members, search, roleFilter]);

    return (
        <div className="w-full flex flex-col gap-0 overflow-hidden">
            {/* Search & Filter Bar */}
            <div className="p-4 md:p-5 border-b border-[#bfc9c3]/20 bg-[#f8f9ff]/60 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px] pointer-events-none">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                        className="w-full min-h-[44px] pl-9 pr-4 py-2 rounded-lg border border-[#bfc9c3]/30 bg-white text-sm text-[#121c2a] placeholder:text-[#707974] focus:outline-none focus:ring-2 focus:ring-[#fed65b] focus:border-[#fed65b] transition-all"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#707974] text-sm hover:text-[#003527] transition-colors"
                        >close</button>
                    )}
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="min-h-[44px] rounded-lg border border-[#bfc9c3]/30 bg-white px-3 py-2 text-sm text-[#121c2a] focus:outline-none focus:ring-2 focus:ring-[#fed65b] focus:border-[#fed65b] transition-all sm:w-44"
                >
                    <option value="all">All Roles</option>
                    {roles.map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Results count */}
            <div className="px-4 md:px-5 py-2.5 bg-white/50 border-b border-[#bfc9c3]/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#707974]">
                    {filtered.length} of {members.length} members
                </span>
            </div>

            {filtered.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-3xl text-[#003527]/20 mb-2">manage_search</span>
                    <p className="font-bold text-[#404944] text-sm">No members found</p>
                    <p className="text-xs text-[#707974] mt-1">Try adjusting your search or filter.</p>
                </div>
            ) : (
                <div className="w-full">
                    {/* Mobile card stack */}
                    <div className="md:hidden flex flex-col divide-y divide-[#bfc9c3]/20 w-full overflow-hidden">
                        {filtered.map((member) => {
                            const { normalized, color } = getRoleBadge(member.role);
                            return (
                                <div key={member.id} className="p-5 flex flex-col gap-3 bg-white hover:bg-black/[0.02] transition-colors w-full">
                                    <div className="flex items-start justify-between gap-3 w-full">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-[#e6eeff] border border-[#bfc9c3]/30 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-[#003527]">
                                                    {(member.full_name || 'A').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="truncate min-w-0">
                                                <span className="font-bold text-[#003527] text-base truncate block">{member.full_name}</span>
                                                <span className="text-[#707974] text-xs font-medium block truncate">{member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1 gap-2 flex-wrap">
                                        <span className={`px-2.5 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest border shadow-sm ${color} whitespace-nowrap`}>
                                            {normalized}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {member.phone_number && (
                                                <a href={`tel:${member.phone_number}`} className="material-symbols-outlined text-[#707974] text-lg bg-[#f8f9ff] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-[#bfc9c3]/30 active:bg-black/5">call</a>
                                            )}
                                            <a href={`mailto:${member.email}`} className="material-symbols-outlined text-[#707974] text-lg bg-[#f8f9ff] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-[#bfc9c3]/30 active:bg-black/5">mail</a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto w-full">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8f9ff] text-[#003527] border-b border-[#bfc9c3]/30">
                                <tr>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Name</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Contact Details</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">System Role</th>
                                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#bfc9c3]/20">
                                {filtered.map((member) => {
                                    const { normalized, color } = getRoleBadge(member.role);
                                    return (
                                        <tr key={member.id} className="hover:bg-[#f8f9ff]/60 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#e6eeff] border border-[#bfc9c3]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        <span className="text-xs font-bold text-[#003527]">
                                                            {(member.full_name || 'A').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-[#003527] text-sm">{member.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-[#121c2a] text-sm font-medium">{member.email}</div>
                                                <div className="text-[#707974] text-xs font-medium mt-0.5">{member.phone_number || '—'}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border shadow-sm ${color}`}>
                                                    {normalized}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[#707974] text-xs font-medium">
                                                {new Date(member.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
