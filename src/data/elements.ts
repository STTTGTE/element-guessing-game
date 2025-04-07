import { ElementData } from "@/types/game";

export const elementData: ElementData[] = [
  // Period 1
  { 
    name: "Hydrogen", 
    symbol: "H", 
    atomicNumber: 1, 
    category: "nonmetal", 
    group: 1, 
    period: 1,
    block: "s",
    meltingPoint: 14.01,
    boilingPoint: 20.28,
    density: 0.00008988,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "common",
    biologicalRole: "essential",
    isRadioactive: false
  },
  { 
    name: "Helium", 
    symbol: "He", 
    atomicNumber: 2, 
    category: "noble-gas", 
    group: 18, 
    period: 1,
    block: "s",
    meltingPoint: 0.95,
    boilingPoint: 4.22,
    density: 0.0001785,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "common",
    biologicalRole: "none",
    isRadioactive: false
  },
  
  // Period 2
  { 
    name: "Lithium", 
    symbol: "Li", 
    atomicNumber: 3, 
    category: "alkali-metal", 
    group: 1, 
    period: 2,
    block: "s",
    meltingPoint: 453.69,
    boilingPoint: 1615,
    density: 0.534,
    electricalConductivity: "high",
    magneticProperty: "paramagnetic",
    naturalOccurrence: "rare",
    biologicalRole: "trace",
    isRadioactive: false
  },
  { 
    name: "Beryllium", 
    symbol: "Be", 
    atomicNumber: 4, 
    category: "alkaline-earth", 
    group: 2, 
    period: 2,
    block: "s",
    meltingPoint: 1560,
    boilingPoint: 2742,
    density: 1.85,
    electricalConductivity: "high",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "rare",
    biologicalRole: "none",
    isRadioactive: false
  },
  { 
    name: "Boron", 
    symbol: "B", 
    atomicNumber: 5, 
    category: "metalloid", 
    group: 13, 
    period: 2,
    block: "p",
    meltingPoint: 2349,
    boilingPoint: 4200,
    density: 2.34,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "rare",
    biologicalRole: "trace",
    isRadioactive: false
  },
  { 
    name: "Carbon", 
    symbol: "C", 
    atomicNumber: 6, 
    category: "nonmetal", 
    group: 14, 
    period: 2,
    block: "p",
    meltingPoint: 3915,
    boilingPoint: 4300,
    density: 2.267,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "common",
    biologicalRole: "essential",
    isRadioactive: false
  },
  { 
    name: "Nitrogen", 
    symbol: "N", 
    atomicNumber: 7, 
    category: "nonmetal", 
    group: 15, 
    period: 2,
    block: "p",
    meltingPoint: 63.15,
    boilingPoint: 77.36,
    density: 0.001251,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "common",
    biologicalRole: "essential",
    isRadioactive: false
  },
  { 
    name: "Oxygen", 
    symbol: "O", 
    atomicNumber: 8, 
    category: "nonmetal", 
    group: 16, 
    period: 2,
    block: "p",
    meltingPoint: 54.36,
    boilingPoint: 90.20,
    density: 0.001429,
    electricalConductivity: "low",
    magneticProperty: "paramagnetic",
    naturalOccurrence: "common",
    biologicalRole: "essential",
    isRadioactive: false
  },
  { 
    name: "Fluorine", 
    symbol: "F", 
    atomicNumber: 9, 
    category: "halogen", 
    group: 17, 
    period: 2,
    block: "p",
    meltingPoint: 53.53,
    boilingPoint: 85.03,
    density: 0.001696,
    electricalConductivity: "low",
    magneticProperty: "paramagnetic",
    naturalOccurrence: "common",
    biologicalRole: "trace",
    isRadioactive: false
  },
  { 
    name: "Neon", 
    symbol: "Ne", 
    atomicNumber: 10, 
    category: "noble-gas", 
    group: 18, 
    period: 2,
    block: "p",
    meltingPoint: 24.56,
    boilingPoint: 27.07,
    density: 0.0008999,
    electricalConductivity: "low",
    magneticProperty: "diamagnetic",
    naturalOccurrence: "rare",
    biologicalRole: "none",
    isRadioactive: false
  },
  
  // Period 3
  { 
    name: "Sodium", 
    symbol: "Na", 
    atomicNumber: 11, 
    category: "alkali-metal", 
    group: 1, 
    period: 3,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Magnesium", 
    symbol: "Mg", 
    atomicNumber: 12, 
    category: "alkaline-earth", 
    group: 2, 
    period: 3,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Aluminum", 
    symbol: "Al", 
    atomicNumber: 13, 
    category: "post-transition", 
    group: 13, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Silicon", 
    symbol: "Si", 
    atomicNumber: 14, 
    category: "metalloid", 
    group: 14, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Phosphorus", 
    symbol: "P", 
    atomicNumber: 15, 
    category: "nonmetal", 
    group: 15, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Sulfur", 
    symbol: "S", 
    atomicNumber: 16, 
    category: "nonmetal", 
    group: 16, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Chlorine", 
    symbol: "Cl", 
    atomicNumber: 17, 
    category: "halogen", 
    group: 17, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Argon", 
    symbol: "Ar", 
    atomicNumber: 18, 
    category: "noble-gas", 
    group: 18, 
    period: 3,
    block: "p",
    isRadioactive: false
  },
  
  // Period 4
  { 
    name: "Potassium", 
    symbol: "K", 
    atomicNumber: 19, 
    category: "alkali-metal", 
    group: 1, 
    period: 4,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Calcium", 
    symbol: "Ca", 
    atomicNumber: 20, 
    category: "alkaline-earth", 
    group: 2, 
    period: 4,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Scandium", 
    symbol: "Sc", 
    atomicNumber: 21, 
    category: "transition", 
    group: 3, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Titanium", 
    symbol: "Ti", 
    atomicNumber: 22, 
    category: "transition", 
    group: 4, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Vanadium", 
    symbol: "V", 
    atomicNumber: 23, 
    category: "transition", 
    group: 5, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Chromium", 
    symbol: "Cr", 
    atomicNumber: 24, 
    category: "transition", 
    group: 6, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Manganese", 
    symbol: "Mn", 
    atomicNumber: 25, 
    category: "transition", 
    group: 7, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Iron", 
    symbol: "Fe", 
    atomicNumber: 26, 
    category: "transition", 
    group: 8, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Cobalt", 
    symbol: "Co", 
    atomicNumber: 27, 
    category: "transition", 
    group: 9, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Nickel", 
    symbol: "Ni", 
    atomicNumber: 28, 
    category: "transition", 
    group: 10, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Copper", 
    symbol: "Cu", 
    atomicNumber: 29, 
    category: "transition", 
    group: 11, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Zinc", 
    symbol: "Zn", 
    atomicNumber: 30, 
    category: "transition", 
    group: 12, 
    period: 4,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Gallium", 
    symbol: "Ga", 
    atomicNumber: 31, 
    category: "post-transition", 
    group: 13, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Germanium", 
    symbol: "Ge", 
    atomicNumber: 32, 
    category: "metalloid", 
    group: 14, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Arsenic", 
    symbol: "As", 
    atomicNumber: 33, 
    category: "metalloid", 
    group: 15, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Selenium", 
    symbol: "Se", 
    atomicNumber: 34, 
    category: "nonmetal", 
    group: 16, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Bromine", 
    symbol: "Br", 
    atomicNumber: 35, 
    category: "halogen", 
    group: 17, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Krypton", 
    symbol: "Kr", 
    atomicNumber: 36, 
    category: "noble-gas", 
    group: 18, 
    period: 4,
    block: "p",
    isRadioactive: false
  },
  
  // Period 5
  { 
    name: "Rubidium", 
    symbol: "Rb", 
    atomicNumber: 37, 
    category: "alkali-metal", 
    group: 1, 
    period: 5,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Strontium", 
    symbol: "Sr", 
    atomicNumber: 38, 
    category: "alkaline-earth", 
    group: 2, 
    period: 5,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Yttrium", 
    symbol: "Y", 
    atomicNumber: 39, 
    category: "transition", 
    group: 3, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Zirconium", 
    symbol: "Zr", 
    atomicNumber: 40, 
    category: "transition", 
    group: 4, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Niobium", 
    symbol: "Nb", 
    atomicNumber: 41, 
    category: "transition", 
    group: 5, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Molybdenum", 
    symbol: "Mo", 
    atomicNumber: 42, 
    category: "transition", 
    group: 6, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Technetium", 
    symbol: "Tc", 
    atomicNumber: 43, 
    category: "transition", 
    group: 7, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Ruthenium", 
    symbol: "Ru", 
    atomicNumber: 44, 
    category: "transition", 
    group: 8, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Rhodium", 
    symbol: "Rh", 
    atomicNumber: 45, 
    category: "transition", 
    group: 9, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Palladium", 
    symbol: "Pd", 
    atomicNumber: 46, 
    category: "transition", 
    group: 10, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Silver", 
    symbol: "Ag", 
    atomicNumber: 47, 
    category: "transition", 
    group: 11, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Cadmium", 
    symbol: "Cd", 
    atomicNumber: 48, 
    category: "transition", 
    group: 12, 
    period: 5,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Indium", 
    symbol: "In", 
    atomicNumber: 49, 
    category: "post-transition", 
    group: 13, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Tin", 
    symbol: "Sn", 
    atomicNumber: 50, 
    category: "post-transition", 
    group: 14, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Antimony", 
    symbol: "Sb", 
    atomicNumber: 51, 
    category: "metalloid", 
    group: 15, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Tellurium", 
    symbol: "Te", 
    atomicNumber: 52, 
    category: "metalloid", 
    group: 16, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Iodine", 
    symbol: "I", 
    atomicNumber: 53, 
    category: "halogen", 
    group: 17, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  { 
    name: "Xenon", 
    symbol: "Xe", 
    atomicNumber: 54, 
    category: "noble-gas", 
    group: 18, 
    period: 5,
    block: "p",
    isRadioactive: false
  },
  
  // Period 6
  { 
    name: "Cesium", 
    symbol: "Cs", 
    atomicNumber: 55, 
    category: "alkali-metal", 
    group: 1, 
    period: 6,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Barium", 
    symbol: "Ba", 
    atomicNumber: 56, 
    category: "alkaline-earth", 
    group: 2, 
    period: 6,
    block: "s",
    isRadioactive: false
  },
  { 
    name: "Lanthanum", 
    symbol: "La", 
    atomicNumber: 57, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Cerium", 
    symbol: "Ce", 
    atomicNumber: 58, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Praseodymium", 
    symbol: "Pr", 
    atomicNumber: 59, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Neodymium", 
    symbol: "Nd", 
    atomicNumber: 60, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Promethium", 
    symbol: "Pm", 
    atomicNumber: 61, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Samarium", 
    symbol: "Sm", 
    atomicNumber: 62, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Europium", 
    symbol: "Eu", 
    atomicNumber: 63, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Gadolinium", 
    symbol: "Gd", 
    atomicNumber: 64, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Terbium", 
    symbol: "Tb", 
    atomicNumber: 65, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Dysprosium", 
    symbol: "Dy", 
    atomicNumber: 66, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Holmium", 
    symbol: "Ho", 
    atomicNumber: 67, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Erbium", 
    symbol: "Er", 
    atomicNumber: 68, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Thulium", 
    symbol: "Tm", 
    atomicNumber: 69, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Ytterbium", 
    symbol: "Yb", 
    atomicNumber: 70, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Lutetium", 
    symbol: "Lu", 
    atomicNumber: 71, 
    category: "lanthanide", 
    group: 3, 
    period: 6,
    block: "f",
    isRadioactive: false
  },
  { 
    name: "Hafnium", 
    symbol: "Hf", 
    atomicNumber: 72, 
    category: "transition", 
    group: 4, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Tantalum", 
    symbol: "Ta", 
    atomicNumber: 73, 
    category: "transition", 
    group: 5, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Tungsten", 
    symbol: "W", 
    atomicNumber: 74, 
    category: "transition", 
    group: 6, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Rhenium", 
    symbol: "Re", 
    atomicNumber: 75, 
    category: "transition", 
    group: 7, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Osmium", 
    symbol: "Os", 
    atomicNumber: 76, 
    category: "transition", 
    group: 8, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Iridium", 
    symbol: "Ir", 
    atomicNumber: 77, 
    category: "transition", 
    group: 9, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Platinum", 
    symbol: "Pt", 
    atomicNumber: 78, 
    category: "transition", 
    group: 10, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Gold", 
    symbol: "Au", 
    atomicNumber: 79, 
    category: "transition", 
    group: 11, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Mercury", 
    symbol: "Hg", 
    atomicNumber: 80, 
    category: "transition", 
    group: 12, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Thallium", 
    symbol: "Tl", 
    atomicNumber: 81, 
    category: "post-transition", 
    group: 13, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Lead", 
    symbol: "Pb", 
    atomicNumber: 82, 
    category: "post-transition", 
    group: 14, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Bismuth", 
    symbol: "Bi", 
    atomicNumber: 83, 
    category: "post-transition", 
    group: 15, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Polonium", 
    symbol: "Po", 
    atomicNumber: 84, 
    category: "post-transition", 
    group: 16, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Astatine", 
    symbol: "At", 
    atomicNumber: 85, 
    category: "halogen", 
    group: 17, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  { 
    name: "Radon", 
    symbol: "Rn", 
    atomicNumber: 86, 
    category: "noble-gas", 
    group: 18, 
    period: 6,
    block: "d",
    isRadioactive: false
  },
  
  // Period 7
  { 
    name: "Francium", 
    symbol: "Fr", 
    atomicNumber: 87, 
    category: "alkali-metal", 
    group: 1, 
    period: 7,
    block: "s",
    isRadioactive: true
  },
  { 
    name: "Radium", 
    symbol: "Ra", 
    atomicNumber: 88, 
    category: "alkaline-earth", 
    group: 2, 
    period: 7,
    block: "s",
    isRadioactive: true
  },
  { 
    name: "Actinium", 
    symbol: "Ac", 
    atomicNumber: 89, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Thorium", 
    symbol: "Th", 
    atomicNumber: 90, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Protactinium", 
    symbol: "Pa", 
    atomicNumber: 91, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Uranium", 
    symbol: "U", 
    atomicNumber: 92, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Neptunium", 
    symbol: "Np", 
    atomicNumber: 93, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Plutonium", 
    symbol: "Pu", 
    atomicNumber: 94, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Americium", 
    symbol: "Am", 
    atomicNumber: 95, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Curium", 
    symbol: "Cm", 
    atomicNumber: 96, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Berkelium", 
    symbol: "Bk", 
    atomicNumber: 97, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Californium", 
    symbol: "Cf", 
    atomicNumber: 98, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Einsteinium", 
    symbol: "Es", 
    atomicNumber: 99, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Fermium", 
    symbol: "Fm", 
    atomicNumber: 100, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Mendelevium", 
    symbol: "Md", 
    atomicNumber: 101, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Nobelium", 
    symbol: "No", 
    atomicNumber: 102, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Lawrencium", 
    symbol: "Lr", 
    atomicNumber: 103, 
    category: "actinide", 
    group: 3, 
    period: 7,
    block: "f",
    isRadioactive: true
  },
  { 
    name: "Rutherfordium", 
    symbol: "Rf", 
    atomicNumber: 104, 
    category: "transition", 
    group: 4, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Dubnium", 
    symbol: "Db", 
    atomicNumber: 105, 
    category: "transition", 
    group: 5, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Seaborgium", 
    symbol: "Sg", 
    atomicNumber: 106, 
    category: "transition", 
    group: 6, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Bohrium", 
    symbol: "Bh", 
    atomicNumber: 107, 
    category: "transition", 
    group: 7, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Hassium", 
    symbol: "Hs", 
    atomicNumber: 108, 
    category: "transition", 
    group: 8, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Meitnerium", 
    symbol: "Mt", 
    atomicNumber: 109, 
    category: "transition", 
    group: 9, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Darmstadtium", 
    symbol: "Ds", 
    atomicNumber: 110, 
    category: "transition", 
    group: 10, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Roentgenium", 
    symbol: "Rg", 
    atomicNumber: 111, 
    category: "transition", 
    group: 11, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Copernicium", 
    symbol: "Cn", 
    atomicNumber: 112, 
    category: "transition", 
    group: 12, 
    period: 7,
    block: "d",
    isRadioactive: true
  },
  { 
    name: "Nihonium", 
    symbol: "Nh", 
    atomicNumber: 113, 
    category: "post-transition", 
    group: 13, 
    period: 7,
    block: "p",
    isRadioactive: true
  },
  { 
    name: "Flerovium", 
    symbol: "Fl", 
    atomicNumber: 114, 
    category: "post-transition", 
    group: 14, 
    period: 7,
    block: "p",
    isRadioactive: true
  },
  { 
    name: "Moscovium", 
    symbol: "Mc", 
    atomicNumber: 115, 
    category: "post-transition", 
    group: 15, 
    period: 7,
    block: "p",
    isRadioactive: true
  },
  { 
    name: "Livermorium", 
    symbol: "Lv", 
    atomicNumber: 116, 
    category: "post-transition", 
    group: 16, 
    period: 7,
    block: "p",
    isRadioactive: true
  },
  { 
    name: "Tennessine", 
    symbol: "Ts", 
    atomicNumber: 117, 
    category: "halogen", 
    group: 17, 
    period: 7,
    block: "p",
    isRadioactive: true
  },
  { 
    name: "Oganesson", 
    symbol: "Og", 
    atomicNumber: 118, 
    category: "noble-gas", 
    group: 18, 
    period: 7,
    block: "p",
    isRadioactive: true
  }
];

// Object mapping for quick element lookup
export const elementMap = elementData.reduce((acc, element) => {
  acc[element.symbol] = element;
  return acc;
}, {} as Record<string, ElementData>);
