import { type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type LabelHTMLAttributes } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-accent text-accent-foreground hover:opacity-90",
    secondary: "bg-surface border border-border hover:bg-surface-hover",
    ghost: "hover:bg-surface-hover",
    danger: "bg-danger-soft text-danger hover:opacity-80",
  };
  const sizes = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-3.5 py-2 rounded-lg",
  };
  return (
    <button
      className={cx(
        "font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent resize-y",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cx("mb-1.5 block text-xs font-medium text-muted", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-xl border border-border bg-surface",
        className
      )}
      {...props}
    />
  );
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-accent-soft text-accent",
  DONE: "bg-success-soft text-success",
  ABANDONED: "bg-danger-soft text-danger",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  DONE: "Done",
  ABANDONED: "Abandoned",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-surface-hover text-muted"
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta == null) return null;
  const positive = delta > 0;
  const zero = delta === 0;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        zero
          ? "bg-surface-hover text-muted"
          : positive
          ? "bg-success-soft text-success"
          : "bg-danger-soft text-danger"
      )}
      title="Hindsight total minus predicted total"
    >
      {zero ? "±0" : positive ? `+${delta}` : delta}
    </span>
  );
}
