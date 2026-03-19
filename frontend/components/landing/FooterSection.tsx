"use client";
import React from "react";
import Link from "next/link";

const FooterSection: React.FC = () => {
  return (
    <footer className="pt-20 pb-10 px-8 lg:px-16 bg-surface border-t border-border mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-16">
        {/* Column 1 - Brand */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-6 pointer-events-none">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-accent/12 stroke-accent stroke-[1.4px]">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              </svg>
            </div>
            <span className="text-[19px] font-800 text-accent tracking-[2px]">CYPHER</span>
          </div>
          <p className="text-[13px] text-muted leading-relaxed max-w-[200px] mb-6">
            Uttarakhand&apos;s first community-powered cyber threat intelligence platform. $0/month infrastructure.
          </p>
          <div className="flex gap-2">
            {["Twitter", "LinkedIn", "Instagram", "Github"].map((social) => (
              <div key={social} className="w-9 h-9 rounded-full bg-surface2 border border-border flex items-center justify-center cursor-pointer hover:border-accent/25 hover:text-accent transition-all text-muted">
                <span className="text-[10px] font-bold">{social[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Platform */}
        <div>
          <h4 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-6 opacity-60">PLATFORM</h4>
          <ul className="space-y-3">
            {["Scanner", "Heatmap", "WhatsApp Bot", "Telegram Bot", "Browser Extension"].map((link) => (
              <li key={link}>
                <Link 
                  href={link === "Scanner" ? "https://url-phishing-ten.vercel.app/" : "#"} 
                  target={link === "Scanner" ? "_blank" : undefined}
                  rel={link === "Scanner" ? "noopener noreferrer" : undefined}
                  className="text-[13px] text-muted hover:text-text transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Community */}
        <div>
          <h4 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-6 opacity-60">COMMUNITY</h4>
          <ul className="space-y-3">
            {["Report Incident", "Advisories", "Sentinel Grid", "Authority Login"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-[13px] text-muted hover:text-text transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 - Resources */}
        <div>
          <h4 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-6 opacity-60">RESOURCES</h4>
          <ul className="space-y-3">
            <li><Link href="https://github.com/dumbspin/url_phishing" className="text-[13px] text-muted hover:text-text transition-colors">GitHub Repository</Link></li>
            <li><Link href="https://url-phishing-ten.vercel.app" className="text-[13px] text-muted hover:text-text transition-colors">Live Site</Link></li>
            {["API Docs", "Privacy Policy", "Terms of Use"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-[13px] text-muted hover:text-text transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-muted/30 font-medium">
        <p>© 2025 Cypher — Sentinel Grid. Built for Uttarakhand.</p>
        <p>Powered by Vercel · Render · Upstash</p>
      </div>
    </footer>
  );
};

export default FooterSection;
