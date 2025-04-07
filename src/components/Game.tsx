import React, { useState } from 'react';
import { GameMode, TableVariant } from '@/types/game';
import PeriodicTable from './PeriodicTable';
import ThemeSelector from './ThemeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameProps {
  mode: GameMode;
  onBack: () => void;
}

const themeDescriptions: Record<TableVariant, { title: string; description: string }> = {
  standard: {
    title: 'Standard View',
    description: 'Classic periodic table layout with traditional element categories'
  },
  color_spectrum: {
    title: 'Color Spectrum',
    description: 'Elements colored based on their chemical properties and categories'
  },
  layered_view: {
    title: 'Layered View',
    description: 'Elements arranged by electron shell configuration'
  },
  geological_map: {
    title: 'Geological Map',
    description: 'Shows natural occurrence and abundance of elements in Earth\'s crust'
  },
  thermal_view: {
    title: 'Thermal View',
    description: 'Elements colored by their melting and boiling points'
  },
  liquid_metals: {
    title: 'Liquid Metals',
    description: 'Highlights elements that are liquid at room temperature'
  },
  electrical_conductors: {
    title: 'Electrical Conductors',
    description: 'Elements categorized by their electrical conductivity'
  },
  magnetic_elements: {
    title: 'Magnetic Elements',
    description: 'Shows magnetic properties of elements'
  },
  density_map: {
    title: 'Density Map',
    description: 'Elements arranged and colored by their density'
  },
  cognitive_map: {
    title: 'Cognitive Map',
    description: 'Memory-optimized layout for learning element positions'
  },
  organic_elements: {
    title: 'Organic Elements',
    description: 'Highlights elements essential for life and biological processes'
  }
};

export default function Game({ mode, onBack }: GameProps) {
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('standard');
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
        
        <Card>
          <CardHeader>
            <CardTitle>{themeDescriptions[currentTheme].title}</CardTitle>
            <CardDescription>{themeDescriptions[currentTheme].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </CardContent>
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