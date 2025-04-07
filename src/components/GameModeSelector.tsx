
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameMode } from '@/types/game';
import { Beaker, Clock, Flask, Sword, Atom, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  unlockedFeatures: string[];
}

const gameModes = [
  {
    id: 'electron_explorer',
    title: 'Electron Explorer',
    description: 'Navigate through electron shells and energy levels',
    icon: Atom,
    requiresUnlock: false,
  },
  {
    id: 'valence_voyager',
    title: 'Valence Voyager',
    description: 'Master valence electron configurations',
    icon: Flask,
    requiresUnlock: false,
  },
  {
    id: 'orbital_odyssey',
    title: 'Orbital Odyssey',
    description: 'Explore atomic orbitals and quantum numbers',
    icon: Microscope,
    requiresUnlock: true,
  },
  {
    id: 'reaction_rush',
    title: 'Reaction Rush',
    description: 'Race to balance chemical equations',
    icon: Clock,
    requiresUnlock: false,
  },
  {
    id: 'atomic_architect',
    title: 'Atomic Architect',
    description: 'Build atoms from subatomic particles',
    icon: Beaker,
    requiresUnlock: true,
  },
  {
    id: 'periodic_puzzle',
    title: 'Periodic Puzzle',
    description: 'Solve element arrangement puzzles',
    icon: Sword,
    requiresUnlock: false,
  },
  {
    id: 'element_evolution',
    title: 'Element Evolution',
    description: 'Trace element discovery through history',
    icon: Clock,
    requiresUnlock: true,
  },
  {
    id: 'molecular_master',
    title: 'Molecular Master',
    description: 'Create stable molecular combinations',
    icon: Flask,
    requiresUnlock: true,
  },
  {
    id: 'bonding_battle',
    title: 'Bonding Battle',
    description: 'Compete in chemical bonding challenges',
    icon: Sword,
    requiresUnlock: false,
  },
  {
    id: 'atomic_assembly',
    title: 'Atomic Assembly',
    description: 'Assemble complex atomic structures',
    icon: Beaker,
    requiresUnlock: true,
  },
  {
    id: 'synthesis_sprint',
    title: 'Synthesis Sprint',
    description: 'Race against time balancing chemical equations',
    icon: Flask,
    requiresUnlock: false,
  },
  {
    id: 'isotope_investigator',
    title: 'Isotope Investigator',
    description: 'Analyze samples using mass spectrometry',
    icon: Microscope,
    requiresUnlock: true,
  },
  {
    id: 'periodic_war',
    title: 'Periodic War',
    description: 'Battle using element properties',
    icon: Sword,
    requiresUnlock: false,
  },
  {
    id: 'nano_architect',
    title: 'Nanotechnology Architect',
    description: 'Design molecular structures',
    icon: Beaker,
    requiresUnlock: true,
  },
  {
    id: 'standard',
    title: 'Standard Quiz',
    description: 'Classic periodic table quiz',
    icon: Atom,
    requiresUnlock: false,
  },
];

export default function GameModeSelector({ onSelectMode, unlockedFeatures }: GameModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gameModes.map((mode) => {
        const isUnlocked = !mode.requiresUnlock || unlockedFeatures.includes(mode.id);
        
        return (
          <motion.div
            key={mode.id}
            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
            whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
          >
            <Card 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${!isUnlocked ? 'opacity-50' : ''}`}
              onClick={() => isUnlocked && onSelectMode(mode.id as GameMode)}
            >
              <CardHeader>
                <mode.icon className="w-8 h-8 mb-2" />
                <CardTitle>{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? 'Play Now' : 'Unlock Required'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
