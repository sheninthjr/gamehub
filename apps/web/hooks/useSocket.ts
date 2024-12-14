import { SocketManager } from "@/utils/socketManager";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<SocketManager | null>(null);
  const userId = session?.user.id;
  useEffect(() => {
    const socketManager = SocketManager.getInstance();
    socketManager.initialize(userId as string);
    setSocket(socketManager);
    return () => {
      socketManager.close();
    };
  }, [userId]);
  return socket;
}
