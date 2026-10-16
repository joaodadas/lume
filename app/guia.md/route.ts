// /guia.md: o FRONTEND.md cru como text/markdown, para agente ou dev que
// prefere ler a fonte. Sem request nem relógio, o Cache Components pré-renderiza
// o GET em build (o config `dynamic = "force-static"` não é aceito com
// cacheComponents). Lê com node:fs; a versão renderizada mora em /guia/frontend.
import { readFileSync } from "node:fs";
import path from "node:path";

export function GET() {
  const corpo = readFileSync(path.join(process.cwd(), "FRONTEND.md"), "utf8");
  return new Response(corpo, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400",
    },
  });
}
