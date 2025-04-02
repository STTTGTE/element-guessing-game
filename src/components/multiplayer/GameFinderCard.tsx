
import { useState } from "react";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GameFinderCardProps {
  onFindGame: () => Promise<void>;
  loading: boolean;
}

export function GameFinderCard({ onFindGame, loading }: GameFinderCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Multiplayer Mode</CardTitle>
          <CardDescription>
            Challenge other players in real-time!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-md p-4">
            <h3 className="font-bold flex items-center gap-2">
              <Swords className="h-5 w-5" /> Game Rules
            </h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>You have 3 minutes to answer as many questions as possible</li>
              <li>3 incorrect answers and you lose automatically</li>
              <li>Player with the most correct answers wins</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onFindGame} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Finding Match..." : "Find Match"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
