import { Providers } from "@/app/providers";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "MyMoney",
    description: "Manage your money flow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono relative top-0 bottom-0 left-0 right-0 w-full min-h-svh`}
            >
                <Providers>
                    {children}
                    <Analytics />
                </Providers>
            </body>
        </html>
    );
}
