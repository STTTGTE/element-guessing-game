
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords } from "lucide-react";

interface GameModeSwitcherProps {
  gameMode: 'single' | 'multiplayer';
  onSwitchGameMode: (mode: 'single' | 'multiplayer') => void;
}

export function GameModeSwitcher({ gameMode, onSwitchGameMode }: GameModeSwitcherProps) {
  return (
    <div className="bg-muted/40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs 
          value={gameMode} 
          onValueChange={(value) => onSwitchGameMode(value as 'single' | 'multiplayer')} 
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mt-2">
            <TabsTrigger value="single">Single Player</TabsTrigger>
            <TabsTrigger value="multiplayer" className="flex items-center gap-1">
              <Swords className="h-4 w-4" /> Multiplayer
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
