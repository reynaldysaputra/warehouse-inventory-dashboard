"use client";

import { useInventoryStore } from "@/store/inventory-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock3, TrendingUp } from "lucide-react";

export function SummaryCards() {
  const { inventory, requests } = useInventoryStore();

  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock3,
    },
    {
      title: "Total Stock Units",
      value: totalStock,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}