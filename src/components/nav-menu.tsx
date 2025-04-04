import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Menu, 
  X, 
  Home, 
  History, 
  Flame, 
  Trophy, 
  LogIn, 
  UserPlus, 
  LogOut, 
  User,
  Swords
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NavMenu() {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Content */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r shadow-lg transform transition-transform duration-300 ease-in-out z-50",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2">
            <NavLink 
              to="/" 
              icon={<Home className="h-5 w-5" />} 
              label="Home" 
              isActive={isActive("/")}
              onClick={closeMenu}
            />
            <NavLink 
              to="/game" 
              icon={<Swords className="h-5 w-5" />} 
              label="Single Player" 
              isActive={isActive("/game")}
              onClick={closeMenu}
            />
            <NavLink 
              to="/multiplayer" 
              icon={<User className="h-5 w-5" />} 
              label="Multiplayer" 
              isActive={isActive("/multiplayer")}
              onClick={closeMenu}
            />
            <NavLink 
              to="/history" 
              icon={<History className="h-5 w-5" />} 
              label="Game History" 
              isActive={isActive("/history")}
              onClick={closeMenu}
            />
            <NavLink 
              to="/streak" 
              icon={<Flame className="h-5 w-5" />} 
              label="My Streak" 
              isActive={isActive("/streak")}
              onClick={closeMenu}
            />
            <NavLink 
              to="/achievements" 
              icon={<Trophy className="h-5 w-5" />} 
              label="Achievements" 
              isActive={isActive("/achievements")}
              onClick={closeMenu}
            />
          </nav>

          <div className="border-t pt-4 mt-4">
            {session.user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{session.profile?.username || "User"}</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  asChild
                  onClick={closeMenu}
                >
                  <Link to="/game?mode=login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  asChild
                  onClick={closeMenu}
                >
                  <Link to="/game?mode=signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ 
  to, 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isActive && "bg-primary/10 text-primary"
      )}
      asChild
      onClick={onClick}
    >
      <Link to={to}>
        {icon}
        <span className="ml-2">{label}</span>
      </Link>
    </Button>
  );
} 