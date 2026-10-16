// Link da indireção de navegação sobre next/link: mesmo contrato do item link (href string, props de <a>), instalado no mesmo caminho components/link.tsx para o app Next ganhar prefetch e navegação client-side sem os blocos importarem next/*.
import NextLink from "next/link";
import type * as React from "react";

/** `href` continua string (nunca o tipo Route): os blocos montam rotas com
 * template string e o Next resolve em runtime. `ref` e as demais props de <a>
 * passam direto para o next/link. */
export function Link({
  href,
  ...props
}: React.ComponentProps<"a"> & { href: string }) {
  return <NextLink href={href} {...props} />;
}
