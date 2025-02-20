"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { usePathname } from "next/navigation";
import en from "@/contexts/i18n/resources/en.json";
import ko from "@/contexts/i18n/resources/ko.json";

const resources = {
  EN_US: en,
  KO_KR: ko,
};

export type LanguageType = "EN_US" | "KO_KR" | null;

i18next.init({
  resources,
  lng: "KO_KR",
  fallbackLng: "KO_KR",
  interpolation: { escapeValue: false },
});

interface I18nContextType {
  language: LanguageType;
  toggleLanguage: (newLang: LanguageType) => void;
  lang: "ko" | "en";
}

const I18nContext = createContext<I18nContextType>({
  language: "KO_KR",
  toggleLanguage: () => {},
  lang: "ko",
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<LanguageType>(null);
  const lang = language === "EN_US" ? "en" : "ko";
  const pathname = usePathname();

  const toggleLanguage = useCallback((newLang: LanguageType) => {
    if (!newLang) return;
    setLanguage(newLang);
    i18next.changeLanguage(newLang);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.split("/").length > 2) {
      const pathLang = pathname.split("/")[1];
      toggleLanguage(pathLang === "en" ? "EN_US" : "KO_KR");
    }
  }, [pathname, toggleLanguage]);

  return (
    <I18nContext.Provider value={{ language, toggleLanguage, lang }}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
