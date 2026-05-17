import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-emerald tracking-tight mb-2">Analytics</h1>
                    <p className="text-gray-500">Visualize community engagement and financial health.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-12 border border-brand-emerald-dim shadow shadow-brand-emerald/10 flex items-center justify-center min-h-64">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Donation Trends Chart (Coming Soon)</p>
                </Card>
                <Card className="p-12 border border-brand-emerald-dim shadow shadow-brand-emerald/10 flex items-center justify-center min-h-64">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Attendance Heatmap (Coming Soon)</p>
                </Card>
            </div>
        </div>
    );
}
