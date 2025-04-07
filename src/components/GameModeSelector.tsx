
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameMode } from '@/types/game';
import { Beaker, Clock, Flask, Sword, Atom } from 'lucide-react';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

const gameModes = [
  {
    id: 'quantum_leap',
    title: 'Quantum Leap Challenge',
    description: 'Travel through time solving historical chemistry problems',
    icon: Clock,
  },
  {
    id: 'synthesis_sprint',
    title: 'Synthesis Sprint',
    description: 'Race against time balancing chemical equations',
    icon: Flask,
  },
  {
    id: 'isotope_investigator',
    title: 'Isotope Investigator',
    description: 'Analyze samples using mass spectrometry',
    icon: Beaker,
  },
  {
    id: 'periodic_war',
    title: 'Periodic War',
    description: 'Battle using element properties',
    icon: Sword,
  },
  {
    id: 'standard',
    title: 'Standard Quiz',
    description: 'Classic periodic table quiz',
    icon: Atom,
  },
];

export default function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gameModes.map((mode) => (
        <Card 
          key={mode.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectMode(mode.id as GameMode)}
        >
          <CardHeader>
            <mode.icon className="w-8 h-8 mb-2" />
            <CardTitle>{mode.title}</CardTitle>
            <CardDescription>{mode.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Play Now</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
