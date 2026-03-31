import { cn } from "@/lib/utils";

function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-card border border-white/80",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 p-6 pb-4", className)} {...props} />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-600 text-primary/60 tracking-wide uppercase", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center px-6 pb-6 pt-0", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
