import { RedisManager } from "./RedisManager";

export class Game {
  public gameId: string;
  public player1: string;
  public player2: string | null;
  private board: string[][];
  private order: Map<string, string[]>;

  constructor(gameId: string, player1: string, player2: string | null) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.board = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
    this.order = new Map<string, string[]>();
  }

  lastMove(gameId: string): string | undefined {
    const moves = this.order.get(gameId);
    if (moves && moves.length > 0) {
      return moves[moves.length - 1];
    }
    return undefined;
  }

  move(
    gameId: string,
    playerId: string,
    row: number,
    col: number,
    symbol: string,
  ) {
    try {
      if (row < 0 || col < 0 || row >= 3 || col >= 3) {
        console.error("Invalid Move");
        return;
      }
      if ((this.board[row] as string[])[col] !== "-") {
        console.error("Cell is already occupied");
        return;
      }
      const lst = this.lastMove(gameId);
      if (lst) {
        if (playerId == lst) {
          console.error("Same player is moving again");
          return;
        }
      }
      (this.board[row] as string[])[col] = symbol;
      const moves = this.order.get(gameId) || [];
      moves.push(playerId);
      this.order.set(gameId, moves);
      const message = JSON.stringify({
        type: "move_made",
        payload: {
          row,
          col,
          symbol,
        },
      });
      RedisManager.getInstance().publish(gameId, message);
      if (this.checkForWin(this.board, symbol)) {
        RedisManager.getInstance().publish(
          gameId,
          JSON.stringify({
            type: "game_over",
            payload: {
              symbol,
            },
          }),
        );
      }
    } catch (error) {
      console.error("Error while making move", error);
      return;
    }
  }

  checkForWin(board: string[][], symbol: string): boolean {
    for (let i = 0; i < 3; i++) {
      if (board[i]?.every((col) => col === symbol)) return true;
      if (board.every((row) => row[i] === symbol)) return true;
    }
    if (
      [0, 1, 2].every((i) => (board[i] as string[])[i] === symbol) ||
      [0, 1, 2].every((i) => (board[i] as string[])[2 - i] === symbol)
    )
      return true;
    return false;
  }
}
