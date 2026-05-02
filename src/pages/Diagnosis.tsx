import { useState } from "react";
import { useDiagnosisStore } from "@/stores/diagnosisStore";
import { useTranslation } from "@/stores/languageStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { DoctorModal } from "@/components/DoctorModal";
import {
    Stethoscope,
    Send,
    AlertTriangle,
    MessageSquareText,
    RotateCcw,
    Sparkles,
    Share,
    Printer,
    CalendarDays,
    Activity,
    ChevronDown,
    ChevronUp,
    FlaskConical,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const stripMarkdown = (text: string) => {
    if (!text) return "";
    return text
        .replace(/\*\*/g, "")
        .replace(/^-\s*$/gm, "")
        .replace(/^-\s*/gm, "")
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();
};

// ─── Symptom definitions ───────────────────────────────────────
const SYMPTOM_OPTIONS = [
    "high_fever",
    "severe_headache",
    "headache",
    "retro_orbital_pain",
    "joint_pain",
    "muscle_pain",
    "rash",
    "bleeding",
    "nausea",
    "vomiting",
    "chills",
    "sweating",
] as const;

type SymptomKey = (typeof SYMPTOM_OPTIONS)[number];

// Maps symptom keys to natural-language phrases sent to the NLP backend
const SYMPTOM_PHRASES: Record<string, string> = {
    high_fever: "high fever",
    severe_headache: "severe headache",
    retro_orbital_pain: "pain behind the eyes",
    joint_pain: "joint pain",
    muscle_pain: "muscle pain and body aches",
    rash: "skin rash with red spots",
    bleeding: "bleeding and bruising",
    nausea: "nausea",
    vomiting: "vomiting",
    chills: "chills and shivering",
    sweating: "excessive sweating",
    headache: "headache",
};

const FEVER_MIN_F = 98.6;
const FEVER_MAX_F = 106;

function feverPercentToFahrenheit(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent));
    return Math.round((FEVER_MIN_F + (clamped / 100) * (FEVER_MAX_F - FEVER_MIN_F)) * 10) / 10;
}

// ─── CheckDetailsPanel component ───────────────────────────────
type CheckResult = "positive" | "negative" | "unknown" | "";
interface CheckDetails {
    result: CheckResult;
    platelets: string;
    wbc: string;
    hematocrit: string;
    notes: string;
}

function CheckDetailsPanel({
    label,
    accentColor,
    details,
    onChange,
    t,
}: {
    label: string;
    accentColor: string;
    details: CheckDetails;
    onChange: (d: CheckDetails) => void;
    t: (key: string) => unknown;
}) {
    const [open, setOpen] = useState(true);
    const set = (key: keyof CheckDetails, value: string) =>
        onChange({ ...details, [key]: value });

    const inputCls =
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 " +
        "focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400";

    const resultOptions: { value: CheckResult; labelKey: string }[] = [
        { value: "", labelKey: "" },
        { value: "positive", labelKey: "diagnosis.checkResultPositive" },
        { value: "negative", labelKey: "diagnosis.checkResultNegative" },
        { value: "unknown", labelKey: "diagnosis.checkResultUnknown" },
    ];

    return (
        <div className={`rounded-xl border-2 overflow-hidden transition-colors duration-200 ${accentColor}`}>
            {/* Toggle header */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary-500" />
                    <span className="text-xs font-semibold text-slate-700">
                        {t("diagnosis.checkDetails") as string} — {label}
                    </span>
                </div>
                {open ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
            </button>

            {/* Fields */}
            {open && (
                <div className="px-4 pb-4 pt-1 space-y-3 bg-white/70">
                    {/* Result (+/-) */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">
                            {t("diagnosis.checkResult") as string}
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {resultOptions.slice(1).map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => set("result", details.result === opt.value ? "" : opt.value)}
                                    className={cn(
                                        "flex-1 min-w-[80px] rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-150",
                                        details.result === opt.value
                                            ? opt.value === "positive"
                                                ? "bg-red-100 border-red-400 text-red-700"
                                                : opt.value === "negative"
                                                    ? "bg-green-100 border-green-400 text-green-700"
                                                    : "bg-slate-200 border-slate-400 text-slate-700"
                                            : "bg-white border-slate-200 text-slate-500 hover:border-primary-300"
                                    )}
                                >
                                    {t(opt.labelKey) as string}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lab values row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">
                                {t("diagnosis.platelets") as string}
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={details.platelets}
                                onChange={(e) => set("platelets", e.target.value)}
                                placeholder={t("diagnosis.plateletsPlaceholder") as string}
                                className={inputCls}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">
                                {t("diagnosis.wbc") as string}
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={details.wbc}
                                onChange={(e) => set("wbc", e.target.value)}
                                placeholder={t("diagnosis.wbcPlaceholder") as string}
                                className={inputCls}
                            />
                        </div>
                        {/* <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">
                                {t("diagnosis.hematocrit") as string}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={details.hematocrit}
                                onChange={(e) => set("hematocrit", e.target.value)}
                                placeholder={t("diagnosis.hematocritPlaceholder") as string}
                                className={inputCls}
                            />
                        </div> */}
                    </div>

                    {/* Doctor notes */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <FileText className="h-3.5 w-3.5" />
                            {t("diagnosis.checkNotes") as string}
                        </label>
                        <textarea
                            rows={2}
                            value={details.notes}
                            onChange={(e) => set("notes", e.target.value)}
                            placeholder={t("diagnosis.checkNotesPlaceholder") as string}
                            className={inputCls + " resize-none"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function DiagnosisPage() {
    const { t, language } = useTranslation();
    const { currentResult, isLoading, submitDiagnosis, clearResult } = useDiagnosisStore();
    const addToast = useToastStore((s) => s.addToast);
    const isRTL = language === "ar";

    const [extraDetails, setExtraDetails] = useState("");
    const [lastDengueCheck, setLastDengueCheck] = useState("");
    const [lastMalariaCheck, setLastMalariaCheck] = useState("");
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [symptomChecked, setSymptomChecked] = useState<Record<SymptomKey, boolean>>(
        Object.fromEntries(SYMPTOM_OPTIONS.map((s) => [s, false])) as Record<SymptomKey, boolean>
    );
    const [isSymptomsOpen, setIsSymptomsOpen] = useState(true);

    // ── Checkup detail state ──────────────────────────────────
    const emptyDetails = (): CheckDetails => ({
        result: "", platelets: "", wbc: "", hematocrit: "", notes: "",
    });
    const [dengueDetails, setDengueDetails] = useState<CheckDetails>(emptyDetails());
    const [malariaDetails, setMalariaDetails] = useState<CheckDetails>(emptyDetails());

    // ── ML Disease Continuous Inputs ──────────────────────────
    const [diseaseData, setDiseaseData] = useState({
        fever: 0,
        headache: 0,
        cough: 0,
        fatigue: 0,
        body_pain: 0
    });

    // Build the combined symptoms string from checkboxes + textarea
    const buildSymptomsText = () => {
        const selectedSymptoms = SYMPTOM_OPTIONS.filter((s) => symptomChecked[s]).map(
            (s) => SYMPTOM_PHRASES[s] || s.replace(/_/g, " ")
        );
        return selectedSymptoms.join(", ");
    };

    const hasSliderInput = () => {
        return (
            feverPercentToFahrenheit(diseaseData.fever) > 99 ||
            diseaseData.headache > 0 ||
            diseaseData.cough > 0 ||
            diseaseData.fatigue > 0 ||
            diseaseData.body_pain > 0
        );
    };

    console.log("currentResult", currentResult);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasSliderInput()) {
            addToast({
                type: "error",
                message: isRTL
                    ? "يرجى رفع شريط الحمى فوق الطبيعي أو إدخال شدة عرض واحد على الأقل"
                    : "Please raise fever above normal or set at least one severity slider before analysis",
            });
            return;
        }
        const symptomsText = buildSymptomsText();
        // Collect the raw symptom keys from checked checkboxes (language-independent)
        const selectedKeys = SYMPTOM_OPTIONS.filter((s) => symptomChecked[s]) as string[];

        // Build supplemental context from checkup details for backend
        const buildCheckContext = (label: string, date: string, d: ReturnType<typeof emptyDetails>) => {
            if (!date) return "";
            const parts: string[] = [`${label} on ${date}`];
            if (d.result) parts.push(`result: ${d.result}`);
            if (d.platelets) parts.push(`platelets: ${d.platelets}×10³/µL`);
            if (d.wbc) parts.push(`WBC: ${d.wbc}×10³/µL`);
            if (d.hematocrit) parts.push(`hematocrit: ${d.hematocrit}%`);
            if (d.notes) parts.push(`notes: ${d.notes}`);
            return parts.join(", ");
        };
        const dengueCtx = buildCheckContext("Dengue checkup", lastDengueCheck, dengueDetails);
        const malariaCtx = buildCheckContext("Malaria checkup", lastMalariaCheck, malariaDetails);
        const checkupContext = [dengueCtx, malariaCtx].filter(Boolean).join(". ");
        const fullText = [symptomsText, checkupContext, extraDetails.trim()]
            .filter(Boolean).join(". ");
        const modelDiseaseData = {
            ...diseaseData,
            fever: feverPercentToFahrenheit(diseaseData.fever),
        };

        console.log("Full Text:", fullText)
        try {
            const labData = {
                platelets: dengueDetails.platelets || undefined,
                wbc: dengueDetails.wbc || undefined,
                result: dengueDetails.result || undefined,
            };
            await submitDiagnosis(
                fullText,
                language,
                lastDengueCheck || null,
                lastMalariaCheck || null,
                selectedKeys,
                labData,
                modelDiseaseData
            );
        } catch {
            addToast({ type: "error", message: t("common.error") });
        }
    };

    const handleNewAssessment = () => {
        clearResult();
        setExtraDetails("");
        setLastDengueCheck("");
        setLastMalariaCheck("");
        setDengueDetails(emptyDetails());
        setMalariaDetails(emptyDetails());
        setSymptomChecked(
            Object.fromEntries(SYMPTOM_OPTIONS.map((s) => [s, false])) as Record<SymptomKey, boolean>
        );
        setDiseaseData({ fever: 0, headache: 0, cough: 0, fatigue: 0, body_pain: 0 });
    };

    const buildReportText = () => {
        if (!currentResult) return "";
        const lines = [
            `NazaCare — ${t("diagnosis.resultTitle")}`,
            `${"-".repeat(40)}`,
            `${t("diagnosis.riskLevel")}: ${currentResult.risk}`,
            ...(currentResult.predictedDisease ? [`Predicted Condition: ${currentResult.predictedDisease}`] : []),
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

    const isHighRisk = currentResult?.risk?.toLowerCase() === "high";
    const confidencePercent = currentResult ? Math.round(currentResult.confidence * 100) : 0;
    const resultMessage = stripMarkdown(
        currentResult?.message?.[language as "en" | "ar"] || currentResult?.message?.en || ""
    );
    const resultRecommendations = currentResult?.recommendations;
    const resultTreatment = stripMarkdown(
        currentResult?.treatment?.[language as "en" | "ar"] || currentResult?.treatment?.en || ""
    );
    const narrativeResponse = stripMarkdown(
        currentResult?.narrativeResponse?.[language as "en" | "ar"] ||
        currentResult?.narrativeResponse?.en ||
        ""
    );

    // ── Symptom Checkbox Group Component ─────────────────────
    const SymptomCheckboxGroup = ({
        title,
        icon,
        symptoms,
        checked,
        onToggle,
        isOpen,
        onToggleOpen,
        accentColor,
    }: {
        title: string;
        icon: React.ReactNode;
        symptoms: readonly string[];
        checked: Record<string, boolean>;
        onToggle: (key: string) => void;
        isOpen: boolean;
        onToggleOpen: () => void;
        accentColor: string;
    }) => {
        const selectedCount = symptoms.filter((s) => checked[s]).length;
        return (
            <div className={`rounded-xl border-2 overflow-hidden ${selectedCount > 0 ? accentColor : "border-slate-200"} transition-colors duration-200`}>
                {/* Header */}
                <button
                    type="button"
                    onClick={onToggleOpen}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-sm font-semibold text-slate-700">{title}</span>
                        {selectedCount > 0 && (
                            <span className="text-xs font-bold bg-primary-100 text-primary-700 rounded-full px-2 py-0.5">
                                {selectedCount}
                            </span>
                        )}
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                </button>

                {/* Checkbox grid */}
                {isOpen && (
                    <div className="px-4 pb-4 pt-2 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {symptoms.map((symptom) => {
                            const dengueLabels = t("diagnosis.dengueSymptomsList") as Record<string, string>;
                            const malariaLabels = t("diagnosis.malariaSymptomsList") as Record<string, string>;
                            const label = dengueLabels?.[symptom] || malariaLabels?.[symptom] || symptom.replace(/_/g, " ");
                            return (
                                <label
                                    key={symptom}
                                    className={cn(
                                        "flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm border transition-all duration-150",
                                        checked[symptom]
                                            ? "bg-primary-50 border-primary-300 text-primary-800 font-medium"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-primary-50/40"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked[symptom] || false}
                                        onChange={() => onToggle(symptom)}
                                        className="h-4 w-4 rounded border-slate-300 accent-primary-500 cursor-pointer"
                                    />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const severitySliderClass = cn(
        "w-full h-2 cursor-pointer appearance-none rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500",
        "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow-md",
        "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-slate-900 [&::-moz-range-thumb]:shadow-md"
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-medical shadow-md">
                    <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t("diagnosis.title")}</h1>
                    <p className="text-sm text-slate-500">{t("diagnosis.subtitle")}</p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{t("diagnosis.warning")}</p>
            </div>

            {/* Input form */}
            {!currentResult && (
                <Card className="border-0 shadow-xl">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Health check history */}
                            <div className="space-y-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-primary-500" />
                                    <span className="text-sm font-medium text-slate-700">
                                        {t("diagnosis.healthFields")}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{t("diagnosis.healthFieldsHint")}</p>

                                <div className="space-y-4">
                                    {/* ── Dengue checkup row ── */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-600">
                                            {t("diagnosis.lastDengueCheck")}
                                        </label>
                                        <input
                                            type="date"
                                            value={lastDengueCheck}
                                            onChange={(e) => {
                                                setLastDengueCheck(e.target.value);
                                                if (!e.target.value) setDengueDetails(emptyDetails());
                                            }}
                                            max={new Date().toISOString().split("T")[0]}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                        {/* Collapsible details panel */}
                                        {lastDengueCheck && (
                                            <CheckDetailsPanel
                                                label={t("diagnosis.lastDengueCheck") as string}
                                                accentColor="border-orange-300 bg-orange-50/60"
                                                details={dengueDetails}
                                                onChange={setDengueDetails}
                                                t={t}
                                            />
                                        )}
                                    </div>

                                    {/* ── Malaria checkup row ── */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-600">
                                            {t("diagnosis.lastMalariaCheck")}
                                        </label>
                                        <input
                                            type="date"
                                            value={lastMalariaCheck}
                                            onChange={(e) => {
                                                setLastMalariaCheck(e.target.value);
                                                if (!e.target.value) setMalariaDetails(emptyDetails());
                                            }}
                                            max={new Date().toISOString().split("T")[0]}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                        {/* Collapsible details panel */}
                                        {lastMalariaCheck && (
                                            <CheckDetailsPanel
                                                label={t("diagnosis.lastMalariaCheck") as string}
                                                accentColor="border-teal-300 bg-teal-50/60"
                                                details={malariaDetails}
                                                onChange={setMalariaDetails}
                                                t={t}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Section label */}
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mt-6">
                                <Activity className="h-4 w-4 text-primary-500" />
                                {t("diagnosis.selectSymptoms")}
                            </div>

                            {/* Continuous Disease Symptoms */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary-500" />
                                    {isRTL ? "مستوى الأعراض العام - مطلوب" : "General Severity - Required"}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {isRTL
                                        ? "ارفع شريط الحمى فوق الطبيعي أو حرك شدة عرض واحد على الأقل حتى يتمكن نموذج التنبؤ من تحديد المرض المحتمل."
                                        : "Raise fever above normal or set at least one symptom severity so the prediction model can identify the likely disease."}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 flex justify-between">
                                            <span>{isRTL ? "نسبة الحمى" : "Fever Severity"}</span>
                                            <span className="text-primary-600 font-bold">{diseaseData.fever}%</span>
                                        </label>
                                        <input type="range" min="0" max="100" step="1" value={diseaseData.fever}
                                            onChange={(e) => setDiseaseData({ ...diseaseData, fever: parseInt(e.target.value) })}
                                            className={severitySliderClass} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 flex justify-between">
                                            <span>{isRTL ? "حدة الصداع" : "Headache Severity"}</span>
                                            <span className="text-primary-600 font-bold">{diseaseData.headache}</span>
                                        </label>
                                        <input type="range" min="0" max="10" step="1" value={diseaseData.headache}
                                            onChange={(e) => setDiseaseData({ ...diseaseData, headache: parseInt(e.target.value) })}
                                            className={severitySliderClass} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 flex justify-between">
                                            <span>{isRTL ? "شدة السعال" : "Cough Severity"}</span>
                                            <span className="text-primary-600 font-bold">{diseaseData.cough}</span>
                                        </label>
                                        <input type="range" min="0" max="10" step="1" value={diseaseData.cough}
                                            onChange={(e) => setDiseaseData({ ...diseaseData, cough: parseInt(e.target.value) })}
                                            className={severitySliderClass} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 flex justify-between">
                                            <span>{isRTL ? "مستوى الإرهاق" : "Fatigue Level"}</span>
                                            <span className="text-primary-600 font-bold">{diseaseData.fatigue}</span>
                                        </label>
                                        <input type="range" min="0" max="10" step="1" value={diseaseData.fatigue}
                                            onChange={(e) => setDiseaseData({ ...diseaseData, fatigue: parseInt(e.target.value) })}
                                            className={severitySliderClass} />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-xs font-medium text-slate-600 flex justify-between">
                                            <span>{isRTL ? "ألم في العضلات / الجسم" : "Body / Muscle Pain"}</span>
                                            <span className="text-primary-600 font-bold">{diseaseData.body_pain}</span>
                                        </label>
                                        <input type="range" min="0" max="10" step="1" value={diseaseData.body_pain}
                                            onChange={(e) => setDiseaseData({ ...diseaseData, body_pain: parseInt(e.target.value) })}
                                            className={severitySliderClass} />
                                    </div>
                                </div>
                            </div>

                            {/* Additional symptom checkboxes */}
                            <SymptomCheckboxGroup
                                title={isRTL ? "أعراض إضافية" : "Additional Symptoms"}
                                icon={<Activity className="h-4 w-4 text-primary-500" />}
                                symptoms={SYMPTOM_OPTIONS}
                                checked={symptomChecked}
                                onToggle={(key) =>
                                    setSymptomChecked((prev) => ({ ...prev, [key]: !prev[key as SymptomKey] }))
                                }
                                isOpen={isSymptomsOpen}
                                onToggleOpen={() => setIsSymptomsOpen((v) => !v)}
                                accentColor="border-primary-300"
                            />

                            {/* Extra Details Textarea */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="extra-details-input"
                                    className="flex items-center gap-2 text-sm font-medium text-slate-700"
                                >
                                    <MessageSquareText className="h-4 w-4 text-primary-500" />
                                    {t("diagnosis.extraDetails")}
                                </label>
                                <textarea
                                    id="extra-details-input"
                                    value={extraDetails}
                                    onChange={(e) => setExtraDetails(e.target.value)}
                                    placeholder={t("diagnosis.extraDetailsPlaceholder") as string}
                                    rows={3}
                                    className={cn(
                                        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 resize-none",
                                        "placeholder:text-slate-400",
                                        "focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                    )}
                                    aria-label={t("diagnosis.extraDetails") as string}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                disabled={!hasSliderInput()}
                            >
                                {isLoading ? (
                                    <>{t("diagnosis.analyzing")}</>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        {t("diagnosis.submitButton")}
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Loading state */}
                        {isLoading && (
                            <div className="mt-6 flex flex-col items-center justify-center gap-3 py-8">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-primary-100 animate-spin-slow border-t-primary-500" />
                                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary-500" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">{t("diagnosis.analyzing")}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Result display */}
            {currentResult && (
                <div className="space-y-4 animate-slide-up">
                    {/* High risk alert */}
                    {isHighRisk && (
                        <div className="flex items-start gap-3 rounded-xl bg-red-50 border-2 border-red-300 p-4 text-sm text-red-800 font-medium shadow-sm">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                            <p>{t("diagnosis.highRiskAlert")}</p>
                        </div>
                    )}

                    {/* ── Narrative Response (ChatGPT-style) ── */}
                    {/* {narrativeResponse && (
                        <Card className="border-0 shadow-xl overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-blue-400 via-primary-500 to-teal-400" />
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-primary-600 shadow-sm">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {t("diagnosis.narrativeTitle")}
                                    </h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                                    {narrativeResponse}
                                </div>
                            </CardContent>
                        </Card>
                    )} */}

                    <Card className="border-0 shadow-xl overflow-hidden">
                        {/* Colored top bar indicating risk */}
                        <div
                            className={cn(
                                "h-2",
                                isHighRisk
                                    ? "bg-gradient-to-r from-red-400 to-red-600"
                                    : currentResult.risk?.toLowerCase() === "moderate"
                                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                        : "bg-gradient-to-r from-green-400 to-green-600"
                            )}
                        />

                        <CardContent className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {t("diagnosis.resultTitle")}
                                </h2>
                            </div>

                            {/* Risk level + Confidence */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-slate-50 p-5">
                                {/* Risk badge */}
                                <div className="flex flex-col items-center justify-center gap-2 flex-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                                        {t("diagnosis.riskLevel")}
                                    </span>
                                    <RiskBadge risk={currentResult.risk} size="lg" />
                                </div>

                                {/* Divider */}
                                <div className="hidden sm:block w-px h-16 bg-slate-200" />
                                <div className="block sm:hidden w-full h-px bg-slate-200" />

                                {/* Predicted Disease */}
                                {currentResult.predictedDisease && (
                                    <>
                                        <div className="flex flex-col items-center justify-center gap-2 flex-1">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                                                Predicted Condition
                                            </span>
                                            <div className="text-lg font-bold text-slate-800 text-center">
                                                {currentResult.predictedDisease}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="hidden sm:block w-px h-16 bg-slate-200" />
                                        <div className="block sm:hidden w-full h-px bg-slate-200" />
                                    </>
                                )}

                                {/* Confidence gauge */}
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        {isRTL ? "نسبة الثقة" : "Confidence"}
                                    </span>
                                    <div className="relative flex items-center justify-center">
                                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                            <circle
                                                cx="18" cy="18" r="15.9155"
                                                fill="none"
                                                strokeWidth="3"
                                                className="stroke-slate-200"
                                            />
                                            <circle
                                                cx="18" cy="18" r="15.9155"
                                                fill="none"
                                                strokeWidth="3"
                                                strokeDasharray={`${confidencePercent} ${100 - confidencePercent}`}
                                                strokeLinecap="round"
                                                className={cn(
                                                    isHighRisk ? "stroke-red-500" :
                                                        currentResult.risk?.toLowerCase() === "moderate" ? "stroke-amber-500" :
                                                            "stroke-green-500"
                                                )}
                                                style={{ transition: 'stroke-dasharray 0.6s ease' }}
                                            />
                                        </svg>
                                        <span className={cn(
                                            "absolute text-sm font-bold",
                                            isHighRisk ? "text-red-600" :
                                                currentResult.risk?.toLowerCase() === "moderate" ? "text-amber-600" :
                                                    "text-green-600"
                                        )}>
                                            {confidencePercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Risk message */}
                            {resultMessage && (
                                <div className={cn(
                                    "rounded-xl border p-4",
                                    isHighRisk
                                        ? "bg-red-50 border-red-200"
                                        : currentResult.risk?.toLowerCase() === "moderate"
                                            ? "bg-amber-50 border-amber-200"
                                            : "bg-green-50 border-green-200"
                                )}>
                                    <h3 className={cn(
                                        "text-sm font-semibold mb-1",
                                        isHighRisk ? "text-red-800" :
                                            currentResult.risk?.toLowerCase() === "moderate" ? "text-amber-800" :
                                                "text-green-800"
                                    )}>
                                        {isRTL ? "ملخص التشخيص" : "Diagnosis Summary"}
                                    </h3>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        isHighRisk ? "text-red-700" :
                                            currentResult.risk?.toLowerCase() === "moderate" ? "text-amber-700" :
                                                "text-green-700"
                                    )}>
                                        {resultMessage}
                                    </p>
                                </div>
                            )}

                            <div className="rounded-xl bg-primary-50 border border-primary-100 p-4">
                                <h3 className="text-sm font-semibold text-primary-800 mb-1">
                                    {t("diagnosis.recommendation")}
                                </h3>
                                {
                                    resultRecommendations && resultRecommendations?.map((recommendation, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm text-primary-700 leading-relaxed">-</span>
                                            <p className="text-sm text-primary-700 leading-relaxed">
                                                {stripMarkdown(recommendation?.[language as "en" | "ar"] || recommendation?.en || "")}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                                <h3 className="text-sm font-semibold text-green-800 mb-1">
                                    {t("diagnosis.treatment")}
                                </h3>
                                <p className="text-sm text-green-700 leading-relaxed">{resultTreatment}</p>
                            </div>

                            <div className="inline-block items-center">
                                <div className="flex w-auto border-b border-gray-300 gap-2 items-center justify-between">
                                    <Button variant={"ghost"} onClick={handleShare} title={isRTL ? "مشاركة" : "Share"}><Share /></Button>
                                    <Button variant={"ghost"} onClick={handlePrint} title={isRTL ? "طباعة" : "Print"}><Printer /></Button>
                                    <Button variant={"ghost"} onClick={handleBookDoctor}>{isRTL ? "حجز طبيب" : "Book Doctor"}</Button>
                                </div>
                            </div>
                            {/* New assessment button */}
                            <Button
                                onClick={handleNewAssessment}
                                variant="outline"
                                className="w-full"
                                size="lg"
                            >
                                <RotateCcw className="h-4 w-4" />
                                {t("diagnosis.newAssessment")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            <DoctorModal
                isOpen={isDoctorModalOpen}
                onClose={() => setIsDoctorModalOpen(false)}
            />
        </div>
    );
}
