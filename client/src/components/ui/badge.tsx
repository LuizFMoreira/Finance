import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-600 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        essential:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        superfluous:
          "bg-amber-50 text-amber-700 border border-amber-200",
        income:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        expense:
          "bg-red-50 text-red-600 border border-red-200",
        lavender: "bg-lavender text-primary",
        gold: "bg-gold/20 text-yellow-700 border border-gold/40",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
