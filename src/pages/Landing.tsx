import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, BookOpen, Trophy, Users } from "lucide-react";

export default function Landing() {
  const { session } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Master the Periodic Table
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Test your knowledge of chemical elements in this interactive game. 
              Challenge yourself or play with friends in multiplayer mode.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session.user ? (
                <Button asChild size="lg">
                  <Link to="/game">
                    Play Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/game?mode=guest">
                      Play as Guest
                    </Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link to="/game?mode=signup">
                      Sign Up to Play <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Elements</h3>
              <p className="text-muted-foreground">
                Test your knowledge of element symbols, names, and properties.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Achievements</h3>
              <p className="text-muted-foreground">
                Unlock achievements as you play and build your streak.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiplayer Mode</h3>
              <p className="text-muted-foreground">
                Challenge friends in real-time multiplayer matches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players who are mastering the periodic table.
          </p>
          <Button asChild size="lg">
            <Link to={session.user ? "/game" : "/game?mode=signup"}>
              {session.user ? "Continue Playing" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 