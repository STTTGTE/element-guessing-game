import React from 'react';
import { TableVariant } from '@/types/game';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThemeSelectorProps {
  currentTheme: TableVariant;
  onThemeChange: (theme: TableVariant) => void;
}

const themes = [
  {
    id: 'standard',
    name: 'Standard View',
    description: 'Classic periodic table layout'
  },
  {
    id: 'color_spectrum',
    name: 'Color Spectrum',
    description: 'Elements colored by their properties'
  },
  {
    id: 'layered_view',
    name: 'Layered View',
    description: 'Elements arranged by electron layers'
  },
  {
    id: 'geological_map',
    name: 'Geological Map',
    description: 'Natural occurrence of elements'
  },
  {
    id: 'thermal_view',
    name: 'Thermal View',
    description: 'Melting and boiling points'
  },
  {
    id: 'liquid_metals',
    name: 'Liquid Metals',
    description: 'Elements liquid at room temperature'
  },
  {
    id: 'electrical_conductors',
    name: 'Electrical Conductors',
    description: 'Electrical conductivity properties'
  },
  {
    id: 'magnetic_elements',
    name: 'Magnetic Elements',
    description: 'Magnetic properties of elements'
  },
  {
    id: 'density_map',
    name: 'Density Map',
    description: 'Elements arranged by density'
  },
  {
    id: 'cognitive_map',
    name: 'Cognitive Map',
    description: 'Memory-based learning layout'
  },
  {
    id: 'organic_elements',
    name: 'Organic Elements',
    description: 'Elements essential for life'
  }
];

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium">Theme:</span>
      <Select
        value={currentTheme}
        onValueChange={(value) => onThemeChange(value as TableVariant)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="flex flex-col">
                <span>{theme.name}</span>
                <span className="text-xs text-muted-foreground">{theme.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 