"use client";
import React from "react";
import { motion } from "framer-motion";

const advisories = [
  {
    severity: "CRITICAL",
    color: "danger",
    dim: "bg-danger-dim text-[#ff6b6b]",
    title: "Fake Char Dham Yatra Portal — Active Campaign",
    desc: "Multiple domains posing as official registration portals detected, all registered within 7 days. Targeting pilgrims in Haridwar and Rishikesh.",
    districts: "Haridwar · Rishikesh",
    count: "47 reports"
  },
  {
    severity: "CRITICAL",
    color: "danger",
    dim: "bg-danger-dim text-[#ff6b6b]",
    title: "PMAY Scheme Fraud — 3-District Campaign",
    desc: "Coordinated attack impersonating PM Awas Yojana portal. Same IP infrastructure across 3 domains. Harvesting Aadhaar and bank details.",
    districts: "Dehradun · Pauri · Almora",
    count: "31 reports"
  },
  {
    severity: "HIGH",
    color: "warning",
    dim: "bg-warning-dim text-[#ffa733]",
    title: "Army Welfare / ECHS Impersonation Links",
    desc: "Links posing as ECHS health scheme circulating in ex-army WhatsApp groups across Pauri district. Targets pension and benefit recipients.",
    districts: "Pauri · Lansdowne",
    count: "18 reports"
  },
  {
    severity: "HIGH",
    color: "warning",
    dim: "bg-warning-dim text-[#ffa733]",
    title: "Fake SBI KYC Update Portal",
    desc: "Page mimicking SBI net banking KYC flow on .tk domain registered 4 days ago. Form action submits credentials to overseas server.",
    districts: "Nainital · Haldwani",
    count: "24 reports"
  },
  {
    severity: "MEDIUM",
    color: "purple",
    dim: "bg-purple-dim text-[#9d82ff]",
    title: "Kedarnath Helicopter Booking Fraud",
    desc: "Fake booking portals for Kedarnath route. Seasonal campaign expected to intensify as yatra season approaches. Watch for new domains.",
    districts: "Rudraprayag · Gaurikund",
    count: "11 reports"
  },
  {
    severity: "MEDIUM",
    color: "purple",
    dim: "bg-purple-dim text-[#9d82ff]",
    title: "PM Kisan Verification Scam",
    desc: "Fraudulent links claiming farmers must re-verify Aadhaar for PM Kisan installment. Spreading through rural WhatsApp groups.",
    districts: "Chamoli · Bageshwar · Champawat",
    count: "9 reports"
  }
];

const AdvisoriesSection: React.FC = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-bg border-t border-white/5">
      {/* NEWSPAPER MASTHEAD */}
      <div className="flex flex-col items-center mb-16 border-b-2 border-text/10 pb-8">
        <div className="flex w-full justify-between items-end mb-4 font-mono text-[9px] text-muted/30 uppercase tracking-[3px]">
          <span>Vol. 01 — No. 04</span>
          <span>Friday, March 19, 2026</span>
          <span>Sentinel Grid Edition</span>
        </div>
        <h2 className="text-5xl lg:text-7xl font-serif font-900 text-text tracking-tight mb-2 italic">
          The Cypher Gazette
        </h2>
        <div className="w-full border-t border-text/20 pt-4 flex justify-center">
          <span className="section-tag text-accent font-bold">LATEST CYBER THREAT ADVISORIES — UTTARAKHAND</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
        {advisories.map((ad, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className={`flex flex-col relative ${
              i % 3 !== 2 ? "lg:border-r lg:border-white/5 lg:pr-10" : ""
            } ${
              i % 2 !== 1 ? "md:border-r md:border-white/5 md:pr-6 lg:md:pr-10" : "md:border-r-0"
            } ${
              i % 3 === 2 ? "lg:border-r-0" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold tracking-wider uppercase ${ad.dim}`}>
                {ad.severity} ALERT
              </span>
              <span className="font-mono text-[10px] text-muted/30 uppercase">
                ID: CPH-{1024 + i}
              </span>
            </div>

            <h3 className="text-2xl font-serif font-800 text-text leading-[1.2] mb-4 hover:text-accent transition-colors cursor-pointer">
              {ad.title}
            </h3>

            <p className="text-[13px] text-muted/80 leading-relaxed mb-6 text-justify lg:text-left font-sans">
              <span className="text-2xl font-serif float-left mr-2 leading-none mt-1 text-accent capitalize">{ad.desc.charAt(0)}</span>
              {ad.desc.slice(1)}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-accent/60 uppercase tracking-wider">
                   Target Areas
                </span>
                <span className="font-mono text-[10px] text-muted/40 uppercase">
                  {ad.count}
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-muted/50 leading-tight">
                {ad.districts}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 pt-8 border-t-2 border-text/10 flex justify-center">
        <button className="group flex flex-col items-center gap-3">
          <span className="font-serif italic text-xl text-muted hover:text-accent transition-all">
            Read all archived advisories
          </span>
          <div className="w-12 h-[1px] bg-accent/30 group-hover:w-24 transition-all" />
        </button>
      </div>
    </section>
  );
};

export default AdvisoriesSection;
