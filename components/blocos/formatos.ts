// Os formatos do app-shell na vitrine /blocos: o id vai na URL (?formato= na
// página, /blocos/[formato] na tela cheia). Sem "use client", porque a rota de
// tela cheia lê a lista no servidor (generateStaticParams). Arquivo do site,
// não entra na registry.

export const FORMATOS = [
  {
    id: "lateral",
    nome: "Lateral",
    props: 'layout="sidebar"',
    resumo:
      "O padrão de todo app que navega entre telas: seções, item com filhos, contagem, link externo, seletor de projeto e busca. O gatilho recolhe para o trilho de ícones.",
  },
  {
    id: "trilho",
    nome: "Trilho",
    props: "defaultOpen={false}",
    resumo:
      "A mesma lateral, aberta já recolhida, para lista longa em que o conteúdo manda. O rótulo vira tooltip e o item com filhos vira menu ao lado.",
  },
  {
    id: "agente",
    nome: "Agente",
    props: "defaultOpen={false} fill panel",
    resumo:
      "A conversa é a página: a lateral abre no trilho, o histórico mora na sidebar aberta e some no trilho, a página é dona do scroll e o painel da carteira empurra o cartão.",
  },
  {
    id: "barra",
    nome: "Barra",
    props: 'layout="topbar"',
    resumo:
      "Um nível de até 7 zonas para produto de leitura que quer a largura toda. A zona com filhos abre um menu no clique; abaixo de 768 px, a barra vira a gaveta da lateral.",
  },
  {
    id: "mural",
    nome: "Mural",
    props: 'layout="topbar" nav={[]} fill',
    resumo:
      "O modo TV do BI: a barra só com marca, contexto e Sair do modo TV, e a página em fill. Sair troca o layout no mesmo shell, sem remontar a página.",
  },
] as const;

export type Formato = (typeof FORMATOS)[number]["id"];

export const FORMATO_PADRAO: Formato = "lateral";

export function isFormato(value: unknown): value is Formato {
  return FORMATOS.some((formato) => formato.id === value);
}

/** O formato da URL, ou o padrão quando falta ou não existe. */
export function formatoDe(value: string | null | undefined): Formato {
  return isFormato(value) ? value : FORMATO_PADRAO;
}
