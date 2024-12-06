import { WEBSOCKET_URL } from "@/config";
import { useEffect, useState } from "react";

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}?userId=${userId}`);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
  }, []);
  return socket;
}
