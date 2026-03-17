export const STORAGE_KEYS = {
  INVENTORY: "warehouse_inventory_live",
  REQUESTS: "warehouse_inventory_requests",
  HISTORY: "warehouse_inventory_history",
  ROLE: "warehouse_user_role",
};

export const getStorageData = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const setStorageData = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};