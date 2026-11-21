"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export type EquipmentCardMongoId =
  | string
  | {
      $oid?: string;
    };

export type EquipmentCardData = {
  _id: EquipmentCardMongoId;
  equipmentName: string;
  description?: string;
  category: string;
  location?: string;
  rentalPrice: number;
  rentalType?: "hourly" | "daily" | "weekly" | "monthly" | string;
  availableQuantity?: number;
  condition?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  status?: string;
};

export type EquipmentCardProps = {
  equipment: EquipmentCardData;
  requireAuthForDetails?: boolean;
  signInPath?: string;
  onViewDetails?: (
    id: string,
    equipment: EquipmentCardData
  ) => void;
  className?: string;
  priority?: boolean;
};

const FALLBACK_EQUIPMENT_IMAGE =
  "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=900&q=80";

function resolveEquipmentId(id?: EquipmentCardMongoId): string {
  if (!id) return "";

  if (typeof id === "string") {
    return id;
  }

  return id.$oid || "";
}

export default function EquipmentCard({
  equipment,
  requireAuthForDetails = false,
  signInPath = "/sign-in",
  onViewDetails,
  className = "",
  priority = false,
}: EquipmentCardProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const id = resolveEquipmentId(equipment._id);

  const detailUrl = id
    ? `/equipment/${encodeURIComponent(id)}`
    : "/equipment";

  const stockCount = Math.max(
    0,
    Number(equipment.availableQuantity ?? 1)
  );

  const billingLabel = (
    equipment.rentalType || "daily"
  ).toLowerCase();

  const handleCardClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // Custom click handler
    if (onViewDetails) {
      event.preventDefault();
      onViewDetails(id, equipment);
      return;
    }

    // Wait until the authentication state is available
    if (requireAuthForDetails && isPending) {
      event.preventDefault();
      return;
    }

    // Redirect guests to sign in
    if (requireAuthForDetails && !session?.user) {
      event.preventDefault();

      router.push(
        `${signInPath}?redirect=${encodeURIComponent(detailUrl)}`
      );
    }
  };

  return (
    <Link
      href={detailUrl}
      onClick={handleCardClick}
      aria-label={`View details for ${equipment.equipmentName}`}
      className={`group block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#6e13f9] focus-visible:ring-offset-2 ${className}`}
    >
      <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.14)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#6e13f9]/45 group-hover:shadow-[0_18px_36px_-12px_rgba(110,19,249,0.2)] dark:border-slate-800 dark:bg-slate-900">

        {/* Equipment Image */}
        <div>
          <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 sm:h-56">
            <Image
              src={
                equipment.imageUrl || FALLBACK_EQUIPMENT_IMAGE
              }
              alt={equipment.equipmentName}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <span className="absolute left-3.5 top-3.5 rounded-full bg-[#111827] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              {equipment.category}
            </span>
          </div>

          {/* Equipment Information */}
          <div className="px-5 pb-3.5 pt-4">
            <div className="flex items-center justify-between gap-2.5">
              <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                {equipment.equipmentName}
              </h3>

              <span className="shrink-0 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {stockCount} Stock
              </span>
            </div>

            <p className="mt-2 line-clamp-2 min-h-[2.625rem] text-xs leading-[1.35rem] text-slate-500 dark:text-slate-400">
              {equipment.description ||
                "Reliable equipment ready for transport, site work, and rental."}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6e13f9] dark:text-[#a66cff]" />

              <span className="truncate">
                {equipment.location || "Available on request"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mx-4 mb-4 flex items-center justify-between border-t border-slate-100 px-1 pt-3.5 dark:border-slate-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#6e13f9] dark:text-[#a66cff]">
              $
              {Number(
                equipment.rentalPrice || 0
              ).toLocaleString()}
            </span>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              / {billingLabel}
            </span>
          </div>

          {/* Visual Details Indicator */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1021] px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#6e13f9] dark:bg-slate-800 dark:group-hover:bg-[#6e13f9]">
            <span>Details</span>

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
