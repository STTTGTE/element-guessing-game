
import React from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface LoginScreenProps {
  onStartGuestMode: () => void;
}

export function LoginScreen({ onStartGuestMode }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <AuthForm />
      <div className="text-center">
        <p className="text-gray-500 mb-2">or</p>
        <Button onClick={onStartGuestMode} variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Play as Guest
        </Button>
      </div>
    </div>
  );
}
