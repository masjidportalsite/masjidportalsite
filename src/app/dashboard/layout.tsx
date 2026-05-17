export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-cream text-foreground flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-brand-emerald text-brand-cream p-6 flex flex-col shadow-xl z-10">
                <div className="font-bold tracking-wider mb-10 text-xl border-b border-brand-emerald-dim pb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-gold"></div>
                    MasjidPortal<span className="text-brand-gold">.</span>
                </div>
                <nav className="flex flex-col gap-4 font-medium pt-2">
                    <a href="/dashboard" className="text-brand-gold hover:text-white transition-colors">Overview</a>
                    <a href="/dashboard/members" className="hover:text-brand-gold transition-colors">Members</a>
                    <a href="/dashboard/donations" className="hover:text-brand-gold transition-colors">Donations</a>
                    <a href="/dashboard/events" className="hover:text-brand-gold transition-colors">Events & Classes</a>
                    <a href="/dashboard/volunteers" className="hover:text-brand-gold transition-colors">Volunteers</a>
                    <a href="/dashboard/analytics" className="hover:text-brand-gold transition-colors">Analytics</a>
                    <a href="/dashboard/settings" className="hover:text-brand-gold transition-colors">Settings</a>
                </nav>
            </aside>
            <main className="flex-1 p-8 md:p-12 overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
