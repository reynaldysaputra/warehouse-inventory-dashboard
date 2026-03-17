"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { StockChartSection } from "@/components/inventory/stock-chart";
import { ApprovalTable } from "@/components/approval/approval-table";

export function DashboardTabs() {
  const { role } = useAuthStore();

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-fit md:grid-cols-3">
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        {role === "officer" && <TabsTrigger value="approval">Approval Queue</TabsTrigger>}
      </TabsList>

      <TabsContent value="inventory" className="mt-4">
        <InventoryTable />
      </TabsContent>

      <TabsContent value="analytics" className="mt-4">
        <StockChartSection />
      </TabsContent>

      {role === "officer" && (
        <TabsContent value="approval" className="mt-4">
          <ApprovalTable />
        </TabsContent>
      )}
    </Tabs>
  );
}