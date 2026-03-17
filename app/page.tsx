"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useInventoryStore } from "@/store/inventory-store";
import { useAuthStore } from "@/store/auth-store";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { StockChartSection } from "@/components/inventory/stock-chart";
import { ApprovalTable } from "@/components/approval/approval-table";

export default function HomePage() {
  const { initialize } = useInventoryStore();
  const { role, initRole } = useAuthStore();

  useEffect(() => {
    initialize();
    initRole();
  }, [initialize, initRole]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <InventoryTable />
        <StockChartSection />
        {role === "officer" && <ApprovalTable />}
      </div>
    </main>
  );
}