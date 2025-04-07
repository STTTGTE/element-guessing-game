import React from 'react';
import { TableVariant } from '@/types/game';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Layers, Globe, Thermometer, Droplet, Zap, Magnet, Scale, Brain, Leaf, Layout } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: TableVariant;
  onThemeChange: (theme: TableVariant) => void;
}

const themes = [
  {
    id: 'standard',
    name: 'Standard View',
    description: 'Classic periodic table layout',
    icon: Layout
  },
  {
    id: 'color_spectrum',
    name: 'Color Spectrum',
    description: 'Elements colored by their properties',
    icon: Palette
  },
  {
    id: 'layered_view',
    name: 'Layered View',
    description: 'Elements arranged by electron layers',
    icon: Layers
  },
  {
    id: 'geological_map',
    name: 'Geological Map',
    description: 'Natural occurrence of elements',
    icon: Globe
  },
  {
    id: 'thermal_view',
    name: 'Thermal View',
    description: 'Melting and boiling points',
    icon: Thermometer
  },
  {
    id: 'liquid_metals',
    name: 'Liquid Metals',
    description: 'Elements liquid at room temperature',
    icon: Droplet
  },
  {
    id: 'electrical_conductors',
    name: 'Electrical Conductors',
    description: 'Electrical conductivity properties',
    icon: Zap
  },
  {
    id: 'magnetic_elements',
    name: 'Magnetic Elements',
    description: 'Magnetic properties of elements',
    icon: Magnet
  },
  {
    id: 'density_map',
    name: 'Density Map',
    description: 'Elements arranged by density',
    icon: Scale
  },
  {
    id: 'cognitive_map',
    name: 'Cognitive Map',
    description: 'Memory-based learning layout',
    icon: Brain
  },
  {
    id: 'organic_elements',
    name: 'Organic Elements',
    description: 'Elements essential for life',
    icon: Leaf
  }
];

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  return (
    <div className="relative w-full">
      <Select
        value={currentTheme}
        onValueChange={(value) => onThemeChange(value as TableVariant)}
        defaultValue="standard"
      >
        <SelectTrigger className="w-full bg-background">
          <div className="flex items-center gap-2">
            {currentThemeData && (
              <currentThemeData.icon className="h-4 w-4" />
            )}
            <SelectValue>
              {currentThemeData ? currentThemeData.name : 'Select a theme'}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="w-[300px] bg-background border rounded-md shadow-lg"
          align="start"
        >
          {themes.map((theme) => (
            <SelectItem 
              key={theme.id} 
              value={theme.id}
              className="flex items-center gap-2 py-3 px-4 hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <theme.icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{theme.name}</span>
                  <span className="text-xs text-muted-foreground">{theme.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 