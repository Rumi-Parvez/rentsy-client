import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api";
import type { EquipmentCategory } from "@/lib/equipmentCategories";

export type CategoryStatus = "pending" | "approved" | "rejected";

export type CategoryRecord = EquipmentCategory & {
  _id?: string | null;
  status?: CategoryStatus;
  isBuiltIn?: boolean;
  createdAt?: string | null;
};

export type CategoriesResponse = {
  success: boolean;
  count: number;
  categories: CategoryRecord[];
};

export type CategoryPayload = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export const fetchManagedCategories = () =>
  apiGet<CategoriesResponse>("/equipment/categories/manage");

export const createCategory = (payload: CategoryPayload) =>
  apiPost<{ success: boolean; message: string; category: CategoryRecord }>(
    "/equipment/categories",
    payload
  );

export const updateCategory = (
  id: string,
  payload: Partial<CategoryPayload> & { status?: CategoryStatus }
) =>
  apiPatch<{ success: boolean; message: string; category: CategoryRecord }>(
    `/equipment/categories/${id}`,
    payload
  );

export const deleteCategory = (id: string) =>
  apiDelete<{ success: boolean; message: string }>(
    `/equipment/categories/${id}`
  );
