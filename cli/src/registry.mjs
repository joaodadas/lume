// Leitura da registry do lume numa versão fixa: o registry.json da tag (lista
// de itens e caminhos) e o public/r/<item>.json (o conteúdo de cada arquivo).
// LUME_REGISTRY troca a origem: outra URL base ou uma pasta local do repo.

import { readFile } from "node:fs/promises";
import path from "node:path";

export const REPO = "joaodadas/lume";

export function origem(versao) {
  const env = process.env.LUME_REGISTRY;
  if (env) return env.replace(/\/$/, "");
  return `https://raw.githubusercontent.com/${REPO}/v${versao}`;
}

async function buscarPadrao(url) {
  if (!/^https?:\/\//.test(url)) {
    return JSON.parse(await readFile(url.replace(/^file:\/\//, ""), "utf8"));
  }
  const r = await fetch(url, { headers: { "user-agent": "lume-cli" } });
  if (!r.ok) throw new Error(`${url} respondeu ${r.status}`);
  return r.json();
}

export function criarRegistry(versao, buscar = buscarPadrao) {
  const base = origem(versao);
  const cache = new Map();
  const pegar = (rel) => {
    const url = /^https?:\/\//.test(base)
      ? `${base}/${rel}`
      : path.join(base, rel);
    if (!cache.has(url)) cache.set(url, buscar(url));
    return cache.get(url);
  };
  return {
    base,
    /** Itens da versão: { name, type, files: [{ path, target? }] }. */
    async itens() {
      const r = await pegar("registry.json");
      return r.items ?? [];
    },
    /** O item buildado, com o conteúdo de cada arquivo. */
    async item(nome) {
      return pegar(`public/r/${nome}.json`);
    },
  };
}

/** Executa tarefas assíncronas com no máximo `n` ao mesmo tempo. */
export async function emLotes(lista, n, fn) {
  const saida = new Array(lista.length);
  let proximo = 0;
  const trabalhadores = Array.from(
    { length: Math.min(n, lista.length) },
    async () => {
      while (proximo < lista.length) {
        const i = proximo++;
        saida[i] = await fn(lista[i], i);
      }
    },
  );
  await Promise.all(trabalhadores);
  return saida;
}
