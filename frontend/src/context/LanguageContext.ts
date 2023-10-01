import { createContext } from "react";

interface LanguageContext {
  language: string;
  setLanguage: (lang: string) => void;
}

export const languageContext = createContext<LanguageContext>({
  language: "ENG",
  setLanguage: (lang: string) => {},
});
