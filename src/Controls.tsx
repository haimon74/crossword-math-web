import React from 'react';

interface ControlsProps {
  onNewPuzzle: () => void;
  onCheck: () => void;
  onReveal: () => void;
  operation: string;
  setOperation: (op: string) => void;
  numberRange: number;
  setNumberRange: (n: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onNewPuzzle, onCheck, onReveal, operation, setOperation, numberRange, setNumberRange }) => (
  <div className="controls" style={{ display: 'flex', gap: '1em', alignItems: 'center', justifyContent: 'center', margin: '1em 0' }}>
    <label>
      Operation:
      <select value={operation} onChange={e => setOperation(e.target.value)}>
        <option value="+">Addition (+)</option>
        <option value="-">Subtraction (-)</option>
        <option value="*">Multiplication (*)</option>
        <option value="/">Division (/)</option>
        <option value="all">All</option>
      </select>
    </label>
    <label>
      Number Range:
      <select value={numberRange} onChange={e => setNumberRange(Number(e.target.value))}>
        <option value={10}>Up to 10</option>
        <option value={20}>Up to 20</option>
        <option value={30}>Up to 30</option>
        <option value={40}>Up to 40</option>
        <option value={50}>Up to 50</option>
        <option value={100}>Up to 100</option>
      </select>
    </label>
    <button onClick={onNewPuzzle}>New Puzzle</button>
    <button onClick={onCheck}>Check</button>
    <button onClick={onReveal}>Reveal</button>
  </div>
);

export default Controls; 