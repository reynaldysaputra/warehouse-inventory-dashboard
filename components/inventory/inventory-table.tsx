"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { InventoryItem } from "@/types/inventory";
import { useInventoryStore } from "@/store/inventory-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryFormModal } from "./inventory-form-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/helpers";

export function InventoryTable() {
  const { inventory, createRequest, requests, isLoading } = useInventoryStore();
  const { role } = useAuthStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const pendingByItemId = useMemo(() => {
    const map = new Set(
      requests.filter((r) => r.status === "pending").map((r) => r.itemId)
    );
    return map;
  }, [requests]);

  const handleDelete = async (item: InventoryItem) => {
    if (pendingByItemId.has(item.id)) {
      toast.error("This item already has a pending request.");
      return;
    }

    await createRequest("delete", {
      itemId: item.id,
      originalData: item,
    });

    toast.success("Pending deletion request submitted.");
  };

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
      },
      {
        accessorKey: "productName",
        header: "Product Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "supplier",
        header: "Supplier",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) =>
          pendingByItemId.has(row.original.id) ? (
            <Badge variant="secondary">Pending Request</Badge>
          ) : (
            <Badge variant="outline">Live</Badge>
          ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          const hasPending = pendingByItemId.has(item.id);

          if (role !== "staff") {
            return <span className="text-xs text-muted-foreground">View only</span>;
          }

          return (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={hasPending}
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
                disabled={hasPending || isLoading}
                onClick={() => handleDelete(item)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [role, isLoading, pendingByItemId]
  );

  const table = useReactTable({
    data: inventory,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const item = row.original;
      const text = [
        item.sku,
        item.productName,
        item.category,
        item.supplier,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Live Inventory</CardTitle>
          <p className="text-sm text-muted-foreground">
            Current approved inventory data (staff changes require approval).
          </p>
        </div>

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
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search SKU, product, category, supplier..."
            className="w-full rounded-md border px-3 py-2 md:max-w-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <div className="text-sm text-muted-foreground">
            Total: {inventory.length} items
          </div>
        </div>

        {inventory.length === 0 ? (
          <EmptyState
            title="No inventory data"
            description="There are no approved inventory items yet. Staff can create a stock request to add new products."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="cursor-pointer px-4 py-3 text-left font-semibold"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No matching inventory found.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-top">
                          {flexRender(
                            cell.column.columnDef.cell ?? cell.column.columnDef.header,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <InventoryFormModal
          open={open}
          onOpenChange={setOpen}
          selectedItem={selectedItem}
        />
      </CardContent>
    </Card>
  );
}