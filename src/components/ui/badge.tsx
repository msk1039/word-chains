import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants: Record<Required<BadgeProps>["variant"], string> = {
      default: "bg-indigo-600 text-white",
      secondary: "bg-slate-100 text-slate-900",
      outline: "border border-slate-300 text-slate-700",
      success: "bg-emerald-500 text-white",
      warning: "bg-amber-500 text-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
