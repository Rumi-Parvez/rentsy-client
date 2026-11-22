"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ImageWithFallbackProps = ImageProps & {
  fallbackIcon?: LucideIcon;
  fallbackClassName?: string;
};

function isValidImageSource(src: ImageProps["src"]) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  if (!/^https?:\/\//i.test(src)) return false;

  try {
    return Boolean(new URL(src).hostname);
  } catch {
    return false;
  }
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  className,
  style,
  onError,
  fallbackIcon: FallbackIcon = ImageOff,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [failedSource, setFailedSource] =
    useState<ImageProps["src"] | null>(null);

  if (!src || !isValidImageSource(src) || failedSource === src) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
          fill ? "absolute inset-0 h-full w-full" : "h-12 w-12",
          className,
          fallbackClassName
        )}
        style={style}
      >
        <FallbackIcon
          aria-hidden="true"
          className="h-8 w-8 max-h-[35%] max-w-[35%]"
        />
      </span>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      style={style}
      onError={(event) => {
        setFailedSource(src);
        onError?.(event);
      }}
    />
  );
}
