import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "./_components/header";
export const metadata: Metadata = {
  title: "WTF Earth Discovers - Weird Products from Our Planet",
  description:
    "Discover the weirdest, funniest, and most bizarre products Earth has to offer. Daily WTF finds with affiliate links!",
  icons: [{ rel: "icon", url: "/meme2.jpg" }],
  openGraph: {
    title: "WTF Earth Discovers - Weird Products from Our Planet",
    description: "Discover the weirdest, funniest, and most bizarre products Earth has to offer. Daily WTF finds with affiliate links!",
    url: "https://productfromtheearth.com",
    siteName: "WTF Earth Discovers",
    images: [
      {
        url: "/meme2.jpg",
        width: 1200,
        height: 630,
        alt: "WTF Earth Discovers - Weird Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WTF Earth Discovers - Weird Products from Our Planet",
    description: "Discover the weirdest, funniest, and most bizarre products Earth has to offer. Daily WTF finds with affiliate links!",
    images: ["/meme2.jpg"],
    creator: "@wtfearthdiscovers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
          <Analytics />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
