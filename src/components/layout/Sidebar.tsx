
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameHistory } from "@/components/game-history";
import { StreakDisplay } from "@/components/streak-display";
import { Achievements } from "@/components/achievements";

interface SidebarProps {
  guestMode: boolean;
  onExitGuestMode: () => void;
}

export function Sidebar({ guestMode, onExitGuestMode }: SidebarProps) {
  if (guestMode) {
    return (
      <div className="w-full lg:w-80">
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
          <h3 className="text-xl font-bold mb-4">Guest Mode</h3>
          <p className="text-muted-foreground mb-4">
            You're playing as a guest. Sign in to track your progress, earn achievements, and keep your streak going!
          </p>
          <Button onClick={onExitGuestMode} className="w-full">
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80">
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="streak">Streak</TabsTrigger>
          <TabsTrigger value="achievements">Trophies</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-2">
          <GameHistory />
        </TabsContent>
        <TabsContent value="streak" className="mt-2">
          <StreakDisplay />
        </TabsContent>
        <TabsContent value="achievements" className="mt-2">
          <Achievements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
