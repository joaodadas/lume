# Camada Lyx: `Lyx-Engenharia/lyx-ds` sobre a base pública

Origem: plano do lume (seção Camada Lyx e Governança), `lyx-front-template/src/app/globals.css` (tokens 52W) e `AGENTS.md` ao lado. A base `joaodadas/lume` é pública e neutra (cinza estrutural, cara do Foglamp); tudo que é marca da Lyx (teal, logo, login, shell com switcher de portal, blocos `hub-*`) vive num repo privado que depende da base por tag. Nesta entrega o `lyx-ds` é esqueleto e contrato; o conteúdo entra com o Jefferson.

## Esqueleto do repo

```
lyx-ds/
  registry.json                 gerado, commitado
  registry/base-vega/{components,blocks,styles}/
  public/r/*.json               shadcn build, servido pela Contents API
  docs/LYX.md                   regras de projeto (o que saiu do FRONTEND.md: tRPC ou fetch wrapper, env, Better Auth)
  AGENTS.md  CODEOWNERS (João e Jefferson)  scripts/{check,release}.ts reduzidos
```

Sem site: a Lyx instala do GitHub (`npx shadcn@latest add Lyx-Engenharia/lyx-ds/<item>#v0.1.0`) ou pelo alias `@lyx` apontando para a Contents API. Todo `registryDependencies` para a base usa o endereço completo com tag (`joaodadas/lume/<item>#v0.1.0`): refs não são herdadas. Nenhum item da Lyx declara dependência no `base`, para o `theme-lyx` nunca ser instalado no mesmo comando que ele (quando os dois entram juntos, o `base` vence). Os repos `lyx-design-system-v2` e `lyx-design-system-bi-v2` são arquivados com um README apontando para cá.

## Itens

| Item | Tipo | O que é | Depende de |
|---|---|---|---|
| `theme-lyx` | `registry:theme` | Só `cssVars`: `--brand`, `--brand-foreground`, `--custom-shadow-brand` nos dois temas e `color-brand` no `theme`; mais um `css` que estende a variante dark para `.dark` e `[data-theme="dark"]` ao mesmo tempo, para os fronts atuais migrarem o toggle depois dos componentes | nada |
| `lyx-logo` | `registry:component` | Portado de `lyx-front-template/src/components/ui/lyx-logo.tsx` (SVG `viewBox="0 0 120 110"`, `currentColor`, `aria-label="Lyx"`, prop `size`) | `joaodadas/lume/utils#v0.1.0` |
| `lyx-login` | `registry:block` | O redesign do Jefferson sobre o `login-form` da base (presentacional: `{ brand, methods, onPassword, onMagicLink, onGoogle, onForgot, pending, error }`); o Better Auth fica no front | `joaodadas/lume/login-form#v0.1.0`, `lyx-logo` |
| `lyx-shell` | `registry:block` | `app-shell` da base com `brand={<LyxLogo />}`, switcher de portal, link para o Hub (`https://hub.lyxai.com.br`, como em `painel/src/app/shell.tsx:107-109`) e menu de conta com sair | `joaodadas/lume/app-shell#v0.1.0`, `lyx-logo` |
| `badge`, `button` | `registry:ui` | Sobrescrevem o item da base acrescentando a variant `brand` (`bg-brand`, `text-brand-foreground` e a sombra `--custom-shadow-brand`); o `CHANGELOG.md` da base avisa quando `button.tsx` ou `badge.tsx` mudarem, e o `check.ts` daqui compara o resto do arquivo com o da base | `joaodadas/lume/utils#v0.1.0` |
| `lyx-guide` | `registry:item` | Depende do `guia` da base e instala `docs/LYX.md` como `~/docs/lume/LYX.md` | `joaodadas/lume/guia#v0.1.0` |

## Teal `#025864`: `--brand`, não `--primary`

<!-- skill:start -->
Recomendação da base (a decisão final é da camada Lyx, registrada num ADR curto do `lyx-ds` para o Jefferson poder discordar com argumento): o teal entra como token `--brand`, e `--primary` fica cinza como no Foglamp.

| Onde o teal entra | Como |
|---|---|
| Logo e tile de marca na sidebar | `LyxLogo className="text-brand"`; tile pela receita do `navTile` com os rgba do teal |
| Login | fundo do painel de marca e o CTA |
| `Badge variant="brand"` | status de marca, nunca estado (estado continua emerald, rose, amber) |
| `Button variant="brand"` | no máximo um por tela, o CTA principal; o resto `default`, `secondary`, `ghost` |

| Token | Light | Dark |
|---|---|---|
| `--brand` | `#025864` | `#03A698` (o teal claro que a 52W já usa no dark) |
| `--brand-foreground` | `#ffffff` | `oklch(0.145 0 0)` |
| `--custom-shadow-brand` | `0 0 0 .5px rgba(2,88,100,.25), 0 .5px 2px -.5px rgba(2,88,100,.18), 0 2px 4px 0 rgba(2,88,100,.12)` | `0 0 0 .5px rgba(3,166,152,.25), 0 .5px 2px -.5px rgba(3,166,152,.18), 0 2px 4px 0 rgba(3,166,152,.12)` |
| `--color-brand` (`@theme inline`) | `var(--brand)` | |

A fórmula da sombra colorida é a mesma dos badges da base (`--custom-shadow-emerald`, `--custom-shadow-sky`...): anel de meio pixel a 25%, uma sombra curta a 18% e uma de 4px a 12%, todas na cor.
<!-- skill:end -->

Porquê `--brand`: o look é cinza estrutural com cor só por significado; o `Button default` da base nem usa `--primary` (é `bg-neutral-800 dark:bg-neutral-100`, `registry/base-vega/ui/button.tsx`), então pintar `--primary` de teal mudaria pouco e ainda tingiria `ring`, `selection:bg-primary/10` e todo `text-primary` do app. O guia de design do João no `lyx-qualidade-front` já fixou "cor em quatro lugares" (logo de terceiro, glifo de status, ícone destrutivo, quadrado de marca) e o tile da marca é o quarto lugar. Se a Lyx decidir `--primary`, o `theme-lyx` passa a sobrescrever `primary`, `primary-foreground`, `ring` e `sidebar-primary` (este último a base não define; o item o cria).

O `css` do `theme-lyx` para a transição dos fronts (ver passo 4 de [migracao-52w](./migracao-52w.md)):

```css
@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));
[data-theme="dark"] { --brand: #03A698; --brand-foreground: oklch(0.145 0 0); }
```

Isso cobre `dark:` nas utilities e os tokens de marca; os tokens da base (`--background`, `--card`...) só flipam com `.dark`, por isso o toggle dos fronts migra cedo para `next-themes` com `attribute="class"`.

## `components.json` de um front Lyx (Next 16 com `src/`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "tabler",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "registries": {
    "@lume": "https://raw.githubusercontent.com/joaodadas/lume/v0.1.0/public/r/{name}.json",
    "@lyx": {
      "url": "https://api.github.com/repos/Lyx-Engenharia/lyx-ds/contents/public/r/{name}.json",
      "params": { "ref": "v0.1.0" },
      "headers": { "Authorization": "Bearer ${GITHUB_TOKEN}", "Accept": "application/vnd.github.raw+json" }
    }
  }
}
```

- `@lume` pelo raw do GitHub com a tag no caminho (público, sem Vercel no meio) ou `https://lume-ashmont.vercel.app/r/{name}.json` (o que o `init` escreve; aponta para a última release publicada).
- `@lyx` pela Contents API: `Accept: application/vnd.github.raw+json` devolve o JSON cru, `params.ref` fixa a tag. `GITHUB_TOKEN` é um PAT fine-grained com Contents read-only no `lyx-ds`, em `.env.local` (nunca commitado; a org pode exigir aprovação do PAT). A sintaxe `${VAR:-default}` não existe: a variável tem que estar definida.
- Subir de versão é trocar a tag nos dois lugares e rodar `npx shadcn@latest add @lyx/theme-lyx @lyx/lyx-shell --overwrite`.

## Comandos

Dev (com `gh auth login` feito; a CLI 4.19+ usa o token do `gh` para repo privado no modo GitHub):

```bash
npx shadcn@latest init joaodadas/lume/base#v0.1.0 -y          # nunca -d; fallback: init https://lume-ashmont.vercel.app/r/base.json -y
npx shadcn@latest add Lyx-Engenharia/lyx-ds/theme-lyx#v0.1.0   # sozinho, depois do init, para o tema vencer o base
npx shadcn@latest add Lyx-Engenharia/lyx-ds/lyx-shell#v0.1.0 Lyx-Engenharia/lyx-ds/lyx-login#v0.1.0 Lyx-Engenharia/lyx-ds/lyx-guide#v0.1.0
npx shadcn@latest add joaodadas/lume/link-next#v0.1.0 --overwrite
npx skills add joaodadas/lume --skill lume-design-engineering
```

Conferir depois: `grep -n "\-\-brand" src/app/globals.css` mostra `--brand` em `:root`, `.dark` e `[data-theme="dark"]` e `--color-brand` no `@theme inline`; `grep -c "sidebar-primary" src/app/globals.css` dá 0 (se der mais, o `init` rodou com `-d`: refaça); `ls components/link.tsx docs/lume/LYX.md` existem; `grep -rl "@/registry/" src` não devolve nada.

CI (sem `gh`): `GH_TOKEN` para o modo GitHub e `GITHUB_TOKEN` para o alias `@lyx`, os dois o mesmo PAT Contents read-only guardado como secret:

```yaml
- run: npx shadcn@latest add @lyx/theme-lyx @lyx/lyx-shell --overwrite --yes
  env:
    GH_TOKEN: ${{ secrets.LYX_DS_TOKEN }}
    GITHUB_TOKEN: ${{ secrets.LYX_DS_TOKEN }}
```

No `lyx-ds`, o `check.ts` reduzido roda em PR: sem travessão em docs, sem hex fora de `theme-lyx`, `registry.json` igual ao regenerado, `public/r` atualizado, variant `brand` presente em `badge` e `button` e o resto desses dois arquivos igual ao da base na tag fixada; `release.ts` grava a versão, regenera, exige `CHANGELOG.md`, tag e `gh release create`.

## Governança

- Melhoria genérica (um primitivo, um bloco neutro, um token cinza) é PR em `joaodadas/lume` com o checklist do `CONTRIBUTING.md`: capturas light e dark em 1440 e 390, reduced motion, `bun run skill:build`, `bun run check`, nenhum `lucide` ou `asChild`. Marca, login e blocos `hub-*` são PR em `Lyx-Engenharia/lyx-ds`. Cor nova ou componente novo abre issue antes ("levante antes de contornar").
- `CODEOWNERS`: João na base; João e Jefferson na camada Lyx. A camada fixa a tag da base em todo `registryDependencies` e sobe de versão por PR próprio, lendo a seção "Como migrar" do `CHANGELOG.md` da base.
- Semver nos dois repos: patch é correção visual, minor é item ou prop nova, major é token removido ou prop quebrada.
- Na Lyx, no dia em que o DS nascer: `AGENTS.md` dos fronts (linhas 13, 27 e 68 do template e do hub, depois `npm run sync-agents`), `lyx-monolith/AGENTS.md:107,268` e `docs/adr/0004-branching-tier-system.md:14,56` (o `lyx-ds` entra no tier Front; ADR novo `0031-design-system-base-publica-e-camada-lyx.md`), e as listas do `lyx-pr-agent` (`src/types.ts:45`, `src/alcance.ts:23`, `src/areas-valor.ts:85-86`: `lyx-ds` como `plataforma`, revisável).
- Ordem de migração dos fronts: `lyx-front-template` (origem dos clones), depois `lyx-analise-credito-front` e `lyx-planejamento-front`, depois `lyx-contratos-front`, depois `lyx-hub-front`; `lyx-bi-principal` fora deste plano. Passo a passo em [migracao-52w](./migracao-52w.md).

## O que não copiar

Da 52W para o `theme-lyx`: `--color-primary: var(--accent)`, `--color-ring: var(--accent)` e `--color-chart-1: var(--accent)` (o teal não é primary, ring nem série de gráfico), `--shadow-accent: 0 0 0 3px var(--accent-glow)` (anel de 3px não existe no sistema; foco é `focus-visible:ring-[1.5px] focus-visible:ring-ring/50`, `registry/base-vega/ui/button.tsx:10`), `--accent-glow` e `--glass-*` (sem glow, sem glass no app), e os `--radius-*` próprios (os pares de raio são os da base). Do template: `lyx-logo.tsx` vem inteiro, mas o `boxShadow: "0 4px 12px rgba(2, 88, 100, 0.25)"` do tile em `dashboard/layout.tsx:105` vira `--custom-shadow-brand`.
