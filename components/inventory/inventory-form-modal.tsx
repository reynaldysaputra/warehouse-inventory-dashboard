"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  sku: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  price: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  supplier: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
};

export function InventoryFormModal({ open, onOpenChange, selectedItem }: Props) {
  const { createRequest, isLoading } = useInventoryStore();

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

      alert("Pending update request submitted.");
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

      alert("Pending creation request submitted.");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedItem ? "Edit Stock" : "Add Stock"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["sku", "productName", "category", "price", "quantity", "supplier"].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize">
                {field}
              </label>
              <input
                {...register(field as keyof FormValues)}
                className="w-full rounded-md border px-3 py-2"
              />
              {errors[field as keyof FormValues] && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}