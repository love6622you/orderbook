// store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// export type Order = [
//   price: number, // 價格
//   size: number, // 數量
//   total?: number, // 當前累計總和
//   percent?: number, // (當前累計總和 / 最大累計總和)
// ];

interface OrderBookSnapshot {
  bids: number[][];
  asks: number[][];
  seqNum: number;
  prevSeqNum: number;
  type: "snapshot" | "delta";
  symbol: string;
  timestamp: number;
}

interface OrderbookState {
  rawBids: number[][];
  bids: number[][];
  rawAsks: number[][];
  asks: number[][];

  // Actions
  addBids: (payload: number[][]) => void;
  addAsks: (payload: number[][]) => void;
  handleAddSnapshotData: (payload: OrderBookSnapshot) => void;
  clearOrdersState: () => void;
}

// 保持原有的工具函数不变
const removePriceLevel = (price: number, levels: number[][]): number[][] =>
  levels.filter((level) => level[0] !== price);

const updatePriceLevel = (updatedLevel: number[], levels: number[][]): number[][] => {
  return levels.map((level) => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

const levelExists = (deltaLevelPrice: number, currentLevels: number[][]): boolean =>
  currentLevels.some((level) => level[0] === deltaLevelPrice);

const applyDeltas = (currentLevels: number[][], orders: number[][]): number[][] => {
  let updatedLevels: number[][] = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelSize = deltaLevel[1];

    if (deltaLevelSize === 0) {
      updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);
    } else {
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else {
        if (updatedLevels.length) {
          updatedLevels = [...updatedLevels, deltaLevel];
        }
      }
    }
  });

  return updatedLevels;
};

export const addTotalSums = (orders: number[][]): number[][] => {
  let total = 0;
  return orders.map((order) => {
    const price = order[0];
    const size = order[1];
    total += size;
    return [price, size, total];
  });
};

export const addPercent = (orders: number[][], maxTotal: number): number[][] => {
  return orders.map((order) => {
    const calculatedTotal = order[2] || 0;
    const percent = (calculatedTotal / maxTotal) * 100;
    return [order[0], order[1], order[2], percent];
  });
};

export const getMaxTotalSum = (orders: number[][]): number => {
  return Math.max(...orders.map((order) => order[2] || 0));
};

// 統一處理型別
export const handleQuotes = (levelList: number[][]): number[][] => {
  return levelList
    .map(([p, s]) => {
      const price = Number(p);
      const size = Number(s);
      if (price && size > 0) {
        return [price, size];
      }
      return [0, 0];
    })
    .filter((order) => order[0] !== 0) as number[][];
};

export const useOrderbookStore = create<OrderbookState>()(
  immer((set, get) => ({
    rawBids: [],
    bids: [],
    rawAsks: [],
    asks: [],

    // Actions
    addBids: (payload) => {
      const currentState = get();
      const rawBids = currentState.rawBids;

      const updatedBids = addTotalSums(applyDeltas(rawBids, payload));

      const maxTotalBids = getMaxTotalSum(updatedBids);

      set((state) => {
        state.bids = addPercent(updatedBids, maxTotalBids);
        state.rawBids = payload;
      });
    },

    addAsks: (payload) => {
      const currentState = get();
      const rawAsks = currentState.rawAsks;

      const updatedAsks = addTotalSums(applyDeltas(rawAsks, payload));

      const maxTotalAsks = getMaxTotalSum(updatedAsks);

      set((state) => {
        state.asks = addPercent(updatedAsks, maxTotalAsks);
        state.rawAsks = payload;
      });
    },

    handleAddSnapshotData: (payload: OrderBookSnapshot) => {
      const asks = handleQuotes(payload.asks);
      const bids = handleQuotes(payload.bids);

      set((state) => {
        state.rawAsks = asks;
        state.rawBids = bids;
        state.asks = asks;
        state.bids = bids;
      });
    },

    clearOrdersState: () => {
      set({
        bids: [],
        asks: [],
        rawBids: [],
        rawAsks: [],
      });
    },
  })),
);
