// Derivado do painel do lyx-pr-agent (João Vitor Dadas): painel/src/app/tema.tsx, com o public/assets/tema.js correspondente em registry/base-vega/public/theme.js.
// Modificado por joaodadas/lume: nomes com a forma do next-themes (ThemeProvider e useTheme devolvendo theme, setTheme, resolvedTheme, systemTheme e themes), storageKey e defaultTheme configuráveis (padrão "lume-theme" e "dark"), seguro em SSR (lê localStorage só depois do mount) e sincronizado entre abas pelo evento storage.
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Tema claro, escuro ou o do sistema sem script inline. A classe .dark no <html>
// é o que o CSS lê, e quem a põe antes do primeiro paint é o public/theme.js
// (arquivo estático carregado no <head>, porque CSP estrita não aceita inline).
// O next-themes faz o mesmo com um <script> inline, que CSP sem nonce bloqueia;
// este provider existe para esse caso e expõe a mesma forma de useTheme.

export type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

export const THEMES: Theme[] = ["light", "dark", "system"];

type ThemeContextValue = {
  /** A escolha salva ("system" é um estado próprio). undefined antes do mount. */
  theme: Theme | undefined;
  /** Aceita string como no next-themes; valor desconhecido cai no defaultTheme. */
  setTheme: (theme: string) => void;
  /** O que está aplicado de fato, "light" ou "dark". undefined antes do mount. */
  resolvedTheme: Resolved | undefined;
  systemTheme: Resolved | undefined;
  themes: string[];
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: undefined,
  setTheme: () => {},
  resolvedTheme: undefined,
  systemTheme: undefined,
  themes: THEMES,
});

const isTheme = (v: unknown): v is Theme =>
  v === "light" || v === "dark" || v === "system";

function readStored(key: string, fallback: Theme): Theme {
  try {
    const t = localStorage.getItem(key);
    return isTheme(t) ? t : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeProvider({
  children,
  storageKey = "lume-theme",
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  /** Mesma chave que o theme.js lê (data-storage-key na tag do script). */
  storageKey?: string;
  /** Mesmo padrão do theme.js (data-default-theme na tag do script). */
  defaultTheme?: Theme;
}) {
  // undefined no servidor e no primeiro render do cliente, como no next-themes:
  // a árvore hidrata igual dos dois lados e o estado real chega no efeito, sem
  // flash, porque a classe .dark já está no <html> pelo theme.js.
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);
  const [systemTheme, setSystemTheme] = useState<Resolved | undefined>(
    undefined,
  );

  useEffect(() => {
    setThemeState(readStored(storageKey, defaultTheme));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(mq.matches ? "dark" : "light");
    onChange();
    mq.addEventListener("change", onChange);
    // Outra aba mudou o tema: acompanha.
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey)
        setThemeState(readStored(storageKey, defaultTheme));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [storageKey, defaultTheme]);

  const resolvedTheme: Resolved | undefined =
    theme === undefined ? undefined : theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (!resolvedTheme) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    // Scrollbar, formulários nativos e color-mix seguem o tema.
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: string) => {
      const t = isTheme(next) ? next : defaultTheme;
      setThemeState(t);
      try {
        localStorage.setItem(storageKey, t);
      } catch {
        // aba anônima ou storage bloqueado: a escolha vale só nesta visita
      }
    },
    [storageKey, defaultTheme],
  );

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme, systemTheme, themes: THEMES }),
    [theme, setTheme, resolvedTheme, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Mesma forma do useTheme do next-themes, para o theme-switcher funcionar com
 * os dois providers: nele, troque o import de "next-themes" por este arquivo. */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
