import { WebSocket } from "ws";
import { randomUUID } from "crypto";

export class User {
  public socket: WebSocket;
  public userId: string;
  public id: string;
  constructor(ws: WebSocket, userId: string) {
    this.socket = ws;
    this.userId = userId;
    this.id = randomUUID();
  }
}
