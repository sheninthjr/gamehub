export class Game {
  public gameId: string;
  public player1: string;
  public player2: string;
  public board: string[][];
  constructor(
    gameId: string,
    player1: string,
    player2: string,
    board: string[][],
  ) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.board = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
  }
}
