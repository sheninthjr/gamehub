import { WebSocket } from "ws";
import { User } from "./User";
import { XoxoGame } from "./xoxo/XoxoGame";
import { RedisManager } from "./RedisManager";
import prisma from "db/client";
import { MinesGame } from "./mines/MinesGame";
import { SudokuGame } from "./sudoku/SudokuGame";

export class GameManager {
  private users: User[];
  private games: XoxoGame[];
  private mines: MinesGame[];
  private sudoku: SudokuGame[];
  private pendingGameId: string | null;
  private liveUser: Map<string, string[]> = new Map();

  constructor() {
    this.users = [];
    this.games = [];
    this.mines = [];
    this.sudoku = [];
    this.pendingGameId = null;
  }

  addUser(user: User) {
    this.users.push(user);
    this.messageHandler(user);
  }

  removeUser(socket: WebSocket) {
    const removedUser = this.users.find((u) => u.socket === socket);
    this.users = this.users.filter((user) => user.socket !== socket);
    if (removedUser) {
      for (const [id, userId] of this.liveUser.entries()) {
        const updatedUserId = userId.filter((u) => u !== removedUser.userId);
        if (updatedUserId.length === 0) {
          this.liveUser.delete(id);
        } else {
          this.liveUser.set(id, updatedUserId);
        }
      }
    }
  }

  private messageHandler(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "welcome") {
        const mines =
          this.liveUser.get("355a5c37-c2ba-481c-bdd3-99f4828aa49e")?.length ||
          0;
        const xoxo =
          this.liveUser.get("141d4980-c376-4fe8-8c5b-11b1f6ab7196")?.length ||
          0;
        const sudoku =
          this.liveUser.get("3eb59008-c962-4320-9904-84c5257e8c8d")?.length ||
          0;
        RedisManager.getInstance().subscribe(
          user.userId,
          "welcome",
          user.socket,
        );
        RedisManager.getInstance().publish(
          "welcome",
          JSON.stringify({
            type: "welcome",
            payload: {
              mines,
              xoxo,
              sudoku,
            },
          }),
        );
      }
      if (message.type === "xoxo_join") {
        const id = message.payload.id;
        const currentUsers = this.liveUser.get(id) || [];
        if (!currentUsers.includes(user.userId)) {
          this.liveUser.set(id, [...currentUsers, user.userId]);
        }
        const mines =
          this.liveUser.get("355a5c37-c2ba-481c-bdd3-99f4828aa49e")?.length ||
          0;
        const xoxo =
          this.liveUser.get("141d4980-c376-4fe8-8c5b-11b1f6ab7196")?.length ||
          0;
        const sudoku =
          this.liveUser.get("3eb59008-c962-4320-9904-84c5257e8c8d")?.length ||
          0;
        RedisManager.getInstance().publish(
          "welcome",
          JSON.stringify({
            type: "welcome",
            payload: {
              mines,
              xoxo,
              sudoku,
            },
          }),
        );
        this.joinHandler(user, message);
      }
      if (message.type === "xoxo_moving") {
        this.movement(message);
      }
      if (message.type === "xoxo_chat_message") {
        this.chatHandler(message);
      }
      if (message.type === "mines_join") {
        const id = message.payload.id;
        const currentUsers = this.liveUser.get(id) || [];
        if (!currentUsers.includes(user.userId)) {
          this.liveUser.set(id, [...currentUsers, user.userId]);
        }
        const mines =
          this.liveUser.get("355a5c37-c2ba-481c-bdd3-99f4828aa49e")?.length ||
          0;
        const xoxo =
          this.liveUser.get("141d4980-c376-4fe8-8c5b-11b1f6ab7196")?.length ||
          0;
        const sudoku =
          this.liveUser.get("3eb59008-c962-4320-9904-84c5257e8c8d")?.length ||
          0;
        RedisManager.getInstance().publish(
          "welcome",
          JSON.stringify({
            type: "welcome",
            payload: {
              mines,
              xoxo,
              sudoku,
            },
          }),
        );
        const gameId = crypto.randomUUID();
        const playerId = user.userId;
        const game = new MinesGame(gameId, playerId);
        this.mines.push(game);
        user.socket.send(
          JSON.stringify({
            type: "mines_gameId",
            gameId: gameId,
          }),
        );
      }
      if (message.type === "mines_click") {
        const row = message.payload.row;
        const col = message.payload.col;
        const gameId = message.payload.gameId;
        const game = this.mines.find((g) => g.gameId === gameId);
        if (game) {
          game.click(gameId, row, col, user.socket);
        } else {
          console.log("No game found");
        }
      }
      if (message.type === "sudoku_join") {
        const id = message.payload.id;
        const currentUsers = this.liveUser.get(id) || [];
        if (!currentUsers.includes(user.userId)) {
          this.liveUser.set(id, [...currentUsers, user.userId]);
        }
        const mines =
          this.liveUser.get("355a5c37-c2ba-481c-bdd3-99f4828aa49e")?.length ||
          0;
        const xoxo =
          this.liveUser.get("141d4980-c376-4fe8-8c5b-11b1f6ab7196")?.length ||
          0;
        const sudoku =
          this.liveUser.get("3eb59008-c962-4320-9904-84c5257e8c8d")?.length ||
          0;
        RedisManager.getInstance().publish(
          "welcome",
          JSON.stringify({
            type: "welcome",
            payload: {
              mines,
              xoxo,
              sudoku,
            },
          }),
        );
        const gameId = crypto.randomUUID();
        const playerId = user.userId;
        const game = new SudokuGame(gameId, playerId);
        this.sudoku.push(game);
        user.socket.send(
          JSON.stringify({
            type: "game_started",
            payload: {
              gameId: gameId,
              board: game.board,
            },
          }),
        );
      }
      if (message.type === "sudoku_click") {
        const row = message.payload.row;
        const col = message.payload.col;
        const gameId = message.payload.gameId;
        const num = message.payload.num;
        const game = this.sudoku.find((s) => s.gameId === gameId);
        if (game) {
          game.click(gameId, row, col, num, user.socket);
        } else {
          console.log("Game not found");
        }
      }
    });
  }

  private async joinHandler(user: User, message: any) {
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
      const userObject = this.users.find((x) => x.userId === user.userId);
      if (!userObject?.socket) {
        return;
      }
      RedisManager.getInstance().subscribe(
        game.player2,
        game.gameId,
        userObject?.socket,
      );
      this.pendingGameId = null;
      const gameId = game.gameId;
      const gameStarted = JSON.stringify({
        type: "xoxo_game_started",
        payload: {
          player1: game.player1,
          player2: game.player2,
          gameId,
        },
      });
      RedisManager.getInstance().publish(gameId, gameStarted);
      await prisma.gameHistory.createMany({
        data: [
          {
            gameId: gameId,
            player1: game.player1,
            player2: game.player2,
            gameName: "XOXO",
            gameStatus: "STARTED",
            gameType: "MULTI",
            userId: game.player1,
          },
          {
            gameId: gameId,
            player1: game.player1,
            player2: game.player2,
            gameName: "XOXO",
            gameStatus: "STARTED",
            gameType: "MULTI",
            userId: game.player2,
          },
        ],
      });
    } else {
      const gameId = crypto.randomUUID();
      const id = message.payload.id;
      const game = new XoxoGame(gameId, user.userId, null);
      this.pendingGameId = gameId;
      const userObject = this.users.find((x) => x.userId === user.userId);
      if (!userObject?.socket) {
        return;
      }
      this.games.push(game);
      RedisManager.getInstance().subscribe(
        user.userId,
        gameId,
        userObject?.socket,
      );
      RedisManager.getInstance().publish(
        gameId,
        JSON.stringify({
          type: "xoxo_waiting",
          payload: {
            message: "waiting",
          },
        }),
      );
    }
  }

  private movement(message: any) {
    const gameId: string = message.payload.gameId;
    const playerId: string = message.payload.playerId;
    const row = message.payload.row;
    const col = message.payload.col;
    const symbol = message.payload.symbol;
    const game = this.games.find((g) => g.gameId === gameId);
    if (game) {
      game.move(gameId, playerId, row, col, symbol);
    } else {
      console.log("No game found");
    }
  }

  private chatHandler(message: any) {
    const gameId = message.payload.gameId;
    const playerId = message.payload.playerId;
    const chatMessage = message.payload.message;
    const chatPayload = JSON.stringify({
      type: "xoxo_chat_message",
      payload: {
        gameId,
        playerId,
        message: chatMessage,
      },
    });
    RedisManager.getInstance().publish(gameId, chatPayload);
  }
}
