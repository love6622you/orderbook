import "./globals.css";

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";

import theme from "@/libs/theme";

export async function generateMetadata(): Promise<Metadata> {
  const faviconPath = `/favicon.ico`;

  return {
    title: "Orderbook",
    description: "Orderbook demo",
    icons: {
      icon: faviconPath,
      href: faviconPath,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
