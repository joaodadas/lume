// Tema antes do primeiro paint, em arquivo estático e não em script inline: CSP
// estrita não aceita inline. Lê a escolha salva no navegador; sem ela, usa o
// padrão. Mesma chave e mesmo padrão do ThemeProvider (theme-provider-csp): para
// mudar os dois, use data-storage-key e data-default-theme nesta tag.
//
//   <script src="/theme.js" data-storage-key="lume-theme" data-default-theme="dark"></script>
//
// Derivado do painel do lyx-pr-agent (João Vitor Dadas): painel/public/assets/tema.js.
(() => {
  try {
    const script = document.currentScript;
    const key = script?.dataset.storageKey || "lume-theme";
    const fallback = script?.dataset.defaultTheme || "dark";
    const saved = localStorage.getItem(key);
    const theme =
      saved === "light" || saved === "dark" || saved === "system"
        ? saved
        : fallback;
    const dark =
      theme === "dark" ||
      (theme === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch {
    // sem localStorage (storage bloqueado): fica o que o CSS já faz por padrão
  }
})();
