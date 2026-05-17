import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24 bg-brand-cream text-foreground font-sans">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center border-b border-brand-emerald/10">
        <div className="font-bold text-xl tracking-wide flex items-center gap-2 text-brand-emerald">
          <div className="w-8 h-8 bg-brand-emerald rounded-full" />
          MasjidPortal
        </div>
        <Link href="/login" className="text-sm font-semibold text-brand-emerald hover:text-brand-gold transition-colors">
          Admin Sign In
        </Link>
      </header>

      <div className="mt-32 max-w-4xl text-center px-4 w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-emerald">
          The Community Management Hub
        </h1>
        <p className="text-xl text-brand-emerald/80 mb-12 max-w-2xl mx-auto font-medium">
          Powered by InsForge. Experience transparent donations, strict RBAC security, and automated event coordination.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link href="/login" className="px-8 py-4 bg-brand-emerald hover:bg-brand-emerald/90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-brand-emerald/20 hover:scale-105 active:scale-95">
            Member Access
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-white/70 hover:bg-white border border-brand-emerald/10 text-brand-emerald rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-xl">
            View Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <Card className="p-6 transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-brand-emerald mb-2">Membership</h3>
            <p className="text-sm text-brand-emerald/70">Manage congregants, households, and role-based access.</p>
          </Card>
          <Card className="p-6 transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-brand-emerald mb-2">Donations & Zakat</h3>
            <p className="text-sm text-brand-emerald/70">Track campaigns, process payments, and issue receipts easily.</p>
          </Card>
          <Card className="p-6 transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-brand-emerald mb-2">Events & RSVPs</h3>
            <p className="text-sm text-brand-emerald/70">Coordinate community gatherings, track attendance, and assign volunteers.</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
