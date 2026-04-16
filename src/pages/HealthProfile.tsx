import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/stores/languageStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Heart,
    Ruler,
    Weight,
    Droplets,
    User,
    Bell,
    BellOff,
    CheckCircle2,
    Stethoscope,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const REMINDER_KEY = "nazacare-health-reminder";

interface ReminderData {
    remindAt: number;
    intervalDays: number;
}

export function getReminderData(): ReminderData | null {
    try {
        const raw = localStorage.getItem(REMINDER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function HealthProfilePage() {
    const { t, language } = useTranslation();
    const isRTL = language === "ar";
    const { user, updateHealthProfile, isLoading } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if this is the initial setup (came from registration) or an edit
    const isSetup = location.state?.fromRegister === true || !user?.age;

    // Reminder state
    const [reminderDays, setReminderDays] = useState<number>(() => {
        const data = getReminderData();
        return data?.intervalDays ?? 30;
    });
    const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
        return !!getReminderData();
    });

    const schema = useMemo(
        () =>
            z.object({
                age: z.coerce
                    .number({ message: t("auth.validation.ageRequired") })
                    .min(1, t("auth.validation.ageRange"))
                    .max(120, t("auth.validation.ageRange")),
                gender: z.string().min(1, t("auth.validation.genderRequired")),
                height: z.coerce
                    .number({ message: t("auth.validation.heightRequired") })
                    .min(30, t("auth.validation.heightRange"))
                    .max(300, t("auth.validation.heightRange")),
                weight: z.coerce
                    .number({ message: t("auth.validation.weightRequired") })
                    .min(1, t("auth.validation.weightRange"))
                    .max(300, t("auth.validation.weightRange")),
                bloodType: z.string().min(1, t("auth.validation.bloodTypeRequired")),
            }),
        [t]
    );

    type FormValues = {
        age: number;
        gender: string;
        height: number;
        weight: number;
        bloodType: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            age: user?.age ?? ("" as unknown as number),
            gender: user?.gender ?? "",
            height: user?.height ?? ("" as unknown as number),
            weight: user?.weight ?? ("" as unknown as number),
            bloodType: user?.bloodType ?? "",
        },
    });

    // Pre-fill when user changes (e.g. store hydrated after mount)
    useEffect(() => {
        if (user?.age) setValue("age", user.age);
        if (user?.gender) setValue("gender", user.gender);
        if (user?.height) setValue("height", user.height);
        if (user?.weight) setValue("weight", user.weight);
        if (user?.bloodType) setValue("bloodType", user.bloodType);
    }, [user, setValue]);

    const watchedBloodType = watch("bloodType");
    const watchedGender = watch("gender");

    const saveReminder = (enabled: boolean, days: number) => {
        if (enabled && days > 0) {
            const data: ReminderData = {
                remindAt: Date.now() + days * 86400000,
                intervalDays: days,
            };
            localStorage.setItem(REMINDER_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(REMINDER_KEY);
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            await updateHealthProfile({
                age: data.age,
                gender: data.gender,
                height: data.height,
                weight: data.weight,
                bloodType: data.bloodType,
            });
            saveReminder(reminderEnabled, reminderDays);
            addToast({
                type: "success",
                message: isRTL ? "تم حفظ معلوماتك الصحية بنجاح" : "Health profile saved successfully!",
            });
            navigate("/diagnosis");
        } catch {
            addToast({
                type: "error",
                message: isRTL ? "فشل حفظ البيانات" : "Failed to save health profile.",
            });
        }
    };

    const inputCls =
        "w-full rounded-xl border-2 px-3 py-2.5 text-sm transition-all focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

    const bloodTypes = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-medical shadow-lg">
                    <Heart className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isSetup
                        ? isRTL ? "أكمل ملفك الصحي" : "Complete Your Health Profile"
                        : isRTL ? "تعديل الملف الصحي" : "Edit Health Profile"}
                </h1>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    {isSetup
                        ? isRTL
                            ? "أضف معلوماتك الصحية لتحسين دقة التشخيص. يمكنك تعديلها في أي وقت."
                            : "Add your health info to improve diagnosis accuracy. You can edit this anytime."
                        : isRTL
                            ? "حدّث بياناتك الصحية ليظل التشخيص دقيقًا."
                            : "Keep your health data up to date for accurate diagnoses."}
                </p>
            </div>

            {/* Progress indicator for setup */}
            {isSetup && (
                <div className="flex items-center gap-2 justify-center">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-8 rounded-full bg-primary-500" />
                        <span className="text-xs text-slate-400">
                            {isRTL ? "إنشاء الحساب" : "Account"}
                        </span>
                    </div>
                    <div className="h-px w-6 bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-8 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-xs font-semibold text-primary-600">
                            {isRTL ? "البيانات الصحية" : "Health Info"}
                        </span>
                    </div>
                    <div className="h-px w-6 bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-8 rounded-full bg-slate-200" />
                        <span className="text-xs text-slate-400">
                            {isRTL ? "التشخيص" : "Diagnose"}
                        </span>
                    </div>
                </div>
            )}

            <Card className="border-0 shadow-xl">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary-500" />
                        <CardTitle className="text-base">
                            {isRTL ? "المعلومات الصحية" : "Health Information"}
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {isRTL
                            ? "هذه المعلومات تساعدنا على تقديم تشخيص أكثر دقة."
                            : "This information helps us provide a more accurate diagnosis."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <User className="h-3.5 w-3.5 text-primary-500" />
                                    {t("auth.age")}
                                </label>
                                <Input
                                    type="number"
                                    placeholder={t("auth.agePlaceholder")}
                                    error={errors.age?.message}
                                    min="1"
                                    max="120"
                                    step="1"
                                    {...register("age")}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <User className="h-3.5 w-3.5 text-primary-500" />
                                    {t("auth.gender")}
                                </label>
                                <div className="flex gap-2">
                                    {[
                                        { value: "male", label: isRTL ? "ذكر" : "Male" },
                                        { value: "female", label: isRTL ? "أنثى" : "Female" },
                                    ].map((g) => (
                                        <button
                                            key={g.value}
                                            type="button"
                                            onClick={() => setValue("gender", g.value)}
                                            className={cn(
                                                "flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all",
                                                watchedGender === g.value
                                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            {g.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.gender && (
                                    <p className="text-xs text-red-500">{errors.gender.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Height & Weight */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <Ruler className="h-3.5 w-3.5 text-primary-500" />
                                    {t("auth.height")} <span className="text-slate-400 text-xs">(cm)</span>
                                </label>
                                <Input
                                    type="number"
                                    placeholder={t("auth.heightPlaceholder")}
                                    error={errors.height?.message}
                                    min="30"
                                    max="300"
                                    step="1"
                                    {...register("height")}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <Weight className="h-3.5 w-3.5 text-primary-500" />
                                    {t("auth.weight")} <span className="text-slate-400 text-xs">(kg)</span>
                                </label>
                                <Input
                                    type="number"
                                    placeholder={t("auth.weightPlaceholder")}
                                    error={errors.weight?.message}
                                    min="1"
                                    max="300"
                                    step="0.1"
                                    {...register("weight")}
                                />
                            </div>
                        </div>

                        {/* Blood Type */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                <Droplets className="h-3.5 w-3.5 text-red-400" />
                                {t("auth.bloodType")}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {bloodTypes.map((bt) => (
                                    <button
                                        key={bt}
                                        type="button"
                                        onClick={() => setValue("bloodType", bt)}
                                        className={cn(
                                            "rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                                            watchedBloodType === bt
                                                ? "border-red-400 bg-red-50 text-red-700"
                                                : "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50/50"
                                        )}
                                    >
                                        {bt}
                                    </button>
                                ))}
                            </div>
                            {/* Hidden input to register the value */}
                            <input type="hidden" {...register("bloodType")} />
                            {errors.bloodType && (
                                <p className="text-xs text-red-500">{errors.bloodType.message}</p>
                            )}
                        </div>

                        {/* ── Reminder Section ── */}
                        <div className={cn(
                            "rounded-xl border-2 p-4 space-y-3 transition-colors",
                            reminderEnabled ? "border-primary-200 bg-primary-50/50" : "border-slate-200 bg-slate-50"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {reminderEnabled
                                        ? <Bell className="h-4 w-4 text-primary-500" />
                                        : <BellOff className="h-4 w-4 text-slate-400" />}
                                    <span className="text-sm font-semibold text-slate-700">
                                        {isRTL ? "تذكير للتحديث" : "Update Reminder"}
                                    </span>
                                </div>
                                {/* Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setReminderEnabled((v) => !v)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                        reminderEnabled ? "bg-primary-500" : "bg-slate-300"
                                    )}
                                    aria-checked={reminderEnabled}
                                    role="switch"
                                >
                                    <span
                                        className={cn(
                                            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                                            reminderEnabled ? "translate-x-6" : "translate-x-1"
                                        )}
                                    />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500">
                                {isRTL
                                    ? "سنذكّرك بتحديث وزنك وطولك بعد مرور المدة المحددة."
                                    : "We'll remind you to update your weight and height after the set period."}
                            </p>

                            {reminderEnabled && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-600 whitespace-nowrap">
                                        {isRTL ? "كل" : "Every"}
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={reminderDays}
                                        onChange={(e) => setReminderDays(Number(e.target.value))}
                                        className="w-20 rounded-lg border-2 border-primary-200 bg-white px-3 py-1.5 text-sm font-medium text-center focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                    />
                                    <span className="text-sm text-slate-600">
                                        {isRTL ? "يوم" : "days"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            <CheckCircle2 className="h-4 w-4" />
                            {isSetup
                                ? isRTL ? "حفظ والانتقال للتشخيص" : "Save & Start Diagnosing"
                                : isRTL ? "حفظ التغييرات" : "Save Changes"}
                        </Button>

                        {/* Skip option (only for setup, not edit) */}
                        {isSetup && (
                            <button
                                type="button"
                                onClick={() => navigate("/diagnosis")}
                                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
                            >
                                {isRTL ? "تخطي الآن، سأكملها لاحقًا" : "Skip for now, I'll fill this later"}
                            </button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
