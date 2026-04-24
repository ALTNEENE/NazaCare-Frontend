import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";

export function RulesAdmin() {
    const [rules, setRules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial state
    const defaultForm = {
        ruleId: "",
        weight: 10,
        conditions: {
            symptoms: "",
            minCount: 1,
        },
        outcome: {
            risk: "Moderate",
            message: { en: "", ar: "" },
            treatment: { en: "", ar: "" },
        }
    };
    const [formData, setFormData] = useState(defaultForm);

    const loadRules = async () => {
        try {
            const data = await adminApi.getRules();
            setRules(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRules();
    }, []);

    const deleteRule = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule? This affects NLP diagnostics!")) return;
        try {
            await adminApi.deleteRule(id);
            setRules(rules.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (rule: any) => {
        setFormData({
            ruleId: rule.ruleId,
            weight: rule.weight,
            conditions: {
                symptoms: rule.conditions.symptoms?.join(", ") || "",
                minCount: rule.conditions.minCount || 1,
            },
            outcome: {
                risk: rule.outcome.risk,
                message: {
                    en: rule.outcome.message?.en || "",
                    ar: rule.outcome.message?.ar || "",
                },
                treatment: {
                    en: rule.outcome.treatment?.en || "",
                    ar: rule.outcome.treatment?.ar || "",
                }
            }
        });
        setEditingId(rule._id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Parse symptoms
        const symptomsArray = formData.conditions.symptoms
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const payload = {
            ...formData,
            conditions: {
                symptoms: symptomsArray,
                minCount: Number(formData.conditions.minCount)
            },
            weight: Number(formData.weight)
        };

        try {
            if (editingId) {
                await adminApi.updateRule(editingId, payload);
            } else {
                await adminApi.createRule(payload);
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData(defaultForm);
            loadRules(); // Reload
        } catch (err) {
            console.error(err);
            alert("Failed to save rule. Ensure Rule ID is unique.");
        }
    };

    if (isLoading) return <div className="text-white">Loading rules...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">NLP Rules Management</h1>
                <div className="flex gap-4 items-center">
                    <div className="text-neutral-400 text-sm bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg hidden sm:block">
                        Rules govern the AI diagnosis engine. Edit carefully.
                    </div>
                    <button 
                        onClick={() => {
                            if (isFormOpen) {
                                setIsFormOpen(false);
                                setEditingId(null);
                            } else {
                                setFormData(defaultForm);
                                setEditingId(null);
                                setIsFormOpen(true);
                            }
                        }}
                        className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-semibold py-2 px-4 rounded-xl transition"
                    >
                        {isFormOpen ? "Close Form" : "Add Rule"}
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-neutral-800/80 p-6 rounded-2xl border border-neutral-700 text-white space-y-4">
                    <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Rule" : "Create New Rule"}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Rule ID (Unique)</label>
                            <input required value={formData.ruleId} onChange={(e) => setFormData({...formData, ruleId: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Weight (Score impact)</label>
                            <input type="number" required value={formData.weight} onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-neutral-400 mb-1">Symptoms (comma separated)</label>
                            <input required placeholder="e.g. fever, cough, headache" value={formData.conditions.symptoms} onChange={(e) => setFormData({...formData, conditions: {...formData.conditions, symptoms: e.target.value}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Min Match Count</label>
                            <input type="number" required value={formData.conditions.minCount} onChange={(e) => setFormData({...formData, conditions: {...formData.conditions, minCount: Number(e.target.value)}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Risk Outcome</label>
                            <select required value={formData.outcome.risk} onChange={(e) => setFormData({...formData, outcome: {...formData.outcome, risk: e.target.value}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg">
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Moderate-High">Moderate-High</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        {/* Messages */}
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Message (English)</label>
                            <input required value={formData.outcome.message.en} onChange={(e) => setFormData({...formData, outcome: {...formData.outcome, message: {...formData.outcome.message, en: e.target.value}}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Message (Arabic)</label>
                            <input required value={formData.outcome.message.ar} onChange={(e) => setFormData({...formData, outcome: {...formData.outcome, message: {...formData.outcome.message, ar: e.target.value}}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg rtl" />
                        </div>

                        {/* Treatments */}
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Treatment (English)</label>
                            <input required value={formData.outcome.treatment.en} onChange={(e) => setFormData({...formData, outcome: {...formData.outcome, treatment: {...formData.outcome.treatment, en: e.target.value}}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Treatment (Arabic)</label>
                            <input required value={formData.outcome.treatment.ar} onChange={(e) => setFormData({...formData, outcome: {...formData.outcome, treatment: {...formData.outcome.treatment, ar: e.target.value}}})} className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg rtl" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-neutral-950 font-semibold py-3 rounded-xl transition">
                            {editingId ? "Update Rule" : "Save New Rule"}
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-800 text-neutral-400">
                        <tr>
                            <th className="p-4">Rule ID</th>
                            <th className="p-4">Condition (Symptoms)</th>
                            <th className="p-4">Weight</th>
                            <th className="p-4">Risk Outcome</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700/50">
                        {rules.map((rule) => (
                            <tr key={rule._id} className="text-neutral-300">
                                <td className="p-4 font-medium text-teal-400">{rule.ruleId}</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {rule.conditions?.symptoms?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 bg-neutral-700 rounded text-xs">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1">
                                        Requires at least {rule.conditions?.minCount || 1} match
                                    </div>
                                </td>
                                <td className="p-4">{rule.weight}</td>
                                <td className="p-4">
                                    <span className={"px-2 py-1 rounded text-xs font-semibold " + (
                                        rule.outcome?.risk === 'Critical' ? 'bg-rose-500/20 text-rose-400' 
                                        : rule.outcome?.risk === 'High' ? 'bg-orange-500/20 text-orange-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                    )}>
                                        {rule.outcome?.risk}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-3">
                                    <button 
                                        onClick={() => handleEdit(rule)}
                                        className="text-teal-400 hover:text-teal-300"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteRule(rule._id)}
                                        className="text-rose-400 hover:text-rose-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rules.length === 0 && (
                    <div className="p-8 text-center text-neutral-500">No active rules found.</div>
                )}
            </div>
        </div>
    );
}
