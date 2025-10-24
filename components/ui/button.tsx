import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:text-white hover:shadow-xl hover:shadow-primary/30 active:scale-95",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:text-white",
        outline:
          "border-2 border-primary bg-background text-gray-10 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95",
        secondary:
          "bg-secondary text-white shadow-lg shadow-secondary/25 hover:bg-secondary-dark hover:text-white hover:shadow-xl hover:shadow-secondary/30 active:scale-95",
        ghost: "text-gray-700 hover:bg-accent/10 hover:text-accent",
        link: "text-gray-10 underline-offset-4 hover:underline",
        accent: "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-dark hover:text-white hover:shadow-xl hover:shadow-accent/30 active:scale-95",
        info: "bg-info text-white shadow-lg shadow-info/25 hover:bg-info-dark hover:text-white hover:shadow-xl hover:shadow-info/30 active:scale-95",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

