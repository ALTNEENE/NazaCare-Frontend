import { useEffect, useState } from "react";
import { adminApi, type AdminStats } from "@/api/admin";
import { Users, FileText, Stethoscope, BrainCog } from "lucide-react";

export function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminApi.getStats();
                setStats(data);
            } catch (err: any) {
                setError(err.message || "Failed to load stats");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="text-white">Loading stats...</div>;
    if (error) return <div className="text-rose-500">{error}</div>;

    const statCards = [
        { label: "Total Users", value: stats?.users, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Diagnoses run", value: stats?.diagnoses, icon: FileText, color: "text-teal-400", bg: "bg-teal-400/10" },
        { label: "Total Doctors", value: stats?.doctors, icon: Stethoscope, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "NLP Rules Active", value: stats?.rules, icon: BrainCog, color: "text-orange-400", bg: "bg-orange-400/10" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-neutral-800/50 border border-neutral-700 p-6 rounded-2xl flex items-center space-x-4">
                        <div className={"p-4 rounded-xl " + card.bg + " " + card.color}>
                            <card.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">{card.label}</p>
                            <p className="text-2xl font-bold text-white">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
