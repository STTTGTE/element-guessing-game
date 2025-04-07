import React, { useState } from 'react';
import { GameMode, TableVariant } from '@/types/game';
import PeriodicTable from './PeriodicTable';
import ThemeSelector from './ThemeSelector';
import { ThemeToggle } from './theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GameProps {
  mode: GameMode;
  onBack: () => void;
}

const themeDescriptions: Record<TableVariant, { title: string; description: string }> = {
  'standard': {
    title: 'Standard View',
    description: 'Classic periodic table with category-based colors'
  },
  'color_spectrum': {
    title: 'Color Spectrum',
    description: 'Enhanced color contrast for better visibility'
  },
  'thermal_view': {
    title: 'Thermal View',
    description: 'Elements colored by their melting points'
  },
  'electrical_conductors': {
    title: 'Electrical Conductors',
    description: 'Elements colored by their electrical conductivity'
  },
  'magnetic_elements': {
    title: 'Magnetic Elements',
    description: 'Elements colored by their magnetic properties'
  },
  'density_map': {
    title: 'Density Map',
    description: 'Elements colored by their density'
  },
  'geological_map': {
    title: 'Geological Map',
    description: 'Elements colored by their natural occurrence'
  },
  'organic_elements': {
    title: 'Organic Elements',
    description: 'Elements colored by their biological role'
  },
  'layered_view': {
    title: 'Layered View',
    description: 'Elements arranged by periods with distinct colors'
  },
  '3d_view': {
    title: '3D View',
    description: 'Interactive 3D visualization of the periodic table'
  }
};

export default function Game({ mode, onBack }: GameProps) {
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('3d_view');
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-sm font-medium hover:underline"
          >
            ← Back to Game Modes
          </button>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>{themeDescriptions[currentTheme].title}</CardTitle>
                <CardDescription>{themeDescriptions[currentTheme].description}</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">App Theme:</span>
                  <ThemeToggle />
                </div>
                <Separator orientation="vertical" className="h-8 hidden sm:block" />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm font-medium">Board Theme:</span>
                  <ThemeSelector
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      <PeriodicTable
        variant={currentTheme}
        highlightedElements={highlightedElements}
        showDetails={true}
      />
    </div>
  );
} 