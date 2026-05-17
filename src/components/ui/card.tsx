import * as React from "react"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-[24px] bg-white/70 backdrop-blur-[24px] border border-brand-emerald/10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.04)]",
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"
