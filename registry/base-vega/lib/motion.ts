// Vocabulário fechado de movimento do lume: as curvas e molas que o Foglamp repete em dez arquivos, centralizadas num módulo só.
//
// Fonte dos valores (Foglamp @ 2bc3bb5, apps/web/src): EASE em marketing/landing/hero.tsx:108
// e figure-reveal.tsx:35; ENTRANCE_EASE em marketing/demo/entrance.ts:20; REVEAL_EASE nos
// três charts do evilcharts; MORPH em theme-switcher.tsx:27 (e mais três cópias iguais);
// TOOLBAR_SPRING em app/data-table.tsx:360; COPY_SPRING em app/copy-icon.tsx:30.
// Mapa do design system, cap. 19.2 (vocabulário de easing) e 21.9 (passo 8: movimento).
//
// Regra: um componente usa um destes nomes ou não anima com motion/react. Curva nova não
// nasce dentro de componente. Durações: UI do produto entre 0.12 e 0.25 s, dados revelando-se
// uma vez entre 0.5 e 1 s; só marketing passa de 1 s. Reduced motion: useReduce() e o
// componente devolve {} ou vai direto ao estado final.

import { useReducedMotion } from "motion/react";

/** Ease-out forte do copy "blur up" (0.7 s) e das figuras; é a mesma curva CSS
 * ease-[cubic-bezier(0.22,1,0.36,1)] do accordion e do range-picker. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Ease-out da casa em escala de UI: pílula de abas (0.2 s), largura de painel
 * (0.25 s) e a entrada 3D do demo de marketing. */
export const ENTRANCE_EASE = [0.32, 0.72, 0, 1] as const;

/** Wipe de 1 s e grow-in de 0.5 s dos gráficos. */
export const REVEAL_EASE = [0, 0.7, 0.5, 1] as const;

/** Mola das pílulas segmentadas (motion.span com layoutId) e do morph de altura
 * e largura: todo controle segmentado do app desliza igual. */
export const MORPH = { type: "spring", stiffness: 400, damping: 38 } as const;

/** Mola do grupo de controles da toolbar quando troca de pai (o "lift" para o
 * slot de ações do header). */
export const TOOLBAR_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 44,
} as const;

/** Mola criticamente amortecida da troca de ícone copy/check (scale 0.25 e
 * blur de 4px na entrada e na saída). */
export const COPY_SPRING = {
  type: "spring",
  duration: 0.25,
  bounce: 0,
} as const;

/** prefers-reduced-motion como booleano. Quem anima testa isto e devolve {} ou
 * o estado final quando for true; nunca uma versão "mais curta" da animação. */
export function useReduce(): boolean {
  return useReducedMotion() ?? false;
}
