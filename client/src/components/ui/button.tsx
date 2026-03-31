import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-sm hover:bg-primary-600 active:scale-95",
        gold: "bg-gold text-primary font-800 shadow-sm hover:bg-gold-light active:scale-95",
        outline:
          "border border-primary/20 bg-white text-primary hover:bg-lavender-light hover:border-primary/40 active:scale-95",
        ghost:
          "text-primary/70 hover:text-primary hover:bg-lavender-light active:scale-95",
        danger:
          "bg-red-500 text-white hover:bg-red-600 active:scale-95",
        lavender:
          "bg-lavender text-primary hover:bg-lavender-dark active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base rounded-2xl",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
