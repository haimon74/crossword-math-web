import { generate5x5Puzzle } from './puzzleUtils';

describe('generate5x5Puzzle', () => {
  it('generates a grid with correct structure and pre-revealed cells', () => {
    const allowedOps = ['+', '-'];
    const numberRange = 20;
    const { grid, solution } = generate5x5Puzzle(allowedOps, numberRange);
    // Check grid size
    expect(grid.length).toBe(5);
    expect(grid[0].length).toBe(5);
    // Check pre-revealed cells
    expect(grid[0][0].type).toBe('fixed');
    expect(grid[0][4].type).toBe('fixed');
    expect(grid[2][2].type).toBe('fixed');
    expect(grid[4][4].type).toBe('fixed');
    // Check input cells
    let inputCount = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c].type === 'input') inputCount++;
      }
    }
    expect(inputCount).toBe(5); // 9 variable cells - 4 pre-revealed
  });

  it('all row and column equations are valid for addition/subtraction', () => {
    const allowedOps = ['+', '-'];
    const numberRange = 20;
    const { grid, solution } = generate5x5Puzzle(allowedOps, numberRange);
    // Check rows 0,2,4
    for (let r of [0,2,4]) {
      const a = parseInt(solution[r][0]);
      const op = grid[r][1].value;
      const b = parseInt(solution[r][2]);
      const eq = grid[r][3].value;
      const res = parseInt(solution[r][4]);
      expect(eq).toBe('=');
      if (op === '+') expect(a + b).toBe(res);
      if (op === '-') expect(a - b).toBe(res);
    }
    // Check cols 0,2,4
    for (let c of [0,2,4]) {
      const a = parseInt(solution[0][c]);
      const op = grid[1][c].value;
      const b = parseInt(solution[2][c]);
      const eq = grid[3][c].value;
      const res = parseInt(solution[4][c]);
      expect(eq).toBe('=');
      if (op === '+') expect(a + b).toBe(res);
      if (op === '-') expect(a - b).toBe(res);
    }
  });

  it('can generate both addition and subtraction', () => {
    const allowedOps = ['+', '-'];
    const numberRange = 20;
    let foundAdd = false, foundSub = false;
    for (let i = 0; i < 20; i++) {
      const { grid } = generate5x5Puzzle(allowedOps, numberRange);
      for (let r of [0,2,4]) {
        if (grid[r][1].value === '+') foundAdd = true;
        if (grid[r][1].value === '-') foundSub = true;
      }
      for (let c of [0,2,4]) {
        if (grid[1][c].value === '+') foundAdd = true;
        if (grid[1][c].value === '-') foundSub = true;
      }
      if (foundAdd && foundSub) break;
    }
    expect(foundAdd).toBe(true);
    expect(foundSub).toBe(true);
  });

  it('all row and column equations are valid for multiplication/division', () => {
    const allowedOps = ['×', '÷'];
    const numberRange = 20;
    const { grid, solution } = generate5x5Puzzle(allowedOps, numberRange);
    // Check rows 0,2,4
    for (let r of [0,2,4]) {
      const a = parseInt(solution[r][0]);
      const op = grid[r][1].value;
      const b = parseInt(solution[r][2]);
      const eq = grid[r][3].value;
      const res = parseInt(solution[r][4]);
      expect(eq).toBe('=');
      if (op === '×') expect(a * b).toBe(res);
      if (op === '÷') expect(a / b).toBe(res);
    }
    // Check cols 0,2,4
    for (let c of [0,2,4]) {
      const a = parseInt(solution[0][c]);
      const op = grid[1][c].value;
      const b = parseInt(solution[2][c]);
      const eq = grid[3][c].value;
      const res = parseInt(solution[4][c]);
      expect(eq).toBe('=');
      if (op === '×') expect(a * b).toBe(res);
      if (op === '÷') expect(a / b).toBe(res);
    }
  });

  it('can generate both multiplication and division', () => {
    const allowedOps = ['×', '÷'];
    const numberRange = 20;
    let foundMul = false, foundDiv = false;
    for (let i = 0; i < 20; i++) {
      const { grid } = generate5x5Puzzle(allowedOps, numberRange);
      for (let r of [0,2,4]) {
        if (grid[r][1].value === '×') foundMul = true;
        if (grid[r][1].value === '÷') foundDiv = true;
      }
      for (let c of [0,2,4]) {
        if (grid[1][c].value === '×') foundMul = true;
        if (grid[1][c].value === '÷') foundDiv = true;
      }
      if (foundMul && foundDiv) break;
    }
    expect(foundMul).toBe(true);
    expect(foundDiv).toBe(true);
  });
}); 