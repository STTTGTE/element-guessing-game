export interface ElementTranslations {
  name: string;
  category: string;
  block: string;
  electricalConductivity: string;
  magneticProperty: string;
  naturalOccurrence: string;
  biologicalRole: string;
}

export interface LanguageTranslations {
  [key: string]: {
    elements: {
      [key: string]: ElementTranslations;
    };
    ui: {
      // Landing Page
      masterPeriodicTable: string;
      landingDescription: string;
      playNow: string;
      playAsGuest: string;
      signUpToPlay: string;
      features: string;
      themes: string;
      themesDescription: string;
      customization: string;
      customizationDescription: string;
      readyToTest: string;
      joinPlayers: string;
      continuePlaying: string;
      getStarted: string;
      
      // Game Actions
      guess: string;
      hint: string;
      next: string;
      correct: string;
      incorrect: string;
      tryAgain: string;
      reset: string;
      start: string;
      back: string;
      
      // Game Info
      score: string;
      highScore: string;
      points: string;
      questionNumber: string;
      streak: string;
      masteryLevel: string;
      
      // Game Messages
      correctAnswer: string;
      wrongAnswer: string;
      gameOver: string;
      newHighScore: string;
      
      // Navigation
      home: string;
      history: string;
      achievements: string;
      profile: string;
      settings: string;
      signIn: string;
      signOut: string;
      
      // Categories
      nonmetal: string;
      'noble-gas': string;
      'alkali-metal': string;
      'alkaline-earth-metal': string;
      metalloid: string;
      halogen: string;
      metal: string;
      transition: string;
      lanthanide: string;
      actinide: string;
      
      // Properties
      low: string;
      medium: string;
      high: string;
      paramagnetic: string;
      diamagnetic: string;
      ferromagnetic: string;
      common: string;
      rare: string;
      synthetic: string;
      essential: string;
      beneficial: string;
      none: string;

      // Theme Options
      'modern': string;
      'classic': string;
      'dark': string;
      'light': string;
      'colorful': string;
      'minimal': string;
      'ocean': string;
      'forest': string;
      'desert': string;
      'space': string;
      'retro': string;
      'neon': string;
      'pastel': string;
      'monochrome': string;
      'vintage': string;
      'gradient': string;
    };
  };
}

export const translations: LanguageTranslations = {
  de: {
    elements: {
      Hydrogen: {
        name: "Wasserstoff",
        category: "Nichtmetall",
        block: "s",
        electricalConductivity: "niedrig",
        magneticProperty: "diamagnetisch",
        naturalOccurrence: "häufig",
        biologicalRole: "essentiell"
      },
      // Add more German translations here
    },
    ui: {
      // Landing Page
      masterPeriodicTable: "Beherrsche das Periodensystem",
      landingDescription: "Teste dein Wissen über chemische Elemente in diesem interaktiven Spiel. Wähle aus verschiedenen Designs und personalisiere deine Erfahrung.",
      playNow: "Jetzt spielen",
      playAsGuest: "Als Gast spielen",
      signUpToPlay: "Registrieren zum Spielen",
      features: "Funktionen",
      themes: "Designs",
      themesDescription: "Wähle aus einer Vielzahl von Designs, von modern bis klassisch, um dein Spielerlebnis zu personalisieren.",
      customization: "Anpassung",
      customizationDescription: "Passe das Aussehen des Periodensystems an deine Vorlieben an und erstelle deine eigene Spielumgebung.",
      readyToTest: "Bereit, dein Wissen zu testen?",
      joinPlayers: "Schließe dich tausenden Spielern an, die das Periodensystem meistern.",
      continuePlaying: "Weiter spielen",
      getStarted: "Loslegen",
      
      // Game Actions
      guess: "Raten",
      hint: "Hinweis",
      next: "Weiter",
      correct: "Richtig!",
      incorrect: "Falsch!",
      tryAgain: "Nochmal versuchen",
      reset: "Zurücksetzen",
      start: "Starten",
      back: "Zurück",
      
      // Game Info
      score: "Punktzahl",
      highScore: "Höchstpunktzahl",
      points: "Punkte",
      questionNumber: "Frage Nummer",
      streak: "Serie",
      masteryLevel: "Beherrschungsgrad",
      
      // Game Messages
      correctAnswer: "Richtige Antwort",
      wrongAnswer: "Falsche Antwort",
      gameOver: "Spiel beendet",
      newHighScore: "Neuer Höchststand",
      
      // Navigation
      home: "Startseite",
      history: "Verlauf",
      achievements: "Errungenschaften",
      profile: "Profil",
      settings: "Einstellungen",
      signIn: "Anmelden",
      signOut: "Abmelden",
      
      // Categories
      nonmetal: "Nichtmetall",
      'noble-gas': "Edelgas",
      'alkali-metal': "Alkalimetall",
      'alkaline-earth-metal': "Erdalkalimetall",
      metalloid: "Halbmetall",
      halogen: "Halogen",
      metal: "Metall",
      transition: "Übergangsmetall",
      lanthanide: "Lanthanoid",
      actinide: "Actinoid",
      
      // Properties
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      paramagnetic: "Paramagnetisch",
      diamagnetic: "Diamagnetisch",
      ferromagnetic: "Ferromagnetisch",
      common: "Häufig",
      rare: "Selten",
      synthetic: "Synthetisch",
      essential: "Essentiell",
      beneficial: "Nützlich",
      none: "Keine",

      // Theme Options
      'modern': "Modern",
      'classic': "Klassisch",
      'dark': "Dunkel",
      'light': "Hell",
      'colorful': "Bunt",
      'minimal': "Minimal",
      'ocean': "Ozean",
      'forest': "Wald",
      'desert': "Wüste",
      'space': "Weltraum",
      'retro': "Retro",
      'neon': "Neon",
      'pastel': "Pastell",
      'monochrome': "Monochrom",
      'vintage': "Vintage",
      'gradient': "Verlauf"
    }
  },
  it: {
    elements: {
      Hydrogen: {
        name: "Idrogeno",
        category: "Non metallo",
        block: "s",
        electricalConductivity: "bassa",
        magneticProperty: "diamagnetico",
        naturalOccurrence: "comune",
        biologicalRole: "essenziale"
      },
      // Add more Italian translations here
    },
    ui: {
      // Landing Page
      masterPeriodicTable: "Padroneggia la Tavola Periodica",
      landingDescription: "Metti alla prova la tua conoscenza degli elementi chimici in questo gioco interattivo. Scegli tra diversi design e personalizza la tua esperienza.",
      playNow: "Gioca ora",
      playAsGuest: "Gioca come ospite",
      signUpToPlay: "Registrati per giocare",
      features: "Funzionalità",
      themes: "Design",
      themesDescription: "Scegli tra una varietà di design, dal moderno al classico, per personalizzare la tua esperienza di gioco.",
      customization: "Personalizzazione",
      customizationDescription: "Adatta l'aspetto della tavola periodica alle tue preferenze e crea il tuo ambiente di gioco personalizzato.",
      readyToTest: "Pronto a testare le tue conoscenze?",
      joinPlayers: "Unisciti a migliaia di giocatori che stanno padroneggiando la tavola periodica.",
      continuePlaying: "Continua a giocare",
      getStarted: "Inizia",
      
      // Game Actions
      guess: "Indovina",
      hint: "Suggerimento",
      next: "Avanti",
      correct: "Corretto!",
      incorrect: "Sbagliato!",
      tryAgain: "Riprova",
      reset: "Ripristina",
      start: "Inizia",
      back: "Indietro",
      
      // Game Info
      score: "Punteggio",
      highScore: "Punteggio massimo",
      points: "Punti",
      questionNumber: "Domanda numero",
      streak: "Serie",
      masteryLevel: "Livello di padronanza",
      
      // Game Messages
      correctAnswer: "Risposta corretta",
      wrongAnswer: "Risposta errata",
      gameOver: "Game Over",
      newHighScore: "Nuovo record",
      
      // Navigation
      home: "Home",
      history: "Cronologia",
      achievements: "Obiettivi",
      profile: "Profilo",
      settings: "Impostazioni",
      signIn: "Accedi",
      signOut: "Esci",
      
      // Categories
      nonmetal: "Non metallo",
      'noble-gas': "Gas nobile",
      'alkali-metal': "Metallo alcalino",
      'alkaline-earth-metal': "Metallo alcalino-terroso",
      metalloid: "Metalloide",
      halogen: "Alogeno",
      metal: "Metallo",
      transition: "Metallo di transizione",
      lanthanide: "Lantanide",
      actinide: "Attinide",
      
      // Properties
      low: "Basso",
      medium: "Medio",
      high: "Alto",
      paramagnetic: "Paramagnetico",
      diamagnetic: "Diamagnetico",
      ferromagnetic: "Ferromagnetico",
      common: "Comune",
      rare: "Raro",
      synthetic: "Sintetico",
      essential: "Essenziale",
      beneficial: "Benefico",
      none: "Nessuno",

      // Theme Options
      'modern': "Moderno",
      'classic': "Classico",
      'dark': "Scuro",
      'light': "Chiaro",
      'colorful': "Colorato",
      'minimal': "Minimale",
      'ocean': "Oceano",
      'forest': "Foresta",
      'desert': "Deserto",
      'space': "Spazio",
      'retro': "Retrò",
      'neon': "Neon",
      'pastel': "Pastello",
      'monochrome': "Monocromatico",
      'vintage': "Vintage",
      'gradient': "Gradiente"
    }
  },
  es: {
    elements: {
      Hydrogen: {
        name: "Hidrógeno",
        category: "No metal",
        block: "s",
        electricalConductivity: "baja",
        magneticProperty: "diamagnético",
        naturalOccurrence: "común",
        biologicalRole: "esencial"
      },
      // Add more Spanish translations here
    },
    ui: {
      // Landing Page
      masterPeriodicTable: "Domina la Tabla Periódica",
      landingDescription: "Prueba tus conocimientos sobre elementos químicos en este juego interactivo. Elige entre diferentes diseños y personaliza tu experiencia.",
      playNow: "Jugar ahora",
      playAsGuest: "Jugar como invitado",
      signUpToPlay: "Registrarse para jugar",
      features: "Características",
      themes: "Diseños",
      themesDescription: "Elige entre una variedad de diseños, desde moderno hasta clásico, para personalizar tu experiencia de juego.",
      customization: "Personalización",
      customizationDescription: "Adapta la apariencia de la tabla periódica a tus preferencias y crea tu propio entorno de juego.",
      readyToTest: "¿Listo para probar tus conocimientos?",
      joinPlayers: "Únete a miles de jugadores que están dominando la tabla periódica.",
      continuePlaying: "Continuar jugando",
      getStarted: "Comenzar",
      
      // Game Actions
      guess: "Adivinar",
      hint: "Pista",
      next: "Siguiente",
      correct: "¡Correcto!",
      incorrect: "¡Incorrecto!",
      tryAgain: "Intentar de nuevo",
      reset: "Reiniciar",
      start: "Comenzar",
      back: "Atrás",
      
      // Game Info
      score: "Puntuación",
      highScore: "Puntuación máxima",
      points: "Puntos",
      questionNumber: "Pregunta número",
      streak: "Racha",
      masteryLevel: "Nivel de dominio",
      
      // Game Messages
      correctAnswer: "Respuesta correcta",
      wrongAnswer: "Respuesta incorrecta",
      gameOver: "Juego terminado",
      newHighScore: "Nuevo récord",
      
      // Navigation
      home: "Inicio",
      history: "Historial",
      achievements: "Logros",
      profile: "Perfil",
      settings: "Configuración",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      
      // Categories
      nonmetal: "No metal",
      'noble-gas': "Gas noble",
      'alkali-metal': "Metal alcalino",
      'alkaline-earth-metal': "Metal alcalinotérreo",
      metalloid: "Metaloide",
      halogen: "Halógeno",
      metal: "Metal",
      transition: "Metal de transición",
      lanthanide: "Lantánido",
      actinide: "Actínido",
      
      // Properties
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
      paramagnetic: "Paramagnético",
      diamagnetic: "Diamagnético",
      ferromagnetic: "Ferromagnético",
      common: "Común",
      rare: "Raro",
      synthetic: "Sintético",
      essential: "Esencial",
      beneficial: "Beneficioso",
      none: "Ninguno",

      // Theme Options
      'modern': "Moderno",
      'classic': "Clásico",
      'dark': "Oscuro",
      'light': "Claro",
      'colorful': "Colorido",
      'minimal': "Minimalista",
      'ocean': "Océano",
      'forest': "Bosque",
      'desert': "Desierto",
      'space': "Espacio",
      'retro': "Retro",
      'neon': "Neón",
      'pastel': "Pastel",
      'monochrome': "Monocromo",
      'vintage': "Vintage",
      'gradient': "Degradado"
    }
  },
  fr: {
    elements: {
      Hydrogen: {
        name: "Hydrogène",
        category: "Non-métal",
        block: "s",
        electricalConductivity: "faible",
        magneticProperty: "diamagnétique",
        naturalOccurrence: "courant",
        biologicalRole: "essentiel"
      },
      // Add more French translations here
    },
    ui: {
      // Landing Page
      masterPeriodicTable: "Maîtrisez le Tableau Périodique",
      landingDescription: "Testez vos connaissances sur les éléments chimiques dans ce jeu interactif. Choisissez parmi différents designs et personnalisez votre expérience.",
      playNow: "Jouer maintenant",
      playAsGuest: "Jouer en tant qu'invité",
      signUpToPlay: "S'inscrire pour jouer",
      features: "Fonctionnalités",
      themes: "Designs",
      themesDescription: "Choisissez parmi une variété de designs, du moderne au classique, pour personnaliser votre expérience de jeu.",
      customization: "Personnalisation",
      customizationDescription: "Adaptez l'apparence du tableau périodique à vos préférences et créez votre propre environnement de jeu.",
      readyToTest: "Prêt à tester vos connaissances ?",
      joinPlayers: "Rejoignez des milliers de joueurs qui maîtrisent le tableau périodique.",
      continuePlaying: "Continuer à jouer",
      getStarted: "Commencer",
      
      // Game Actions
      guess: "Deviner",
      hint: "Indice",
      next: "Suivant",
      correct: "Correct!",
      incorrect: "Incorrect!",
      tryAgain: "Réessayer",
      reset: "Réinitialiser",
      start: "Commencer",
      back: "Retour",
      
      // Game Info
      score: "Score",
      highScore: "Meilleur score",
      points: "Points",
      questionNumber: "Question numéro",
      streak: "Série",
      masteryLevel: "Niveau de maîtrise",
      
      // Game Messages
      correctAnswer: "Bonne réponse",
      wrongAnswer: "Mauvaise réponse",
      gameOver: "Partie terminée",
      newHighScore: "Nouveau record",
      
      // Navigation
      home: "Accueil",
      history: "Historique",
      achievements: "Succès",
      profile: "Profil",
      settings: "Paramètres",
      signIn: "Se connecter",
      signOut: "Se déconnecter",
      
      // Categories
      nonmetal: "Non-métal",
      'noble-gas': "Gaz noble",
      'alkali-metal': "Métal alcalin",
      'alkaline-earth-metal': "Métal alcalino-terreux",
      metalloid: "Métalloïde",
      halogen: "Halogène",
      metal: "Métal",
      transition: "Métal de transition",
      lanthanide: "Lanthanide",
      actinide: "Actinide",
      
      // Properties
      low: "Faible",
      medium: "Moyen",
      high: "Élevé",
      paramagnetic: "Paramagnétique",
      diamagnetic: "Diamagnétique",
      ferromagnetic: "Ferromagnétique",
      common: "Commun",
      rare: "Rare",
      synthetic: "Synthétique",
      essential: "Essentiel",
      beneficial: "Bénéfique",
      none: "Aucun",

      // Theme Options
      'modern': "Moderne",
      'classic': "Classique",
      'dark': "Sombre",
      'light': "Clair",
      'colorful': "Coloré",
      'minimal': "Minimaliste",
      'ocean': "Océan",
      'forest': "Forêt",
      'desert': "Désert",
      'space': "Espace",
      'retro': "Rétro",
      'neon': "Néon",
      'pastel': "Pastel",
      'monochrome': "Monochrome",
      'vintage': "Vintage",
      'gradient': "Dégradé"
    }
  },
  sv: {
    elements: {
      Hydrogen: {
        name: "Väte",
        category: "Icke-metall",
        block: "s",
        electricalConductivity: "låg",
        magneticProperty: "diamagnetisk",
        naturalOccurrence: "vanlig",
        biologicalRole: "essentiell"
      },
      // Add more Swedish translations here
    },
    ui: {
      // Landing Page
      masterPeriodicTable: "Behärska det Periodiska Systemet",
      landingDescription: "Testa dina kunskaper om kemiska element i detta interaktiva spel. Välj mellan olika design och anpassa din upplevelse.",
      playNow: "Spela nu",
      playAsGuest: "Spela som gäst",
      signUpToPlay: "Registrera dig för att spela",
      features: "Funktioner",
      themes: "Design",
      themesDescription: "Välj bland en mängd olika design, från modernt till klassiskt, för att anpassa din spelupplevelse.",
      customization: "Anpassning",
      customizationDescription: "Anpassa utseendet på det periodiska systemet efter dina preferenser och skapa din egen spelupplevelse.",
      readyToTest: "Redo att testa dina kunskaper?",
      joinPlayers: "Gå med i tusentals spelare som behärskar det periodiska systemet.",
      continuePlaying: "Fortsätt spela",
      getStarted: "Kom igång",
      
      // Game Actions
      guess: "Gissa",
      hint: "Ledtråd",
      next: "Nästa",
      correct: "Rätt!",
      incorrect: "Fel!",
      tryAgain: "Försök igen",
      reset: "Återställ",
      start: "Starta",
      back: "Tillbaka",
      
      // Game Info
      score: "Poäng",
      highScore: "Högsta poäng",
      points: "Poäng",
      questionNumber: "Fråga nummer",
      streak: "Serie",
      masteryLevel: "Behärskningsnivå",
      
      // Game Messages
      correctAnswer: "Rätt svar",
      wrongAnswer: "Fel svar",
      gameOver: "Spelet är slut",
      newHighScore: "Nytt rekord",
      
      // Navigation
      home: "Hem",
      history: "Historik",
      achievements: "Prestationer",
      profile: "Profil",
      settings: "Inställningar",
      signIn: "Logga in",
      signOut: "Logga ut",
      
      // Categories
      nonmetal: "Icke-metall",
      'noble-gas': "Ädelgas",
      'alkali-metal': "Alkalimetall",
      'alkaline-earth-metal': "Alkaliska jordartsmetall",
      metalloid: "Metalloid",
      halogen: "Halogen",
      metal: "Metall",
      transition: "Övergångsmetall",
      lanthanide: "Lantanoid",
      actinide: "Aktinoid",
      
      // Properties
      low: "Låg",
      medium: "Medel",
      high: "Hög",
      paramagnetic: "Paramagnetisk",
      diamagnetic: "Diamagnetisk",
      ferromagnetic: "Ferromagnetisk",
      common: "Vanlig",
      rare: "Sällsynt",
      synthetic: "Syntetisk",
      essential: "Essentiell",
      beneficial: "Gynnsam",
      none: "Ingen",

      // Theme Options
      'modern': "Modern",
      'classic': "Klassisk",
      'dark': "Mörk",
      'light': "Ljus",
      'colorful': "Färgglad",
      'minimal': "Minimalistisk",
      'ocean': "Ocean",
      'forest': "Skog",
      'desert': "Öken",
      'space': "Rymd",
      'retro': "Retro",
      'neon': "Neon",
      'pastel': "Pastell",
      'monochrome': "Monokrom",
      'vintage': "Vintage",
      'gradient': "Gradient"
    }
  }
}; 