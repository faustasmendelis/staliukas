interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "discount" | "outline";
  className?: string;
}

const variants = {
  default: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  discount: "bg-discount-bg text-discount-text",
  outline: "border border-border text-muted",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
