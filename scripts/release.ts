// Lança uma versão do lume. Valida (versão semver maior que a atual, tag
// inexistente, git limpo, seção da versão no CHANGELOG.md, gh autenticado e
// check verde), grava a versão no package.json, regenera registry.json,
// public/r e a skill, commita "release: vX.Y.Z" (sem Co-Authored-By), cria a
// tag anotada com a seção do CHANGELOG, dá push e cria a GitHub Release a
// partir da tag.
//
// uso: bun scripts/release.ts <versão> [--dry-run] [--no-build]
//
// --dry-run só valida: lista tudo o que impediria a release e não grava nada.
// --no-build repassa ao check (pula o next build). Serve para ensaiar; a
// release de verdade roda sem ele.

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const versao = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const noBuild = args.includes("--no-build");

if (!versao) {
  console.error(
    "uso: bun scripts/release.ts <versão> [--dry-run] [--no-build]",
  );
  process.exit(2);
}
const tag = `v${versao}`;

function roda(cmd: string[], opts: { mostra?: boolean } = {}) {
  try {
    const r = Bun.spawnSync(cmd, {
      cwd: ROOT,
      stdout: opts.mostra ? "inherit" : "pipe",
      stderr: opts.mostra ? "inherit" : "pipe",
    });
    const saida = opts.mostra
      ? ""
      : `${r.stdout?.toString() ?? ""}${r.stderr?.toString() ?? ""}`.trim();
    return { ok: r.exitCode === 0, saida };
  } catch (e) {
    return { ok: false, saida: String(e) };
  }
}

function passo(nome: string, cmd: string[]) {
  console.log(`\n> ${nome}: ${cmd.join(" ")}`);
  const r = roda(cmd, { mostra: true });
  if (!r.ok) {
    console.error(`release: falhou em "${nome}"`);
    process.exit(1);
  }
}

// --------------------------------------------------------------- validações

const problemas: string[] = [];

const pkgArq = path.join(ROOT, "package.json");
const pkgTexto = readFileSync(pkgArq, "utf8");
const atual = (JSON.parse(pkgTexto) as { version: string }).version;

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const mNova = SEMVER.exec(versao);
const mAtual = SEMVER.exec(atual);
if (!mNova) problemas.push(`versão "${versao}" não é semver (X.Y.Z)`);
else if (mAtual) {
  const n = [1, 2, 3].map((i) => Number(mNova[i]));
  const a = [1, 2, 3].map((i) => Number(mAtual[i]));
  const maior =
    n[0] !== a[0]
      ? (n[0] ?? 0) > (a[0] ?? 0)
      : n[1] !== a[1]
        ? (n[1] ?? 0) > (a[1] ?? 0)
        : (n[2] ?? 0) > (a[2] ?? 0);
  if (!maior)
    problemas.push(`versão ${versao} não é maior que a atual (${atual})`);
}

if (!roda(["git", "rev-parse", "--is-inside-work-tree"]).ok)
  problemas.push("não é um repositório git");
else {
  const status = roda(["git", "status", "--porcelain"]).saida;
  if (status)
    problemas.push(`árvore suja; commite ou descarte antes:\n${status}`);
  if (roda(["git", "tag", "-l", tag]).saida.trim() === tag)
    problemas.push(`tag ${tag} já existe`);
  if (!roda(["git", "remote", "get-url", "origin"]).ok)
    problemas.push("sem remote origin");
}

// Seção da versão no CHANGELOG.md (Keep a Changelog): "## [X.Y.Z] - data".
let notas = "";
const changelogArq = path.join(ROOT, "CHANGELOG.md");
if (!existsSync(changelogArq)) problemas.push("CHANGELOG.md não existe");
else {
  const linhas = readFileSync(changelogArq, "utf8").split("\n");
  const inicio = linhas.findIndex((l) => l.startsWith(`## [${versao}]`));
  if (inicio < 0) problemas.push(`CHANGELOG.md sem a seção "## [${versao}]"`);
  else {
    let fim = linhas.length;
    for (let i = inicio + 1; i < linhas.length; i++)
      if (linhas[i]?.startsWith("## ")) {
        fim = i;
        break;
      }
    notas = linhas
      .slice(inicio + 1, fim)
      .join("\n")
      .trim();
    if (!notas)
      problemas.push(`seção "## [${versao}]" do CHANGELOG.md está vazia`);
    if (/[—–]/.test(notas))
      problemas.push("seção do CHANGELOG.md com travessão ou meia-risca");
  }
}

const gh = roda(["gh", "auth", "status"]);
if (!gh.ok)
  problemas.push(
    `gh não está autenticado (gh auth login):\n${gh.saida.split("\n").slice(0, 3).join("\n")}`,
  );

// O check é o mais caro; roda por último e aparece inteiro no terminal.
console.log(`> bun run check${noBuild ? " --no-build" : ""}`);
const check = roda(
  ["bun", "run", "check", ...(noBuild ? ["--no-build"] : [])],
  { mostra: true },
);
if (!check.ok) problemas.push("bun run check falhou (veja acima)");

if (problemas.length) {
  console.error(
    `\nrelease ${tag}: ${problemas.length} impedimento(s)\n- ${problemas.join("\n- ")}`,
  );
  process.exit(1);
}
if (dryRun) {
  console.log(`\nrelease ${tag}: validações ok (dry-run, nada gravado)`);
  process.exit(0);
}

// -------------------------------------------------------------------- release

writeFileSync(
  pkgArq,
  pkgTexto.replace(/"version":\s*"[^"]*"/, `"version": "${versao}"`),
);
console.log(`\npackage.json: ${atual} -> ${versao}`);

passo("registry.json", ["bun", "scripts/build-registry.ts"]);
passo("public/r", ["bunx", "shadcn", "build", "--output", "public/r"]);
if (existsSync(path.join(ROOT, "scripts/build-skill.ts")))
  passo("skill", ["bun", "scripts/build-skill.ts"]);
else console.log("\n> skill: scripts/build-skill.ts não existe, pulando");

passo("git add", ["git", "add", "-A"]);
passo("git commit", ["git", "commit", "-m", `release: ${tag}`]);

const notasArq = path.join(tmpdir(), `lume-release-${versao}.md`);
writeFileSync(notasArq, `${tag}\n\n${notas}\n`);
try {
  passo("git tag", ["git", "tag", "-a", tag, "-F", notasArq]);
} finally {
  unlinkSync(notasArq);
}
passo("git push", ["git", "push", "--follow-tags"]);
passo("gh release", [
  "gh",
  "release",
  "create",
  tag,
  "--title",
  tag,
  "--notes-from-tag",
]);

console.log(`\nrelease ${tag} publicada`);
