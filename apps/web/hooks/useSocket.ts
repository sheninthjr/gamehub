import { WEBSOCKET_URL } from "@/config";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const userId = session?.user.id;
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
