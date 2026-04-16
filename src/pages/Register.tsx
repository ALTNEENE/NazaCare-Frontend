import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/stores/languageStore";
import { useLanguageStore } from "@/stores/languageStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

/** Password strength evaluator */
function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
    width: string;
} {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const configs = [
        { label: "weak", color: "bg-red-400", width: "w-1/4" },
        { label: "fair", color: "bg-amber-400", width: "w-2/4" },
        { label: "good", color: "bg-blue-400", width: "w-3/4" },
        { label: "strong", color: "bg-green-500", width: "w-full" },
    ];

    const config = configs[Math.max(0, score - 1)] || configs[0];
    return { score, ...config };
}

export function RegisterPage() {
    const { t, language } = useTranslation();
    const { setLanguage } = useLanguageStore();
    const { register: registerUser, isLoading, error: apiError } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();
    const [watchedPassword, setWatchedPassword] = useState("");

    const baseSchema = useMemo(
        () =>
            z.object({
                fullName: z
                    .string()
                    .min(1, t("auth.validation.nameRequired"))
                    .min(2, t("auth.validation.nameMin")),
                email: z
                    .string()
                    .min(1, t("auth.validation.emailRequired"))
                    .email(t("auth.validation.emailInvalid")),
                password: z
                    .string()
                    .min(1, t("auth.validation.passwordRequired"))
                    .min(3, t("auth.validation.passwordMin")),
                confirmPassword: z.string().min(1, t("auth.validation.confirmRequired")),
            }),
        [t]
    );

    const schema = useMemo(
        () =>
            baseSchema.refine((data) => data.password === data.confirmPassword, {
                message: t("auth.validation.passwordsMismatch"),
                path: ["confirmPassword"],
            }),
        [baseSchema, t]
    );

    type FormValues = {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const passwordStrength = getPasswordStrength(watchedPassword);

    const onSubmit = async (data: FormValues) => {
        try {
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                languagePreference: language,
            });
            addToast({ type: "success", message: t("auth.registerSuccess") });
            // User is now auto-authenticated — go complete health profile
            navigate("/health-profile", { state: { fromRegister: true } });
        } catch {
            addToast({ type: "error", message: apiError || "Registration failed." });
        }
    };

    return (
        <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-medical shadow-lg">
                    <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">{t("auth.registerTitle")}</CardTitle>
                <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {/* Full Name */}
                    <Input
                        label={t("auth.fullName")}
                        placeholder={t("auth.fullNamePlaceholder")}
                        icon={<User className="h-4 w-4" />}
                        error={errors.fullName?.message}
                        autoComplete="name"
                        {...register("fullName")}
                    />

                    {/* Email */}
                    <Input
                        label={t("auth.email")}
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        icon={<Mail className="h-4 w-4" />}
                        error={errors.email?.message}
                        autoComplete="email"
                        {...register("email")}
                    />

                    {/* Password */}
                    <div className="space-y-2">
                        <Input
                            label={t("auth.password")}
                            type="password"
                            placeholder={t("auth.passwordPlaceholder")}
                            icon={<Lock className="h-4 w-4" />}
                            error={errors.password?.message}
                            autoComplete="new-password"
                            {...register("password", {
                                onChange: (e) => setWatchedPassword(e.target.value),
                            })}
                        />
                        {watchedPassword && (
                            <div className="space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    {t(`auth.passwordStrength.${passwordStrength.label}`)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <Input
                        label={t("auth.confirmPassword")}
                        type="password"
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        icon={<Lock className="h-4 w-4" />}
                        error={errors.confirmPassword?.message}
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />

                    {/* Language preference */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                            {t("auth.languagePreference")}
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setLanguage("en")}
                                className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all cursor-pointer ${language === "en"
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage("ar")}
                                className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-all cursor-pointer ${language === "ar"
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                العربية
                            </button>
                        </div>
                    </div>

                    {/* API error */}
                    {apiError && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        {t("auth.registerButton")}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center">
                <p className="text-sm text-slate-500">
                    {t("auth.hasAccount")}{" "}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                        {t("auth.signInLink")}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
