"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ClipboardCheck,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { ButtonLink } from "@/components/dashboard/Button";
import {
  EquipmentForm,
  type EquipmentPayload,
} from "@/components/dashboard/EquipmentForm";
import { PageHeader, SectionCard } from "@/components/dashboard/SectionCard";
import { apiPost, getErrorMessage } from "@/lib/api";
import type { DashboardUser } from "@/types/dashboard";

export default function AddEquipmentClient({
  user,
}: {
  user: DashboardUser;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: EquipmentPayload) => {
    setSubmitting(true);

    try {
      await apiPost("/equipment", payload);

      toast.success(
        user.role === "admin"
          ? "Equipment created and approved."
          : "Equipment submitted for admin approval."
      );

      router.push("/dashboard/equipment");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Add equipment"
        subtitle="List a machine for rent. Clear photos and accurate pricing get approved faster."
        actions={
          <ButtonLink
            href="/dashboard/equipment"
            variant="secondary"
            size="md"
          >
            Back to equipment
          </ButtonLink>
        }
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <SectionCard
          title="Equipment details"
          subtitle="All fields marked with * are required"
        >
          <EquipmentForm
            submitLabel="Submit equipment"
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/equipment")}
          />
        </SectionCard>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b0b63] via-[#4c139f] to-[#6e13f9] p-5 text-white shadow-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ring-1 ring-inset ring-white/20">
              <Sparkles className="h-3 w-3" />
              Owner guide
            </span>

            <h2 className="mt-3 text-lg font-bold leading-tight">
              A great listing rents faster
            </h2>

            <ul className="mt-3 space-y-2.5 text-[11px] leading-5 text-purple-100">
              <li className="flex gap-2">
                <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" />
                Use a clear, real photo of the equipment.
              </li>
              <li className="flex gap-2">
                <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" />
                Set a competitive price and realistic quantity.
              </li>
              <li className="flex gap-2">
                <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" />
                Add rental terms so customers know the rules.
              </li>
            </ul>
          </div>

          <SectionCard title="Approval process">
            <div className="space-y-4">
              <Step
                icon={ClipboardCheck}
                title="1. Submit details"
                description="Fill in the equipment form and submit."
              />
              <Step
                icon={ShieldCheck}
                title="2. Admin review"
                description="Our team verifies the listing before it goes live."
              />
              <Step
                icon={BadgeCheck}
                title="3. Start earning"
                description="Approved equipment appears in the marketplace and can receive bookings."
              />
            </div>

            <div className="mt-4 flex gap-2 rounded-xl border border-border bg-muted/40 p-3 text-[10px] leading-5 text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {user.role === "admin"
                ? "Admin listings are approved automatically."
                : "You can edit or delete a listing at any time from My Equipment. Pending listings are not visible to customers."}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BadgeCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
