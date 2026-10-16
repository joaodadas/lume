// Render de um documento Markdown do /guia com react-markdown + remark-gfm,
// mapeado para as classes do lume: títulos em text-base/text-sm font-medium,
// corpo text-sm, tabela da registry, código inline em mono sobre bg-muted e
// bloco de código no CodeBlock (shiki) quando a linguagem é ts/json. Server
// component: react-markdown v10 não usa hook. Arquivo do site, fora da registry.
import Link from "next/link";
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { type Doc, linkDoRepo, rotaDoLink } from "@/components/guia/docs";
import { CodeBlock } from "@/registry/base-vega/components/code-block";
import { cn } from "@/registry/base-vega/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";

// Linguagens que o CodeBlock sabe colorir (grammars carregadas no shiki). O
// resto cai num <pre> renderizado no servidor.
const LANG_SHIKI: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  js: "typescript",
  jsx: "typescript",
  json: "json",
};

function textoDe(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textoDe).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return textoDe(node.props.children);
  return "";
}

// Slug de título no padrão do GitHub (mesmo do scripts/check.ts), para as
// âncoras #secao citadas nos links entre documentos.
function criarSlugger() {
  const vistos = new Map<string, number>();
  return (texto: string) => {
    const base = texto
      .replace(/[`*_~]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .trim()
      .replace(/\s/g, "-");
    const vezes = vistos.get(base) ?? 0;
    vistos.set(base, vezes + 1);
    return vezes === 0 ? base : `${base}-${vezes}`;
  };
}

const LINK_CLASS =
  "font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground";

function criarComponentes(doc: Doc): Components {
  const slug = criarSlugger();

  const Titulo = (
    nivel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    className: string,
  ) => {
    const Tag = nivel;
    return ({ children }: ComponentProps<typeof nivel>) => (
      <Tag
        id={slug(textoDe(children))}
        className={cn("scroll-mt-20 font-medium tracking-tight", className)}
      >
        {children}
      </Tag>
    );
  };

  return {
    h1: Titulo("h1", "text-xl text-balance"),
    h2: Titulo("h2", "mt-10 text-base"),
    h3: Titulo("h3", "mt-6 text-sm"),
    h4: Titulo("h4", "mt-4 text-sm text-muted-foreground"),
    h5: Titulo("h5", "mt-4 text-sm text-muted-foreground"),
    h6: Titulo("h6", "mt-4 text-sm text-muted-foreground"),
    p: ({ children }) => (
      <p className="text-sm leading-relaxed text-pretty">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground/60">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground/60">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="[&>ol]:mt-1.5 [&>p]:inline [&>ul]:mt-1.5">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="flex flex-col gap-2 border-l-2 border-border/60 pl-4 text-sm text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-2 border-border/40" />,
    strong: ({ children }) => (
      <strong className="font-medium text-foreground">{children}</strong>
    ),
    a: ({ href = "", children }) => {
      if (href.startsWith("#")) {
        return (
          <a href={href} className={LINK_CLASS}>
            {children}
          </a>
        );
      }
      if (/^[a-z]+:/i.test(href)) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            {children}
          </a>
        );
      }
      const rota = rotaDoLink(doc, href);
      if (rota) {
        return (
          <Link href={rota} className={LINK_CLASS}>
            {children}
          </Link>
        );
      }
      if (href.startsWith("/")) {
        return (
          <Link href={href} className={LINK_CLASS}>
            {children}
          </Link>
        );
      }
      return (
        <a
          href={linkDoRepo(doc, href)}
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          {children}
        </a>
      );
    },
    // Código inline. O bloco cercado é consumido pelo override de <pre>, então
    // aqui só chega o `código` de uma linha.
    code: ({ children }) => (
      <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
        {children}
      </code>
    ),
    pre: ({ children }) => {
      const filho = Children.toArray(children)[0];
      const props = isValidElement<{
        className?: string;
        children?: ReactNode;
      }>(filho)
        ? filho.props
        : { className: "", children };
      const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "";
      const code = textoDe(props.children).replace(/\n$/, "");
      const shiki = LANG_SHIKI[lang];
      if (shiki) {
        return (
          <div className="my-1 [&_pre]:text-xs">
            <CodeBlock code={code} lang={shiki} />
          </div>
        );
      }
      return (
        <pre className="my-1 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      );
    },
    table: ({ children }) => (
      <Table className="my-2 text-sm [&_td:last-child]:pr-3 [&_th:last-child]:pr-3">
        {children}
      </Table>
    ),
    thead: ({ children }) => (
      <TableHeader className="h-9 text-muted-foreground [&_tr]:h-9">
        {children}
      </TableHeader>
    ),
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children, align }) => (
      <TableHead
        align={align === "center" || align === "right" ? align : undefined}
        className="px-3 text-xs"
      >
        {children}
      </TableHead>
    ),
    td: ({ children, align }) => (
      <TableCell
        align={align === "center" || align === "right" ? align : undefined}
        className="whitespace-normal px-3 py-2 align-top leading-relaxed"
      >
        {children}
      </TableCell>
    ),
    img: ({ src, alt }) => (
      // biome-ignore lint/performance/noImgElement: imagem de documento, sem otimizador
      <img
        src={typeof src === "string" ? src : undefined}
        alt={alt ?? ""}
        className="my-2 max-w-full rounded-md"
      />
    ),
  };
}

export function DocMarkdown({ doc, markdown }: { doc: Doc; markdown: string }) {
  return (
    <article className="flex min-w-0 flex-col gap-4 text-sm text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={criarComponentes(doc)}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
