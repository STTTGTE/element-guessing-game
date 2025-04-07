import React, { useState } from 'react';
import { ElementData, TableVariant } from '@/types/game';
import { Tooltip } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { elementData } from "@/data/elements";

interface PeriodicTableProps {
  onElementClick?: (element: ElementData) => void;
  highlightedElements?: string[];
  disabledElements?: string[];
  viewMode?: 'standard' | 'compact';
  showDetails?: boolean;
  variant?: TableVariant;
}

export default function PeriodicTable({
  onElementClick,
  highlightedElements = [],
  disabledElements = [],
  viewMode = 'standard',
  showDetails = true,
  variant = 'standard',
}: PeriodicTableProps) {

  const getElementColor = (element: ElementData) => {
    switch (variant) {
      case 'color_spectrum':
        return `bg-${element.category}-100 dark:bg-${element.category}-900`;
      case 'thermal_view':
        return element.meltingPoint 
          ? `bg-gradient-to-r from-blue-${Math.min(900, Math.floor(element.meltingPoint/100)*100)} to-red-${Math.min(900, Math.floor(element.boilingPoint/100)*100)}`
          : 'bg-gray-100 dark:bg-gray-800';
      case 'electrical_conductors':
        return element.electricalConductivity === 'high' 
          ? 'bg-yellow-100 dark:bg-yellow-900'
          : element.electricalConductivity === 'medium'
          ? 'bg-orange-100 dark:bg-orange-900'
          : 'bg-red-100 dark:bg-red-900';
      case 'magnetic_elements':
        return element.magneticProperty === 'ferromagnetic'
          ? 'bg-blue-100 dark:bg-blue-900'
          : element.magneticProperty === 'paramagnetic'
          ? 'bg-indigo-100 dark:bg-indigo-900'
          : 'bg-purple-100 dark:bg-purple-900';
      case 'density_map':
        return element.density
          ? `bg-gradient-to-r from-green-${Math.min(900, Math.floor(element.density*100))} to-blue-${Math.min(900, Math.floor(element.density*100))}`
          : 'bg-gray-100 dark:bg-gray-800';
      case 'geological_map':
        return element.naturalOccurrence === 'common'
          ? 'bg-green-100 dark:bg-green-900'
          : element.naturalOccurrence === 'rare'
          ? 'bg-yellow-100 dark:bg-yellow-900'
          : 'bg-red-100 dark:bg-red-900';
      case 'organic_elements':
        return element.biologicalRole === 'essential'
          ? 'bg-green-100 dark:bg-green-900'
          : element.biologicalRole === 'trace'
          ? 'bg-blue-100 dark:bg-blue-900'
          : element.biologicalRole === 'toxic'
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-gray-100 dark:bg-gray-800';
      default:
        return `bg-${element.category}-100 dark:bg-${element.category}-900`;
    }
  };

  const getAdditionalInfo = (element: ElementData) => {
    switch (variant) {
      case 'thermal_view':
        return `MP: ${element.meltingPoint}K BP: ${element.boilingPoint}K`;
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
      default:
        return '';
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
          "element-tile",
          getElementColor(element),
          "rounded-lg p-2 cursor-pointer transition-all",
          "flex flex-col items-center justify-center",
          isHighlighted && "ring-2 ring-primary",
          isDisabled && "opacity-50 cursor-not-allowed",
          viewMode === 'compact' ? 'w-8 h-8' : 'w-16 h-16'
        )}
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        onClick={() => !isDisabled && onElementClick?.(element)}
      >
        <span className="font-bold">{element.symbol}</span>
        {viewMode === 'standard' && showDetails && (
          <>
            <span className="text-xs">{element.atomicNumber}</span>
            <span className="text-xs truncate">{element.name}</span>
            {additionalInfo && (
              <span className="text-xs mt-1 opacity-75">{additionalInfo}</span>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn(
      "periodic-table-grid grid gap-1",
      variant === 'layered_view' && "grid-cols-18 grid-rows-7",
      variant === 'standard' && "grid-cols-18 grid-rows-10"
    )}>
      {elementData.map((element) => renderElement(element))}
    </div>
  );
}