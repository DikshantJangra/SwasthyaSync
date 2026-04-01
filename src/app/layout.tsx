import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwasthyaSync",
  description: "Your health, synced.",
};

import { TRPCProvider } from "./TRPCProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
