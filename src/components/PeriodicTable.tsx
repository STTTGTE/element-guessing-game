import React from 'react';
import { ElementData, TableVariant } from '@/types/game';
import { Tooltip } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { elementData } from "@/data/elements";

interface PeriodicTableProps {
  onElementClick?: (element: ElementData) => void;
  highlightedElements?: string[];
  disabledElements?: string[];
  showDetails?: boolean;
  variant?: TableVariant;
}

// Color schemes for different themes
const categoryColors = {
  'alkali-metal': 'bg-red-200 dark:bg-red-800',
  'alkaline-earth-metal': 'bg-orange-200 dark:bg-orange-800',
  'transition-metal': 'bg-yellow-200 dark:bg-yellow-800',
  'post-transition-metal': 'bg-green-200 dark:bg-green-800',
  'metalloid': 'bg-teal-200 dark:bg-teal-800',
  'nonmetal': 'bg-blue-200 dark:bg-blue-800',
  'noble-gas': 'bg-purple-200 dark:bg-purple-800',
  'lanthanide': 'bg-pink-200 dark:bg-pink-800',
  'actinide': 'bg-rose-200 dark:bg-rose-800',
  'unknown': 'bg-gray-200 dark:bg-gray-800'
};

const thermalColors = {
  cold: 'bg-blue-200 dark:bg-blue-800',
  cool: 'bg-cyan-200 dark:bg-cyan-800',
  moderate: 'bg-green-200 dark:bg-green-800',
  warm: 'bg-yellow-200 dark:bg-yellow-800',
  hot: 'bg-orange-200 dark:bg-orange-800',
  extreme: 'bg-red-200 dark:bg-red-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

const conductivityColors = {
  high: 'bg-yellow-200 dark:bg-yellow-800',
  medium: 'bg-orange-200 dark:bg-orange-800',
  low: 'bg-red-200 dark:bg-red-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

const magneticColors = {
  ferromagnetic: 'bg-blue-200 dark:bg-blue-800',
  paramagnetic: 'bg-indigo-200 dark:bg-indigo-800',
  diamagnetic: 'bg-purple-200 dark:bg-purple-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

const densityColors = {
  veryLight: 'bg-blue-200 dark:bg-blue-800',
  light: 'bg-green-200 dark:bg-green-800',
  moderate: 'bg-yellow-200 dark:bg-yellow-800',
  heavy: 'bg-orange-200 dark:bg-orange-800',
  veryHeavy: 'bg-red-200 dark:bg-red-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

const geologicalColors = {
  common: 'bg-green-200 dark:bg-green-800',
  rare: 'bg-yellow-200 dark:bg-yellow-800',
  synthetic: 'bg-red-200 dark:bg-red-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

const biologicalColors = {
  essential: 'bg-green-200 dark:bg-green-800',
  trace: 'bg-blue-200 dark:bg-blue-800',
  toxic: 'bg-red-200 dark:bg-red-800',
  none: 'bg-gray-200 dark:bg-gray-800',
  unknown: 'bg-gray-200 dark:bg-gray-800'
};

export default function PeriodicTable({
  onElementClick,
  highlightedElements = [],
  disabledElements = [],
  showDetails = true,
  variant = '3d_view',
}: PeriodicTableProps) {

  const getElementColor = (element: ElementData) => {
    switch (variant) {
      case '3d_view': {
        const period = element.period;
        const group = element.group;
        // Create a 3D effect using period and group
        const depth = (period - 1) * 10; // Deeper for higher periods
        const tilt = (group - 1) * 5; // Tilt based on group
        return `bg-gradient-to-br from-${categoryColors[element.category].split(' ')[0]} to-${categoryColors[element.category].split(' ')[0]} shadow-lg transform -rotate-${tilt} translate-z-${depth}`;
      }
      case 'color_spectrum':
        return categoryColors[element.category] || categoryColors.unknown;
      
      case 'thermal_view': {
        const meltingPoint = element.meltingPoint || 0;
        if (meltingPoint === 0) return thermalColors.unknown;
        if (meltingPoint < 273) return thermalColors.cold;
        if (meltingPoint < 373) return thermalColors.cool;
        if (meltingPoint < 1000) return thermalColors.moderate;
        if (meltingPoint < 2000) return thermalColors.warm;
        if (meltingPoint < 4000) return thermalColors.hot;
        return thermalColors.extreme;
      }

      case 'electrical_conductors':
        return conductivityColors[element.electricalConductivity || 'unknown'];

      case 'magnetic_elements':
        return magneticColors[element.magneticProperty || 'unknown'];

      case 'density_map': {
        const density = element.density || 0;
        if (density === 0) return densityColors.unknown;
        if (density < 1) return densityColors.veryLight;
        if (density < 5) return densityColors.light;
        if (density < 10) return densityColors.moderate;
        if (density < 15) return densityColors.heavy;
        return densityColors.veryHeavy;
      }

      case 'geological_map':
        return geologicalColors[element.naturalOccurrence || 'unknown'];

      case 'organic_elements':
        return biologicalColors[element.biologicalRole || 'unknown'];

      case 'layered_view': {
        const period = element.period;
        if (period === 1) return 'bg-blue-200 dark:bg-blue-800';
        if (period === 2) return 'bg-green-200 dark:bg-green-800';
        if (period === 3) return 'bg-yellow-200 dark:bg-yellow-800';
        if (period === 4) return 'bg-orange-200 dark:bg-orange-800';
        if (period === 5) return 'bg-red-200 dark:bg-red-800';
        if (period === 6) return 'bg-purple-200 dark:bg-purple-800';
        if (period === 7) return 'bg-pink-200 dark:bg-pink-800';
        return 'bg-gray-200 dark:bg-gray-800';
      }

      default:
        return categoryColors[element.category] || categoryColors.unknown;
    }
  };

  const getAdditionalInfo = (element: ElementData) => {
    switch (variant) {
      case '3d_view':
        return `P${element.period} G${element.group}`;
      case 'thermal_view':
        return `MP: ${element.meltingPoint || '?'}K`;
      case 'electrical_conductors':
        return element.electricalConductivity || 'Unknown';
      case 'magnetic_elements':
        return element.magneticProperty || 'Unknown';
      case 'density_map':
        return element.density ? `${element.density} g/cm³` : 'Unknown';
      case 'geological_map':
        return element.naturalOccurrence || 'Unknown';
      case 'organic_elements':
        return element.biologicalRole || 'Unknown';
      case 'layered_view':
        return `Period ${element.period}`;
      default:
        return element.category;
    }
  };

  const renderElement = (element: ElementData) => {
    const isHighlighted = highlightedElements.includes(element.symbol);
    const isDisabled = disabledElements.includes(element.symbol);
    const additionalInfo = getAdditionalInfo(element);

    return (
      <motion.div
        key={element.symbol}
        className={cn(
          "element-tile relative",
          getElementColor(element),
          "rounded-lg p-2 cursor-pointer transition-all",
          "hover:scale-105 hover:shadow-xl",
          isHighlighted && "ring-2 ring-primary",
          isDisabled && "opacity-50 cursor-not-allowed",
          "w-16 h-16",
          variant === '3d_view' && "transform-gpu perspective-1000"
        )}
        onClick={() => !isDisabled && onElementClick?.(element)}
        whileHover={{ scale: 1.05, zIndex: 1 }}
        style={variant === '3d_view' ? {
          transformStyle: 'preserve-3d',
          transform: `rotateX(${(element.period - 1) * 5}deg) rotateY(${(element.group - 1) * 5}deg)`
        } : undefined}
      >
        <div className={cn(
          "flex flex-col items-center justify-center h-full",
          variant === '3d_view' && "transform-gpu"
        )}>
          <span className="font-bold text-foreground">{element.symbol}</span>
          {showDetails && (
            <>
              <span className="text-xs text-foreground/80">{element.atomicNumber}</span>
              <span className="text-xs text-foreground/80 truncate max-w-full">{element.name}</span>
              {additionalInfo && (
                <span className="text-[10px] text-foreground/60 mt-0.5 truncate max-w-full">
                  {additionalInfo}
                </span>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={cn(
      "periodic-table-grid grid gap-1",
      variant === 'layered_view' ? "grid-cols-18 grid-rows-7" : "grid-cols-18 grid-rows-10",
      "p-4 rounded-lg bg-background/50 border",
      variant === '3d_view' && "transform-gpu perspective-1000"
    )}>
      {elementData.map((element) => renderElement(element))}
    </div>
  );
}