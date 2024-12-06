import { WebSocket } from "ws";

export class User {
  public socket: WebSocket;
  public userId: string;
  constructor(ws: WebSocket, userId: string) {
    this.socket = ws;
    this.userId = userId;
  }
}
