// Link da indireção de navegação do lume: um <a> puro com href string. Os blocos importam daqui, nunca de next/link; o item link-next troca este arquivo por uma versão sobre next/link no mesmo caminho (components/link.tsx).
import type * as React from "react";

/** Âncora com o contrato que os blocos esperam: `href` obrigatório e string
 * (rota escrita à mão, nunca o tipo Route do Next), o resto é o que um <a>
 * aceita, inclusive `ref`, que no React 19 é prop comum. Serve em Vite, em
 * Remix e em qualquer app sem roteador; o app Next instala o link-next por cima. */
export function Link({
  href,
  ...props
}: React.ComponentProps<"a"> & { href: string }) {
  return <a href={href} {...props} />;
}
