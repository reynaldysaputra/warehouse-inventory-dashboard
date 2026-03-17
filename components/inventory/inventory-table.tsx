"use client";

import { useMemo, useState } from "react";
import { useInventoryStore } from "@/store/inventory-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { InventoryFormModal } from "./inventory-form-modal";

export function InventoryTable() {
  const { inventory, createRequest, isLoading } = useInventoryStore();
  const { role } = useAuthStore();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof InventoryItem>("productName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredData = useMemo(() => {
    const filtered = inventory.filter((item) =>
      [item.sku, item.productName, item.category, item.supplier]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [inventory, search, sortKey, sortOrder]);

  const handleDelete = async (item: InventoryItem) => {
    await createRequest("delete", {
      itemId: item.id,
      originalData: item,
    });
    alert("Pending deletion request submitted.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Inventory</CardTitle>
        {role === "staff" && (
          <Button
            onClick={() => {
              setSelectedItem(null);
              setOpen(true);
            }}
          >
            Add Stock
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full max-w-sm rounded-md border px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-md border px-3 py-2"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as keyof InventoryItem)}
          >
            <option value="productName">Product Name</option>
            <option value="sku">SKU</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
            <option value="supplier">Supplier</option>
          </select>

          <select
            className="rounded-md border px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                {["SKU", "Product", "Category", "Price", "Qty", "Supplier", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.sku}</td>
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">Rp {item.price.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.supplier}</td>
                  <td className="px-4 py-3">
                    {role === "staff" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InventoryFormModal
          open={open}
          onOpenChange={setOpen}
          selectedItem={selectedItem}
        />
      </CardContent>
    </Card>
  );
}