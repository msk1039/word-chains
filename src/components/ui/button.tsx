import * as React from "react";

import { cn } from "@/lib/utils";

const VARIANT_STYLES: Record<string, string> = {
  default:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  ghost: "text-slate-900 hover:bg-slate-100",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
};

const SIZE_STYLES: Record<string, string> = {
  default: "h-11 px-5 py-2 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_STYLES;
  size?: keyof typeof SIZE_STYLES;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-60";

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
