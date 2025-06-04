import React from 'react';

interface Clue {
  number: number;
  row: number;
  col: number;
  length: number;
  clue: string;
}

interface CluesListProps {
  clues: { across: Clue[]; down: Clue[] };
  highlight?: { direction: 'across' | 'down'; number: number };
}

export const CluesList: React.FC<CluesListProps> = ({ clues, highlight }) => (
  <div className="clues-list" style={{ display: 'flex', gap: '2em', justifyContent: 'center', margin: '1em 0' }}>
    <div>
      <h4>Across</h4>
      {clues.across.map(clue => (
        <div key={clue.number} style={{ fontWeight: highlight && highlight.direction === 'across' && highlight.number === clue.number ? 'bold' : undefined }}>
          {clue.number}. {clue.clue}
        </div>
      ))}
    </div>
    <div>
      <h4>Down</h4>
      {clues.down.map(clue => (
        <div key={clue.number} style={{ fontWeight: highlight && highlight.direction === 'down' && highlight.number === clue.number ? 'bold' : undefined }}>
          {clue.number}. {clue.clue}
        </div>
      ))}
    </div>
  </div>
);

export default CluesList; 