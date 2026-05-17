import * as React from "react"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-[24px] bg-white/75 backdrop-blur-[24px] border border-[#064e3b]/10 shadow-[0_40px_60px_-15px_rgba(6,78,59,0.04)]",
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"
