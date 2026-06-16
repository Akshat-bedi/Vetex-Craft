import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "green" | "gold";

export function minecraftButtonClassName(
  variant: ButtonVariant = "green",
  className?: string,
) {
  const variantStyles =
    variant === "green"
      ? "bg-accent-green border-[#2d8a2d] text-black"
      : "bg-accent-gold border-[#b37700] text-black";

  return cn(
    "pixel-hover inline-flex items-center justify-center font-pixel border-[3px] border-solid px-4 py-2.5 text-[10px] leading-relaxed sm:px-6 sm:py-3 sm:text-xs",
    "shadow-pixel",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantStyles,
    className,
  );
}

type MinecraftButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  href?: never;
};

type MinecraftLinkButtonProps = {
  variant?: ButtonVariant;
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function MinecraftButton({
  variant = "green",
  className,
  type = "button",
  children,
  ...props
}: MinecraftButtonProps) {
  return (
    <button
      type={type}
      className={minecraftButtonClassName(variant, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function MinecraftLinkButton({
  variant = "green",
  href,
  className,
  children,
  onClick,
}: MinecraftLinkButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={minecraftButtonClassName(variant, className)}
    >
      {children}
    </Link>
  );
}
