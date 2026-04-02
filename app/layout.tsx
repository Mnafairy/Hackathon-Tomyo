import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import { Providers } from "@/components/Providers";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Peony | Боломжуудын нээлт",
  description:
    "Монголын ахлах, дунд ангийн сурагчдад зориулсан төсөл, тэмцээн, амжилтын боломжуудын платформ",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="mn" className={`${dmSans.variable} ${syne.variable} dark`}>
      <body className="noise-overlay min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
