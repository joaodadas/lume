// Peças avulsas da vitrine /blocos, fora do shell: login-form, border-beam-card
// com code-block, rolling-text com copy-button, chips e badges de tipo, e o
// notice nos três tons. Arquivo do site, não entra na registry.
"use client";

import {
  IconBrandGoogleFilled,
  IconCpu,
  IconGhostFilled,
  IconRefresh,
  IconSparkles,
  IconTool,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  API_KEYS,
  INSTALL_SNIPPET,
  SPAN_TYPES,
} from "@/components/blocos/mock";
import { LoginForm } from "@/registry/base-vega/blocks/login-form/login-form";
import { BorderBeamCard } from "@/registry/base-vega/components/border-beam-card";
import { CodeBlock } from "@/registry/base-vega/components/code-block";
import {
  Chip,
  ContextChip,
} from "@/registry/base-vega/components/context-chip";
import { CopyButton } from "@/registry/base-vega/components/copy-button";
import { Notice } from "@/registry/base-vega/components/notice";
import { RollingText } from "@/registry/base-vega/components/rolling-text";
import {
  SpanTypeBadge,
  SpanTypeChip,
} from "@/registry/base-vega/components/span-type";
import { Button } from "@/registry/base-vega/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";

// Simula a ida ao servidor: o form fica "Entrando…" enquanto a promise voa.
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function PiecesHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground text-pretty">{description}</p>
    </div>
  );
}

export function PiecesDemo() {
  // O botão do Google fica em "Redirecionando…" porque o app de verdade sai da
  // página; aqui o form remonta depois do toast para a demo continuar viva.
  const [formKey, setFormKey] = useState(0);
  const [keyIndex, setKeyIndex] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <PiecesHeading
            title="login-form"
            description="Presentacional: senha, link mágico e Google. Quem autentica é o app, pelos callbacks; aqui cada um vira um toast."
          />
          <Card className="py-2">
            <LoginForm
              key={formKey}
              brand={
                <span className="size-4 rounded-[5px] squircle:rounded-xl corner-squircle bg-foreground" />
              }
              methods={{ password: true, magicLink: true, google: true }}
              googleIcon={<IconBrandGoogleFilled className="size-3.5" />}
              onPassword={async (email) => {
                await wait(600);
                toast.success(`Sessão iniciada como ${email}`);
              }}
              onMagicLink={async (email) => {
                await wait(600);
                toast.success(`Link enviado para ${email}`);
              }}
              onForgot={async (email) => {
                await wait(600);
                toast.success(`Redefinição enviada para ${email}`);
              }}
              onGoogle={() => {
                toast("Redirecionando para o Google");
                window.setTimeout(() => setFormKey((k) => k + 1), 1500);
              }}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <PiecesHeading
              title="border-beam-card e code-block"
              description="O card que chama atenção para o próximo passo, um por tela, com o código pronto para copiar."
            />
            <BorderBeamCard>
              <CardHeader>
                <CardTitle>Cole no seu projeto</CardTitle>
                <CardDescription>
                  Um StatCard com sparkline e delta, direto da registry.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={INSTALL_SNIPPET} lang="typescript" />
              </CardContent>
            </BorderBeamCard>
          </div>

          <div className="flex flex-col gap-3">
            <PiecesHeading
              title="rolling-text e copy-button"
              description="A chave rola como caça-níquel até o valor final; o botão copia da string, nunca do DOM animado."
            />
            <Card size="sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Chave criada</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setKeyIndex((i) => (i + 1) % API_KEYS.length)}
                >
                  <IconRefresh />
                  Gerar outra
                </Button>
              </CardHeader>
              <CardContent className="mt-2 flex items-center gap-2">
                <RollingText value={API_KEYS[keyIndex]} />
                <CopyButton value={API_KEYS[keyIndex]} title="Copiar chave" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <PiecesHeading
          title="context-chip e span-type"
          description="Chips de entidade na superfície do gatilho de filtro, e a tabela fixa de cor por tipo de span."
        />
        <Card size="sm">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <ContextChip
                href="#agentes"
                icon={IconGhostFilled}
                iconClassName="text-orange-500"
                label="agente: suporte-n1"
              />
              <ContextChip
                icon={IconCpu}
                iconClassName="text-muted-foreground"
                label="modelo: gpt-5"
              />
              <Chip
                icon={<IconSparkles className="size-3 text-violet-500" />}
                label="gerar resposta"
                trailing="1,2s"
              />
              <Chip
                icon={<IconTool className="size-3" />}
                label="buscar pedido"
                trailing="×3"
                tone="error"
              />
              <Chip label="enviar e-mail" tone="aborted" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {SPAN_TYPES.map((type) => (
                <SpanTypeBadge key={type} type={type} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {SPAN_TYPES.map((type) => (
                <SpanTypeChip key={type} type={type} />
              ))}
              <span className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                tr_3a1f0c
                <CopyButton
                  value="tr_3a1f0c"
                  title="Copiar ID"
                  iconSize="size-3.5"
                />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <PiecesHeading
          title="notice"
          description="Faixa de aviso entre blocos, nos três tons, com a sombra colorida no lugar da borda."
        />
        {/* O Notice traz o gutter PX da página; aqui o container do site já
            cuida da margem. */}
        <Notice tone="info" title="Leitura de ontem" className="px-0 md:px-0">
          Os números deste período foram consolidados às 03:00 e podem mudar até
          o fechamento.
        </Notice>
        <Notice tone="warning" title="Cota pausada" className="px-0 md:px-0">
          O projeto passou de 90% do limite mensal; novas chamadas entram na
          fila.
        </Notice>
        <Notice tone="error" title="Falha de leitura" className="px-0 md:px-0">
          Não foi possível ler o custo por modelo. Tente de novo em instantes.
        </Notice>
      </div>
    </div>
  );
}
