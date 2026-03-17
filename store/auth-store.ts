import { create } from "zustand";
import { UserRole } from "@/types/inventory";
import { STORAGE_KEYS, getStorageData, setStorageData } from "@/lib/storage";

type AuthState = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  initRole: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: "staff",

  setRole: (role) => {
    set({ role });
    setStorageData(STORAGE_KEYS.ROLE, role);
  },

  initRole: () => {
    const storedRole = getStorageData<UserRole>(STORAGE_KEYS.ROLE, "staff");
    set({ role: storedRole });
  },
}));