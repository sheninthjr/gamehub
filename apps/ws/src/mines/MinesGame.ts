import { WebSocket } from "ws";

export class MinesGame {
  public gameId: string;
  public playerId: string;
  public board: string[][];
  public points: number;
  public isGameOver: boolean;

  constructor(gameId: string, playerId: string) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.board = [
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
    ];
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    (this.board[row] as string[])[col] = "X";
    this.points = 0;
    this.isGameOver = false;
  }

  public click(gameId: string, row: number, col: number, ws: WebSocket) {
    if (this.isGameOver) {
      ws.send(
        JSON.stringify({
          type: "mines_game_over",
          gameId: gameId,
          payload: {
            message: "Game is already over",
            row: row,
            col: col,
            points: this.points,
          },
        }),
      );
      return;
    }

    if ((this.board[row] as string[])[col] === "X") {
      this.isGameOver = true;
      ws.send(
        JSON.stringify({
          type: "mines_click",
          gameId: gameId,
          payload: {
            status: "game_over",
            row: row,
            col: col,
            message: "You clicked the mine! Game Over.",
            points: this.points,
          },
        }),
      );
    } else if ((this.board[row] as string[])[col] === "-") {
      (this.board[row] as string[])[col] = "C";
      this.points++;
      ws.send(
        JSON.stringify({
          type: "mines_click",
          gameId: gameId,
          payload: {
            status: "correct",
            row: row,
            col: col,
            message: "Correct cell! Points awarded.",
            points: this.points,
          },
        }),
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "mines_click",
          gameId: gameId,
          payload: {
            status: "already_clicked",
            row: row,
            col: col,
            message: "This cell has already been clicked.",
            points: this.points,
          },
        }),
      );
    }
  }
}
