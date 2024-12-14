import { SocketManager } from "@/utils/socketManager";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<SocketManager | null>(null);
  const userId = session?.user.id;

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
