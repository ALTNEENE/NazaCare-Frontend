import { useTranslation } from "@/stores/languageStore";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface RiskBadgeProps {
    risk: string;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
}

export function RiskBadge({ risk, size = "md", showIcon = true }: RiskBadgeProps) {
    const { t } = useTranslation();

    const config = getRiskConfig(risk);
    const label = t(`diagnosis.risk.${risk.toLowerCase()?.split("/")[1] || risk?.toLocaleLowerCase()?.split("/")[0]}`) || risk;

    const sizeClasses = {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3.5 py-1.5 text-sm",
        lg: "px-5 py-2 text-base",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all",
                config.classes,
                sizeClasses[size]
            )}
            role="status"
            aria-label={`Risk level: ${risk}`}
        >
            {showIcon && <config.icon className={cn("shrink-0", size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />}
            {label}
        </span>
    );
}

function getRiskConfig(risk: string) {
    switch (risk?.toLowerCase()) {
        case "high":
            return {
                classes: "bg-red-100 text-red-700 border border-red-200",
                icon: ShieldAlert,
            };
        case "moderate":
            return {
                classes: "bg-amber-100 text-amber-700 border border-amber-200",
                icon: Shield,
            };
        case "low":
        default:
            return {
                classes: "bg-green-100 text-green-700 border border-green-200",
                icon: ShieldCheck,
            };
    }
}
