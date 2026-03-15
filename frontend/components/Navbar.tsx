"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Bell, Github } from "lucide-react";
import { AdvisoriesModal } from "./AdvisoriesModal";

export function Navbar() {
  const [showAdvisories, setShowAdvisories] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-accent transition-transform group-hover:scale-110">
              <Shield className="w-5 h-5" strokeWidth={2} fill="rgba(91,91,214,0.15)" />
            </div>
            <span className="font-bold text-base text-text-primary">
              Cy<span className="text-accent">pher</span>
            </span>
          </Link>

          {/* Center nav pill */}
          <nav
            className="hidden sm:flex items-center gap-1 text-sm bg-white/70 backdrop-blur-md border border-border-solid rounded-full px-2 py-1.5 shadow-navbar"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full font-medium text-text-primary hover:bg-accent/10 hover:text-accent transition-all"
            >
              Scanner
            </Link>
            <button
              onClick={() => setShowAdvisories(true)}
              className="px-4 py-1.5 rounded-full font-medium text-text-muted hover:bg-accent/10 hover:text-accent flex items-center gap-1.5 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              Advisories
            </button>
            <a
              href="https://github.com/dumbspin/url_phishing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full font-medium text-text-muted hover:bg-accent/10 hover:text-accent flex items-center gap-1.5 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </nav>

        </div>
      </header>

      <AdvisoriesModal
        isOpen={showAdvisories}
        onClose={() => setShowAdvisories(false)}
      />
    </>
  );
}
