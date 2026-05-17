import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-white hover:scale-[1.02] active:scale-100 shadow-md shadow-brand-emerald/10",
            secondary: "border border-secondary text-secondary hover:bg-secondary/10 hover:scale-[1.02] active:scale-100",
            ghost: "text-primary hover:bg-primary/10 hover:scale-[1.02] active:scale-100",
        }
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all duration-200",
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
