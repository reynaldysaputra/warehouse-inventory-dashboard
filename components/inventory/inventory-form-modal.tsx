"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { InventoryItem } from "@/types/inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventoryStore } from "@/store/inventory-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const schema = z.object({
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  supplier: z.string().min(1, "Supplier is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
};

export function InventoryFormModal({ open, onOpenChange, selectedItem }: Props) {
  const { createRequest, requests, isLoading } = useInventoryStore();

  const pendingByItemId = new Set(
    requests.filter((r) => r.status === "pending").map((r) => r.itemId)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sku: "",
      productName: "",
      category: "",
      price: 0,
      quantity: 0,
      supplier: "",
    },
  });

  useEffect(() => {
    if (selectedItem) {
      reset({
        sku: selectedItem.sku,
        productName: selectedItem.productName,
        category: selectedItem.category,
        price: selectedItem.price,
        quantity: selectedItem.quantity,
        supplier: selectedItem.supplier,
      });
    } else {
      reset({
        sku: "",
        productName: "",
        category: "",
        price: 0,
        quantity: 0,
        supplier: "",
      });
    }
  }, [selectedItem, reset]);

  const onSubmit = async (values: FormValues) => {
    if (selectedItem && pendingByItemId.has(selectedItem.id)) {
      toast.error("This item already has a pending request.");
      return;
    }

    if (selectedItem) {
      const updatedItem: InventoryItem = {
        ...selectedItem,
        ...values,
        updatedAt: new Date().toISOString(),
      };

      await createRequest("update", {
        itemId: selectedItem.id,
        originalData: selectedItem,
        proposedData: updatedItem,
      });

      toast.success("Pending update request submitted.");
    } else {
      const newItem: InventoryItem = {
        id: uuidv4(),
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createRequest("create", {
        itemId: newItem.id,
        proposedData: newItem,
      });

      toast.success("Pending creation request submitted.");
    }

    onOpenChange(false);
  };

  const fieldClassName =
    "w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{selectedItem ? "Edit Stock" : "Add Stock"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">SKU</label>
            <input {...register("sku")} className={fieldClassName} />
            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Product Name</label>
            <input {...register("productName")} className={fieldClassName} />
            {errors.productName && <p className="mt-1 text-xs text-red-500">{errors.productName.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <input {...register("category")} className={fieldClassName} />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Supplier</label>
              <input {...register("supplier")} className={fieldClassName} />
              {errors.supplier && <p className="mt-1 text-xs text-red-500">{errors.supplier.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Price</label>
              <input type="number" {...register("price")} className={fieldClassName} />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input type="number" {...register("quantity")} className={fieldClassName} />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}