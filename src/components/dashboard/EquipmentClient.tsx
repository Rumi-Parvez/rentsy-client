"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Eye,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button, ButtonLink } from "@/components/dashboard/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  EmptyState,
  Skeleton,
} from "@/components/dashboard/EmptyState";
import {
  EquipmentForm,
  type EquipmentPayload,
} from "@/components/dashboard/EquipmentForm";
import {
  FilterSelect,
  SearchInput,
} from "@/components/dashboard/Filters";
import { ConfirmDialog, Modal } from "@/components/dashboard/Modal";
import { PageHeader } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import {
  SERVER_URL,
  apiDelete,
  apiPatch,
  getErrorMessage,
} from "@/lib/api";
import { EQUIPMENT_STATUS_OPTIONS } from "@/lib/equipment-options";
import { fetchEquipmentCategories } from "@/lib/equipmentCategories";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/format";
import type {
  DashboardUser,
  Equipment,
} from "@/types/dashboard";

type EquipmentResponse = {
  success: boolean;
  count: number;
  equipment: Equipment[];
};

export default function EquipmentClient({
  user,
  initialQuery = "",
  initialStatus = "",
}: {
  user: DashboardUser;
  initialQuery?: string;
  initialStatus?: string;
}) {
  const { data, loading, error, refresh } =
    useApi<EquipmentResponse>("/equipment/manage");

  const [search, setSearch] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState<Equipment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(
    []
  );

  useEffect(() => {
    let active = true;

    fetchEquipmentCategories(SERVER_URL)
      .then((categories) => {
        if (!active) return;

        setCategoryOptions(
          categories
            .map((category) => category.name.trim())
            .filter(Boolean)
        );
      })
      .catch(() => {
        // Filters still work with the categories present in the list.
      });

    return () => {
      active = false;
    };
  }, []);

  const equipment = data?.equipment || [];

  const categoryFilterOptions = useMemo(() => {
    const names = new Set<string>(categoryOptions);

    equipment.forEach((item) => {
      if (item.category) {
        names.add(item.category);
      }
    });

    return [
      { label: "All categories", value: "" },
      ...Array.from(names)
        .sort((left, right) => left.localeCompare(right))
        .map((name) => ({ label: name, value: name })),
    ];
  }, [categoryOptions, equipment]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return equipment.filter((item) => {
      if (status && item.status !== status) {
        return false;
      }

      if (category && item.category !== category) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        item.equipmentName,
        item.category,
        item.location,
        item.brand,
        item.model,
        item.ownerName,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [category, equipment, search, status]);

  const counts = useMemo(
    () => ({
      total: equipment.length,
      approved: equipment.filter(
        (item) => item.status === "approved"
      ).length,
      pending: equipment.filter(
        (item) => item.status === "pending"
      ).length,
      rejected: equipment.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [equipment]
  );

  const updateStatus = async (
    item: Equipment,
    nextStatus: "approved" | "rejected"
  ) => {
    setBusyId(item._id);

    try {
      await apiPatch(`/equipment/${item._id}/status`, {
        status: nextStatus,
      });

      toast.success(
        `${item.equipmentName} ${nextStatus}.`
      );
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const saveEdit = async (payload: EquipmentPayload) => {
    if (!editing) return;

    setSaving(true);

    try {
      await apiPatch(`/equipment/${editing._id}`, payload);
      toast.success("Equipment updated.");
      setEditing(null);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const deleteEquipment = async () => {
    if (!deleting) return;

    setBusyId(deleting._id);

    try {
      await apiDelete(`/equipment/${deleting._id}`);
      toast.success("Equipment deleted.");
      setDeleting(null);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={
          user.role === "admin"
            ? "All equipment"
            : "My equipment"
        }
        subtitle={
          user.role === "admin"
            ? "Review, approve and manage every listing on the marketplace."
            : "Manage pricing, availability and details for your fleet."
        }
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <ButtonLink
              href="/dashboard/add-equipment"
              size="md"
            >
              <Plus className="h-3.5 w-3.5" />
              Add equipment
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryChip label="Total listings" value={counts.total} />
        <SummaryChip
          label="Approved"
          value={counts.approved}
          tone="emerald"
        />
        <SummaryChip
          label="Pending approval"
          value={counts.pending}
          tone="amber"
        />
        <SummaryChip
          label="Rejected"
          value={counts.rejected}
          tone="rose"
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search equipment, brand, location..."
            className="w-full lg:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={category}
              onChange={setCategory}
              options={categoryFilterOptions}
              ariaLabel="Filter by category"
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={EQUIPMENT_STATUS_OPTIONS}
              ariaLabel="Filter by status"
            />
            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
              {filtered.length} result(s)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Could not load equipment
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={refresh}
              className="mt-3"
            >
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Package}
              title={
                equipment.length === 0
                  ? "No equipment listed yet"
                  : "No equipment matches your filters"
              }
              description={
                equipment.length === 0
                  ? user.role === "admin"
                    ? "Equipment submitted by owners will appear here for approval."
                    : "Add your first machine and submit it for admin approval."
                  : "Try a different search term or filter."
              }
              action={
                equipment.length === 0 ? (
                  <ButtonLink
                    href="/dashboard/add-equipment"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add equipment
                  </ButtonLink>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
          <div className="space-y-2 p-3 xl:hidden">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="min-w-0 rounded-xl border border-border/70 bg-background/50 p-3"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                    {item.imageUrl ? (
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.equipmentName}
                        width={40}
                        height={40}
                        fallbackIcon={Package}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-semibold text-foreground">
                      {item.equipmentName}
                    </p>
                    <p className="mt-0.5 break-words text-[10px] text-muted-foreground">
                      {item.brand || "No brand"} · {item.location || "No location"}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/60 pt-2.5 text-[10px]">
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="break-words font-medium text-foreground">{item.category}</dd>
                  </div>
                  {user.role === "admin" && (
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">Owner</dt>
                      <dd className="break-words font-medium text-foreground">{item.ownerName || "—"}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="font-semibold text-foreground">
                      {formatCurrency(item.rentalPrice)}/{item.rentalType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Quantity</dt>
                    <dd className="font-medium text-foreground">{formatNumber(item.availableQuantity)}</dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2.5">
                  <Button variant="secondary" size="sm" onClick={() => setSelected(item)}>
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  {user.role === "admin" && item.status !== "approved" && (
                    <Button size="sm" disabled={busyId === item._id} onClick={() => updateStatus(item, "approved")}>
                      <Check className="h-3 w-3" />
                      Approve
                    </Button>
                  )}
                  {user.role === "admin" && item.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-rose-600 dark:text-rose-400"
                      disabled={busyId === item._id}
                      onClick={() => updateStatus(item, "rejected")}
                    >
                      <X className="h-3 w-3" />
                      Reject
                    </Button>
                  )}
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setEditing(item)} aria-label="Edit equipment">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                    onClick={() => setDeleting(item)}
                    aria-label="Delete equipment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[820px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">
                    Equipment
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Category
                  </th>
                  {user.role === "admin" && (
                    <th className="px-4 py-3 font-semibold">Owner</th>
                  )}
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {filtered.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                          {item.imageUrl ? (
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.equipmentName}
                              width={40}
                              height={40}
                              fallbackIcon={Package}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate font-semibold text-foreground">
                            {item.equipmentName}
                          </p>
                          <p className="max-w-[180px] truncate text-[10px] text-muted-foreground">
                            {item.brand || "No brand"} ·{" "}
                            {item.location || "No location"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">
                      {item.category}
                    </td>

                    {user.role === "admin" && (
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">
                        {item.ownerName}
                      </td>
                    )}

                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">
                      {formatCurrency(item.rentalPrice)}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        /{item.rentalType}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {formatNumber(item.availableQuantity)}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelected(item)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>

                        {user.role === "admin" &&
                          item.status !== "approved" && (
                            <Button
                              size="sm"
                              disabled={busyId === item._id}
                              onClick={() =>
                                updateStatus(item, "approved")
                              }
                            >
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                          )}

                        {user.role === "admin" &&
                          item.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-rose-600 dark:text-rose-400"
                              disabled={busyId === item._id}
                              onClick={() =>
                                updateStatus(item, "rejected")
                              }
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          )}

                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditing(item)}
                          aria-label="Edit equipment"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                          onClick={() => setDeleting(item)}
                          aria-label="Delete equipment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      {/* View details */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.equipmentName || "Equipment details"}
        description={
          selected
            ? `${selected.category} · ${selected.status}`
            : undefined
        }
        size="lg"
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelected(null)}
          >
            Close
          </Button>
        }
      >
        {selected && <EquipmentDetails equipment={selected} />}
      </Modal>

      {/* Edit */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit equipment"
        description="Changes are saved to the marketplace immediately."
        size="lg"
      >
        {editing && (
          <EquipmentForm
            key={editing._id}
            initial={editing}
            submitLabel="Update equipment"
            submitting={saving}
            onSubmit={saveEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete */}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete equipment"
        message={`Delete ${deleting?.equipmentName || "this equipment"}? Listings with active bookings cannot be deleted.`}
        confirmLabel="Delete equipment"
        loading={busyId === deleting?._id}
        onClose={() => setDeleting(null)}
        onConfirm={deleteEquipment}
      />
    </div>
  );
}

function EquipmentDetails({ equipment }: { equipment: Equipment }) {
  const rows = [
    ["Equipment", equipment.equipmentName],
    ["Category", equipment.category],
    ["Owner", `${equipment.ownerName || "—"} (${equipment.ownerEmail || "—"})`],
    ["Price", `${formatCurrency(equipment.rentalPrice)} / ${equipment.rentalType}`],
    ["Available quantity", String(equipment.availableQuantity)],
    ["Condition", equipment.condition || "—"],
    ["Brand", equipment.brand || "—"],
    ["Model", equipment.model || "—"],
    ["Location", equipment.location || "—"],
    ["Added", formatDate(equipment.createdAt)],
    ["Rental terms", equipment.rentalTerms || "—"],
    ["Description", equipment.description || "—"],
  ];

  return (
    <div className="space-y-4">
      {equipment.imageUrl && (
        <div className="h-52 overflow-hidden rounded-xl border border-border bg-muted/30">
          <ImageWithFallback
            src={equipment.imageUrl}
            alt={equipment.equipmentName}
            width={1000}
            height={500}
            fallbackIcon={Package}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <StatusBadge status={equipment.status} />

      <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-3.5 py-2.5 text-xs sm:grid-cols-[150px_1fr] sm:gap-3"
          >
            <dt className="font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="break-words font-medium text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <Link
        href="/dashboard/add-equipment"
        className="inline-flex text-[11px] font-semibold text-primary hover:underline"
      >
        Add another listing
      </Link>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-bold ${tones[tone]}`}
      >
        {value}
      </span>
    </div>
  );
}
