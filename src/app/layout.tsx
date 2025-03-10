import "./globals.css";

import type { Metadata } from "next";

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
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
