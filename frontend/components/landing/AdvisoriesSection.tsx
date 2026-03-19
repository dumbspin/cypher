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
    <section className="py-24 px-8 lg:px-16 bg-bg">
      <div className="flex justify-between items-center mb-10">
        <div>
          <span className="section-tag text-accent/80 mb-2">LIVE ALERTS</span>
          <h2 className="text-3xl font-800 text-text">Active threat advisories</h2>
        </div>
        <button className="px-5 py-2.5 rounded-xl border border-border text-muted text-sm font-bold hover:border-accent/35 hover:text-accent transition-all">
          View All Advisories →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advisories.map((ad, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className={`card-style p-6 border-t-4 ${
              ad.color === "danger" ? "border-t-danger" : 
              ad.color === "warning" ? "border-t-warning" : "border-t-purple"
            }`}
          >
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block mb-3 ${ad.dim}`}>
              {ad.severity}
            </span>
            <h3 className="text-[14px] font-bold text-text leading-tight mb-3">
              {ad.title}
            </h3>
            <p className="text-[12px] text-muted leading-relaxed mb-5">
              {ad.desc}
            </p>
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
              <span className="bg-surface2 px-2 py-0.5 rounded text-[10px] font-bold text-muted/60">
                {ad.districts}
              </span>
              <span className="text-[10px] font-bold text-muted/40 uppercase">
                {ad.count}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AdvisoriesSection;
