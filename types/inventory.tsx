export type UserRole = "staff" | "officer";

export type InventoryItem = {
  id: string;
  sku: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
};

export type RequestType = "create" | "update" | "delete";
export type RequestStatus = "pending" | "approved" | "rejected";

export type StockRequest = {
  id: string;
  type: RequestType;
  status: RequestStatus;
  itemId: string;
  originalData?: InventoryItem | null;
  proposedData?: InventoryItem | null;
  rejectionReason?: string;
  createdBy: "staff";
  createdAt: string;
  reviewedAt?: string;
};

export type StockHistory = {
  date: string;
  quantity: number;
};

export type StockHistoryMap = Record<string, StockHistory[]>;