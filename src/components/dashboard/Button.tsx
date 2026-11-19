import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary:
    "border border-border bg-card text-foreground hover:bg-muted",
  ghost:
    "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
  soft: "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/15",
};

const sizes = {
  sm: "h-8 px-3 text-[11px] gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-xs gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

const buttonStyles = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) =>
  cn(
    "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={buttonStyles({ variant, size, className })}
    >
      {children}
    </Link>
  );
}
