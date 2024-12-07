import { WebSocket } from "ws";
import { User } from "./User";
import { Game } from "./Game";
import { SocketManager } from "./SocketManager";

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
          SocketManager.getInstance().addUser(user,game.gameId);
          this.pendingGameId = null;
          const gameId = game.gameId;
          const gameStarted = JSON.stringify({
            type: "game_started",
            payload: {
              player1: game.player1,
              player2: game.player2,
              gameId
            }
          })
          console.log("Game Started")
          SocketManager.getInstance().broadcast(gameId,gameStarted);
        } else {
          const gameId = crypto.randomUUID();
          const game = new Game(gameId,user.userId, null);
          this.pendingGameId = gameId;
          console.log(gameId)
          this.games.push(game);
          SocketManager.getInstance().addUser(user,gameId); 
        }
      }
      if(message.type === 'moving') {
        const gameId:string = message.payload.gameId;
        const playerId:string = message.payload.playerId;
        const row = message.payload.row;
        const column = message.payload.column;
        const symbol = message.payload.symbol;
        const game = this.games.find((g) => g.gameId === gameId);
        if(game) {
          game.move(gameId,playerId,row,column,symbol);
        } else {
          console.log("No game found")
        }
      }
    });
  }
}
