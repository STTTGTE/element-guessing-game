
import React from "react";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface HeaderProps {
  guestMode: boolean;
  onExitGuestMode: () => void;
}

export function Header({ guestMode, onExitGuestMode }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Element Guessing Game</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {guestMode ? (
            <Button onClick={onExitGuestMode} size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          ) : (
            <UserNav />
          )}
        </div>
      </div>
    </header>
  );
}
