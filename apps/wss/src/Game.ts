import { SocketManager } from "./SocketManager";

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
    this.order = new Map<string,string[]>();
  }

  lastMove(gameId:string) : string | undefined {
    const moves = this.order.get(gameId);
    if(moves && moves.length > 0) {
      return moves[moves.length - 1];
    }
    return undefined;
  }

  move(gameId: string, playerId: string, row: number, column: number,symbol:string) {
    try {
      if(row < 0 || column < 0 || row >= 3 || column >= 3 || this.board[row]?.[column] === undefined) {
        console.error("Invalid Move");
        return;
      }
      if((this.board[row][column]) !== '-') {
        console.error("Cell is already occupied");
        return;
      }
      const lst = this.lastMove(gameId);
      if(lst) {
        if(playerId == lst) {
          console.error("Same player is moving again");
          return;
        }
      }
      this.board[row][column] = symbol;
      const moves = this.order.get(gameId) || [];
      moves.push(playerId);
      this.order.set(gameId, moves);
      console.log("moved Successfully")
      const message = JSON.stringify({
        type: "move_made",
        payload: {
          row,
          column,
          symbol
        }
      })
      SocketManager.getInstance().broadcast(gameId,message);
    } catch (error) {
      console.error("Error while making move",error)
      return; 
    }
  }
}
