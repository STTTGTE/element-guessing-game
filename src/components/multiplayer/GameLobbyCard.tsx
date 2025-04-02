
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GameLobbyCardProps {
  onLeaveGame: () => Promise<void>;
}

export function GameLobbyCard({ onLeaveGame }: GameLobbyCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Waiting for Opponent</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <p className="text-center text-muted-foreground max-w-md">
            Searching for an opponent. This could take a moment...
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onLeaveGame} 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
