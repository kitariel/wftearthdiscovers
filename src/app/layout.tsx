import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "WTF Earth Discovers - Weird Products from Our Planet",
  description:
    "Discover the weirdest, funniest, and most bizarre products Earth has to offer. Daily WTF finds with affiliate links!",
  icons: [{ rel: "icon", url: "/meme2.jpg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <ToastProvider>{children}</ToastProvider>
          <Analytics />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
