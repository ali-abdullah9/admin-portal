import type { Metadata } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import AuthProvider from "./AuthProvider";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "NusTAC - Admin Portal",
  description: "Secure campus access management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConvexClientProvider>
              {/* Header */}
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <Navbar />
                </div>
              </header>

              {/* Main content */}
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>

              {/* Footer */}
              <Footer />
              
              <Toaster position="bottom-right" />
            </ConvexClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}