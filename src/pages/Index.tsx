
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent } from "@/components/ui/tabs"; 
import { SinglePlayerGame } from "@/components/single-player/SinglePlayerGame";
import { MultiplayerGame } from "@/components/multiplayer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { GameModeSwitcher } from "@/components/layout/GameModeSwitcher";
import { LoginScreen } from "@/components/auth/LoginScreen";

const Index = () => {
  const { session } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');

  const startGuestMode = () => {
    setGuestMode(true);
  };

  const exitGuestMode = () => {
    setGuestMode(false);
  };

  const switchGameMode = (mode: 'single' | 'multiplayer') => {
    if (gameMode !== mode) {
      setGameMode(mode);
    }
  };

  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session.user && !guestMode) {
    return <LoginScreen onStartGuestMode={startGuestMode} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors">
      <Header guestMode={guestMode} onExitGuestMode={exitGuestMode} />
      <GameModeSwitcher gameMode={gameMode} onSwitchGameMode={switchGameMode} />

      <main className="flex flex-col lg:flex-row flex-grow p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full gap-4 md:gap-6">
        <div className="flex flex-col flex-grow gap-4 md:gap-6">
          <Tabs value={gameMode} className="hidden">
            <TabsContent value="single" forceMount={gameMode === 'single'}>
              <SinglePlayerGame guestMode={guestMode} />
            </TabsContent>
            <TabsContent value="multiplayer" forceMount={gameMode === 'multiplayer'}>
              <MultiplayerGame />
            </TabsContent>
          </Tabs>
        </div>

        <Sidebar guestMode={guestMode} onExitGuestMode={exitGuestMode} />
      </main>
    </div>
  );
};

export default Index;
