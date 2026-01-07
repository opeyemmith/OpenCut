"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { Film, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      login(email);
      toast.success("Welcome back to ClipFactory!");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300 ring-1 ring-[#262626]">
            <Film className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            Welcome to ClipFactory
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to manage your automated video pipeline
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
          <div className="space-y-2" suppressHydrationWarning>
            <label htmlFor="email" className="text-sm font-medium text-gray-300 font-sans">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@clipfactory.ai"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[#262626] text-center">
          <p className="text-xs text-gray-600">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
