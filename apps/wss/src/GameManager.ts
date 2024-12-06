import { WebSocket } from "ws";
import { User } from "./User";
import { Game } from "./Game";

export class GameManager {
  private users: User[];
  private games: Game[];
  private pendingGameId: string | null;

  constructor() {
    this.users = [];
    this.games = [];
    this.pendingGameId = null;
  }

  addUser(user: User) {
    this.users.push(user);
    this.messageHandler(user);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user.socket !== socket);
  }

  private messageHandler(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "join") {
        if (this.pendingGameId) {
          const game = this.games.find((g) => g.gameId === this.pendingGameId);
          if (!game) {
            console.log("Game not found");
            return;
          }
          if (user.userId === game.player1) {
            console.log("User is already part of this game");
            return;
          }
          game.player2 = user.userId;
        }
      }
    });
  }
}
