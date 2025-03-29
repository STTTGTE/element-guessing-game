
import { ElementData } from "@/types/game";

export const elementData: ElementData[] = [
  // Period 1
  { name: "Hydrogen", symbol: "H", atomicNumber: 1, category: "nonmetal", group: 1, period: 1 },
  { name: "Helium", symbol: "He", atomicNumber: 2, category: "noble-gas", group: 18, period: 1 },
  
  // Period 2
  { name: "Lithium", symbol: "Li", atomicNumber: 3, category: "alkali-metal", group: 1, period: 2 },
  { name: "Beryllium", symbol: "Be", atomicNumber: 4, category: "alkaline-earth", group: 2, period: 2 },
  { name: "Boron", symbol: "B", atomicNumber: 5, category: "metalloid", group: 13, period: 2 },
  { name: "Carbon", symbol: "C", atomicNumber: 6, category: "nonmetal", group: 14, period: 2 },
  { name: "Nitrogen", symbol: "N", atomicNumber: 7, category: "nonmetal", group: 15, period: 2 },
  { name: "Oxygen", symbol: "O", atomicNumber: 8, category: "nonmetal", group: 16, period: 2 },
  { name: "Fluorine", symbol: "F", atomicNumber: 9, category: "halogen", group: 17, period: 2 },
  { name: "Neon", symbol: "Ne", atomicNumber: 10, category: "noble-gas", group: 18, period: 2 },
  
  // Period 3
  { name: "Sodium", symbol: "Na", atomicNumber: 11, category: "alkali-metal", group: 1, period: 3 },
  { name: "Magnesium", symbol: "Mg", atomicNumber: 12, category: "alkaline-earth", group: 2, period: 3 },
  { name: "Aluminum", symbol: "Al", atomicNumber: 13, category: "post-transition", group: 13, period: 3 },
  { name: "Silicon", symbol: "Si", atomicNumber: 14, category: "metalloid", group: 14, period: 3 },
  { name: "Phosphorus", symbol: "P", atomicNumber: 15, category: "nonmetal", group: 15, period: 3 },
  { name: "Sulfur", symbol: "S", atomicNumber: 16, category: "nonmetal", group: 16, period: 3 },
  { name: "Chlorine", symbol: "Cl", atomicNumber: 17, category: "halogen", group: 17, period: 3 },
  { name: "Argon", symbol: "Ar", atomicNumber: 18, category: "noble-gas", group: 18, period: 3 },
  
  // Period 4 (first 10 elements)
  { name: "Potassium", symbol: "K", atomicNumber: 19, category: "alkali-metal", group: 1, period: 4 },
  { name: "Calcium", symbol: "Ca", atomicNumber: 20, category: "alkaline-earth", group: 2, period: 4 },
  { name: "Iron", symbol: "Fe", atomicNumber: 26, category: "transition", group: 8, period: 4 },
  { name: "Copper", symbol: "Cu", atomicNumber: 29, category: "transition", group: 11, period: 4 },
  { name: "Zinc", symbol: "Zn", atomicNumber: 30, category: "transition", group: 12, period: 4 },
  
  // Additional common elements
  { name: "Gold", symbol: "Au", atomicNumber: 79, category: "transition", group: 11, period: 6 },
  { name: "Mercury", symbol: "Hg", atomicNumber: 80, category: "transition", group: 12, period: 6 },
  { name: "Lead", symbol: "Pb", atomicNumber: 82, category: "post-transition", group: 14, period: 6 },
  { name: "Uranium", symbol: "U", atomicNumber: 92, category: "actinide", group: 3, period: 7 }
];

// Object mapping for quick element lookup
export const elementMap = elementData.reduce((acc, element) => {
  acc[element.symbol] = element;
  return acc;
}, {} as Record<string, ElementData>);
