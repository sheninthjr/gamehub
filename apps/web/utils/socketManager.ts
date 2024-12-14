import { WEBSOCKET_URL } from "@/config";

type MessageHandler = (data: any) => void;

export class SocketManager {
  private ws: WebSocket | null = null;
  private static instance: SocketManager;
  private bufferedMessages: any[] = [];
  private initialized: boolean = false;
  private userId: string | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  public initialize(userId: string): void {
    if (this.ws) {
      console.warn("Socket already initialized");
      return;
    }

    this.userId = userId;
    this.ws = new WebSocket(`${WEBSOCKET_URL}?userId=${userId}`);

    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((message) => {
        this.ws?.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(data));
    };

    this.ws.onclose = () => {
      this.initialized = false;
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }

  public sendMessage(message: any): void {
    if (!this.initialized || !this.ws) {
      this.bufferedMessages.push(message);
      return;
    }
    this.ws.send(JSON.stringify(message));
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);

    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.initialized = false;
      this.messageHandlers.clear();
    }
  }
}
