"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { zhTranslations } from "./translations";

type Language = "en" | "zh";

const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void }>({
  language: "en",
  toggleLanguage: () => undefined,
});

const originalText = new WeakMap<Text, string>();

function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, [data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  let node = walker.nextNode() as Text | null;
  while (node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
    const source = originalText.get(node) || "";
    const key = source.trim();
    const replacement = language === "zh" ? zhTranslations[key] : undefined;
    const next = language === "zh" && replacement
      ? source.replace(key, replacement)
      : source;
    if (node.nodeValue !== next) node.nodeValue = next;
    node = walker.nextNode() as Text | null;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-language");
    if (saved === "zh") setLanguage("zh");
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("portfolio-language", language);
    const frame = window.requestAnimationFrame(() => translatePage(language));
    return () => window.cancelAnimationFrame(frame);
  }, [language, pathname]);

  return <LanguageContext.Provider value={{ language, toggleLanguage: () => setLanguage(current => current === "en" ? "zh" : "en") }}>{children}</LanguageContext.Provider>;
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useContext(LanguageContext);
  return <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={language === "en" ? "切换到中文" : "Switch to English"} data-no-translate>{language === "en" ? "中文" : "EN"}</button>;
}
