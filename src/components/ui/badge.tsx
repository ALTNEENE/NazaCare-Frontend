import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary-100 text-primary-700",
                success: "bg-green-100 text-green-700",
                warning: "bg-amber-100 text-amber-700",
                danger: "bg-red-100 text-red-700",
                outline: "border border-slate-200 text-slate-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
