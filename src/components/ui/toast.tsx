import { useToastStore } from "@/stores/toastStore";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconColorMap = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
};

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-4 end-4 z-50 flex flex-col gap-3 w-full max-w-sm"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => {
                const Icon = iconMap[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-fade-in",
                            colorMap[toast.type]
                        )}
                        role="alert"
                    >
                        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColorMap[toast.type])} />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Close notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
