"use client";

import { useMemo, useState } from "react";
import {
  Check,
  FolderPlus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/dashboard/Button";
import { EmptyState, Skeleton } from "@/components/dashboard/EmptyState";
import { FilterSelect, SearchInput } from "@/components/dashboard/Filters";
import { ConfirmDialog, Modal } from "@/components/dashboard/Modal";
import { PageHeader } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import { getErrorMessage } from "@/lib/api";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoriesResponse,
  type CategoryRecord,
  type CategoryStatus,
} from "@/lib/category-api";
import type { DashboardUser } from "@/types/dashboard";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-foreground";

export default function CategoriesClient({
  user,
}: {
  user: DashboardUser;
}) {
  const { data, loading, error, refresh } =
    useApi<CategoriesResponse>("/equipment/categories/manage");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<CategoryRecord | null>(null);

  const isAdmin = user.role === "admin";
  const categories = data?.categories || [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return categories.filter((category) => {
      if (status && (category.status || "approved") !== status) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [category.name, category.description]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [categories, search, status]);

  const counts = useMemo(
    () => ({
      total: categories.length,
      approved: categories.filter(
        (category) => (category.status || "approved") === "approved"
      ).length,
      pending: categories.filter(
        (category) => category.status === "pending"
      ).length,
      rejected: categories.filter(
        (category) => category.status === "rejected"
      ).length,
    }),
    [categories]
  );

  const setCategoryStatus = async (
    category: CategoryRecord,
    nextStatus: CategoryStatus
  ) => {
    if (!category._id) return;

    setBusyId(category._id);

    try {
      await updateCategory(category._id, { status: nextStatus });
      toast.success(`${category.name} ${nextStatus}.`);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const removeCategory = async () => {
    if (!deleteTarget?._id) return;

    setBusyId(deleteTarget._id);

    try {
      await deleteCategory(deleteTarget._id);
      toast.success("Category deleted.");
      setDeleteTarget(null);
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
        title="Categories"
        subtitle={
          isAdmin
            ? "Approve owner category requests and keep the marketplace taxonomy tidy."
            : "Request new categories for your fleet. An admin reviews every request."
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

            <Button
              size="md"
              onClick={() => setCreateOpen(true)}
            >
              <FolderPlus className="h-3.5 w-3.5" />
              New category
            </Button>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryChip label="Total categories" value={counts.total} />
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
            placeholder="Search categories..."
            className="w-full lg:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              ariaLabel="Filter by category status"
            />

            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
              {filtered.length} result(s)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-36 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Could not load categories
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
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
              icon={Tag}
              title={
                categories.length === 0
                  ? "No categories yet"
                  : "No categories match your filters"
              }
              description={
                categories.length === 0
                  ? "Create the first category to organise the marketplace."
                  : "Try a different search term or status filter."
              }
              action={
                <Button
                  size="sm"
                  onClick={() => setCreateOpen(true)}
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  New category
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((category) => (
              <article
                key={category._id || category.slug || category.name}
                className="flex min-w-0 flex-col justify-between rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-primary/30"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Tag className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground">
                          {category.equipmentCount} approved listing(s)
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={category.status || "approved"}
                    />
                  </div>

                  <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {category.description ||
                      "No description provided yet."}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    {category.isBuiltIn ? (
                      <>
                        <ShieldCheck className="h-3 w-3" />
                        Built-in category
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Custom category
                      </>
                    )}
                  </span>

                  {isAdmin && !category.isBuiltIn && category._id ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(category.status || "approved") !== "approved" && (
                        <Button
                          size="sm"
                          disabled={busyId === category._id}
                          onClick={() =>
                            setCategoryStatus(category, "approved")
                          }
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </Button>
                      )}

                      {category.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-rose-600 dark:text-rose-400"
                          disabled={busyId === category._id}
                          onClick={() =>
                            setCategoryStatus(category, "rejected")
                          }
                        >
                          <X className="h-3 w-3" />
                          Reject
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {category.status === "pending"
                        ? "Awaiting admin approval"
                        : category.status === "rejected"
                          ? "Not available for equipment"
                          : "Available for equipment"}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New category"
        description={
          isAdmin
            ? "Admin categories are approved immediately."
            : "Owner requests are reviewed by an admin before they appear in equipment forms."
        }
      >
        <CreateCategoryForm
          isAdmin={isAdmin}
          saving={saving}
          onCancel={() => setCreateOpen(false)}
          onSubmit={async (payload) => {
            setSaving(true);

            try {
              const result = await createCategory(payload);
              toast.success(result.message || "Category created.");
              setCreateOpen(false);
              refresh();
            } catch (requestError) {
              toast.error(getErrorMessage(requestError));
            } finally {
              setSaving(false);
            }
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={`Delete ${deleteTarget?.name || "this category"}? This cannot be undone. Categories with equipment cannot be deleted.`}
        confirmLabel="Delete category"
        loading={busyId === deleteTarget?._id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeCategory}
      />
    </div>
  );
}

function CreateCategoryForm({
  isAdmin,
  saving,
  onSubmit,
  onCancel,
}: {
  isAdmin: boolean;
  saving: boolean;
  onSubmit: (payload: {
    name: string;
    description: string;
    imageUrl: string;
  }) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const name = values.name.trim();

    if (name.length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }

    onSubmit({
      name,
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className={labelClass}>
          Category name <span className="text-rose-500">*</span>
        </label>
        <input
          id="category-name"
          className={inputClass}
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder="Industrial Cleaning Equipment"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="category-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="category-description"
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="What kind of equipment belongs in this category?"
        />
      </div>

      <div>
        <label htmlFor="category-image" className={labelClass}>
          Cover image URL
        </label>
        <input
          id="category-image"
          type="url"
          className={inputClass}
          value={values.imageUrl}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              imageUrl: event.target.value,
            }))
          }
          placeholder="https://example.com/category.jpg"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-3 text-[10px] leading-5 text-muted-foreground">
        {isAdmin
          ? "This category will be available to every owner right away."
          : "Your request starts as pending. You can select it when adding equipment after an admin approves it."}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" size="md" disabled={saving}>
          <FolderPlus className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Create category"}
        </Button>
      </div>
    </form>
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
