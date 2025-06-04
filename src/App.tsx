import React, { useState } from 'react';
import './App.css';
import { Grid } from './Grid';
import { generate5x5Puzzle, GridTemplate } from './puzzleUtils';

const GRID_SIZES = [
  { label: '5x5 grid', value: 5 },
  { label: '7x7 grid', value: 7 },
];

const OP_OPTIONS = [
  { label: 'Addition & Subtraction', value: ['+', '-'] },
  { label: 'Multiplication & Division', value: ['×', '÷'] },
];

function emptyUserGrid(template: GridTemplate): string[][] {
  return template.map(row => row.map(cell => (cell.type === 'input' ? '' : '')));
}

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState(5);
  const [allowedOps, setAllowedOps] = useState<string[]>(['+']);
  const [numberRange, setNumberRange] = useState<number>(20);
  const [puzzle, setPuzzle] = useState(() => generate5x5Puzzle(allowedOps, numberRange));
  const [userGrid, setUserGrid] = useState<string[][]>(emptyUserGrid(puzzle.grid));
  const [checkResult, setCheckResult] = useState<boolean[][] | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleNewPuzzle() {
    const np = generate5x5Puzzle(allowedOps, numberRange);
    setPuzzle(np);
    setUserGrid(emptyUserGrid(np.grid));
    setCheckResult(null);
    setRevealed(false);
  }

  function handleInput(row: number, col: number, value: string) {
    setUserGrid(prev => prev.map((r, ri) => r.map((cell, ci) => (ri === row && ci === col ? value : cell))));
    setCheckResult(null);
    setRevealed(false);
  }

  function handleCheck() {
    setCheckResult(userGrid.map((row, r) => row.map((cell, c) => {
      if (puzzle.grid[r][c].type === 'input') {
        return cell === puzzle.solution[r][c];
      }
      return true;
    })));
    setRevealed(false);
  }

  function handleReveal() {
    setUserGrid(userGrid.map((row, r) => row.map((cell, c) => puzzle.grid[r][c].type === 'input' ? puzzle.solution[r][c] : '')));
    setCheckResult(null);
    setRevealed(true);
  }

  React.useEffect(() => {
    handleNewPuzzle();
    // eslint-disable-next-line
  }, [gridSize, allowedOps, numberRange]);

  return (
    <div className="App" style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Math Crossword Puzzle</h2>
      <div className="controls" style={{ display: 'flex', gap: '0.5em', alignItems: 'center', justifyContent: 'center', margin: '1em 0' }}>
        <select value={gridSize} onChange={e => setGridSize(Number(e.target.value))}>
          {GRID_SIZES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={allowedOps.join(',')} onChange={e => {
          const val = e.target.value;
          const found = OP_OPTIONS.find(opt => opt.value.join(',') === val);
          setAllowedOps(found ? found.value : ['+']);
        }}>
          {OP_OPTIONS.map(opt => <option key={opt.label} value={opt.value.join(',')}>{opt.label}</option>)}
        </select>
        <select value={numberRange} onChange={e => setNumberRange(Number(e.target.value))}>
          {[10, 20, 30, 40, 50, 100].map(n => <option key={n} value={n}>Up to {n}</option>)}
        </select>
        <button onClick={handleNewPuzzle}>New</button>
        <button onClick={handleCheck}>Check</button>
        <button onClick={handleReveal}>Reveal</button>
      </div>
      <Grid
        grid={puzzle.grid}
        solution={puzzle.solution}
        userGrid={userGrid}
        onChange={handleInput}
        numberRange={numberRange}
      />
      {checkResult && (
        <div style={{ margin: '1em', color: checkResult.flat().every(Boolean) ? 'green' : 'red' }}>
          {checkResult.flat().every(Boolean) ? 'Correct! 🎉' : 'Some answers are incorrect.'}
        </div>
      )}
      {revealed && <div style={{ margin: '1em', color: 'blue' }}>Solution revealed.</div>}
      <div style={{ marginTop: 30, fontSize: '0.9em', color: '#888' }}>
        <b>How to play:</b> Fill the orange cells by clicking and selecting the correct number. Each row and column forms a valid equation. Use the controls to check your answers or reveal the solution. Change the operation and number range for new challenges!
      </div>
    </div>
  );
};

export default App;
