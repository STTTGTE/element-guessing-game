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
      guess: string;
      hint: string;
      next: string;
      correct: string;
      incorrect: string;
      tryAgain: string;
      score: string;
      highScore: string;
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
      guess: "Raten",
      hint: "Hinweis",
      next: "Weiter",
      correct: "Richtig!",
      incorrect: "Falsch!",
      tryAgain: "Nochmal versuchen",
      score: "Punktzahl",
      highScore: "Höchstpunktzahl"
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
      guess: "Indovina",
      hint: "Suggerimento",
      next: "Avanti",
      correct: "Corretto!",
      incorrect: "Sbagliato!",
      tryAgain: "Riprova",
      score: "Punteggio",
      highScore: "Punteggio massimo"
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
      guess: "Adivinar",
      hint: "Pista",
      next: "Siguiente",
      correct: "¡Correcto!",
      incorrect: "¡Incorrecto!",
      tryAgain: "Intentar de nuevo",
      score: "Puntuación",
      highScore: "Puntuación máxima"
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
      guess: "Deviner",
      hint: "Indice",
      next: "Suivant",
      correct: "Correct!",
      incorrect: "Incorrect!",
      tryAgain: "Réessayer",
      score: "Score",
      highScore: "Meilleur score"
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
      guess: "Gissa",
      hint: "Ledtråd",
      next: "Nästa",
      correct: "Rätt!",
      incorrect: "Fel!",
      tryAgain: "Försök igen",
      score: "Poäng",
      highScore: "Högsta poäng"
    }
  }
}; 