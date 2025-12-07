"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/forge", label: "Forge" },
  { href: "/journey", label: "My Journey" },
  { href: "/companions", label: "Companions" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="text-gradient">⚡</span>
          <span className="text-gradient font-display text-xl font-bold">
            MindForge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${
                  pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn btn-ghost btn-icon"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <SignedOut>
            <SignInButton>
              <button className="btn btn-secondary">Sign In</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden btn btn-ghost btn-icon"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu open md:hidden">
          <SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 px-4 rounded-lg transition ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground-muted hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
