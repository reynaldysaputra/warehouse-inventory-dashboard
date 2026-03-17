"use client";

import { useMemo, useState, useEffect } from "react";
import { useInventoryStore } from "@/store/inventory-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export function StockChartSection() {
  const { inventory, stockHistory } = useInventoryStore();
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (!selectedId && inventory.length > 0) {
      setSelectedId(inventory[0].id);
    }
  }, [inventory, selectedId]);

  const selectedProduct = useMemo(() => {
    return inventory.find((item) => item.id === selectedId);
  }, [inventory, selectedId]);

  const chartData = selectedProduct ? stockHistory[selectedProduct.id] || [] : [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Stock Level History</CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive 30-day stock trend for the selected product.
        </p>
      </CardHeader>

      <CardContent>
        {inventory.length === 0 ? (
          <EmptyState
            title="No chart data available"
            description="Approved inventory items are required before stock history can be visualized."
          />
        ) : (
          <>
            <div className="mb-4">
              <select
                className="w-full rounded-md border px-3 py-2 md:max-w-sm"
                value={selectedProduct?.id || ""}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productName}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}