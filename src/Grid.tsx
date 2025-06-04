import React, { useState, useRef, useEffect } from 'react';
import { GridTemplate } from './puzzleUtils';
import styles from './Grid.module.css';

interface GridProps {
  grid: GridTemplate;
  solution: string[][];
  userGrid: string[][];
  onChange: (row: number, col: number, value: string) => void;
  numberRange: number;
}

function getChoices(solution: string, numberRange: number): string[] {
  const choices = new Set([solution]);
  const options = Array.from(Array(numberRange).keys());
  options.splice(parseInt(solution), 1);
  for (let i = 0; i < 3; i++) {
    const optionsLength = options.length;
    const optionIndex = Math.floor(Math.random() * optionsLength);
    choices.add(options[optionIndex].toString());
    options.splice(optionIndex, 1);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export const Grid: React.FC<GridProps> = ({ grid, solution, userGrid, onChange, numberRange }) => {
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [choices, setChoices] = useState<Map<string, string[]>>(new Map());
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // build choices map
    const choicesMap = new Map<string, string[]>();
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c].type !== 'input') continue;
        choicesMap.set(`${r}_${c}`, getChoices(solution[r][c], numberRange));
      }
    }
    setChoices(choicesMap);
  },[grid, solution, numberRange]);

  function handleCellClick(r: number, c: number) {
    setActiveCell({ r, c });    
  }

  function handleChoiceSelect(r: number, c: number, value: string) {
    onChange(r, c, value);
    setActiveCell(null);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveCell(null);
      }
    }
    if (activeCell) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [activeCell]);

  return (
    <table className={styles.crosswordTable}>
      <tbody>
        {grid.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => {
              let cellClass = styles.cell;
              if (cell.type === 'block') cellClass += ' ' + styles.block;
              if (cell.type === 'fixed') cellClass += ' ' + styles.fixed;
              if (cell.type === 'input') cellClass += ' ' + styles.input;
              return (
                <td key={c} className={cellClass} onClick={cell.type === 'input' ? () => handleCellClick(r, c) : undefined}>
                  <div className={styles.cellInner}>
                    {userGrid[r][c] || (cell.type === 'fixed' ? cell.value : '')}
                    {activeCell && activeCell.r === r && activeCell.c === c && (
                      <div
                        ref={dropdownRef}
                        className={styles.dropdown}
                      >
                        {choices.get(`${r}_${c}`)?.map(choice => (
                          <div
                            key={choice}
                            className={styles.dropdownOption}
                            onClick={e => { e.stopPropagation(); handleChoiceSelect(r, c, choice); }}
                          >
                            {choice}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Grid; 