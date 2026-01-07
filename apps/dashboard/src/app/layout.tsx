import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipFactory - AI Video Automation",
  description: "AI-powered content automation platform for creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased relative">
        <Sidebar />
        <main className="pl-[260px] min-h-screen relative z-0 transition-all duration-300 ease-in-out">
          {children}
        </main>
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
