"use client";
import React from "react";
import { motion } from "framer-motion";
import RadarEffect from "@/components/ui/RadarEffect";

const features = [
  {
    title: "URL Structure Analysis",
    desc: "Detects IP hostnames, encoding tricks, @ symbol abuse, excess subdomains, redirect chains. All decoded before any request fires.",
    color: "text-accent",
    bgColor: "bg-accent-dim border-accent/20",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    )
  },
  {
    title: "Domain Intelligence",
    desc: "WHOIS + RDAP lookup. Domains under 30 days old are statistically the strongest single phishing signal we measure.",
    color: "text-warning",
    bgColor: "bg-warning-dim border-warning/20",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    title: "3-Layer Blacklist Check",
    desc: "Google Safe Browsing → PhishDestroy → OpenPhish feed. Any single match = instant Phishing verdict, no further analysis.",
    color: "text-danger",
    bgColor: "bg-danger-dim border-danger/20",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    )
  },
  {
    title: "HTML Content Scanner",
    desc: "Inspects the page DOM for password fields, hidden iframes, external form targets, and brand title spoofing.",
    color: "text-purple",
    bgColor: "bg-purple-dim border-purple/20",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-surface/20 border-y border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* LEFT COLUMN - TEXT */}
        <div className="flex flex-col items-start">
          <span className="section-tag text-accent/80 mb-3">HOW IT WORKS</span>
          <h2 className="text-3xl lg:text-4xl font-800 text-text mb-6">
            Six detection layers. <br /> One clear answer.
          </h2>
          <p className="text-muted max-w-[440px] leading-relaxed mb-12">
            Every URL passes through six parallel modules. Each looks for a different signal. Together they build a complete threat picture.
          </p>

          <div className="space-y-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${item.bgColor} group-hover:scale-110`}>
                  <div className={item.color}>{item.icon}</div>
                </div>
                <div>
                  <h3 className="text-[15px] font-700 text-text mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-muted leading-relaxed max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - RADAR */}
        <div className="flex flex-col items-center">
          <RadarEffect />
          <p className="mt-8 text-center text-[12px] font-mono text-danger tracking-tight animate-pulse">
            312 THREATS DETECTED THIS WEEK
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
