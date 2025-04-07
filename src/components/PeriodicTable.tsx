import React, { useState } from 'react';
import { ElementData } from '@/types/game';
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
}

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

  const getTableLayout = () => {
    switch (variant) {
      case 'long':
        return 'grid-cols-18 grid-rows-7';
      case 'spiral':
        return 'grid-spiral';
      case 'electron_shell':
        return 'grid-shells';
      case 'periodic_3d':
        return 'grid-3d transform-style-3d';
      case 'quantum_mechanical':
        return 'grid-quantum';
      case 'reactivity':
        return 'grid-reactivity';
      case 'atomic_radius':
        return 'grid-radius';
      case 'electronegativity':
        return 'grid-electronegativity';
      case 'ionization_energy':
        return 'grid-ionization';
      default:
        return 'grid-cols-18 grid-rows-10';
    }
  };
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);

  const getElementColor = (category: string) => {
    const colors = {
      "nonmetal": "bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800",
      "noble-gas": "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800",
      "alkali-metal": "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800",
      "alkaline-earth": "bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800",
      "metalloid": "bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800",
      "halogen": "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800",
      "transition": "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800",
      "post-transition": "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800",
      "actinide": "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800",
      "lanthanide": "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800",
      "default": "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
    };

    return colors[category as keyof typeof colors] || colors.default;
  };

  const renderElement = (element: ElementData) => {
    const isHighlighted = highlightedElements.includes(element.symbol);
    const isDisabled = disabledElements.includes(element.symbol);

    return (
      <motion.div
        key={element.symbol}
        className={cn(
          "element-tile",
          getElementColor(element.category),
          "rounded-lg p-2 cursor-pointer transition-all",
          "flex flex-col items-center justify-center",
          isHighlighted && "ring-2 ring-primary",
          isDisabled && "opacity-50 cursor-not-allowed",
          viewMode === 'compact' ? 'w-8 h-8' : 'w-16 h-16'
        )}
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        onClick={() => !isDisabled && onElementClick?.(element)}
        onMouseEnter={() => setHoveredElement(element)}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <span className="font-bold">{element.symbol}</span>
        {viewMode === 'standard' && showDetails && (
          <>
            <span className="text-xs">{element.atomicNumber}</span>
            <span className="text-xs truncate">{element.name}</span>
          </>
        )}
      </motion.div>
    );
  };

  const renderTooltipContent = (element: ElementData) => (
    <div className="p-2">
      <h3 className="font-bold">{element.name}</h3>
      <p>Atomic Number: {element.atomicNumber}</p>
      <p>Category: {element.category}</p>
      {element.electronConfiguration && (
        <p>Electron Configuration: {element.electronConfiguration}</p>
      )}
      {element.discoveryYear && (
        <p>Discovered: {element.discoveryYear} by {element.discoveredBy}</p>
      )}
    </div>
  );

  return (
    <div className="periodic-table-grid grid gap-1">
      {elementData.map((element) => (
        <Tooltip
          key={element.symbol}
          content={renderTooltipContent(element)}
          open={hoveredElement?.symbol === element.symbol}
        >
          {renderElement(element)}
        </Tooltip>
      ))}
    </div>
  );
}