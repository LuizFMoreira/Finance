import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  colorClass?: string;
}

function Progress({
  value,
  max = 100,
  colorClass = "bg-primary",
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-700", colorClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export { Progress };
