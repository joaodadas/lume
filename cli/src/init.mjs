// lume init: conduz o agente do dev, uma etapa por chamada. Cada resposta é um
// JSON com `etapa`, `next`, `say`, `instruction`, `run`, `rules` e `details`.
// O estado vem do próprio projeto (components.json, lume.json, arquivos), então
// chamar de novo depois de cada passo sempre devolve o passo seguinte.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  baseInstalada,
  CODIGO,
  conferirCompleto,
  cssTemBase,
  escopoDoApp,
  KITS,
  NAO_ESCANEAR,
  REGRAS,
} from "./check.mjs";
import { escreverCssDaBase, SUFIXO_ANTIGO } from "./css.mjs";
import { criarResolvedor, importsDe } from "./imports.mjs";
import { montarPlano } from "./plano.mjs";
import { LAYOUTS, lerProjeto, listar, TEMAS } from "./projeto.mjs";
import { criarRegistry, emLotes, REPO } from "./registry.mjs";
import { normalizar, semComentarios } from "./texto.mjs";

const PACOTE = "@joao.dadas/lume";

export const RULES = [
  "Siga uma etapa por vez: rode o que está em `run`, faça o que está em `instruction` e chame o init de novo. Não pule etapa nem escreva código de tela antes de `next` ser `migrar`.",
  "Fale com o usuário pelo texto de `say`. Quando `next` for `perguntar`, faça a pergunta e espere a resposta antes de seguir.",
  "O lume substitui a interface atual de uma vez. Nunca crie pasta paralela de componentes (components/lume, components/ds) nem desvie os aliases do components.json: components/ui é do lume.",
  "Nunca edite à mão um arquivo instalado da registry (components/ui e os blocos): variação vai por className na composição. O lume check compara cada arquivo com a versão da registry.",
  "Nunca mantenha um componente antigo com a API antiga e a aparência do lume por dentro: reescreva a tela para a API do lume (Button variant default, Dialog no lugar de Modal, render no lugar de asChild).",
  "Nunca troque a fonte, os tamanhos, o raio, a sombra, o movimento ou os ícones. Por produto só a cor muda, por tema instalado depois do base.",
  "Antes de escrever qualquer tela, leia a skill lume-design-engineering (.agents/skills ou .claude/skills).",
  "Não rode git clean, não apague arquivo fora do que a etapa pede e não faça commit nem push sem o usuário pedir.",
];

function comando(versao, args) {
  return `npx -y ${PACOTE}@${versao} ${args}`;
}

function resposta(versao, campos) {
  return {
    etapa: campos.etapa,
    next: campos.next,
    say: campos.say,
    instruction: campos.instruction,
    run: campos.run ?? [],
    rules: RULES,
    details: { versao, ...(campos.details ?? {}) },
  };
}

/** "0.4.0" > "0.3.1"? Compara X.Y.Z como números. */
export function versaoMaiorQue(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0);
  }
  return false;
}

const SEMVER = /^\d+\.\d+\.\d+$/;

/** Os comandos que instalam (ou reinstalam) tudo do lume numa versão. */
async function comandosDeInstalacao(projeto, registry, versao) {
  const itens = await registry.itens();
  const ui = itens.filter((i) => i.type === "registry:ui").map((i) => i.name);
  const graficos = projeto.deps.recharts ? ["kit-graficos"] : [];
  const doLumeJson = Array.isArray(projeto.lumeJson?.itens)
    ? projeto.lumeJson.itens
    : [];
  const nomes = [
    ...new Set([
      ...ui,
      ...KITS,
      ...graficos,
      "login-form",
      "guia",
      ...doLumeJson,
    ]),
  ].filter((n) => n !== "link-next");
  const lista = nomes.map((n) => `${REPO}/${n}#v${versao}`).join(" ");
  const run = [`npx shadcn@latest add ${lista} --overwrite --yes`];
  if (projeto.framework === "next") {
    run.push(
      `npx shadcn@latest add ${REPO}/link-next#v${versao} --overwrite --yes`,
    );
  }
  return run;
}

function gravarLumeJson(raiz, lumeJson) {
  writeFileSync(
    path.join(raiz, "lume.json"),
    `${JSON.stringify(lumeJson, null, 2)}\n`,
  );
}

async function componentesFaltando(projeto, registry) {
  const itens = await registry.itens();
  const ui = itens.filter((i) => i.type === "registry:ui").map((i) => i.name);
  const faltam = ui.filter(
    (nome) =>
      !existsSync(path.join(projeto.raiz, projeto.dirUi, `${nome}.tsx`)),
  );
  const shell = path.join(
    projeto.raiz,
    projeto.dirComponentes,
    "app-shell",
    "app-shell.tsx",
  );
  if (!existsSync(shell)) faltam.push("app-shell");
  if (projeto.framework === "next") {
    const link = path.join(projeto.raiz, projeto.dirComponentes, "link.tsx");
    if (!existsSync(link) || !readFileSync(link, "utf8").includes("next/link"))
      faltam.push("link-next");
  }
  return { faltam, ui };
}

function skillInstalada(raiz) {
  return [".agents/skills", ".claude/skills"].some((d) =>
    existsSync(path.join(raiz, d, "lume-design-engineering", "SKILL.md")),
  );
}

function shellDoLayout(layout) {
  if (layout === "topbar") return '<AppShell layout="topbar" ...>';
  if (layout === "offcanvas")
    return '<AppShell layout="sidebar" collapsible="offcanvas" ...>';
  return '<AppShell layout="sidebar" collapsible="icon" ...>';
}

/** O comando de typecheck do projeto: o script, se houver, ou o tsc. */
export function comandoTypecheck(projeto) {
  const r = projeto.raiz;
  const pm =
    existsSync(path.join(r, "bun.lock")) ||
    existsSync(path.join(r, "bun.lockb"))
      ? "bun"
      : existsSync(path.join(r, "pnpm-lock.yaml"))
        ? "pnpm"
        : existsSync(path.join(r, "yarn.lock"))
          ? "yarn"
          : "npm";
  if (projeto.pkg?.scripts?.typecheck) return `${pm} run typecheck`;
  return "npx tsc --noEmit";
}

/** Código e CSS do app, fora de teste: onde o init conta uso e import. */
function arquivosDoApp(projeto, arquivos) {
  const escopo = escopoDoApp(projeto);
  const doApp = arquivos.filter((r) => escopo(r) && !NAO_ESCANEAR.test(r));
  return {
    codigo: doApp.filter((r) => CODIGO.test(r)),
    css: doApp.filter((r) => r.endsWith(".css")),
  };
}

/** Projeto com interface própria: components/ui ou mais que o esqueleto. */
function interfaceExistente(projeto, arquivos) {
  const prefixoUi = `${projeto.dirUi}/`;
  const ui = arquivos.filter(
    (r) => r.startsWith(prefixoUi) && /\.(tsx|jsx)$/.test(r),
  ).length;
  const telas = arquivosDoApp(projeto, arquivos).codigo.filter((r) =>
    /\.(tsx|jsx)$/.test(r),
  ).length;
  return { ui, telas, tem: ui > 0 || telas > 5 };
}

const PERGUNTA = {
  layout: () =>
    "Layout de navegação: sidebar (barra lateral que recolhe para ícones), offcanvas (barra lateral que some) ou topbar (barra no topo, até 7 zonas)?",
  tema: () =>
    "Tema padrão, o que abre na primeira visita: claro ou escuro? A pessoa troca depois no menu de conta.",
  substituir: (i) =>
    `O lume substitui a interface atual de uma vez: ${i.ui > 0 ? `os ${i.ui} componentes de components/ui saem, ` : ""}${i.telas} arquivos de tela e componente são reescritos numa mudança só, e o app fica sem compilar até a migração terminar. Posso substituir de uma vez? (sim ou não)`,
};

/**
 * Etapa `ler`: confere o projeto e faz as perguntas de produto que faltam
 * (layout, tema e, num projeto com interface própria, se pode substituir de
 * uma vez). Devolve a resposta da etapa, ou null quando já pode seguir.
 */
function etapaLer(raiz, projeto, ctx) {
  const { versao, reinit, layoutPedido, temaPedido, substituir } = ctx;
  if (layoutPedido && !LAYOUTS.includes(layoutPedido)) {
    return resposta(versao, {
      etapa: "ler",
      next: "bloqueado",
      say: `Layout "${layoutPedido}" não existe. As opções são ${LAYOUTS.join(", ")}.`,
      instruction:
        "Pergunte de novo ao usuário e rode o init com --layout=<escolha>.",
    });
  }
  if (temaPedido && !TEMAS.includes(temaPedido)) {
    return resposta(versao, {
      etapa: "ler",
      next: "bloqueado",
      say: `Tema "${temaPedido}" não existe. As opções são ${TEMAS.join(" e ")}.`,
      instruction:
        "Pergunte de novo ao usuário e rode o init com --tema=<claro|escuro>.",
    });
  }
  const arquivos = listar(raiz);
  const ui = interfaceExistente(projeto, arquivos);
  const precisaSubstituir = !ctx.lumeJson?.layout && ui.tem;
  if (precisaSubstituir && substituir === "nao") {
    return resposta(versao, {
      etapa: "ler",
      next: "bloqueado",
      say: "Sem substituir de uma vez, o lume não entra neste projeto. Ele não convive com a interface antiga: pasta paralela, alias desviado ou componente antigo com a cara do lume dão uma interface pela metade, e o lume check reprova. Quando der para fazer a troca inteira, rode o init de novo.",
      instruction:
        "Mostre isso ao usuário e pare. Não instale nada do lume nem grave o lume.json.",
      details: { componentesUi: ui.ui, arquivosDeTela: ui.telas },
    });
  }
  const faltaSubstituir = precisaSubstituir && substituir !== "sim";
  const layout = layoutPedido ?? ctx.lumeJson?.layout;
  const tema = temaPedido ?? ctx.lumeJson?.tema;
  if (!faltaSubstituir && (layoutPedido || temaPedido)) {
    ctx.lumeJson = {
      ...(ctx.lumeJson ?? {}),
      versao,
      ...(layout ? { layout } : {}),
      ...(tema ? { tema } : {}),
    };
    gravarLumeJson(raiz, ctx.lumeJson);
  }
  const faltam = [
    ...(layout
      ? []
      : [["layout", "--layout=<sidebar|offcanvas|topbar>", LAYOUTS]]),
    ...(tema ? [] : [["tema", "--tema=<claro|escuro>", TEMAS]]),
    ...(faltaSubstituir
      ? [["substituir", "--substituir=<sim|nao>", ["sim", "nao"]]]
      : []),
  ];
  if (faltam.length === 0) return null;
  const perguntas = faltam.map(
    ([nome], i) =>
      `${faltam.length > 1 ? `${i + 1}. ` : ""}${PERGUNTA[nome](ui)}`,
  );
  return resposta(versao, {
    etapa: "ler",
    next: "perguntar",
    say: [
      ctx.lumeJson?.layout
        ? `O projeto já usa o lume v${versao}. Falta uma escolha para o lume.json.`
        : `Vou aplicar o lume v${versao} neste projeto (${projeto.framework}, Tailwind 4).`,
      ui.tem && !faltaSubstituir && !ctx.lumeJson?.layout
        ? "Ele substitui a interface atual de uma vez."
        : "",
      ...perguntas,
    ]
      .filter(Boolean)
      .join(" "),
    instruction: `Faça as perguntas de \`say\` ao usuário e espere as respostas. Depois rode \`${reinit} ${faltam.map(([, flag]) => flag).join(" ")}\`.${faltaSubstituir ? " Se ele não quiser substituir de uma vez, rode com --substituir=nao: o init explica por que o lume não entra pela metade." : ""}`,
    details: {
      framework: projeto.framework,
      perguntas: faltam.map(([nome, flag, opcoes]) => ({
        nome,
        flag: flag.split("=")[0],
        opcoes,
      })),
      componentesUi: ui.ui,
      arquivosDeTela: ui.telas,
      alteracoesNaoCommitadas: projeto.alteracoesGit,
      avisoGit:
        projeto.alteracoesGit > 0
          ? "Há mudanças não commitadas. Sugira ao usuário commitar ou guardar antes, para a troca ficar numa mudança separada."
          : undefined,
    },
  });
}

/**
 * O que o --overwrite da etapa componentes troca: os arquivos de
 * components/ui com nome de item do lume e conteúdo diferente do da registry,
 * os componentes antigos que ficam (e dependem deles) e quantos arquivos do
 * app importam um ou outro.
 */
async function trocaDeComponentes(projeto, registry) {
  const itens = await registry.itens();
  const nomesUi = new Set(
    itens.filter((i) => i.type === "registry:ui").map((i) => i.name),
  );
  const arquivos = listar(projeto.raiz);
  const prefixoUi = `${projeto.dirUi}/`;
  const extras = projeto.lumeJson?.extras ?? {};
  const daUi = arquivos.filter(
    (r) => r.startsWith(prefixoUi) && CODIGO.test(r) && !NAO_ESCANEAR.test(r),
  );
  const nome = (r) => path.posix.basename(r).replace(CODIGO, "");
  const mesmoNome = daUi.filter((r) => nomesUi.has(nome(r)));
  const iguais = await emLotes(mesmoNome, 8, async (r) => {
    const json = await registry.item(nome(r));
    const local = normalizar(
      readFileSync(path.join(projeto.raiz, r), "utf8"),
      projeto.prefixosLocais,
    );
    return (json.files ?? []).some(
      (f) => normalizar(f.content ?? "", projeto.prefixosLocais) === local,
    );
  });
  const trocados = mesmoNome.filter((_, i) => !iguais[i]);
  const antigos = daUi.filter((r) => !nomesUi.has(nome(r)) && !extras[nome(r)]);
  const alvo = new Set([...trocados, ...antigos]);
  const resolver = criarResolvedor(projeto.raiz, arquivos);
  let importadores = 0;
  for (const r of arquivosDoApp(projeto, arquivos).codigo) {
    if (r.startsWith(prefixoUi)) continue;
    const codigo = semComentarios(
      readFileSync(path.join(projeto.raiz, r), "utf8"),
    );
    if (
      importsDe(codigo).some(({ spec }) => {
        const a = resolver(r, spec);
        return a?.existe && alvo.has(a.rel);
      })
    )
      importadores++;
  }
  return { trocados, antigos, importadores };
}

function resumoDoCss(css) {
  const usados = css.tokens.filter((t) => t.usos > 0);
  const classesUsadas = css.classes.filter((c) => c.usos > 0);
  const lista = usados
    .slice(0, 5)
    .map((t) => `${t.nome} (${t.usos} usos em ${t.arquivos} arquivos)`)
    .join(", ");
  const partes = [
    `Escrevi o ${css.css} só com a base do lume${css.antigo ? `; o antigo ficou em ${css.antigo}` : ""}.`,
  ];
  if (css.tokens.length + css.classes.length > 0) {
    partes.push(
      `Saíram ${css.tokens.length} tokens e ${css.classes.length} classes próprias do CSS antigo.`,
    );
  }
  if (usados.length + classesUsadas.length > 0) {
    partes.push(
      `${usados.length} tokens e ${classesUsadas.length} classes ainda são usados no código${lista ? `: ${lista}` : ""}. As telas não migradas perdem essas cores até serem reescritas, e o lume check acusa cada uso (codigo/token-orfao).`,
    );
  }
  return partes.join(" ");
}

/**
 * Uma etapa do init para o projeto em `raiz`. A versão que vale é a do
 * lume.json; `opcoes.versao` (a do pacote) só entra num projeto sem lume.json
 * ou quando o usuário aceita subir (`atualizar: "sim"`).
 */
export async function passo(raiz, opcoes) {
  const {
    versao: versaoPacote,
    layout: layoutPedido,
    tema: temaPedido,
    substituir,
    atualizar,
    confirmarTroca,
    buscar,
  } = opcoes;
  const projeto = lerProjeto(raiz);
  let lumeJson =
    projeto.lumeJson && !projeto.lumeJson.__invalido ? projeto.lumeJson : null;
  let versao = SEMVER.test(String(lumeJson?.versao ?? ""))
    ? lumeJson.versao
    : versaoPacote;
  let reinit = comando(versao, "init");

  if (!projeto.pkg) {
    return resposta(versao, {
      etapa: "ler",
      next: "bloqueado",
      say: "Não achei um package.json aqui. Rode o comando na raiz do projeto.",
      instruction:
        "Vá para a raiz do projeto (a pasta do package.json) e rode o init de novo.",
    });
  }
  if (!projeto.framework || projeto.tailwind !== 4) {
    return resposta(versao, {
      etapa: "ler",
      next: "bloqueado",
      say: `O lume precisa de Next ou Vite com Tailwind 4. Achei framework ${projeto.framework ?? "desconhecido"} e Tailwind ${projeto.tailwind ?? "ausente"}.`,
      instruction:
        "Mostre isso ao usuário e pare. Com Tailwind 3, a atualização é `npx @tailwindcss/upgrade`, que é uma tarefa própria e precisa do ok dele.",
      details: { framework: projeto.framework, tailwind: projeto.tailwind },
    });
  }

  // As perguntas são desta versão do pacote: a resposta volta para ela.
  const ctx = {
    versao,
    reinit: comando(versaoPacote, "init"),
    layoutPedido,
    temaPedido,
    substituir,
    lumeJson,
  };
  const ler = etapaLer(raiz, projeto, ctx);
  if (ler) return ler;
  lumeJson = ctx.lumeJson;
  projeto.lumeJson = lumeJson;
  const { layout, tema } = lumeJson;

  if (versaoMaiorQue(versaoPacote, versao) && atualizar !== "nao") {
    const anterior = versao;
    if (atualizar !== "sim") {
      return resposta(versao, {
        etapa: "atualizar",
        next: "perguntar",
        say: `O projeto está no lume v${anterior} e a v${versaoPacote} já saiu. Quer subir para a v${versaoPacote}? Os arquivos do lume são reinstalados com --overwrite.`,
        instruction: `Faça a pergunta de \`say\` ao usuário e espere a resposta. Se ele quiser subir, rode \`${comando(versaoPacote, "init")} --atualizar=sim\`. Se não, rode \`${reinit}\`, que segue na v${anterior}.`,
        details: { versaoDoProjeto: anterior, versaoNova: versaoPacote },
      });
    }
    versao = versaoPacote;
    reinit = comando(versao, "init");
    lumeJson = { ...lumeJson, versao };
    gravarLumeJson(raiz, lumeJson);
    projeto.lumeJson = lumeJson;
    if (baseInstalada(projeto)) {
      const registry = criarRegistry(versao, buscar);
      return resposta(versao, {
        etapa: "atualizar",
        next: "rodar",
        say: `Subindo o lume de v${anterior} para v${versao}: os arquivos do lume são reinstalados na versão nova.`,
        instruction: `O lume.json já está na v${versao}. Rode os comandos de \`run\` em ordem e depois \`${reinit}\`. O --overwrite troca os arquivos do lume pela versão nova: é o esperado. Não restaure versão antiga de nenhum deles.`,
        run: await comandosDeInstalacao(projeto, registry, versao),
        details: { versaoAnterior: anterior },
      });
    }
  }
  const registry = criarRegistry(versao, buscar);

  if (!baseInstalada(projeto)) {
    const cj = projeto.componentsJson;
    const run = [];
    let instrucao = `Rode os comandos de \`run\` na raiz do projeto, em ordem, e depois \`${reinit}\`.`;
    if (cj) {
      run.push("rm components.json");
      instrucao = `O components.json atual não é o do lume (style "${cj.style}", aliases.ui "${cj.aliases?.ui}"). ${instrucao}`;
    }
    run.push(`npx shadcn@latest init ${REPO}/base#v${versao} -y`);
    const temBase = cssTemBase(projeto);
    const guardado =
      projeto.css &&
      existsSync(path.join(raiz, `${projeto.css}${SUFIXO_ANTIGO}`));
    let css = null;
    if (projeto.css && (!temBase || guardado)) {
      const doApp = arquivosDoApp(projeto, listar(raiz));
      css = escreverCssDaBase(
        projeto,
        await registry.item("base"),
        doApp.codigo,
        doApp.css,
        { gravar: !temBase },
      );
    }
    const sobreOCss = css
      ? `O init já escreveu o ${css.css} só com o que a base do lume traz, igual ao que o shadcn init escreve num projeto novo, e o shadcn init mantém esse CSS. Não devolva nada do CSS antigo${css.antigo ? ` (está em ${css.antigo}, para consulta)` : ""}: o que as telas usavam dele sai na migração, com o lume check apontando cada uso.${css.importadosPeloAntigo.length > 0 ? ` O CSS antigo importava ${css.importadosPeloAntigo.join(", ")}: ninguém importa mais, apague quando a migração terminar.` : ""}`
      : "Se o CSS global antigo tiver tokens próprios (outro @theme inline, outro @layer base, cores próprias), apague esses blocos: fica só o que a base escreveu.";
    return resposta(versao, {
      etapa: "base",
      next: "rodar",
      say: css
        ? `Instalando a base do lume: tokens, fontes e o components.json. ${resumoDoCss(css)}`
        : "Instalando a base do lume: tokens, fontes e o components.json.",
      instruction: `${instrucao} Nunca use -d no init do shadcn. ${sobreOCss}`,
      run,
      details: css
        ? {
            cssGlobal: {
              arquivo: css.css,
              antigo: css.antigo,
              importadosPeloAntigo: css.importadosPeloAntigo,
              tokensRemovidos: css.tokens.slice(0, 40),
              totalTokensRemovidos: css.tokens.length,
              classesRemovidas: css.classes.slice(0, 40),
              totalClassesRemovidas: css.classes.length,
            },
          }
        : undefined,
    });
  }

  const { faltam } = await componentesFaltando(projeto, registry);
  if (faltam.length > 0) {
    const run = await comandosDeInstalacao(projeto, registry, versao);
    const troca =
      confirmarTroca === "sim"
        ? null
        : await trocaDeComponentes(projeto, registry);
    if (troca && troca.trocados.length > 0) {
      const nomes = troca.trocados
        .slice(0, 6)
        .map((r) => path.posix.basename(r).replace(CODIGO, ""))
        .join(", ");
      return resposta(versao, {
        etapa: "componentes",
        next: "perguntar",
        say: [
          `Antes de instalar os componentes: o --overwrite troca ${troca.trocados.length} arquivos de components/ui (${nomes}${troca.trocados.length > 6 ? "..." : ""}) pelos do lume, que têm outra API.`,
          troca.antigos.length > 0
            ? `Outros ${troca.antigos.length} componentes antigos ficam em components/ui e usam os trocados, então quebram junto.`
            : "",
          `${troca.importadores} arquivos do app importam um ou outro. Do --overwrite até o fim da migração o app não compila nem abre.`,
          "Recomendo um commit agora, para poder voltar a qualquer momento. Posso trocar?",
        ]
          .filter(Boolean)
          .join(" "),
        instruction: `Faça a pergunta de \`say\` ao usuário e espere a resposta. Se houver mudança não commitada, sugira o commit antes (só faça o commit se ele pedir). Se ele aceitar a troca, rode \`${reinit} --confirmar-troca=sim\`. Se não, pare: o lume não entra pela metade.`,
        details: {
          trocados: troca.trocados.slice(0, 30),
          totalTrocados: troca.trocados.length,
          antigos: troca.antigos.slice(0, 30),
          totalAntigos: troca.antigos.length,
          importadores: troca.importadores,
          alteracoesNaoCommitadas: projeto.alteracoesGit,
        },
      });
    }
    return resposta(versao, {
      etapa: "componentes",
      next: "rodar",
      say: "Instalando todos os componentes do lume no lugar dos atuais.",
      instruction: `Rode os comandos de \`run\` em ordem e depois \`${reinit}\`. O --overwrite troca os arquivos de mesmo nome em components/ui: é o esperado. Não restaure versão antiga de nenhum deles. Até a migração terminar o app pode não compilar: é o esperado, e o plano da etapa migrar põe primeiro o que faz ele abrir de novo.`,
      run,
      details: { faltam: faltam.slice(0, 20), totalFaltando: faltam.length },
    });
  }

  if (!skillInstalada(raiz)) {
    return resposta(versao, {
      etapa: "skill",
      next: "rodar",
      say: "Instalando a skill com as regras de design engineering do lume.",
      instruction: `Rode o comando de \`run\` e depois \`${reinit}\`. Depois leia o SKILL.md instalado antes de seguir.`,
      run: [`npx -y skills add ${REPO} --skill lume-design-engineering -y`],
    });
  }

  const { resultado, contexto } = await conferirCompleto(raiz, {
    versao,
    buscar,
  });
  const typecheck = comandoTypecheck(projeto);
  const temaNext = tema === "claro" ? "light" : "dark";
  const antigo =
    projeto.css && existsSync(path.join(raiz, `${projeto.css}${SUFIXO_ANTIGO}`))
      ? `${projeto.css}${SUFIXO_ANTIGO}`
      : null;
  if (!resultado.ok) {
    const porRegra = {};
    for (const v of resultado.violacoes)
      porRegra[v.regra] = (porRegra[v.regra] ?? 0) + 1;
    const arquivos = new Set(resultado.violacoes.map((v) => v.arquivo));
    const plano = montarPlano(
      { ...contexto, violacoes: resultado.violacoes },
      comando(versao, "check"),
    );
    const telas = plano.filter((g) => g.tipo === "tela").length;
    const primeiro = plano[0];
    return resposta(versao, {
      etapa: "migrar",
      next: "migrar",
      say: `Base, componentes e regras instalados. Faltam ${resultado.violacoes.length} ajustes em ${arquivos.size} arquivos. Vou seguir um plano de ${plano.length} grupos: ${primeiro.tipo === "config" ? "a configuração, " : ""}o que o layout usa (para o app voltar a abrir), ${telas} telas uma por vez e, por último, a limpeza do que é antigo.`,
      instruction: [
        "Siga `details.plano` em ordem, um grupo por vez. Em cada grupo: reescreva os arquivos listados para os componentes de components/ui, na API do lume;",
        "rode o `check` do grupo (o lume check só com aqueles caminhos) até ele passar;",
        `e rode o typecheck do projeto (\`${typecheck}\`): os erros dos arquivos do grupo têm que sumir e o total só desce. Só então passe ao grupo seguinte.`,
        "O grupo layout vem primeiro porque é ele que faz o app abrir de novo. No grupo limpeza, apague os componentes antigos de components/ui quando nada mais importar deles e tire as dependências barradas do package.json.",
        "O que é do produto e não existe no lume vai para components/app, composto com os primitivos do lume.",
        `Monte o shell com ${shellDoLayout(layout)}, o layout que o usuário escolheu, e o ThemeProvider do theme-provider com attribute="class" defaultTheme="${temaNext}" enableSystem disableTransitionOnChange (o tema ${tema ?? "escuro"} que ele escolheu), com suppressHydrationWarning no <html>.`,
        'Monte cada página como o guia manda: PageHeader, StatGrid com StatCard, Card size="sm", DataTable ou Table, Field com Input, EmptyState.',
        `Quando o check inteiro passar, rode \`${reinit}\` de novo.`,
      ].join(" "),
      run: [comando(versao, "check")],
      details: {
        layout,
        tema,
        typecheck,
        violacoesPorRegra: porRegra,
        dicas: Object.fromEntries(
          Object.keys(porRegra).map((r) => [r, REGRAS[r]]),
        ),
        plano,
      },
    });
  }

  return resposta(versao, {
    etapa: "pronto",
    next: "pronto",
    say: `O projeto está no lume v${versao}, com layout ${layout} e tema ${tema ?? "escuro"}, e o lume check passa.`,
    instruction: `${antigo ? `Apague o ${antigo}: o CSS antigo não é mais usado. ` : ""}Rode o typecheck (\`${typecheck}\`), o lint, os testes e o build do projeto e mostre o resultado ao usuário. Sugira abrir o app e conferir as telas no claro e no escuro. Não faça commit nem push sem ele pedir.`,
    details: { layout, tema },
  });
}
