import React, { useState } from 'react';
import { GameMode, TableVariant } from '@/types/game';
import PeriodicTable from './PeriodicTable';
import ThemeSelector from './ThemeSelector';

interface GameProps {
  mode: GameMode;
  onBack: () => void;
}

export default function Game({ mode, onBack }: GameProps) {
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('standard');
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-sm font-medium hover:underline"
        >
          ← Back to Game Modes
        </button>
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />
      </div>
      
      <PeriodicTable
        variant={currentTheme}
        highlightedElements={highlightedElements}
        showDetails={true}
      />
    </div>
  );
} 