"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";


interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-[100] h-[58px] bg-bg/93 backdrop-blur-md border-b border-white/6 px-6 flex items-center justify-between">
      {/* LEFT - Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={scrollToTop}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-accent/30 transition-all">
          <img 
            src="/cypher_logo.jpeg" 
            alt="Cypher Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[17px] font-800 text-accent tracking-[2px] font-display">CYPHER</span>
      </div>

      {/* RIGHT - Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        {["HOME", "SCANNER", "HEATMAP", "BOT"].map((item) => (
          <Link
            key={item}
            href={
              item === "HOME" ? "/" : 
              item === "SCANNER" ? "https://url-phishing-ten.vercel.app/" : 
              `/${item.toLowerCase()}`
            }
            target={item === "SCANNER" ? "_blank" : undefined}
            rel={item === "SCANNER" ? "noopener noreferrer" : undefined}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
              item === "HOME" ? "text-accent bg-surface2/50" : "text-muted hover:bg-surface2 hover:text-text"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
