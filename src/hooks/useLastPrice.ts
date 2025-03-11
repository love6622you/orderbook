import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";

const WSS_URL = "wss://ws.btse.com/ws/futures";
const TOPIC = "tradeHistoryApi:BTCPFC";

const useLastPrice = () => {
  const [lastPrice, setLastPrice] = useState(0);
  const prevLastPrice = useRef(0);

  const { sendJsonMessage, getWebSocket } = useWebSocket(WSS_URL, {
    onOpen: () => console.log("[LastPrice] WebSocket connection opened."),
    onClose: () => console.log("[LastPrice] WebSocket connection closed."),
    onMessage: (evt: WebSocketEventMap["message"]) => {
      const { data, topic } = JSON.parse(evt.data);

      if (!data || !topic) return;
      prevLastPrice.current = lastPrice;
      setLastPrice(data[0].price);
    },
    shouldReconnect: () => true,
  });

  const connect = () => {
    const subscribeMessage = {
      op: "subscribe",
      args: [TOPIC],
    };

    sendJsonMessage(subscribeMessage);
  };

  useEffect(() => {
    connect();

    return () => {
      getWebSocket()?.close();
    };
  }, []);

  return {
    lastPrice,
    prevLastPrice: prevLastPrice.current,
  };
};

export default useLastPrice;
