import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Palette, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { session } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {t('ui.masterPeriodicTable')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t('ui.landingDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session.user ? (
                <Button asChild size="lg">
                  <Link to="/game">
                    {t('ui.playNow')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/game">
                      {t('ui.playAsGuest')}
                    </Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link to="/auth">
                      {t('ui.signUpToPlay')} <ArrowRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('ui.features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('ui.themes')}</h3>
              <p className="text-muted-foreground">
                {t('ui.themesDescription')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('ui.customization')}</h3>
              <p className="text-muted-foreground">
                {t('ui.customizationDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('ui.readyToTest')}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('ui.joinPlayers')}
          </p>
          <Button asChild size="lg">
            <Link to={session.user ? "/game" : "/auth"}>
              {session.user ? t('ui.continuePlaying') : t('ui.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 