"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Page title mapping
const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/templates": "Templates",
  "/projects": "Projects",
  "/characters": "Characters",
  "/tools": "Tools",
  "/batch": "Batch Jobs",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pageTitle = pageTitles[pathname] || "Dashboard";

  // Sample notifications
  const notifications = [
    { id: 1, title: "Batch job completed", message: "Your 10 videos are ready", time: "2m ago", unread: true },
    { id: 2, title: "New template available", message: "Check out the TikTok Viral template", time: "1h ago", unread: true },
    { id: 3, title: "Welcome to ClipFactory!", message: "Get started with your first project", time: "1d ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-[var(--bg-glass)] backdrop-blur-md border-b border-[var(--border-default)] sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">{pageTitle}</h1>
        
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            What's New
          </button>
        </div>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden lg:flex relative items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            ⌘K
          </kbd>
        </div>

        {/* Help */}
        <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-[var(--error)] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                  <button className="text-xs text-[var(--accent)] hover:text-[var(--accent-light)]">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer ${
                        notif.unread ? "bg-[var(--accent-subtle)]/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 mt-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        )}
                        <div className={notif.unread ? "" : "ml-5"}>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{notif.title}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{notif.message}</p>
                          <p className="text-xs text-[var(--text-dim)] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/notifications"
                  className="block p-3 text-center text-sm text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <Link 
          href="/settings"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-[var(--border-default)]">
                    <p className="font-medium text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {/* logout */}}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
