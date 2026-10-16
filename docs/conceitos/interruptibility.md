# Interruptibility

Original: https://craft.gustavofior.com/interruptibility (Gustavo Fior, MIT). Fonte MDX:
https://github.com/gustavo-fior/craft/blob/main/content/motion/interruptibility.mdx. Seção: Motion.
Status no Foglamp: parcial (mapa 3.4).

## Regra

Abra um sheet e feche antes de ele chegar: ele deve dar meia-volta de onde está, não pular para
"aberto" e começar a fechar do zero. Keyframe é gravação (toca do primeiro frame, sempre); transição
é destino (o browser anima de onde o elemento está até onde deve ficar, e se o destino muda no meio,
só muda de rumo). Mola ainda guarda a velocidade, então a volta é um movimento só. Logo: transição
ou spring para tudo que a pessoa pode alternar; keyframes só para one-shot que nada interrompe
(spinner, caret, shimmer). E nunca trancar a porta: nenhum `isAnimating` que descarta clique, nenhum
`pointer-events: none` enquanto algo se move; o clique descartado faz a pessoa clicar de novo, e
piora. Teste: abrir e fechar dez vezes o mais rápido que conseguir.

## Valores

<!-- skill:start -->
| Caso | String ou valor exato | Arquivo |
|---|---|---|
| Sheet (transição Base UI) | overlay `transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0`; painel `transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 ... data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10` | registry/base-vega/ui/sheet.tsx:33,61 |
| Accordion | `transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:h-0 data-starting-style:h-0` | registry/base-vega/ui/accordion.tsx:67 |
| Navigation menu | `transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] ... data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150` | registry/base-vega/ui/navigation-menu.tsx:116 |
| Pílula segmentada (spring) | `MORPH = { type: "spring", stiffness: 400, damping: 38 }` com `layoutId` | registry/base-vega/lib/motion.ts:29; components/theme-switcher.tsx |
| Toolbar que troca de pai | `TOOLBAR_SPRING = { type: "spring", stiffness: 520, damping: 44 }`, `layout="position"`, `layoutDependency={lifted}` | registry/base-vega/lib/motion.ts:33-37; blocks/data-table/data-table.tsx:286-306 |
| Troca de ícone copy/check | `COPY_SPRING = { type: "spring", duration: 0.25, bounce: 0 }` em `AnimatePresence mode="popLayout" initial={false}` | registry/base-vega/lib/motion.ts:41-45; components/copy-icon.tsx:29 |
| Keyframes aceitos (tw-animate, `duration-100`) | dialog e alert-dialog `data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[96%] data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[99%]`; popover, tooltip, dropdown, hover-card, menubar, combobox com `zoom-in-95` e `zoom-out-95` | registry/base-vega/ui/dialog.tsx:36,58; ui/popover.tsx:42; ui/tooltip.tsx:58; ui/dropdown-menu.tsx:47 |
| One-shots legítimos | `animate-caret-blink` (ui/input-otp.tsx:68); `--animate-shimmer: shimmer 4s linear infinite` (styles/globals.css:269) | registry/base-vega |
| Craft | `transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1)`; spring `stiffness: 300, damping: 30`; `@starting-style` para entrar a partir de `display: none` | craft interruptibility.mdx |

**Always**: componente novo anima por `data-starting-style` e `data-ending-style` (Base UI) ou por
`animate` e spring do `lib/motion.ts`; keyframe só em one-shot; `useReduce()` devolvendo o estado
final. **Never**: `isAnimating` ou `disabled` enquanto anima; `pointer-events-none` como trava de
animação; aumentar o `duration-100` dos keyframes do dialog e do popover (curtos, a falta de
interrupção não aparece); curva ou mola nova fora do `lib/motion.ts`.
<!-- skill:end -->

## Onde aparece no Foglamp

Parcial. Transições em `packages/ui/src/components/sheet.tsx:59`, `accordion.tsx:65`,
`navigation-menu.tsx:114`; molas em `apps/web/src/app/(app)/evals/eval-settings-fields.tsx:154` e
`components/theme-switcher.tsx:27` (`400/38`), `components/app/data-table.tsx:360` (`520/44`),
`copy-icon.tsx:30` (`duration 0.25, bounce 0`). Mas Dialog, AlertDialog, Popover e Tooltip usam
keyframes do tw-animate (`dialog.tsx:56`), que não dão meia-volta. Nenhum `isAnimating` no repo
(grep zero): a porta nunca é trancada. Quando um toast novo chega, o Sonner usa transição CSS e os
anteriores se reposicionam sem pular.

## No lume

- Itens: `motion` (vocabulário fechado: `EASE`, `ENTRANCE_EASE`, `REVEAL_EASE`, `MORPH`, `TOOLBAR_SPRING`, `COPY_SPRING`, `useReduce`), `sheet`, `accordion`, `dialog`, `popover`, `data-table`, `copy-icon`, `theme-switcher`, `sonner`.
- FRONTEND.md: seção 19 (Overlays e menus) e seção 21 (Movimento: `motion/react` permitido com o vocabulário do `lib/motion.ts`; reduced motion = estado final). Guia: `docs/guia/09-movimento.md`.
- Os primitivos com keyframes vêm verbatim do Foglamp; trocá-los por transição Base UI é mudança de upstream, não do lume. Se fizer, registre no CHANGELOG como mudança de comportamento.
