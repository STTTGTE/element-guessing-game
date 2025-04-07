import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { DebugPanel } from "@/components/debug-panel";
import { Layout } from "@/components/layout";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import Multiplayer from "@/pages/Multiplayer";
import History from "@/pages/History";
import Streak from "@/pages/Streak";
import Achievements from "@/pages/Achievements";
import './App.css';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/game" element={<Index />} />
                <Route path="/multiplayer" element={<Multiplayer />} />
                <Route path="/history" element={<History />} />
                <Route path="/streak" element={<Streak />} />
                <Route path="/achievements" element={<Achievements />} />
              </Routes>
            </Layout>
            <Toaster />
            <DebugPanel />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
