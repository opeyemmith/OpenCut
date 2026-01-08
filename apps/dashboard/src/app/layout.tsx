"use client";

import { Toaster } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
import { InitialDataLoader } from "@/components/initial-data-loader";
import { usePathname } from "next/navigation";
import "./globals.css";

// Metadata cannot be exported from a client component
// We should move this to a separate layout or metadata file if strictly needed server-side
// but for this client-heavy MVP this is acceptable for now or can be handled in page.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased relative">
        <AuthGuard>
          <InitialDataLoader />
          {!isLoginPage && <Sidebar />}
          <div 
            className={`min-h-screen flex flex-col relative z-0 transition-all duration-300 ease-in-out ${
              !isLoginPage ? "pl-[260px]" : ""
            }`}
          >
            {!isLoginPage && <Header />}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthGuard>
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
