import React, { useState, useRef, useEffect } from 'react';
import { GridTemplate, Cell } from './puzzleUtils';

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
    <table className="crossword-table" style={{ borderCollapse: 'collapse', margin: '0 auto', position: 'relative' }}>
      <tbody>
        {grid.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => {
              let cellStyle: React.CSSProperties = {
                width: '2.5em',
                height: '2.5em',
                textAlign: 'center',
                border: '1px solid #888',
                fontSize: '1.2em',
                fontWeight: 'bold',
                padding: 0,
                boxSizing: 'border-box',
                position: 'relative',
                verticalAlign: 'middle',
              };
              if (cell.type === 'block') {
                cellStyle.background = '#222';
                return <td key={c} style={cellStyle}></td>;
              }
              if (cell.type === 'fixed') {
                cellStyle.background = '#fff';
                cellStyle.color = 'blue';
                return <td key={c} style={cellStyle}>{cell.value}</td>;
              }
              // input cell
              cellStyle.background = '#ffa500';
              cellStyle.cursor = 'pointer';
              return (
                <td key={c} style={cellStyle} onClick={() => handleCellClick(r, c)}>
                  <div>
                    {userGrid[r][c] || ''}
                    {activeCell && activeCell.r === r && activeCell.c === c && (
                      <div
                        ref={dropdownRef}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '100%',
                          background: '#fff',
                          border: '1px solid #aaa',
                          borderRadius: 4,
                          zIndex: 1000,
                          minWidth: '3em',
                          minHeight: '8em',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2em',
                          padding: '0.3em',
                        }}
                      >
                        {choices.get(`${r}_${c}`)?.map(choice => (
                          <div
                            key={choice}
                            style={{ padding: '0.5em 1em', cursor: 'pointer', color: '#1976d2', fontWeight: 'bold', userSelect: 'none', fontSize: '1.1em' }}
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