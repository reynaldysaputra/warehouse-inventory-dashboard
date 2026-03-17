"use client";

import { useMemo, useState } from "react";
import { useInventoryStore } from "@/store/inventory-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockChartSection() {
  const { inventory, stockHistory } = useInventoryStore();
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedProduct = useMemo(() => {
    return inventory.find((item) => item.id === selectedId) || inventory[0];
  }, [inventory, selectedId]);

  const chartData = selectedProduct ? stockHistory[selectedProduct.id] || [] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Level History (Last 30 Days)</CardTitle>
      </CardHeader>

      <CardContent>
        {inventory.length > 0 && (
          <div className="mb-4">
            <select
              className="rounded-md border px-3 py-2"
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
        )}

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}