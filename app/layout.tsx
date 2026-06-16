import type { Metadata } from "next";
import { Nunito, Press_Start_2P, VT323 } from "next/font/google";
import { Providers } from "@/app/providers";
import "@uploadthing/react/styles.css";
import "@/styles/globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Minecraft Store",
  description: "Premium Minecraft packages — modpacks, plugins, maps, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${nunito.variable} min-h-screen bg-bg-primary text-text-primary`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
