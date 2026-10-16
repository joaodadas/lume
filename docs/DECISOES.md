# Decisões do lume

Registro curto das decisões que moldam o repo. Cada uma tem a data, a escolha e o porquê. Mudou de ideia? Acrescente uma linha nova com a data em vez de reescrever a antiga.

| Data | Decisão | Escolha | Porquê |
|---|---|---|---|
| 2026-10-15 | Nome e namespace | `lume`, `@lume`, skill `lume-design-engineering` | Curto, português, mesma família semântica do Foglamp (luz) sem copiar o nome |
| 2026-10-15 | Dono e acesso | Base pública `joaodadas/lume` (Apache 2.0) + camada privada `Lyx-Engenharia/lyx-ds` que depende da base | Os projetos do João e a Lyx instalam a mesma base; marca e blocos da Lyx ficam na org dela |
| 2026-10-15 | Primitivos | Base UI (`@base-ui/react`), fiel ao Foglamp; não Radix | É o que o Foglamp usa; é o padrão do `shadcn init` desde julho de 2026; o AI Elements do shadcn tem variante Base UI |
| 2026-10-15 | Idioma | Tudo em PT-BR; marcadores `**Always**` e `**Never**` em inglês; identificadores em inglês; "AI", nunca "IA"; sem travessão | O time da Lyx é brasileiro e os agentes leem os dois |
| 2026-10-15 | Semente dos primitivos | Cópia verbatim do Foglamp HEAD (`2bc3bb5`) via `scripts/sync-upstream.ts`, não o boilerplate | O boilerplate é o Foglamp congelado no 5º commit (sem squircle, sombras de 1px) |
| 2026-10-15 | Fontes | Fontsource (`@fontsource-variable/inter/opsz.css`, `geist-mono`, `host-grotesk`) com nomes literais no `@theme inline` | `registry:font` só aceita Google e woff2 não passa pela registry; o Fontsource funciona em Next e Vite e mantém o eixo `opsz` da Inter |
| 2026-10-15 | `--font-mono` | Mapeada para Geist Mono Variable | O Foglamp carrega a Geist Mono e nunca a mapeia (gotcha 4.11 do mapa); o painel do lyx-pr-agent já corrigia |
| 2026-10-15 | `font-feature-settings: "cv11", "ss01"` | Opt-in documentado no guia, fora do `base` | Muda a cara em relação ao foglamp.dev e quebraria a comparação visual |
| 2026-10-15 | Tokens removidos | `--sidebar-primary*` e `--custom-shadow-slate` saem; `hsl(var(--sidebar-border))` vira `var(--sidebar-border)`; hex da `table.tsx` viram tokens de borda | Nenhum componente usa os tokens removidos; `hsl(var())` com oklch é CSS inválido; hex fora do `globals.css` é proibido pelo check |
| 2026-10-15 | `cn()` | `clsx` + `tailwind-merge` em `lib/utils.ts`, não o pacote `cn` | É a assinatura que todo item do `@shadcn` espera |
| 2026-10-15 | Acoplamento a Next | Indireção `link` (`<a>`) / `link-next` (`next/link`) e `useUrlFilters` por `history.replaceState` | Os blocos ficam puros e instalam em Vite (como o painel do lyx-pr-agent) |
| 2026-10-15 | Tema | `theme-provider` (next-themes, `defaultTheme="dark"`) e `theme-provider-csp` (sem inline script) | Regra praticada do Foglamp; CSP estrita precisa de script estático |
| 2026-10-15 | Formulários | TanStack Form ou React Hook Form, desde que o campo seja o do DS; `login-form` é presentacional | Não impor lib que a Lyx não usa |
| 2026-10-15 | Distribuição | Registry GitHub nativa (`npx shadcn@latest add joaodadas/lume/<item>#vX.Y.Z`) + alias `@lume` servido de `public/r` na Vercel | Sem build para quem instala do GitHub; o alias dá nome estável e `search` |
| 2026-10-15 | `shadcn init` | `npx shadcn@latest init joaodadas/lume/base#vX.Y.Z -y`, nunca com `-d` | Verificado: com `-d` a CLI ignora `extends: none` e o `config` do base e instala o style padrão (tokens `sidebar-primary`, `button` e pacote `cn` do registry oficial) por cima; com `-y` só o `utils` e o `globals.css` entram e o `components.json` sai com base-vega, tabler e o alias `@lume` |
| 2026-10-15 | Primitivos extras | Os 15 que o app do Foglamp não usa são publicados verbatim com `tier: extra`, sem vitrine até a v0.2 | Custo zero e nenhum arquivo órfão |
| 2026-10-15 | Teal da Lyx | Recomendação: token `--brand`, não `--primary` (decisão final é da camada Lyx, em ADR próprio) | O look é cinza estrutural com cor só por significado; o `Button default` nem usa `--primary` |
| 2026-10-15 | Placeholder de valor nulo | Texto `sem dado` em `text-muted-foreground/50`; nunca o travessão que o `formatCost` do Foglamp usa | Regra de texto do repo e o check barrariam o glifo |

## Fora da v0.1.0

Capítulo de marketing do guia, bloco `ai-chat` (do Foggy) e HUD, `route-header` como item, `number-flow`, `model-chip` e logos de marcas (marcas registradas), migração efetiva dos fronts da Lyx (trabalho da Lyx com o guia), `lyx-bi-principal`.
