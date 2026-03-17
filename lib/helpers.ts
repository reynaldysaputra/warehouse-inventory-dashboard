import { InventoryItem } from "@/types/inventory";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const getChangedFields = (
  original?: InventoryItem | null,
  proposed?: InventoryItem | null
) => {
  if (!original || !proposed) return [];

  const fields: (keyof InventoryItem)[] = [
    "sku",
    "productName",
    "category",
    "price",
    "quantity",
    "supplier",
  ];

  return fields
    .filter((field) => original[field] !== proposed[field])
    .map((field) => ({
      field,
      oldValue: original[field],
      newValue: proposed[field],
    }));
};