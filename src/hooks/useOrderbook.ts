import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";

import { handleQuotes, useOrderbookStore } from "@/stores/useOrderbookSlice";

const WSS_URL = "wss://ws.btse.com/ws/oss/futures";
const TOPIC = "update:BTCPFC_0";

const useOrderbook = () => {
  const currentAsks = useRef<number[][]>([]);
  const currentBids = useRef<number[][]>([]);

  // 序列號
  const seqNumRef = useRef(null);

  const store = useOrderbookStore();
  const bids = store.bids;
  const asks = store.asks;

  const { sendJsonMessage, getWebSocket } = useWebSocket(WSS_URL, {
    onOpen: () => console.log("[Orderbook] WebSocket connection opened."),
    onClose: () => console.log("[Orderbook] WebSocket connection closed."),
    onMessage: (evt: WebSocketEventMap["message"]) => {
      const { data, topic } = JSON.parse(evt.data);

      if (!data || topic !== TOPIC) return;

      switch (data.type) {
        case "snapshot":
          seqNumRef.current = data.seqNum;
          store.handleAddSnapshotData(data);
          break;

        case "delta":
          if (data.prevSeqNum !== seqNumRef.current) {
            reSubscribe();
            return;
          }

          if (data?.asks?.length >= 0) {
            currentAsks.current = [...currentAsks.current, ...data.asks];

            store.addAsks(handleQuotes(currentAsks.current));
            currentAsks.current = [];
            currentAsks.current.length = 0;
          }

          if (data?.bids?.length > 0) {
            currentBids.current = [...currentBids.current, ...data.bids];

            store.addBids(handleQuotes(currentBids.current));
            currentBids.current = [];
            currentBids.current.length = 0;
          }

          break;

        default:
          break;
      }

      if (isCrossedBook()) {
        reSubscribe();
      }
    },
    shouldReconnect: () => true,
  });

  // The bid price is equal or higher than the lowest ask
  const isCrossedBook = () => {
    if (!bids.length || !asks.length) return false;
    const bestBid = Math.max(...bids.map(([p]) => p));
    const bestAsk = Math.min(...asks.map(([p]) => p));
    return bestBid >= bestAsk;
  };

  const reSubscribe = () => {
    if (getWebSocket()?.readyState !== WebSocket.OPEN) return;
    const unSubscribeMessage = { op: "unsubscribe", args: [TOPIC] };
    sendJsonMessage(unSubscribeMessage);

    const subscribeMessage = { op: "subscribe", args: [TOPIC] };
    sendJsonMessage(subscribeMessage);
  };

  const connect = () => {
    const subscribeMessage = { op: "subscribe", args: [TOPIC] };

    sendJsonMessage(subscribeMessage);
  };

  useEffect(() => {
    connect();

    return () => {
      getWebSocket()?.close();
    };
  }, []);
};

export default useOrderbook;
