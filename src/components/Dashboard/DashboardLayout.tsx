"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Compass,
  Settings,
  ChevronLeft,
  Sparkles,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companions", label: "Companions", icon: Users },
  { href: "/journey", label: "Learning Journey", icon: Compass },
];

const secondaryLinks: SidebarLink[] = [
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string | null;
}

export function DashboardLayout({ children, userName }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background-secondary))]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[hsl(var(--foreground))]" />
          ) : (
            <Menu className="w-5 h-5 text-[hsl(var(--foreground))]" />
          )}
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[hsl(var(--foreground))]">MindForge</span>
        </Link>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "w-[72px]" : "w-64"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(var(--sidebar-border))]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-[hsl(var(--sidebar-foreground))] text-lg">
                MindForge
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 text-[hsl(var(--foreground-muted))] transition-transform ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {/* Main Links */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <span className="px-3 text-xs font-medium text-[hsl(var(--foreground-subtle))] uppercase tracking-wider">
                Menu
              </span>
            )}
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                    ${
                      isActive
                        ? "bg-[hsl(var(--primary))] text-white"
                        : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-foreground))]"
                    }
                    ${sidebarCollapsed ? "justify-center" : ""}
                  `}
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-[hsl(var(--sidebar-border))]" />

          {/* Secondary Links */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <span className="px-3 text-xs font-medium text-[hsl(var(--foreground-subtle))] uppercase tracking-wider">
                Support
              </span>
            )}
            {secondaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                    ${
                      isActive
                        ? "bg-[hsl(var(--primary))] text-white"
                        : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-foreground))]"
                    }
                    ${sidebarCollapsed ? "justify-center" : ""}
                  `}
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[hsl(var(--sidebar-border))]">
          <div
            className={`
              flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] transition-colors
              ${sidebarCollapsed ? "justify-center" : ""}
            `}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] truncate">
                  {userName || "User"}
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))] truncate">
                  View profile
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"}
          pt-16 lg:pt-0
        `}
      >
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] items-center justify-between px-6">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--foreground-muted))]" />
              <input
                type="text"
                placeholder="Search companions, sessions..."
                className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--background-secondary))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.1)] transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
              <Bell className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
            </button>
            <div className="h-6 w-px bg-[hsl(var(--border))]" />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
