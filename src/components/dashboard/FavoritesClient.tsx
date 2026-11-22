"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  MapPin,
  Package,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/dashboard/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import { EmptyState, Skeleton } from "@/components/dashboard/EmptyState";
import { SearchInput } from "@/components/dashboard/Filters";
import { ConfirmDialog, Modal } from "@/components/dashboard/Modal";
import { PageHeader } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import { apiDelete, getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Favorite } from "@/types/dashboard";

type FavoritesResponse = {
  success: boolean;
  count: number;
  favorites: Favorite[];
};

export default function FavoritesClient() {
  const { data, loading, error, refresh } =
    useApi<FavoritesResponse>("/favorites");

  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<Favorite | null>(null);
  const [selected, setSelected] = useState<Favorite | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const favorites = data?.favorites || [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return favorites;
    }

    return favorites.filter((favorite) =>
      [
        favorite.equipment?.equipmentName,
        favorite.equipment?.category,
        favorite.equipment?.location,
        favorite.equipment?.brand,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        )
    );
  }, [favorites, search]);

  const removeFavorite = async () => {
    if (!removing) return;

    setBusyId(removing._id);

    try {
      await apiDelete(`/favorites/${removing.equipmentId}`);
      toast.success("Favorite removed.");
      setRemoving(null);
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
        title="Favorites"
        subtitle={`${favorites.length} saved equipment listing(s)`}
        actions={
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
        }
      />

      <div className="rounded-2xl border border-border/70 bg-card p-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search saved equipment..."
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-400/20 dark:bg-rose-500/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Could not load favorites
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
        <EmptyState
          icon={Heart}
          title={
            favorites.length === 0
              ? "No favorites yet"
              : "No favorites match your search"
          }
          description={
            favorites.length === 0
              ? "Tap the heart icon on any equipment to save it here for later."
              : "Try a different search term."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((favorite) => {
            const equipment = favorite.equipment;

            return (
              <article
                key={favorite._id}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-primary/30 hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  {equipment.imageUrl ? (
                    <ImageWithFallback
                      src={equipment.imageUrl}
                      alt={equipment.equipmentName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      fallbackIcon={Package}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-10 w-10 text-primary/40" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setRemoving(favorite)}
                    aria-label="Remove favorite"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur transition hover:bg-rose-50 dark:bg-slate-900/90 dark:hover:bg-rose-500/10"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>

                  <div className="absolute left-2.5 top-2.5">
                    <StatusBadge status={equipment.status} />
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {equipment.category}
                  </p>
                  <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">
                    {equipment.equipmentName}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {equipment.location || "Location not set"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {formatCurrency(equipment.rentalPrice)}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          /{equipment.rentalType}
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Qty {equipment.availableQuantity}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelected(favorite)}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.equipment.equipmentName || "Equipment"}
        description={selected?.equipment.category}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setRemoving(selected);
                setSelected(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove favorite
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            {selected.equipment.imageUrl && (
              <div className="h-52 overflow-hidden rounded-xl border border-border bg-muted/30">
                <ImageWithFallback
                  src={selected.equipment.imageUrl}
                  alt={selected.equipment.equipmentName}
                  width={1000}
                  height={500}
                  fallbackIcon={Package}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <p className="text-xs leading-6 text-muted-foreground">
              {selected.equipment.description ||
                "No description provided for this listing."}
            </p>

            <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
              {[
                [
                  "Price",
                  `${formatCurrency(selected.equipment.rentalPrice)} / ${selected.equipment.rentalType}`,
                ],
                ["Location", selected.equipment.location || "—"],
                ["Quantity", String(selected.equipment.availableQuantity)],
                ["Condition", selected.equipment.condition || "—"],
                [
                  "Owner",
                  selected.equipment.ownerName || "—",
                ],
                [
                  "Rental terms",
                  selected.equipment.rentalTerms || "—",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 gap-1 px-3.5 py-2.5 text-xs sm:grid-cols-[140px_1fr] sm:gap-3"
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
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(removing)}
        title="Remove favorite"
        message={`Remove ${removing?.equipment.equipmentName || "this equipment"} from your favorites?`}
        confirmLabel="Remove"
        loading={busyId === removing?._id}
        onClose={() => setRemoving(null)}
        onConfirm={removeFavorite}
      />
    </div>
  );
}
