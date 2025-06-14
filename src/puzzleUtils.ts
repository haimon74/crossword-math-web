export type CellType = 'input' | 'fixed' | 'block';
export interface Cell {
  type: CellType;
  value?: string; // for fixed cells (operator/result)
  choices?: string[]; // for input cells (multiple choice)
}
export type GridTemplate = Cell[][];

export interface Puzzle {
  grid: GridTemplate;
  solution: string[][]; // only for input cells, others are ''
}

export const TEMPLATE_5x5: GridTemplate = [
  [ {type:'block'}, {type:'fixed', value:'-'}, {type:'fixed', value:'4'}, {type:'fixed', value:'='}, {type:'block'} ],
  [ {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'+'} ],
  [ {type:'block'}, {type:'input'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'='} ],
  [ {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'='} ],
  [ {type:'fixed', value:'18'}, {type:'fixed', value:'-'}, {type:'fixed', value:'5'}, {type:'fixed', value:'='}, {type:'block'} ],
];

export const TEMPLATE_7x7: GridTemplate = [
  [ {type:'block'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'='}, {type:'block'} ],
  [ {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'+'} ],
  [ {type:'block'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'='} ],
  [ {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'='} ],
  [ {type:'block'}, {type:'input'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'='} ],
  [ {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'-'}, {type:'input'}, {type:'fixed', value:'+'} ],
  [ {type:'block'}, {type:'fixed', value:'='}, {type:'input'}, {type:'fixed', value:'+'}, {type:'input'}, {type:'fixed', value:'='}, {type:'block'} ],
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperation(allowed: string[]): string {
  return allowed[getRandomInt(0, allowed.length - 1)];
}

export function generatePuzzleFromTemplate(template: GridTemplate, allowedOps: string[], numberRange: number): Puzzle {
  const grid: GridTemplate = template.map(row => row.map(cell => ({...cell})));
  const solution: string[][] = grid.map(row => row.map(cell => cell.type === 'input' ? '' : ''));
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].type === 'input') {
        const val = getRandomInt(1, numberRange).toString();
        grid[r][c].value = '';
        solution[r][c] = val;
      }
      if (grid[r][c].type === 'fixed' && ['+', '-', '×', '÷'].includes(grid[r][c].value || '') && allowedOps.length > 1) {
        grid[r][c].value = getRandomOperation(allowedOps);
      }
    }
  }
  return { grid, solution };
}

// 5x5 template: 3 row and 3 column equations, rest are blocks
export function generate5x5Puzzle(allowedOps: string[], numberRange: number): Puzzle {
  const grid: GridTemplate = Array.from({ length: 5 }, () => Array(5).fill(null) as any);
  const solution: string[][] = Array.from({ length: 5 }, () => Array(5).fill(''));

  function randOp() {
    return allowedOps[Math.floor(Math.random() * allowedOps.length)];
  }

  function generateOperands(op: string, numberRange: number) {
    let a: number | undefined, b: number | undefined, result: number | undefined;
    if (op === '+') {
      a = Math.floor(Math.random() * (numberRange - 1)) + 1;
      b = Math.floor(Math.random() * (numberRange - a)) + 1;
      result = a + b;
    } else if (op === '-') {
      b = Math.floor(Math.random() * (numberRange - 1)) + 1;
      result = Math.floor(Math.random() * (numberRange - b)) + 1;
      a = b + result;
      if (a > numberRange) return null;
    } else if (op === '×') {
      a = Math.floor(Math.random() * (numberRange - 1)) + 1;
      b = Math.floor(Math.random() * (numberRange - 1)) + 1;
      result = a * b;
      if (result > numberRange) return null;
    } else if (op === '÷') {
      b = Math.floor(Math.random() * (numberRange - 1)) + 1;
      result = Math.floor(Math.random() * (numberRange - 1)) + 1;
      a = b * result;
      if (a > numberRange) return null;
    }
    if (
      a == null || b == null || result == null ||
      a < 1 || b < 1 || result < 1 ||
      a > numberRange || b > numberRange || result > numberRange
    ) return null;
    return { a, b, result };
  }

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const rowOps = [randOp(), randOp(), randOp()];
    const colOps = [randOp(), randOp(), randOp()];

    let row0 = null;
    for (let i = 0; i < 10 && !row0; i++) row0 = generateOperands(rowOps[0], numberRange);
    if (!row0) continue;
    let { a, b, result: c } = row0;
    if (a == null || b == null || c == null) continue;

    let row2 = null;
    for (let i = 0; i < 10 && !row2; i++) row2 = generateOperands(rowOps[1], numberRange);
    if (!row2) continue;
    let { a: d, b: f, result: g } = row2;
    if (d == null || f == null || g == null) continue;

    let e: number | undefined;
    if (colOps[0] === '+') e = a + d;
    else if (colOps[0] === '-') e = a - d;
    else if (colOps[0] === '×') e = a * d;
    else if (colOps[0] === '÷' && d !== 0 && a % d === 0) e = a / d;
    else continue;
    if (e == null || !Number.isInteger(e) || e < 1 || e > numberRange) continue;

    let h: number | undefined;
    if (colOps[1] === '+') h = b + f;
    else if (colOps[1] === '-') h = b - f;
    else if (colOps[1] === '×') h = b * f;
    else if (colOps[1] === '÷' && f !== 0 && b % f === 0) h = b / f;
    else continue;
    if (h == null || !Number.isInteger(h) || h < 1 || h > numberRange) continue;

    let iVal: number | undefined;
    if (rowOps[2] === '+') iVal = e + h;
    else if (rowOps[2] === '-') iVal = e - h;
    else if (rowOps[2] === '×') iVal = e * h;
    else if (rowOps[2] === '÷' && h !== 0 && e % h === 0) iVal = e / h;
    else continue;
    if (iVal == null || !Number.isInteger(iVal) || iVal < 1 || iVal > numberRange) continue;

    let i2: number | undefined;
    if (colOps[2] === '+') i2 = c + g;
    else if (colOps[2] === '-') i2 = c - g;
    else if (colOps[2] === '×') i2 = c * g;
    else if (colOps[2] === '÷' && g !== 0 && c % g === 0) i2 = c / g;
    else continue;
    if (i2 == null || !Number.isInteger(i2) || i2 !== iVal) continue;

    // All values are valid, fill the grid
    // Pre-reveal (0,0), (0,4), (2,2), (4,4) as fixed
    // All other variable cells are input
    grid[0][0] = { type: 'fixed', value: a.toString() }; solution[0][0] = a.toString();
    grid[0][1] = { type: 'fixed', value: rowOps[0] };
    grid[0][2] = { type: 'input' }; solution[0][2] = b.toString();
    grid[0][3] = { type: 'fixed', value: '=' };
    grid[0][4] = { type: 'fixed', value: c.toString() }; solution[0][4] = c.toString();
    grid[2][0] = { type: 'input' }; solution[2][0] = d.toString();
    grid[2][1] = { type: 'fixed', value: rowOps[1] };
    grid[2][2] = { type: 'fixed', value: f.toString() }; solution[2][2] = f.toString();
    grid[2][3] = { type: 'fixed', value: '=' };
    grid[2][4] = { type: 'input' }; solution[2][4] = g.toString();
    grid[4][0] = { type: 'input' }; solution[4][0] = e.toString();
    grid[4][1] = { type: 'fixed', value: rowOps[2] };
    grid[4][2] = { type: 'input' }; solution[4][2] = h.toString();
    grid[4][3] = { type: 'fixed', value: '=' };
    grid[4][4] = { type: 'fixed', value: iVal.toString() }; solution[4][4] = iVal.toString();
    grid[1][0] = { type: 'fixed', value: colOps[0] };
    grid[3][0] = { type: 'fixed', value: '=' };
    grid[1][2] = { type: 'fixed', value: colOps[1] };
    grid[3][2] = { type: 'fixed', value: '=' };
    grid[1][4] = { type: 'fixed', value: colOps[2] };
    grid[3][4] = { type: 'fixed', value: '=' };
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!grid[r][c]) grid[r][c] = { type: 'block' };
      }
    }
    return { grid, solution };
  }
  return generate5x5Puzzle(['+'], numberRange);
}

export function generate7x7Puzzle(allowedOps: string[], numberRange: number): Puzzle {
  const grid: GridTemplate = Array.from({ length: 7 }, () => Array(7).fill(null) as any);
  const solution: string[][] = Array.from({ length: 7 }, () => Array(7).fill(''));

  function randOp() {
    return allowedOps[Math.floor(Math.random() * allowedOps.length)];
  }

  function generateOperands2(op1: string, op2: string, numberRange: number) {
    for (let tries = 0; tries < 20; tries++) {
      let a = Math.floor(Math.random() * (numberRange - 1)) + 1;
      let b = Math.floor(Math.random() * (numberRange - 1)) + 1;
      let c = Math.floor(Math.random() * (numberRange - 1)) + 1;
      let res1, result;
      if (op1 === '+') res1 = a + b;
      else if (op1 === '-') res1 = a - b;
      else if (op1 === '×') res1 = a * b;
      else if (op1 === '÷' && b !== 0 && a % b === 0) res1 = a / b;
      else continue;
      if (op2 === '+') result = res1 + c;
      else if (op2 === '-') result = res1 - c;
      else if (op2 === '×') result = res1 * c;
      else if (op2 === '÷' && c !== 0 && res1 % c === 0) result = res1 / c;
      else continue;
      if (!Number.isInteger(result) || result < 1 || result > numberRange) continue;
      return { a, b, c, result };
    }
    return null;
  }

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const rowOps = Array.from({ length: 4 }, () => [randOp(), randOp()]);
    const colOps = Array.from({ length: 4 }, () => [randOp(), randOp()]);
    for (let r of [0,2,4,6]) {
      const idx = r/2;
      const ops = rowOps[idx];
      const eq = generateOperands2(ops[0], ops[1], numberRange);
      if (!eq) continue;
      const { a, b, c, result } = eq;
      solution[r][0] = a.toString();
      solution[r][2] = b.toString();
      solution[r][4] = c.toString();
      solution[r][6] = result.toString();
      grid[r][1] = { type: 'fixed', value: ops[0] };
      grid[r][3] = { type: 'fixed', value: ops[1] };
      grid[r][5] = { type: 'fixed', value: '=' };
    }
    for (let c of [0,2,4,6]) {
      const idx = c/2;
      const ops = colOps[idx];
      let a = solution[0][c] ? parseInt(solution[0][c]) : Math.floor(Math.random() * (numberRange - 1)) + 1;
      let b = solution[2][c] ? parseInt(solution[2][c]) : Math.floor(Math.random() * (numberRange - 1)) + 1;
      let cval = solution[4][c] ? parseInt(solution[4][c]) : Math.floor(Math.random() * (numberRange - 1)) + 1;
      let res1, result;
      if (ops[0] === '+') res1 = a + b;
      else if (ops[0] === '-') res1 = a - b;
      else if (ops[0] === '×') res1 = a * b;
      else if (ops[0] === '÷' && b !== 0 && a % b === 0) res1 = a / b;
      else continue;
      if (ops[1] === '+') result = res1 + cval;
      else if (ops[1] === '-') result = res1 - cval;
      else if (ops[1] === '×') result = res1 * cval;
      else if (ops[1] === '÷' && cval !== 0 && res1 % cval === 0) result = res1 / cval;
      else continue;
      if (!Number.isInteger(result) || result < 1 || result > numberRange) continue;
      solution[6][c] = result.toString();
      grid[1][c] = { type: 'fixed', value: ops[0] };
      grid[3][c] = { type: 'fixed', value: ops[1] };
      grid[5][c] = { type: 'fixed', value: '=' };
    }
    // Set black/unused cells
    const blackSet = new Set([
      '1_1','1_3','1_5','3_1','3_3','3_5','5_1','5_3','5_5'
    ]);
    // Set hidden input cells
    const inputSet = new Set([
      '2_2','4_2','4_4','0_4','0_0','6_0','6_6'
    ]);
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (blackSet.has(`${r}_${c}`)) {
          grid[r][c] = { type: 'block' };
        } else if (grid[r][c] && grid[r][c].type === 'fixed') {
          // already set (operator or equals)
          continue;
        } else if (inputSet.has(`${r}_${c}`)) {
          grid[r][c] = { type: 'input' };
        } else {
          // reveal as fixed
          grid[r][c] = { type: 'fixed', value: solution[r][c] };
        }
      }
    }
    return { grid, solution };
  }
  return generate7x7Puzzle(['+'], numberRange);
} 