import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import FirebaseAuthGate from "@/components/FirebaseAuthGate";
import LiveClock from "@/components/LiveClock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Blog CMS - Admin Panel",
  description:
    "Professional admin panel for AI-powered blog content management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"  suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
        
            <FirebaseAuthGate>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {/* <LiveClock /> */}
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      border: "1px solid hsl(var(--border))",
                    },
                  }}
                />
              </ThemeProvider>
            </FirebaseAuthGate>

        </Providers>
      </body>
    </html>
  );
}
