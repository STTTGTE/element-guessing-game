import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session.user) {
      navigate("/game");
    }
  }, [session.user, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <AuthForm />
    </div>
  );
} 