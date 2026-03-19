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
        className="flex items-center gap-2 cursor-pointer group"
        onClick={scrollToTop}
      >
        <div className="relative w-7 h-7">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-accent/12 stroke-accent stroke-[1.4px]">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
          <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full fill-none stroke-accent stroke-[1.5px] scale-50 translate-y-0.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-[17px] font-800 text-accent tracking-[2px]">CYPHER</span>
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
