"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function RoleSwitcher() {
  const { role, setRole, initRole } = useAuthStore();

  useEffect(() => {
    initRole();
  }, [initRole]);

  return (
    <div className="flex flex-col gap-1 md:items-end">
      <label className="text-xs font-medium text-muted-foreground">Logged in as</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "staff" | "officer")}
        className="rounded-md border bg-white px-3 py-2 text-sm"
      >
        <option value="staff">Staff (Maker)</option>
        <option value="officer">Officer (Checker)</option>
      </select>
    </div>
  );
}