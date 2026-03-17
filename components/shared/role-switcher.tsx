"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function RoleSwitcher() {
  const { role, setRole, initRole } = useAuthStore();

  useEffect(() => {
    initRole();
  }, [initRole]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Logged in as:</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "staff" | "officer")}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="staff">Staff (Maker)</option>
        <option value="officer">Officer (Checker)</option>
      </select>
    </div>
  );
}