import type { DiagnosisResult } from "@/stores/diagnosisStore";
import { useTranslation } from "@/stores/languageStore";
import { formatDate } from "@/lib/utils";
import { RiskBadge } from "./RiskBadge";
import { Calendar, Activity, FileText } from "lucide-react";

interface HistoryCardProps {
    diagnosis: DiagnosisResult;
    onViewDetails: (diagnosis: DiagnosisResult) => void;
}

export function HistoryCard({ diagnosis, onViewDetails }: HistoryCardProps) {
    const { t, language } = useTranslation();

    const message = diagnosis.message?.[language as "en" | "ar"] || diagnosis.message?.en || "";
    const dateStr = diagnosis.createdAt ? formatDate(diagnosis.createdAt, language) : "—";

    return (
        <button
            onClick={() => onViewDetails(diagnosis)}
            className="w-full text-start rounded-2xl bg-white border border-slate-100 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 cursor-pointer group"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dateStr}</span>
                    </div>

                    {/* Symptoms preview */}
                    {diagnosis.symptoms && (
                        <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-700 line-clamp-2">{diagnosis.symptoms}</p>
                        </div>
                    )}

                    {/* Message preview */}
                    <p className="text-sm text-slate-500 line-clamp-1">{message}</p>

                    {/* Confidence */}
                    <div className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-primary-500" />
                        <span className="text-xs text-slate-600">
                            {t("history.confidence")}: {Math.round(diagnosis.confidence * 100)}%
                        </span>
                    </div>
                </div>

                {/* Risk badge */}
                <div className="shrink-0">
                    <RiskBadge risk={diagnosis.risk} size="sm" />
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
                <span className="text-xs text-primary-500 font-medium group-hover:text-primary-700 transition-colors">
                    {t("history.viewDetails")} →
                </span>
            </div>
        </button>
    );
}
