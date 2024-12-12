export function generateBoard(): {
  filledBoard: number[][];
  boardWithRemovedNumbers: number[][];
} {
  const SIZE = 9;
  const SUBGRID = 3;
  const board: number[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(0),
  );

  function fillDiagonal() {
    for (let i = 0; i < SIZE; i += SUBGRID) {
      fillSubGrid(i, i);
    }
  }

  function fillSubGrid(row: number, col: number) {
    const nums: number[] = shuffle(
      Array.from({ length: SIZE }, (_, i) => i + 1),
    );
    for (let i = 0; i < SUBGRID; i++) {
      for (let j = 0; j < SUBGRID; j++) {
        //@ts-ignore
        board[row + i][col + j] = nums[i * SUBGRID + j];
      }
    }
  }

  function shuffle(nums: number[]) {
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      //@ts-ignore
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  }

  function isValid(board: number[][], row: number, col: number, num: number) {
    for (let i = 0; i < SIZE; i++) {
      if ((board[row] as number[])[i] === num) {
        return false;
      }
      if ((board[i] as number[])[col] === num) {
        return false;
      }
      if (
        (
          board[
            SUBGRID * Math.floor(row / SUBGRID) + Math.floor(i / SUBGRID)
          ] as number[]
        )[SUBGRID * Math.floor(col / SUBGRID) + (i % SUBGRID)] === num
      ) {
        return false;
      }
    }
    return true;
  }

  function fillBoard() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < (board[0] as number[])?.length; j++) {
        if ((board[i] as number[])[j] === 0) {
          for (let num = 1; num <= SIZE; num++) {
            if (isValid(board, i, j, num)) {
              (board[i] as number[])[j] = num;
              if (fillBoard()) {
                return true;
              }
              (board[i] as number[])[j] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function removeNumbers(holes = 45) {
    const boardWithRemovedNumbers = JSON.parse(JSON.stringify(board));
    while (holes > 0) {
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      if ((boardWithRemovedNumbers[row] as number[])[col] !== 0) {
        (boardWithRemovedNumbers[row] as number[])[col] = 0;
        holes--;
      }
    }
    return boardWithRemovedNumbers;
  }

  fillDiagonal();
  fillBoard();
  const boardWithRemovedNumbers = removeNumbers();

  return { filledBoard: board, boardWithRemovedNumbers };
}
