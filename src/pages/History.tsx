import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDiagnosisStore, type DiagnosisResult } from "@/stores/diagnosisStore";
import { useTranslation } from "@/stores/languageStore";
import { HistoryCard } from "@/components/HistoryCard";
import { RiskBadge } from "@/components/RiskBadge";
import { DoctorModal } from "@/components/DoctorModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, cn } from "@/lib/utils";
import {
    History as HistoryIcon,
    Filter,
    ArrowUpDown,
    Stethoscope,
    X,
    TrendingUp,
    Calendar,
    FileText,
    Bot,
    Share,
    Printer,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { useToastStore } from "@/stores/toastStore";
import { stripMarkdown } from "./Diagnosis";

type RiskFilter = "all" | "low" | "moderate" | "high";
type SortOrder = "newest" | "oldest";

export function HistoryPage() {
    const { t, language } = useTranslation();
    const { currentResult, history, isHistoryLoading, fetchHistory } = useDiagnosisStore();
    const navigate = useNavigate();
    const addToast = useToastStore((s) => s.addToast);
    const isRTL = language === "ar";

    const [filter, setFilter] = useState<RiskFilter>("all");
    const [sort, setSort] = useState<SortOrder>("newest");
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResult | null>(null);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Filter + sort
    const filteredHistory = useMemo(() => {
        let items = [...history];
        if (filter !== "all") {
            items = items.filter((d) => d.risk.toLowerCase() === filter);
        }
        items.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sort === "newest" ? dateB - dateA : dateA - dateB;
        });
        return items;
    }, [history, filter, sort]);

    const buildReportText = () => {
        if (!currentResult) return "";
        const lines = [
            `NazaCare — ${t("diagnosis.resultTitle")}`,
            `${"-".repeat(40)}`,
            `${t("diagnosis.riskLevel")}: ${currentResult.risk}`,
            `${t("diagnosis.diagnosis")}: ${resultMessage}`,
            `${t("diagnosis.treatment")}: ${resultTreatment}`,
        ];
        if (resultRecommendations?.length) {
            lines.push(`\n${t("diagnosis.recommendation")}:`);
            resultRecommendations.forEach((r) => {
                const text = r?.[language as "en" | "ar"] || r?.en || "";
                if (text) lines.push(`  - ${text}`);
            });
        }
        if (narrativeResponse) {
            lines.push(`\n${t("diagnosis.narrativeTitle")}:\n${narrativeResponse}`);
        }
        lines.push(`\n${new Date().toLocaleString()}`);
        return lines.join("\n");
    };

    const handleShare = async () => {
        const text = buildReportText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "NazaCare " + t("diagnosis.resultTitle"),
                    text,
                });
            } catch {
                // user cancelled
            }
        } else {
            await navigator.clipboard.writeText(text);
            addToast({ type: "success", message: isRTL ? "تم نسخ التقرير إلى الحافظة" : "Report copied to clipboard" });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBookDoctor = () => {
        setIsDoctorModalOpen(true);
    };

    // Chart data
    const chartData = useMemo(() => {
        const sorted = [...history].sort(
            (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
        return sorted.map((d, i) => ({
            name: d.createdAt ? formatDate(d.createdAt, language) : `#${i + 1}`,
            confidence: Math.round(d.confidence * 100),
            riskValue:
                d.risk.toLowerCase() === "high" ? 3 : d.risk.toLowerCase() === "moderate" ? 2 : 1,
            risk: d.risk,
        }));
    }, [history, language]);

    const filterOptions: { key: RiskFilter; label: string }[] = [
        { key: "all", label: t("history.filterAll") },
        { key: "low", label: t("history.filterLow") },
        { key: "moderate", label: t("history.filterModerate") },
        { key: "high", label: t("history.filterHigh") },
    ];

    const resultMessage =
        stripMarkdown(selectedDiagnosis?.message?.[language as "en" | "ar"] || selectedDiagnosis?.message?.en || "");
    const resultRecommendations =
        (selectedDiagnosis?.recommendations);
    const resultTreatment =
        stripMarkdown(selectedDiagnosis?.treatment?.[language as "en" | "ar"] || selectedDiagnosis?.treatment?.en || "");
    const narrativeResponse =
        stripMarkdown(selectedDiagnosis?.narrativeResponse?.[language as "en" | "ar"] ||
            selectedDiagnosis?.narrativeResponse?.en ||
            "");

    console.log("selectedDiagnosis", selectedDiagnosis?.diseaseProbabilities);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-medical shadow-md">
                        <HistoryIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t("history.title")}</h1>
                        <p className="text-sm text-slate-500">{t("history.subtitle")}</p>
                    </div>
                </div>
                <Button onClick={() => navigate("/diagnosis")} size="md">
                    <Stethoscope className="h-4 w-4" />
                    {t("history.goToDiagnosis")}
                </Button>
            </div>

            {/* Loading state */}
            {isHistoryLoading && (
                <div className="flex items-center justify-center py-16">
                    <div className="h-10 w-10 rounded-full border-4 border-primary-100 animate-spin-slow border-t-primary-500" />
                </div>
            )}

            {/* Empty state */}
            {!isHistoryLoading && history.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                            <HistoryIcon className="h-10 w-10 text-primary-300" />
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs">{t("history.noHistory")}</p>
                        <Button onClick={() => navigate("/diagnosis")} className="mt-4" size="md">
                            <Stethoscope className="h-4 w-4" />
                            {t("history.goToDiagnosis")}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Content (charts + list) */}
            {!isHistoryLoading && history.length > 0 && (
                <>
                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center gap-6">
                        {/* Risk Trend */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary-500" />
                                    {t("history.chartRiskTrend")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                                            <YAxis
                                                domain={[0, 4]}
                                                ticks={[1, 2, 3]}
                                                tickFormatter={(v) =>
                                                    v === 1 ? "Low" : v === 2 ? "Mod" : v === 3 ? "High" : ""
                                                }
                                                tick={{ fontSize: 11 }}
                                                stroke="#94a3b8"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid #e2e8f0",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                                    fontSize: 12,
                                                }}
                                                formatter={(value) => {
                                                    const v = value as number;
                                                    return v === 1 ? "Low" : v === 2 ? "Moderate" : "High";
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="riskValue"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                fill="url(#riskGradient)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Filters & Sort */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Risk filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="h-4 w-4 text-slate-400" />
                            {filterOptions.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={cn(
                                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                                        filter === key
                                            ? "bg-primary-100 text-primary-700 shadow-sm"
                                            : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <button
                            onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            {sort === "newest" ? t("history.sortNewest") : t("history.sortOldest")}
                        </button>
                    </div>

                    {/* History list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredHistory.map((diagnosis, i) => (
                            <HistoryCard
                                key={diagnosis.id || i}
                                diagnosis={diagnosis}
                                onViewDetails={setSelectedDiagnosis}
                            />
                        ))}
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="text-center py-8 text-sm text-slate-400">
                            No results match the selected filter.
                        </div>
                    )}
                </>
            )}

            {/* Detail modal */}
            {selectedDiagnosis && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setSelectedDiagnosis(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {t("history.detailsTitle")}
                            </h2>
                            <button
                                onClick={() => setSelectedDiagnosis(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                                aria-label={t("history.close")}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-5 space-y-5">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {selectedDiagnosis.createdAt
                                        ? formatDate(selectedDiagnosis.createdAt, language)
                                        : "—"}
                                </span>
                            </div>

                            {/* Risk level + Confidence */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-slate-50 p-5">
                                {/* Risk badge */}
                                <div className="flex flex-col items-center justify-center gap-2 flex-1">
                                    <p className="text-xs text-slate-500">{t("history.riskLevel")}</p>
                                    <RiskBadge risk={selectedDiagnosis.risk} size="lg" />
                                </div>
                                {/* Confidence ring */}
                                <div className="flex flex-col items-center justify-center gap-2 flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0">
                                    <div className="relative h-16 w-16">
                                        <svg viewBox="0 0 36 36" className="h-full w-full">
                                            <path
                                                className="fill-none stroke-slate-200"
                                                strokeWidth="3"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <circle
                                                cx="18" cy="18" r="15.9155"
                                                fill="none"
                                                strokeWidth="3"
                                                strokeDasharray={`${Math.round(selectedDiagnosis.confidence * 100)} ${100 - Math.round(selectedDiagnosis.confidence * 100)}`}
                                                strokeLinecap="round"
                                                className={cn(
                                                    selectedDiagnosis.risk?.toLowerCase() === "high" ? "stroke-red-500" :
                                                        selectedDiagnosis.risk?.toLowerCase() === "moderate" ? "stroke-amber-500" :
                                                            "stroke-green-500"
                                                )}
                                                style={{ transition: 'stroke-dasharray 0.6s ease' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={cn(
                                                "text-xs font-bold",
                                                selectedDiagnosis.risk?.toLowerCase() === "high" ? "text-red-700" :
                                                    selectedDiagnosis.risk?.toLowerCase() === "moderate" ? "text-amber-700" :
                                                        "text-green-700"
                                            )}>
                                                {Math.round(selectedDiagnosis.confidence * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-center">{t("history.confidence") || "Confidence"}</p>
                                </div>
                            </div>

                            {/* Symptoms */}
                            {selectedDiagnosis.symptoms && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        {t("history.symptoms")}
                                    </div>
                                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                                        {selectedDiagnosis.symptoms}
                                    </p>
                                </div>
                            )}

                            {/* AI Narrative Summary */}
                            {narrativeResponse && (
                                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-primary-50 border border-blue-100 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-primary-600">
                                            <Bot className="h-3.5 w-3.5 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            {t("history.narrativeTitle")}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                        {narrativeResponse}
                                    </p>
                                </div>
                            )}


                            {/* Recommendation message
                            <div className="rounded-xl bg-primary-50 border border-primary-100 p-4">
                                <h3 className="text-sm font-semibold text-primary-800 mb-1">
                                    {t("diagnosis.diagnosis")}
                                </h3>
                                <p className="text-sm text-primary-700 leading-relaxed">{resultMessage}</p>

                            </div> */}

                            <div className="rounded-xl bg-greem-50 border border-primary-100 p-4">
                                <h3 className="text-sm font-semibold text-primary-800 mb-1">
                                    {t("diagnosis.recommendation")}
                                </h3>
                                {/* <p className="text-sm text-primary-700 leading-relaxed">{resultMessage}</p> */}
                                {
                                    resultRecommendations && resultRecommendations?.map((recommendation, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm text-primary-700 leading-relaxed">-</span>
                                            <p className="text-sm text-primary-700 leading-relaxed">
                                                {recommendation?.[language as "en" | "ar"] || recommendation?.en || ""}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="rounded-xl bg-green-100 border border-green-100 p-4">
                                <h3 className="text-sm font-semibold text-green-600 mb-1">
                                    {t("diagnosis.treatment")}
                                </h3>
                                {/* <p className="text-sm text-primary-700 leading-relaxed">{resultMessage}</p> */}
                                <p className="text-sm text-green-600 leading-relaxed">{resultTreatment}</p>

                            </div>
                        </div>

                        <div className="inline-block items-center">
                            <div className="flex w-auto border-b border-gray-300 gap-2 items-center justify-between">
                                <Button variant={"ghost"} onClick={handleShare} title={isRTL ? "مشاركة" : "Share"}><Share /></Button>
                                <Button variant={"ghost"} onClick={handlePrint} title={isRTL ? "طباعة" : "Print"}><Printer /></Button>
                                <Button variant={"ghost"} onClick={handleBookDoctor}>{isRTL ? "حجز طبيب" : "Book Doctor"}</Button>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="p-5 border-t border-slate-100">
                            <Button
                                onClick={() => setSelectedDiagnosis(null)}
                                variant="outline"
                                className="w-full"
                            >
                                {t("history.close")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <DoctorModal
                isOpen={isDoctorModalOpen}
                onClose={() => setIsDoctorModalOpen(false)}
            />
        </div>
    );
}
