import type { Metadata } from "next";

import { ThemeProvider } from "@/registry/base-vega/components/theme-provider";
import { Toaster } from "@/registry/base-vega/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "lume",
    template: "%s · lume",
  },
  description:
    "Design system com a cara do Foglamp: tokens, componentes, blocos, guia e skill de agente, instaláveis por registry shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="font-sans">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
