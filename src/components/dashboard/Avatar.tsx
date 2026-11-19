"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const sizeMap = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-lg",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  const showImage = Boolean(src) && !broken;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6e13f9] to-[#a855f7] font-bold text-white ring-2 ring-background",
        sizeMap[size],
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src || ""}
          alt={name || "User avatar"}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </span>
  );
}
