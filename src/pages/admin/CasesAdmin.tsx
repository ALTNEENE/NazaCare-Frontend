import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";

export function CasesAdmin() {
    const [cases, setCases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCases = async () => {
            try {
                const data = await adminApi.getCases();
                setCases(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCases();
    }, []);

    const deleteCase = async (id: string) => {
        if (!confirm("Delete this case?")) return;
        try {
            await adminApi.deleteCase(id);
            setCases((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="text-white">Loading cases...</div>;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "Critical": return "bg-rose-500 text-white";
            case "High": return "bg-orange-500/20 text-orange-400";
            case "Moderate-High": return "bg-yellow-500/20 text-yellow-400";
            case "Moderate": return "bg-blue-500/20 text-blue-400";
            default: return "bg-teal-500/20 text-teal-400";
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Diagnosis Cases</h1>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-800 text-neutral-400">
                        <tr>
                            <th className="p-4">Patient</th>
                            <th className="p-4 w-1/3">Symptoms</th>
                            <th className="p-4">Risk</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700/50">
                        {cases.map((c) => (
                            <tr key={c._id} className="text-neutral-300">
                                <td className="p-4">{c.userId?.fullName || 'Unknown'}</td>
                                <td className="p-4 truncate max-w-xs" title={c.symptoms}>{c.symptoms}</td>
                                <td className="p-4">
                                    <span className={"px-2 py-1 rounded full font-medium text-xs " + getRiskColor(c.risk)}>
                                        {c.risk}
                                    </span>
                                </td>
                                <td className="p-4">{(c.confidence * 100).toFixed(1)}%</td>
                                <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => deleteCase(c._id)}
                                        className="text-rose-400 hover:text-rose-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
