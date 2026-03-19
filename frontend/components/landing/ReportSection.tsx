"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const districts = [
  "Dehradun", "Haridwar", "Tehri Garhwal", "Uttarkashi", "Almora", 
  "Nainital", "Udham Singh Nagar", "Pauri Garhwal", "Rudraprayag", 
  "Chamoli", "Bageshwar", "Pithoragarh", "Champawat"
];

const scamTypes = [
  "Fake government scheme", "Char Dham / pilgrimage fraud", 
  "Bank / UPI fraud", "Army / ESM welfare fraud", 
  "Job / employment fraud", "Other"
];

const ReportSection: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState("Web");
  const [reportCount, setReportCount] = useState(1247);

  // Simple live counter simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setReportCount(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="report" className="py-24 px-8 lg:px-16 bg-surface border-y border-border">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start max-w-7xl mx-auto">
        
        {/* LEFT - FORM */}
        <div className="flex flex-col">
          <span className="section-tag text-danger/80 mb-3">REPORT A SCAM</span>
          <h2 className="text-3xl lg:text-4xl font-800 text-text mb-6">
            Help protect your community
          </h2>
          <p className="text-muted max-w-[460px] leading-relaxed mb-10">
            Spotted a suspicious link? Report it to Sentinel Grid. Verified reports update the district threat map and alert the Uttarakhand Cybercrime Cell in real time.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-style p-8 bg-surface2/30 shadow-xl"
          >

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 block">Suspicious URL</label>
                <input 
                  type="text" 
                  placeholder="https://suspicious-site.tk/..."
                  className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[14px] text-text outline-none focus:border-accent/35 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 block">Your District</label>
                  <select className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[14px] text-text outline-none focus:border-accent/35 transition-all appearance-none cursor-pointer">
                    <option value="" disabled selected>Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 block">Scam Type</label>
                  <select className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[14px] text-text outline-none focus:border-accent/35 transition-all appearance-none cursor-pointer">
                    <option value="" disabled selected>Select Scam Type</option>
                    {scamTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3 block">Channel of receiving</label>
                <div className="flex flex-wrap gap-2">
                  {["Web", "WhatsApp", "Telegram", "QR Code / CSC"].map(ch => (
                    <button
                      key={ch}
                      onClick={() => setActiveChannel(ch)}
                      className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all ${
                        activeChannel === ch 
                        ? "bg-accent-dim border-accent/35 text-accent" 
                        : "border-border text-muted hover:border-border2"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 block">Description (optional)</label>
                <textarea 
                  placeholder="How did you receive this link?"
                  className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[14px] text-text outline-none focus:border-accent/35 transition-all h-24 resize-none"
                />
              </div>

              <button className="w-full bg-danger text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-danger/10">
                Submit Report to Sentinel Grid
              </button>

            </div>
          </motion.div>
        </div>

        {/* RIGHT - GLOBE */}
        <div className="flex flex-col items-center sticky top-32">
          <RotatingEarth width={500} height={500} />
          
          <div className="text-center mt-12">
            <p className="text-[12px] text-muted mb-2 tracking-wide uppercase font-bold opacity-60">
              Reports received from 13 districts
            </p>
            <motion.div
              key={reportCount}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-800 text-accent tracking-tighter"
            >
              {reportCount.toLocaleString()}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
