import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import { Shell } from "@/components/Shell";
import "./globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Our New Way — Offene Bürgerplattform",
    template: "%s · Our New Way",
  },
  description:
    "Konzept für direkte Gesetzgebung durch das Volk: alle Bundesgesetze, Abstimmung, Diskurs, unparteiische Auszählung.",
  icons: { icon: "/seal.svg" },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${garamond.variable} ${lato.variable} h-full`}>
      <body className={`${lato.className} min-h-full antialiased`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
