# Avisos de terceiros

O lume é distribuído sob Apache-2.0 (ver `LICENSE` e `NOTICE`). Ele inclui código
derivado e depende de projetos de terceiros, listados aqui com a licença de cada
um. Os arquivos derivados trazem no cabeçalho a origem exata (caminho e commit) e
um resumo das modificações, como pede a seção 4(b) da Apache-2.0. Esta lista é
mantida à mão a partir de `scripts/upstream-map.json` (verificação 8 do
`scripts/check.ts` exige que todo arquivo do mapa apareça aqui).

## Foglamp (Apache-2.0)

- Projeto: https://github.com/foglamp-labs/foglamp
- Autor: foglamp-labs / Gustavo Fior
- Commit sincronizado: `2bc3bb5` (2026-10-12)
- Licença: Apache License 2.0 (cópia integral abaixo, em "Apache License 2.0")

### Arquivos copiados verbatim (via `scripts/sync-upstream.ts`)

Cada um começa com `// Derivado do Foglamp (...)` (ou `// Evil Charts` no caso do
fork vendorizado, ver seção Evil Charts) e `// Modificado por joaodadas/lume: ...`.

| Arquivo no lume | Origem no Foglamp | Modificações |
|---|---|---|
| `registry/base-vega/components/evilcharts/charts/area-chart.tsx` | `apps/web/src/components/evilcharts/charts/area-chart.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/charts/bar-chart.tsx` | `apps/web/src/components/evilcharts/charts/bar-chart.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/charts/donut-chart.tsx` | `apps/web/src/components/evilcharts/charts/donut-chart.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/charts/line-chart.tsx` | `apps/web/src/components/evilcharts/charts/line-chart.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/background.tsx` | `apps/web/src/components/evilcharts/core/background.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/chart.tsx` | `apps/web/src/components/evilcharts/core/chart.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/dot.tsx` | `apps/web/src/components/evilcharts/core/dot.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/evil-brush.tsx` | `apps/web/src/components/evilcharts/core/evil-brush.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/legend.tsx` | `apps/web/src/components/evilcharts/core/legend.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/tooltip.tsx` | `apps/web/src/components/evilcharts/core/tooltip.tsx` | imports reescritos |
| `registry/base-vega/components/evilcharts/core/zoom.tsx` | `apps/web/src/components/evilcharts/core/zoom.tsx` | imports reescritos |
| `registry/base-vega/hooks/use-mobile.ts` | `packages/ui/src/hooks/use-mobile.ts` | imports reescritos |
| `registry/base-vega/ui/accordion.tsx` | `packages/ui/src/components/accordion.tsx` | imports reescritos |
| `registry/base-vega/ui/alert-dialog.tsx` | `packages/ui/src/components/alert-dialog.tsx` | imports reescritos |
| `registry/base-vega/ui/alert.tsx` | `packages/ui/src/components/alert.tsx` | imports reescritos |
| `registry/base-vega/ui/aspect-ratio.tsx` | `packages/ui/src/components/aspect-ratio.tsx` | imports reescritos |
| `registry/base-vega/ui/avatar.tsx` | `packages/ui/src/components/avatar.tsx` | imports reescritos |
| `registry/base-vega/ui/badge.tsx` | `packages/ui/src/components/badge.tsx` | imports reescritos |
| `registry/base-vega/ui/breadcrumb.tsx` | `packages/ui/src/components/breadcrumb.tsx` | imports reescritos |
| `registry/base-vega/ui/button-group.tsx` | `packages/ui/src/components/button-group.tsx` | imports reescritos |
| `registry/base-vega/ui/button.tsx` | `packages/ui/src/components/button.tsx` | imports reescritos |
| `registry/base-vega/ui/calendar.tsx` | `packages/ui/src/components/calendar.tsx` | imports reescritos |
| `registry/base-vega/ui/card.tsx` | `packages/ui/src/components/card.tsx` | imports reescritos |
| `registry/base-vega/ui/carousel.tsx` | `packages/ui/src/components/carousel.tsx` | imports reescritos |
| `registry/base-vega/ui/chart.tsx` | `packages/ui/src/components/chart.tsx` | imports reescritos |
| `registry/base-vega/ui/checkbox.tsx` | `packages/ui/src/components/checkbox.tsx` | imports reescritos |
| `registry/base-vega/ui/collapsible.tsx` | `packages/ui/src/components/collapsible.tsx` | imports reescritos |
| `registry/base-vega/ui/combobox.tsx` | `packages/ui/src/components/combobox.tsx` | imports reescritos |
| `registry/base-vega/ui/command.tsx` | `packages/ui/src/components/command.tsx` | imports reescritos |
| `registry/base-vega/ui/context-menu.tsx` | `packages/ui/src/components/context-menu.tsx` | imports reescritos |
| `registry/base-vega/ui/dialog.tsx` | `packages/ui/src/components/dialog.tsx` | imports reescritos |
| `registry/base-vega/ui/direction.tsx` | `packages/ui/src/components/direction.tsx` | imports reescritos |
| `registry/base-vega/ui/drawer.tsx` | `packages/ui/src/components/drawer.tsx` | imports reescritos |
| `registry/base-vega/ui/dropdown-menu.tsx` | `packages/ui/src/components/dropdown-menu.tsx` | imports reescritos |
| `registry/base-vega/ui/empty.tsx` | `packages/ui/src/components/empty.tsx` | imports reescritos |
| `registry/base-vega/ui/field.tsx` | `packages/ui/src/components/field.tsx` | imports reescritos |
| `registry/base-vega/ui/hover-card.tsx` | `packages/ui/src/components/hover-card.tsx` | imports reescritos |
| `registry/base-vega/ui/input-group.tsx` | `packages/ui/src/components/input-group.tsx` | imports reescritos |
| `registry/base-vega/ui/input-otp.tsx` | `packages/ui/src/components/input-otp.tsx` | imports reescritos |
| `registry/base-vega/ui/input.tsx` | `packages/ui/src/components/input.tsx` | imports reescritos |
| `registry/base-vega/ui/item.tsx` | `packages/ui/src/components/item.tsx` | imports reescritos |
| `registry/base-vega/ui/kbd.tsx` | `packages/ui/src/components/kbd.tsx` | imports reescritos |
| `registry/base-vega/ui/label.tsx` | `packages/ui/src/components/label.tsx` | imports reescritos |
| `registry/base-vega/ui/loader.tsx` | `packages/ui/src/components/loader.tsx` | imports reescritos |
| `registry/base-vega/ui/menubar.tsx` | `packages/ui/src/components/menubar.tsx` | imports reescritos |
| `registry/base-vega/ui/native-select.tsx` | `packages/ui/src/components/native-select.tsx` | imports reescritos |
| `registry/base-vega/ui/navigation-menu.tsx` | `packages/ui/src/components/navigation-menu.tsx` | imports reescritos |
| `registry/base-vega/ui/pagination.tsx` | `packages/ui/src/components/pagination.tsx` | imports reescritos |
| `registry/base-vega/ui/popover.tsx` | `packages/ui/src/components/popover.tsx` | imports reescritos |
| `registry/base-vega/ui/progress.tsx` | `packages/ui/src/components/progress.tsx` | imports reescritos |
| `registry/base-vega/ui/radio-group.tsx` | `packages/ui/src/components/radio-group.tsx` | imports reescritos |
| `registry/base-vega/ui/resizable.tsx` | `packages/ui/src/components/resizable.tsx` | imports reescritos |
| `registry/base-vega/ui/scroll-area.tsx` | `packages/ui/src/components/scroll-area.tsx` | imports reescritos |
| `registry/base-vega/ui/select.tsx` | `packages/ui/src/components/select.tsx` | imports reescritos |
| `registry/base-vega/ui/separator.tsx` | `packages/ui/src/components/separator.tsx` | imports reescritos |
| `registry/base-vega/ui/sheet.tsx` | `packages/ui/src/components/sheet.tsx` | imports reescritos |
| `registry/base-vega/ui/sidebar.tsx` | `packages/ui/src/components/sidebar.tsx` | hsl() removido do variant outline (os tokens são oklch, hsl(var()) é CSS inválido); idem para --sidebar-accent |
| `registry/base-vega/ui/skeleton.tsx` | `packages/ui/src/components/skeleton.tsx` | imports reescritos |
| `registry/base-vega/ui/slider.tsx` | `packages/ui/src/components/slider.tsx` | imports reescritos |
| `registry/base-vega/ui/sonner.tsx` | `packages/ui/src/components/sonner.tsx` | imports reescritos |
| `registry/base-vega/ui/spinner.tsx` | `packages/ui/src/components/spinner.tsx` | imports reescritos |
| `registry/base-vega/ui/switch.tsx` | `packages/ui/src/components/switch.tsx` | imports reescritos |
| `registry/base-vega/ui/table.tsx` | `packages/ui/src/components/table.tsx` | hex do footer trocado pelos tokens de borda; hex da caption trocado pelos tokens de borda; comentário com hex removido |
| `registry/base-vega/ui/tabs.tsx` | `packages/ui/src/components/tabs.tsx` | imports reescritos |
| `registry/base-vega/ui/textarea.tsx` | `packages/ui/src/components/textarea.tsx` | imports reescritos |
| `registry/base-vega/ui/toggle-group.tsx` | `packages/ui/src/components/toggle-group.tsx` | imports reescritos |
| `registry/base-vega/ui/toggle.tsx` | `packages/ui/src/components/toggle.tsx` | imports reescritos |
| `registry/base-vega/ui/tooltip.tsx` | `packages/ui/src/components/tooltip.tsx` | imports reescritos |

### Blocos adaptados

Os arquivos em `registry/base-vega/components/*.tsx`, `registry/base-vega/blocks/**`,
`registry/base-vega/lib/*.ts` e `registry/base-vega/hooks/*.ts` que começam com
`// Derivado do Foglamp` são adaptações de `apps/web/src/components/app/*`,
`apps/web/src/components/*.tsx` e `apps/web/src/lib/*` do mesmo commit, com as
generalizações descritas no cabeçalho de cada arquivo (Link da indireção no lugar
de `next/link`, tokens no lugar de hex, textos em pt-BR). Parte deles deriva
também do painel do lyx-pr-agent (João Vitor Dadas), port do Foglamp para Vite,
e o cabeçalho diz quando é o caso. `registry/base-vega/styles/globals.css` deriva
de `packages/ui/src/styles/globals.css` com as correções listadas no `CHANGELOG.md`.

## craft (MIT)

- Projeto: https://github.com/gustavo-fior/craft (https://craft.gustavofior.com)
- Autor: Gustavo Fior
- Licença: MIT. As fontes do craft (Inter e Redaction) mantêm a própria licença (SIL OFL) e não são redistribuídas pelo lume.
- O que o lume usa: os conceitos de design engineering, reescritos em português do Brasil em `docs/conceitos/`, com link para o original em cada página. Nenhum código do craft é copiado; `scripts/build-skill.ts` segue a forma do gerador do craft.

## Evil Charts (MIT)

- Projeto: https://evilcharts.com (https://github.com/legions-developer/evilcharts)
- Autor: Gurbinder
- O que o lume usa: `registry/base-vega/components/evilcharts/**` (fork vendorizado pelo Foglamp em `apps/web/src/components/evilcharts`, copiado daqui com imports reescritos). Cada arquivo começa com `// Evil Charts (https://evilcharts.com), MIT, (c) 2026 Gurbinder.`
- Licença (cópia de https://github.com/legions-developer/evilcharts/blob/main/LICENSE):

```
MIT License

Copyright (c) 2026 Gurbinder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## prompt-kit (MIT)

- Projeto: https://www.prompt-kit.com (https://github.com/ibelick/prompt-kit)
- O que o lume usa: o `loader` do Foglamp (`registry/base-vega/ui/loader.tsx`) implementa o `text-shimmer` do prompt-kit, como o próprio arquivo registra no comentário de origem.
- Licença: MIT.

## Dependências npm (MIT)

Instaladas pelo consumidor via `dependencies` dos itens; o lume não redistribui o código delas.

| Pacote | Projeto | Uso no lume |
|---|---|---|
| shadcn/ui (`shadcn`) | https://github.com/shadcn-ui/ui | CLI, formato da registry e base dos primitivos (Copyright (c) 2023 shadcn) |
| Base UI (`@base-ui/react`) | https://github.com/mui/base-ui | primitivos acessíveis sob os componentes |
| Tabler Icons (`@tabler/icons-react`) | https://github.com/tabler/tabler-icons | única biblioteca de ícones |
| `tw-animate-css` | https://github.com/Wombosvideo/tw-animate-css | animações de entrada e saída |
| `@toolwind/corner-shape` | https://github.com/toolwind/corner-shape | plugin do `corner-squircle` |
| `slot-text` | https://www.npmjs.com/package/slot-text | `rolling-text` |
| `border-beam` | https://www.npmjs.com/package/border-beam | `border-beam-card` |
| NumberFlow (`@number-flow/react`) | https://github.com/barvian/number-flow | fora da v0.1.0; entra com o item `number-flow` |
| `class-variance-authority`, `clsx`, `tailwind-merge`, `motion`, `next-themes`, `sonner`, `recharts`, `react-day-picker`, `date-fns`, `shiki`, `zod`, `react-markdown`, `remark-gfm`, `cmdk`, `vaul`, `input-otp`, `embla-carousel-react`, `react-resizable-panels` | respectivos repositórios | dependências dos primitivos e blocos, todas MIT |

Texto da licença MIT, válido para cada pacote acima com o respectivo detentor de copyright:

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fontes (SIL Open Font License 1.1, via Fontsource)

Servidas pelo consumidor a partir dos pacotes `@fontsource-variable/*`; o lume não redistribui os arquivos de fonte.

| Fonte | Pacote | Copyright |
|---|---|---|
| Inter | `@fontsource-variable/inter` | Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) |
| Geist Mono | `@fontsource-variable/geist-mono` | Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font) |
| Host Grotesk | `@fontsource-variable/host-grotesk` | Copyright 2023 The Host Grotesk Project Authors (https://github.com/Element-Type/HostGrotesk) |

Licença: SIL Open Font License, Version 1.1 (https://openfontlicense.org). O Fontsource (https://fontsource.org) empacota as fontes sob a mesma licença de cada família.

## Apache License 2.0

Texto integral, aplicável ao Foglamp e ao próprio lume:

```

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```
