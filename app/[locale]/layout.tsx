import type { ReactNode } from "react";

import clsx from "clsx";

import "@/styles/globals.css";
import { ibmPlexSans, spaceGrotesk, viewportConfig } from "@/config";
import { Navbar, Providers, NextIntlProvider } from "@/components";
import { ToolsMenu } from "@/components/shared/navbar/components";

export const viewport = viewportConfig;


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}
      lang="es"
    >
      <body className={clsx("layout")}>
        <NextIntlProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <Navbar />

            <div className="layout__container">
              {children}

              <ToolsMenu />
            </div>
          </Providers>
        </NextIntlProvider>
      </body>
    </html>
  );
}
