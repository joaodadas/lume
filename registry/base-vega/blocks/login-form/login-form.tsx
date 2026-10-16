// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/login-form.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: virou presentacional. Saíram @tanstack/react-form, better-auth, env, toast e GoogleLogo; entraram os callbacks onPassword, onMagicLink, onGoogle e onForgot, brand e googleIcon como ReactNode, pending e error vindos de fora, validação zod.safeParse no submit, erros em Field/FieldError da registry, imports da registry e textos em pt-BR.
"use client";

import { useId, useState } from "react";
import { z } from "zod";

import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import { Field, FieldError } from "@/registry/base-vega/ui/field";
import { Input } from "@/registry/base-vega/ui/input";
import { Label } from "@/registry/base-vega/ui/label";

// Which sign-in methods the server has enabled (fetched by the login page from
// /api/auth-methods). Hosted: google + magic link. Self-host: password (+ magic
// link when email is configured).
// Aqui quem decide é o app: passa `methods` e o form só mostra o que existe.
export type LoginMethods = {
  password?: boolean;
  magicLink?: boolean;
  google?: boolean;
};

type Mode = "password" | "magic" | "forgot";

const EMAIL = z.email("Informe um e-mail válido.");

const passwordSchema = z.object({
  email: EMAIL,
  password: z.string().min(1, "Informe sua senha."),
});

const emailSchema = z.object({ email: EMAIL });

type FieldErrors = { email?: string; password?: string };

// Validação só no submit, como no Foglamp (validators.onSubmit): nada de erro
// enquanto digita, e o botão fica habilitado até a primeira tentativa.
function firstErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "email" || key === "password") && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}

// O tile da marca das telas de auth (mapa 12.2.2): quadrado de 40px em
// bg-muted, squircle 2xl quando o browser suporta, sombra no lugar de borda.
function BrandTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-10 rounded-md squircle:rounded-2xl corner-squircle bg-muted shadow-(--custom-shadow) flex justify-center items-center">
      {children}
    </div>
  );
}

/**
 * Formulário de login presentacional: senha, link mágico e Google, com a
 * troca de modo e as telas "verifique seu e-mail" do Foglamp. Quem autentica
 * é o app, pelos callbacks; `pending` e `error` chegam de fora, e um callback
 * que rejeita mantém o form na tela com a mensagem do erro.
 */
export function LoginForm({
  brand,
  methods = { password: true, magicLink: false, google: false },
  onPassword,
  onMagicLink,
  onGoogle,
  onForgot,
  googleIcon,
  pending,
  error,
  className,
}: {
  /** Marca dentro do tile de 40px, por exemplo <BrandMark className="w-7" />. */
  brand?: React.ReactNode;
  methods?: LoginMethods;
  onPassword?: (email: string, password: string) => void | Promise<void>;
  onMagicLink?: (email: string) => void | Promise<void>;
  onGoogle?: () => void;
  onForgot?: (email: string) => void | Promise<void>;
  /** Logo do Google no botão, por exemplo <GoogleLogo className="size-3.5 mr-0.75" />. */
  googleIcon?: React.ReactNode;
  /** Pendência controlada pelo app (mutation em voo); some com o submit interno. */
  pending?: boolean;
  /** Erro do app (senha inválida, provedor fora): aparece acima do botão. */
  error?: string | null;
  className?: string;
}) {
  const id = useId();
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;

  // Password first when available (the self-host floor); otherwise magic link.
  const [mode, setMode] = useState<Mode>(
    methods.password ? "password" : "magic",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resetSentTo, setResetSentTo] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  const busy = Boolean(pending) || submitting;
  const shownError = error ?? submitError;

  const hasEmailForm =
    ((mode === "password" || mode === "forgot") && Boolean(methods.password)) ||
    (mode === "magic" && Boolean(methods.magicLink));

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setSubmitError(null);
  };

  // Roda o callback do app e devolve true se ele resolveu. Se rejeitar, a
  // mensagem fica na tela e o form continua montado, como o toast.error +
  // return do original.
  const run = async (action: () => void | Promise<void>) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Não foi possível concluir. Tente de novo.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithGoogle = () => {
    setGooglePending(true);
    // On success this navigates away to Google; we only return here on error.
    onGoogle?.();
  };

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parsed = passwordSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(firstErrors(parsed.error));
      return;
    }
    setErrors({});
    await run(() => onPassword?.(parsed.data.email, parsed.data.password));
  };

  const submitForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(firstErrors(parsed.error));
      return;
    }
    setErrors({});
    if (await run(() => onForgot?.(parsed.data.email))) {
      setResetSentTo(parsed.data.email);
    }
  };

  const submitMagic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(firstErrors(parsed.error));
      return;
    }
    setErrors({});
    if (await run(() => onMagicLink?.(parsed.data.email))) {
      setSentTo(parsed.data.email);
    }
  };

  if (resetSentTo) {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-lg flex-col gap-4 p-6",
          className,
        )}
      >
        {brand && <BrandTile>{brand}</BrandTile>}
        <div className="mt-3 flex flex-col gap-2">
          <h1 className="text-xl font-medium text-balance">
            Verifique seu e-mail
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Se existe uma conta para{" "}
            <span className="font-medium text-foreground">{resetSentTo}</span>,
            enviamos um link para redefinir a senha.
          </p>
          <p className="text-sm text-muted-foreground text-balance mt-2">
            O link expira em{" "}
            <span className="text-foreground font-medium">1 hora</span>.
          </p>
        </div>
        <Button
          className="self-start mt-2"
          onClick={() => {
            setResetSentTo(null);
            switchMode("password");
          }}
        >
          Voltar para o login
        </Button>
      </div>
    );
  }

  if (sentTo) {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-lg flex-col gap-4 p-6",
          className,
        )}
      >
        {brand && <BrandTile>{brand}</BrandTile>}
        <div className="mt-5 flex flex-col gap-2">
          <h1 className="text-xl font-medium text-balance">
            Verifique seu e-mail
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enviamos um link de acesso para{" "}
            <span className="font-medium text-foreground">{sentTo}</span>.
          </p>
          <p className="text-sm text-muted-foreground text-balance">
            O link expira em 15 minutos.
          </p>
        </div>
        <Button
          variant="link"
          className="self-start px-0"
          onClick={() => {
            setSentTo(null);
            switchMode(methods.password ? "password" : "magic");
          }}
        >
          Voltar para o login
        </Button>
      </div>
    );
  }

  // No form de senha o e-mail tem rótulo; nos de link mágico e de redefinição
  // o campo vai sozinho, como no original (o título já diz o que é).
  const emailField = (labeled: boolean) => (
    <Field data-invalid={Boolean(errors.email)} className="gap-2.5">
      {labeled && <Label htmlFor={emailId}>E-mail</Label>}
      <Input
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        aria-label={labeled ? undefined : "E-mail"}
        value={email}
        aria-invalid={Boolean(errors.email) || undefined}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FieldError className="text-xs">{errors.email}</FieldError>
    </Field>
  );

  return (
    <div className={cn("mx-auto flex w-full max-w-lg flex-col p-6", className)}>
      {brand && <BrandTile>{brand}</BrandTile>}
      <h1
        className={cn(
          "mb-1 w-full text-start text-lg font-medium text-balance",
          brand && "mt-5",
        )}
      >
        {mode === "forgot" ? "Redefinir sua senha" : "Entrar"}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground tracking-normal">
        {mode === "forgot"
          ? "Enviamos por e-mail um link para você escolher uma nova senha."
          : "Entre na sua conta para continuar."}
      </p>

      {methods.google && mode !== "forgot" && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={googlePending || busy}
          onClick={signInWithGoogle}
        >
          {googleIcon}
          {googlePending ? "Redirecionando…" : "Entrar com Google"}
        </Button>
      )}

      {methods.google && hasEmailForm && mode !== "forgot" && (
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground/60">ou</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      )}

      {hasEmailForm && mode === "password" ? (
        <form onSubmit={submitPassword} className="flex w-full flex-col gap-5">
          {emailField(true)}

          <Field data-invalid={Boolean(errors.password)} className="gap-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={passwordId}>Senha</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                onClick={() => switchMode("forgot")}
              >
                Esqueci a senha
              </button>
            </div>
            <Input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              aria-invalid={Boolean(errors.password) || undefined}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldError className="text-xs">{errors.password}</FieldError>
          </Field>

          <FieldError className="text-xs">{shownError}</FieldError>

          <Button type="submit" className="w-full mt-2" disabled={busy}>
            {busy ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      ) : hasEmailForm && mode === "forgot" ? (
        <form onSubmit={submitForgot} className="flex w-full flex-col gap-5">
          {emailField(false)}

          <FieldError className="text-xs">{shownError}</FieldError>

          <Button type="submit" className="w-full mt-1" disabled={busy}>
            {busy ? "Enviando…" : "Enviar link de redefinição"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="self-start px-0 text-muted-foreground/50"
            onClick={() => switchMode("password")}
          >
            Voltar para o login
          </Button>
        </form>
      ) : hasEmailForm ? (
        <form onSubmit={submitMagic} className="flex w-full flex-col gap-6">
          {emailField(false)}

          <FieldError className="text-xs">{shownError}</FieldError>

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Enviando…" : "Enviar link mágico"}
          </Button>
        </form>
      ) : null}

      {methods.password && methods.magicLink && mode !== "forgot" && (
        <Button
          variant="link"
          className="mt-4 self-start px-0 text-muted-foreground/50 hover:text-foreground"
          onClick={() => switchMode(mode === "password" ? "magic" : "password")}
        >
          {mode === "password"
            ? "Prefiro receber um link por e-mail"
            : "Prefiro usar e-mail e senha"}
        </Button>
      )}
    </div>
  );
}
