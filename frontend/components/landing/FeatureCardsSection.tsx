"use client";
import React from "react";
import { motion } from "framer-motion";

const FeatureCardsSection: React.FC = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-surface border-y border-border">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="section-tag text-purple/80 mb-3">EXPAND YOUR PROTECTION</span>
        <h2 className="text-3xl lg:text-4xl font-800 text-text mb-4">
          Available on every platform
        </h2>
        <p className="text-sm text-muted max-w-xl leading-relaxed">
          Cypher runs wherever you are. The same Sentinel Grid intelligence is accessible through the website, WhatsApp, Telegram, and your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* BROWSER EXTENSION */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="card-style p-8 lg:p-10 border-t-4 border-t-accent flex flex-col group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-800 text-accent border border-accent/30">C</div>
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center font-800 text-orange-400 border border-orange-400/30">F</div>
            </div>
            <div className="bg-accent-dim border border-accent/25 text-[#33eeff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              NEW
            </div>
          </div>

          <h3 className="text-xl font-800 text-text mb-4">Browser Extension</h3>
          <p className="text-[13px] text-muted leading-relaxed mb-8">
            Scan any link before you click it. Right-click any URL in Chrome or Firefox to instantly check it with Cypher. The full risk report appears in a popup — no copy-paste, no leaving the page.
          </p>

          <div className="space-y-3 mb-10">
            {[
              "Works on Chrome and Firefox",
              "Right-click context menu integration",
              "Popup result — stay on the page",
              "Reports feed directly into Sentinel Grid"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px] text-muted/80">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {feature}
              </div>
            ))}
          </div>

          <button className="mt-auto w-full bg-accent text-bg font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
            Download Extension →
          </button>
        </motion.div>

        {/* TELEGRAM BOT */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="card-style p-8 lg:p-10 border-t-4 border-t-[#229ED9] flex flex-col group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#229ED9]/20 flex items-center justify-center text-[#229ED9] border border-[#229ED9]/30">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c0 .06.01.13 0 .19z" />
              </svg>
            </div>
            <div className="bg-success-dim border border-success/25 text-[#33d66e] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              LIVE
            </div>
          </div>

          <h3 className="text-xl font-800 text-text mb-4">Telegram Bot</h3>
          <p className="text-[13px] text-muted leading-relaxed mb-8">
            For users who prefer Telegram. Forward any message or link to @CypherSentinel_bot and get a full risk report in seconds. Works in group chats too — protect your whole community.
          </p>

          <div className="space-y-3 mb-7">
            {[
              "No signup required",
              "Hindi and English support",
              "Works in group chats",
              "Feeds Sentinel Grid reports"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px] text-muted/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#229ED9]" />
                {feature}
              </div>
            ))}
          </div>

          <div className="bg-surface2 border border-border rounded-xl px-4 py-3 flex items-center justify-between mb-5">
            <span className="text-[13px] font-mono font-bold text-accent">@CypherSentinel_bot</span>
            <button className="text-[11px] font-bold text-muted hover:text-text transition-colors">Copy</button>
          </div>

          <button className="mt-auto w-full bg-transparent border border-[#229ED9]/40 text-[#229ED9] font-bold py-4 rounded-xl hover:bg-[#229ED9]/10 transition-all">
            Open in Telegram →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
