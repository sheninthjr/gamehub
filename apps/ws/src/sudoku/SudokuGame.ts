import { WebSocket } from "ws";
import { generateBoard } from "./generateBoard";

const MESSAGE_TYPES = {
  GAME_OVER: "sudoku_game_over",
  INVALID_MOVE: "sudoku_invalid_move",
  CORRECT_MOVE: "sudoku_correct_move",
  GAME_COMPLETED: "sudoku_game_completed",
};

export class SudokuGame {
  public gameId: string;
  public playerId: string;
  public board: number[][];
  private finalBoard: number[][];
  public isGameOver: boolean;

  constructor(gameId: string, playerId: string) {
    this.gameId = gameId;
    this.playerId = playerId;
    const generateBoards = generateBoard();
    this.board = generateBoards.boardWithRemovedNumbers;
    this.finalBoard = generateBoards.filledBoard;
    this.isGameOver = false;
  }

  click(gameId: string, row: number, col: number, num: number, ws: WebSocket) {
    if (this.isGameOver) {
      this.sendMessage(ws, MESSAGE_TYPES.GAME_OVER, {
        message: "Game is already over",
        row,
        col,
      });
      return;
    }

    if (!this.isValid(row, col, num)) {
      this.sendMessage(ws, MESSAGE_TYPES.INVALID_MOVE, {
        message: "Invalid move",
        row,
        col,
        num,
      });
      return;
    }

    (this.board[row] as number[])[col] = num;
    this.sendMessage(ws, MESSAGE_TYPES.CORRECT_MOVE, {
      message: "Correct Move",
      row,
      col,
      num,
    });

    if (this.isGameCompleted()) {
      this.isGameOver = true;
      this.sendMessage(ws, MESSAGE_TYPES.GAME_COMPLETED, {
        message: "Congratulations! Game completed successfully",
      });
    }
  }

  private sendMessage(ws: WebSocket, type: string, payload: object) {
    ws.send(
      JSON.stringify({
        type,
        gameId: this.gameId,
        payload,
      }),
    );
  }

  private isGameCompleted(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          (this.board[row] as number[])[col] === 0 ||
          !this.isValid(row, col, this.board[row]![col]!)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private isValid(row: number, col: number, num: number) {
    if ((this.finalBoard[row] as number[])[col] === num) {
      return true;
    }
    return false;
  }
}
