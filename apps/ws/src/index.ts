import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { User } from "./User";
import { parse } from "url";

const wss = new WebSocketServer({ port: 8081 });

const game = new GameManager();

wss.on("connection", (ws, req) => {
  const userId = parse(req.url || "", true).query.userId;
  game.addUser(new User(ws, userId as string));
});
