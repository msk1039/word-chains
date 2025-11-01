import * as React from "react";

import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="custom-scrollbar h-full overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  ),
);

ScrollArea.displayName = "ScrollArea";
