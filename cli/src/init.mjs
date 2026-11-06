// lume init: conduz o agente do dev, uma etapa por chamada. Cada resposta é um
// JSON com `etapa`, `next`, `say`, `instruction`, `run`, `rules` e `details`.
// O estado vem do próprio projeto (components.json, lume.json, arquivos), então
// chamar de novo depois de cada passo sempre devolve o passo seguinte.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { baseInstalada, conferir, KITS, REGRAS } from "./check.mjs";
import { LAYOUTS, lerProjeto } from "./projeto.mjs";
import { criarRegistry, REPO } from "./registry.mjs";

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

/**
 * Uma etapa do init para o projeto em `raiz`. A versão que vale é a do
 * lume.json; `opcoes.versao` (a do pacote) só entra num projeto sem lume.json
 * ou quando o usuário aceita subir (`atualizar: "sim"`).
 */
export async function passo(raiz, opcoes) {
  const {
    versao: versaoPacote,
    layout: layoutPedido,
    atualizar,
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

  if (layoutPedido) {
    if (!LAYOUTS.includes(layoutPedido)) {
      return resposta(versao, {
        etapa: "ler",
        next: "bloqueado",
        say: `Layout "${layoutPedido}" não existe. As opções são ${LAYOUTS.join(", ")}.`,
        instruction:
          "Pergunte de novo ao usuário e rode o init com --layout=<escolha>.",
      });
    }
    lumeJson = { ...(lumeJson ?? {}), versao, layout: layoutPedido };
    gravarLumeJson(raiz, lumeJson);
  }
  if (!lumeJson?.layout) {
    const temInterface = existsSync(path.join(raiz, projeto.dirUi));
    return resposta(versao, {
      etapa: "ler",
      next: "perguntar",
      say: [
        `Vou aplicar o lume v${versao} neste projeto (${projeto.framework}, Tailwind 4).`,
        temInterface
          ? "Ele substitui a interface atual de uma vez: os componentes antigos saem e as telas são reescritas com os componentes do lume, numa mudança só."
          : "Ele instala a base, os componentes e as regras de uma vez.",
        "Qual layout de navegação você quer? sidebar (barra lateral que recolhe para ícones), offcanvas (barra lateral que some) ou topbar (barra no topo, até 7 zonas).",
      ].join(" "),
      instruction: `Faça a pergunta de \`say\` ao usuário e espere a resposta. Depois rode \`${reinit} --layout=<sidebar|offcanvas|topbar>\`.`,
      details: {
        framework: projeto.framework,
        alteracoesNaoCommitadas: projeto.alteracoesGit,
        avisoGit:
          projeto.alteracoesGit > 0
            ? "Há mudanças não commitadas. Sugira ao usuário commitar ou guardar antes, para a troca ficar numa mudança separada."
            : undefined,
      },
    });
  }
  const layout = lumeJson.layout;

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
    return resposta(versao, {
      etapa: "base",
      next: "rodar",
      say: "Instalando a base do lume: tokens, fontes e o components.json.",
      instruction: `${instrucao} Nunca use -d no init do shadcn. Se o CSS global antigo tiver tokens próprios (outro @theme inline, outro @layer base, cores próprias), apague esses blocos: fica só o que a base escreveu.`,
      run,
    });
  }

  const { faltam } = await componentesFaltando(projeto, registry);
  if (faltam.length > 0) {
    const run = await comandosDeInstalacao(projeto, registry, versao);
    return resposta(versao, {
      etapa: "componentes",
      next: "rodar",
      say: "Instalando todos os componentes do lume no lugar dos atuais.",
      instruction: `Rode os comandos de \`run\` em ordem e depois \`${reinit}\`. O --overwrite troca os arquivos de mesmo nome em components/ui: é o esperado. Não restaure versão antiga de nenhum deles.`,
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

  const resultado = await conferir(raiz, { versao, buscar });
  if (!resultado.ok) {
    const porRegra = {};
    for (const v of resultado.violacoes)
      porRegra[v.regra] = (porRegra[v.regra] ?? 0) + 1;
    const arquivos = new Set(resultado.violacoes.map((v) => v.arquivo));
    return resposta(versao, {
      etapa: "migrar",
      next: "migrar",
      say: `Base, componentes e regras instalados. Faltam ${resultado.violacoes.length} ajustes em ${arquivos.size} arquivos para o projeto ficar no lume; vou reescrever as telas com os componentes dele.`,
      instruction: [
        `Rode \`${comando(versao, "check")}\` para ver a lista inteira e corrija tudo, regra por regra.`,
        "Reescreva cada tela para os componentes de components/ui, na API do lume, e apague os componentes antigos depois de trocar os imports. O que é do produto e não existe no lume vai para components/app, composto com os primitivos do lume.",
        `Monte o shell com ${shellDoLayout(layout)}, o layout que o usuário escolheu.`,
        'Monte cada página como o guia manda: PageHeader, StatGrid com StatCard, Card size="sm", DataTable ou Table, Field com Input, EmptyState.',
        `Quando o check passar, rode \`${reinit}\` de novo.`,
      ].join(" "),
      run: [comando(versao, "check")],
      details: {
        layout,
        violacoesPorRegra: porRegra,
        dicas: Object.fromEntries(
          Object.keys(porRegra).map((r) => [r, REGRAS[r]]),
        ),
      },
    });
  }

  return resposta(versao, {
    etapa: "pronto",
    next: "pronto",
    say: `O projeto está no lume v${versao}, com layout ${layout}, e o lume check passa.`,
    instruction:
      "Rode o typecheck, o lint, os testes e o build do projeto e mostre o resultado ao usuário. Sugira abrir o app e conferir as telas no claro e no escuro. Não faça commit nem push sem ele pedir.",
    details: { layout },
  });
}
