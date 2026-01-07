"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render children while redirecting if unauthenticated, 
  // but allow rendering the login page itself
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
