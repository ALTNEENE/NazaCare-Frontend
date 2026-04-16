import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200",
                            "placeholder:text-slate-400",
                            "focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                            icon && "ps-10",
                            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                </div>
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs text-red-500 mt-1"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
