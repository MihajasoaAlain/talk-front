import type { ButtonHTMLAttributes, ReactNode } from "react";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white shadow-[0_12px_30px_rgba(15,15,15,0.28)] hover:-translate-y-0.5 hover:bg-[#1f1f1f]",
  secondary:
    "bg-[#f3efe7] text-black shadow-sm hover:-translate-y-0.5 hover:bg-[#ebe5da]",
  outline:
    "border border-black/20 bg-white text-black hover:-translate-y-0.5 hover:border-black/40",
  ghost: "bg-transparent text-black hover:bg-black/5",
  danger:
    "bg-[#1f0d0d] text-white shadow-[0_12px_30px_rgba(31,13,13,0.35)] hover:-translate-y-0.5 hover:bg-[#2c1212]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
