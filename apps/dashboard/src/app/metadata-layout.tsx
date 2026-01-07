import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClipFactory - AI Video Automation",
  description: "AI-powered content automation platform for creators",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
