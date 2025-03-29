
import { useState } from "react";
import { ElementData } from "@/types/game";
import { elementData } from "@/data/elements";
import { cn } from "@/lib/utils";

interface PeriodicTableProps {
  onElementClick: (element: ElementData) => void;
  selectedElement: ElementData | null;
  correctElement?: string;
}

const PeriodicTable = ({ onElementClick, selectedElement, correctElement }: PeriodicTableProps) => {
  // Create a grid for the periodic table
  // We'll use a simplified version with main elements
  
  // Group elements by period for rendering
  const elementsByPeriod: Record<number, ElementData[]> = {};
  
  elementData.forEach(element => {
    if (!elementsByPeriod[element.period]) {
      elementsByPeriod[element.period] = [];
    }
    elementsByPeriod[element.period].push(element);
  });
  
  // Sort elements within each period by group
  Object.keys(elementsByPeriod).forEach(period => {
    elementsByPeriod[Number(period)].sort((a, b) => a.group - b.group);
  });
  
  const getElementColor = (category: string) => {
    const colors = {
      "nonmetal": "bg-emerald-100 hover:bg-emerald-200",
      "noble-gas": "bg-purple-100 hover:bg-purple-200",
      "alkali-metal": "bg-red-100 hover:bg-red-200",
      "alkaline-earth": "bg-orange-100 hover:bg-orange-200",
      "metalloid": "bg-teal-100 hover:bg-teal-200",
      "halogen": "bg-yellow-100 hover:bg-yellow-200",
      "transition": "bg-blue-100 hover:bg-blue-200",
      "post-transition": "bg-indigo-100 hover:bg-indigo-200",
      "actinide": "bg-pink-100 hover:bg-pink-200",
      "lanthanide": "bg-rose-100 hover:bg-rose-200",
      "default": "bg-gray-100 hover:bg-gray-200"
    };
    
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <div className="periodic-table w-full overflow-x-auto">
      <div className="text-center mb-4 text-sm text-gray-600">
        Click on an element to make your guess!
      </div>
      
      {Object.keys(elementsByPeriod).map(period => (
        <div 
          key={period} 
          className="period flex flex-wrap justify-center gap-1 mb-1"
        >
          {elementsByPeriod[Number(period)].map(element => {
            const isSelected = selectedElement?.symbol === element.symbol;
            const isCorrect = correctElement === element.symbol;
            
            return (
              <button
                key={element.symbol}
                onClick={() => onElementClick(element)}
                className={cn(
                  "element w-16 h-16 rounded-md flex flex-col items-center justify-center transition-all",
                  getElementColor(element.category),
                  isSelected && "ring-2 ring-blue-500 scale-105",
                  isCorrect && "bg-green-200 hover:bg-green-300"
                )}
              >
                <div className="symbol text-lg font-bold">{element.symbol}</div>
                <div className="name text-[10px] font-medium truncate max-w-full px-1">{element.name}</div>
                <div className="atomic-number text-[9px] text-gray-500">{element.atomicNumber}</div>
              </button>
            );
          })}
        </div>
      ))}
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-nonmetal bg-emerald-100 mr-2"></div>
          <span className="text-xs">Nonmetal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-noble-gas bg-purple-100 mr-2"></div>
          <span className="text-xs">Noble Gas</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-alkali-metal bg-red-100 mr-2"></div>
          <span className="text-xs">Alkali Metal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-alkaline-earth bg-orange-100 mr-2"></div>
          <span className="text-xs">Alkaline Earth</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-transition bg-blue-100 mr-2"></div>
          <span className="text-xs">Transition Metal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-post-transition bg-indigo-100 mr-2"></div>
          <span className="text-xs">Post-Transition</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-metalloid bg-teal-100 mr-2"></div>
          <span className="text-xs">Metalloid</span>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
