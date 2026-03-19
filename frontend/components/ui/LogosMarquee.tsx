"use client";
import React from "react";

export const LogosMarquee = () => {
  const logos = [
    { name: "VirusTotal", color: "#4B9EF9" },
    { name: "Google SB", color: "#4285F4" },
    { name: "AbuseIPDB", color: "#FF6B35" },
    { name: "PhishDestroy", color: "#00E5FF" },
    { name: "OpenPhish", color: "#FF4C4C" },
    { name: "WHOIS+RDAP", color: "#7B61FF" },
    { name: "Screenshotone", color: "#00C853" },
    { name: "Upstash", color: "#00E5FF" },
  ];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-surface/60 py-3 relative group">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-surface border border-border text-[12px] font-medium text-muted mx-4 hover:border-accent/25 hover:text-text transition-all duration-200 cursor-default"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: logo.color }}
            />
            {logo.name}
          </div>
        ))}
      </div>
      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default LogosMarquee;
