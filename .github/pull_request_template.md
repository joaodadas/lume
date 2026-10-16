## O que muda

<!-- Uma frase. Se for melhoria vinda de um produto (Ashmont, Lyx, pessoal), diga qual e por quê a mudança é geral. -->

## Checklist

- [ ] Conferido nos dois temas (light e dark)
- [ ] Conferido em 1440 e em 390 de largura (captura de cada um na PR, quando muda algo visual)
- [ ] Conferido com `prefers-reduced-motion: reduce` (animação some, estado final igual)
- [ ] `bun run check` verde (inclui typecheck de registry, hex, border, imports, docs e next build)
- [ ] `bun run typecheck` e `bun run lint` verdes
- [ ] Linha em `CHANGELOG.md` na seção `[Não lançado]` (Adicionado, Mudado, Corrigido ou Upstream; "Como migrar" se muda API)
- [ ] Sem `lucide-react`, sem `asChild` (Base UI usa `render`), sem hex em className ou style
- [ ] Arquivo derivado do Foglamp começa com `// Derivado do Foglamp (...)` e `// Modificado por joaodadas/lume: ...`
- [ ] Item novo tem metadados em `registry/items.ts` e `bun run registry:build` foi rodado (registry.json e public/r commitados)
- [ ] Texto em pt-BR, sem travessão nem meia-risca; identificadores e classes em inglês; "AI", nunca "IA"
