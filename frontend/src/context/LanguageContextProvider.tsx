import { FC, useState } from "react";
import { languageContext } from "./LanguageContext";

const LanguageContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("ENG");

  return (
    <languageContext.Provider value={{ language, setLanguage }}>
      {children}
    </languageContext.Provider>
  );
};

export default LanguageContextProvider;
