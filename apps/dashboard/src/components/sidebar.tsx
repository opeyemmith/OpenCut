"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { launchProjectsBrowser } from "@clipfactory/opencut-engine";
import { 
  Home,
  Film,
  FolderOpen,
  Zap,
  Settings,
  Rocket 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/templates", label: "Templates", icon: Film },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/batch", label: "Batch Jobs", icon: Zap },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleOpenEditor = () => {
    launchProjectsBrowser();
  };

  return (
    <aside className="w-[260px] h-screen bg-[var(--bg-glass)] backdrop-blur-md border-r border-[var(--border-default)] fixed left-0 top-0 flex flex-col z-50">
      <div className="flex items-center gap-3 p-6 border-b border-[var(--border-default)]">
        <Film className="w-7 h-7 text-[var(--accent)]" />
        <span className="text-xl font-bold gradient-text">ClipFactory</span>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[inset_2px_0_0_0_var(--accent)]" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-subtle)]/50 to-transparent opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-default)]">
        <button
          onClick={handleOpenEditor}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Rocket className="w-4 h-4" />
          <span>Open OpenCut</span>
        </button>
      </div>
    </aside>
  );
}
