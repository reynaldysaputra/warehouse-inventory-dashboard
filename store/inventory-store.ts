"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  InventoryItem,
  StockHistoryMap,
  StockRequest,
} from "@/types/inventory";
import { generateStockHistory, initialInventory } from "@/lib/mock-data";
import { STORAGE_KEYS, getStorageData, setStorageData } from "@/lib/storage";

type InventoryState = {
  inventory: InventoryItem[];
  requests: StockRequest[];
  stockHistory: StockHistoryMap;
  isLoading: boolean;

  initialize: () => Promise<void>;
  createRequest: (type: "create" | "update" | "delete", payload: {
    itemId?: string;
    originalData?: InventoryItem | null;
    proposedData?: InventoryItem | null;
  }) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string, reason?: string) => Promise<void>;
};

const fakeDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  requests: [],
  stockHistory: {},
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    await fakeDelay(300);

    const storedInventory = getStorageData<InventoryItem[]>(
      STORAGE_KEYS.INVENTORY,
      initialInventory
    );

    const storedRequests = getStorageData<StockRequest[]>(
      STORAGE_KEYS.REQUESTS,
      []
    );

    const storedHistory = getStorageData<StockHistoryMap>(
      STORAGE_KEYS.HISTORY,
      generateStockHistory(storedInventory)
    );

    set({
      inventory: storedInventory,
      requests: storedRequests,
      stockHistory: storedHistory,
      isLoading: false,
    });

    setStorageData(STORAGE_KEYS.INVENTORY, storedInventory);
    setStorageData(STORAGE_KEYS.REQUESTS, storedRequests);
    setStorageData(STORAGE_KEYS.HISTORY, storedHistory);
  },

  createRequest: async (type, payload) => {
    set({ isLoading: true });
    await fakeDelay();

    const newRequest: StockRequest = {
      id: uuidv4(),
      type,
      status: "pending",
      itemId: payload.itemId || payload.proposedData?.id || uuidv4(),
      originalData: payload.originalData || null,
      proposedData: payload.proposedData || null,
      createdBy: "staff",
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [...get().requests, newRequest];

    set({ requests: updatedRequests, isLoading: false });
    setStorageData(STORAGE_KEYS.REQUESTS, updatedRequests);
  },

  approveRequest: async (requestId) => {
    set({ isLoading: true });
    await fakeDelay();

    const { inventory, requests, stockHistory } = get();
    const request = requests.find((r) => r.id === requestId);

    if (!request) {
      set({ isLoading: false });
      return;
    }

    let updatedInventory = [...inventory];

    if (request.type === "create" && request.proposedData) {
      updatedInventory.push({
        ...request.proposedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (request.type === "update" && request.proposedData) {
      updatedInventory = updatedInventory.map((item) =>
        item.id === request.itemId
          ? { ...request.proposedData!, updatedAt: new Date().toISOString() }
          : item
      );
    }

    if (request.type === "delete") {
      updatedInventory = updatedInventory.filter((item) => item.id !== request.itemId);
    }

    const updatedRequests = requests.filter((r) => r.id !== requestId);

    const updatedHistory = { ...stockHistory };
    const affectedItem = request.proposedData || request.originalData;

    if (affectedItem && updatedHistory[affectedItem.id]) {
      updatedHistory[affectedItem.id] = [
        ...updatedHistory[affectedItem.id].slice(1),
        {
          date: new Date().toISOString().split("T")[0],
          quantity:
            request.type === "delete"
              ? 0
              : request.proposedData?.quantity ?? affectedItem.quantity,
        },
      ];
    }

    if (request.type === "create" && request.proposedData && !updatedHistory[request.proposedData.id]) {
      updatedHistory[request.proposedData.id] = generateStockHistory([request.proposedData])[request.proposedData.id];
    }

    set({
      inventory: updatedInventory,
      requests: updatedRequests,
      stockHistory: updatedHistory,
      isLoading: false,
    });

    setStorageData(STORAGE_KEYS.INVENTORY, updatedInventory);
    setStorageData(STORAGE_KEYS.REQUESTS, updatedRequests);
    setStorageData(STORAGE_KEYS.HISTORY, updatedHistory);
  },

  rejectRequest: async (requestId) => {
    set({ isLoading: true });
    await fakeDelay();

    const updatedRequests = get().requests.filter((r) => r.id !== requestId);

    set({ requests: updatedRequests, isLoading: false });
    setStorageData(STORAGE_KEYS.REQUESTS, updatedRequests);
  },
}));