import { InventoryItem, StockHistoryMap } from "@/types/inventory";
import { v4 as uuidv4 } from "uuid";

export const initialInventory: InventoryItem[] = [
  {
    id: uuidv4(),
    sku: "SKU-001",
    productName: "Wireless Mouse",
    category: "Electronics",
    price: 150000,
    quantity: 25,
    supplier: "PT Tech Supply",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    sku: "SKU-002",
    productName: "Office Chair",
    category: "Furniture",
    price: 850000,
    quantity: 12,
    supplier: "CV Comfort Seating",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    sku: "SKU-003",
    productName: "Notebook A5",
    category: "Stationery",
    price: 25000,
    quantity: 100,
    supplier: "PT Stationery Hub",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const generateStockHistory = (items: InventoryItem[]): StockHistoryMap => {
  const history: StockHistoryMap = {};

  items.forEach((item) => {
    const days = 30;
    let currentQty = item.quantity;

    history[item.id] = Array.from({ length: days }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - index));

      const change = Math.floor(Math.random() * 11) - 5;
      currentQty = Math.max(0, currentQty + change);

      return {
        date: date.toISOString().split("T")[0],
        quantity: currentQty,
      };
    });
  });

  return history;
};