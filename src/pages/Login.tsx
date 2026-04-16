import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, Stethoscope } from "lucide-react";
import { useMemo } from "react";

export function LoginPage() {
    const { t } = useTranslation();
    const { login, isLoading, error: apiError } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();
    const location = useLocation();

    // Where to go after login (default: /diagnosis)
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/diagnosis";

    const schema = useMemo(
        () =>
            z.object({
                email: z
                    .string()
                    .min(1, t("auth.validation.emailRequired"))
                    .email(t("auth.validation.emailInvalid")),
                password: z
                    .string()
                    .min(1, t("auth.validation.passwordRequired")),
                rememberMe: z.boolean().optional(),
            }),
        [t]
    );

    type FormValues = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await login(data.email, data.password, data.rememberMe);
            addToast({ type: "success", message: "Welcome back!" });
            navigate(from, { replace: true });
        } catch {
            addToast({ type: "error", message: apiError || "Login failed." });
        }
    };

    return (
        <Card className="border-0 shadow-xl hover:scale-105 hover:shadow-4xl transition-all duration-600">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-medical shadow-lg">
                    <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">{t("auth.loginTitle")}</CardTitle>
                <CardDescription>{t("auth.loginSubtitle")}</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                    <Input
                        label={t("auth.password")}
                        type="password"
                        placeholder={t("auth.passwordPlaceholder")}
                        icon={<Lock className="h-4 w-4" />}
                        error={errors.password?.message}
                        autoComplete="current-password"
                        {...register("password")}
                    />

                    {/* Remember me & Forgot password */}
                    {/* <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                            />
                            <span className="text-sm text-slate-600">{t("auth.rememberMe")}</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors cursor-pointer"
                        >
                            {t("auth.forgotPassword")}
                        </button>
                    </div> */}

                    {/* API error */}
                    {apiError && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        {t("auth.loginButton")}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center">
                <p className="text-sm text-slate-500">
                    {t("auth.noAccount")}{" "}
                    <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                        {t("auth.signUpLink")}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
