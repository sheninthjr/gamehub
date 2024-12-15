import { SocketManager } from "@/utils/socketManager";
import { useEffect, useState } from "react";

export function useSocket() {
  const [socket, setSocket] = useState<SocketManager | null>(null);
  const userId = "774d1cc1-4455-41ce-859f-2a27de47756c";

  useEffect(() => {
    if (userId) {
      const socketManager = SocketManager.getInstance();
      if (!socketManager.isInitialized()) {
        socketManager.initialize(userId);
      }
      setSocket(socketManager);
    }
  }, [userId]);
  return socket;
}
