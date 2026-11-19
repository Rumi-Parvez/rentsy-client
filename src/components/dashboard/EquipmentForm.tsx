"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/dashboard/Button";
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  RENTAL_TYPE_OPTIONS,
} from "@/lib/equipment-options";
import type { Equipment } from "@/types/dashboard";

export interface EquipmentPayload {
  equipmentName: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  imageUrl: string;
  rentalTerms: string;
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-foreground";

export function EquipmentForm({
  initial,
  submitLabel = "Save equipment",
  submitting = false,
  onSubmit,
  onCancel,
}: {
  initial?: Equipment | null;
  submitLabel?: string;
  submitting?: boolean;
  onSubmit: (payload: EquipmentPayload) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<EquipmentPayload>({
    equipmentName: initial?.equipmentName || "",
    description: initial?.description || "",
    category: initial?.category || CATEGORY_OPTIONS[0],
    location: initial?.location || "",
    rentalPrice: initial?.rentalPrice ?? 0,
    rentalType: initial?.rentalType || "daily",
    availableQuantity: initial?.availableQuantity ?? 1,
    condition: initial?.condition || "Excellent",
    brand: initial?.brand || "",
    model: initial?.model || "",
    imageUrl: initial?.imageUrl || "",
    rentalTerms: initial?.rentalTerms || "",
  });

  const update = (
    field: keyof EquipmentPayload,
    value: string | number
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.equipmentName.trim()) {
      toast.error("Equipment name is required.");
      return;
    }

    if (!values.category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!Number.isFinite(values.rentalPrice) || values.rentalPrice < 0) {
      toast.error("Enter a valid rental price.");
      return;
    }

    if (
      !Number.isFinite(values.availableQuantity) ||
      values.availableQuantity < 0
    ) {
      toast.error("Enter a valid available quantity.");
      return;
    }

    onSubmit({
      ...values,
      equipmentName: values.equipmentName.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      imageUrl: values.imageUrl.trim(),
      rentalTerms: values.rentalTerms.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="equipmentName" className={labelClass}>
            Equipment name <span className="text-rose-500">*</span>
          </label>
          <input
            id="equipmentName"
            className={inputClass}
            value={values.equipmentName}
            onChange={(event) =>
              update("equipmentName", event.target.value)
            }
            placeholder="Professional Excavator"
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            className={inputClass}
            value={values.category}
            onChange={(event) =>
              update("category", event.target.value)
            }
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rentalType" className={labelClass}>
            Rental type
          </label>
          <select
            id="rentalType"
            className={inputClass}
            value={values.rentalType}
            onChange={(event) =>
              update("rentalType", event.target.value)
            }
          >
            {RENTAL_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rentalPrice" className={labelClass}>
            Rental price (৳) <span className="text-rose-500">*</span>
          </label>
          <input
            id="rentalPrice"
            type="number"
            min={0}
            className={inputClass}
            value={values.rentalPrice}
            onChange={(event) =>
              update("rentalPrice", Number(event.target.value))
            }
            placeholder="5000"
          />
        </div>

        <div>
          <label htmlFor="availableQuantity" className={labelClass}>
            Available quantity
          </label>
          <input
            id="availableQuantity"
            type="number"
            min={0}
            className={inputClass}
            value={values.availableQuantity}
            onChange={(event) =>
              update(
                "availableQuantity",
                Number(event.target.value)
              )
            }
            placeholder="1"
          />
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            className={inputClass}
            value={values.location}
            onChange={(event) =>
              update("location", event.target.value)
            }
            placeholder="Dhaka"
          />
        </div>

        <div>
          <label htmlFor="condition" className={labelClass}>
            Condition
          </label>
          <select
            id="condition"
            className={inputClass}
            value={values.condition}
            onChange={(event) =>
              update("condition", event.target.value)
            }
          >
            {CONDITION_OPTIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand
          </label>
          <input
            id="brand"
            className={inputClass}
            value={values.brand}
            onChange={(event) =>
              update("brand", event.target.value)
            }
            placeholder="CAT"
          />
        </div>

        <div>
          <label htmlFor="model" className={labelClass}>
            Model
          </label>
          <input
            id="model"
            className={inputClass}
            value={values.model}
            onChange={(event) =>
              update("model", event.target.value)
            }
            placeholder="320D"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="imageUrl" className={labelClass}>
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            className={inputClass}
            value={values.imageUrl}
            onChange={(event) =>
              update("imageUrl", event.target.value)
            }
            placeholder="https://example.com/equipment.jpg"
          />
        </div>

        {values.imageUrl && (
          <div className="sm:col-span-2">
            <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.imageUrl}
                alt="Equipment preview"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            value={values.description}
            onChange={(event) =>
              update("description", event.target.value)
            }
            placeholder="Describe the equipment, its condition and ideal use cases."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="rentalTerms" className={labelClass}>
            Rental terms
          </label>
          <textarea
            id="rentalTerms"
            rows={2}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            value={values.rentalTerms}
            onChange={(event) =>
              update("rentalTerms", event.target.value)
            }
            placeholder="Minimum rental period, delivery terms, deposit, etc."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" size="md" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ImageIcon className="h-3.5 w-3.5" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
