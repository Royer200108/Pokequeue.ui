import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            size: {
                sm: "h-8 px-2 text-sm",
                default: "h-10",
                lg: "h-12 text-base",
            },
            variant: {
                default: "",
                destructive: "border-destructive text-destructive placeholder:text-destructive/70 focus-visible:ring-destructive",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
)

const Input = React.forwardRef(({ className, size, variant, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(inputVariants({ size, variant, className }))}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input, inputVariants }
