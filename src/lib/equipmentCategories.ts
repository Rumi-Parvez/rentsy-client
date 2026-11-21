import { getAccessToken } from "@/lib/api";

export type EquipmentCategory = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  equipmentCount: number;
};

export const DEFAULT_EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    name: "Construction Equipment",
    slug: "construction-equipment",
    description:
      "Heavy duty excavators, concrete mixers, site lifts, and earthmoving gear.",
    imageUrl:
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
  {
    name: "Photography Equipment",
    slug: "photography-equipment",
    description:
      "Cameras, lenses, lighting rigs, gimbals, and studio production gear.",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    description:
      "Microbuses, cargo vans, utility trucks, and commercial transport vehicles.",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
  {
    name: "Agriculture",
    slug: "agriculture",
    description:
      "Farm tillers, harvesters, pumps, and agricultural field equipment.",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
  {
    name: "Electronics",
    slug: "electronics",
    description:
      "Generators, displays, power stations, diagnostic tools, and electronics.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
  {
    name: "Events",
    slug: "events",
    description:
      "Audio systems, staging, lighting trusses, and event rental equipment.",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    equipmentCount: 0,
  },
];

export function getCategoriesEndpoint(baseUrl: string, searchQuery = ""): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const params = new URLSearchParams();
  if (searchQuery.trim()) {
    params.set("q", searchQuery.trim());
  }
  const qs = params.toString();
  return `${cleanBase}/api/equipment/categories${qs ? `?${qs}` : ""}`;
}

export async function fetchEquipmentCategories(
  baseUrl: string,
  searchQuery = ""
): Promise<EquipmentCategory[]> {
  const endpoint = getCategoriesEndpoint(baseUrl, searchQuery);

  const token = await getAccessToken();
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Server returned an invalid response.");
  }

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load equipment categories.");
  }

  const list: EquipmentCategory[] = Array.isArray(data.categories)
    ? data.categories
    : [];

  return list.length > 0 ? list : DEFAULT_EQUIPMENT_CATEGORIES;
}