import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";

export class RedisManager {
  private static instance: RedisManager;
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private subscriptions: Map<string, string[]> = new Map();
  private reverseSubscriptions: Map<
    string,
    { [userId: string]: { ws: WebSocket } }
  > = new Map();

  private constructor() {
    this.publisher = createClient();
    this.publisher.connect();
    this.subscriber = createClient();
    this.subscriber.connect();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public subscribe(userId: string, gameId: string, ws: WebSocket) {
    if (this.subscriptions.get(userId)?.includes(gameId)) {
      return;
    }

    this.subscriptions.set(
      userId,
      (this.subscriptions.get(userId) || []).concat(gameId),
    );
    this.reverseSubscriptions.set(gameId, {
      ...(this.reverseSubscriptions.get(gameId) || {}),
      [userId]: { ws },
    });
    if (
      Object.keys(this.reverseSubscriptions.get(gameId) || {})?.length === 1
    ) {
      this.subscriber.subscribe(gameId, (message) => {
        const users = this.reverseSubscriptions.get(gameId) || {};
        Object.values(users).forEach(({ ws }) => {
          ws.send(message);
        });
      });
    }
  }

  public unsubscribe(userId: string, gameId: string) {
    const subscriptions = this.subscriptions.get(userId);
    if (subscriptions) {
      this.subscriptions.set(
        userId,
        subscriptions.filter((s) => s !== gameId),
      );
    }
    delete this.reverseSubscriptions.get(gameId)?.[userId];
    if (
      !this.reverseSubscriptions.get(gameId) ||
      Object.keys(this.reverseSubscriptions.get(gameId) || {}).length === 0
    ) {
      this.subscriber.unsubscribe(gameId);
      this.reverseSubscriptions.delete(gameId);
    }
  }

  public publish(gameId: string, message: any) {
    this.publisher.publish(gameId, message);
  }
}
