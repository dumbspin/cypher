"use client";
import React from "react";
import { motion } from "framer-motion";
import TelegramBotDemo from "./TelegramBotDemo";

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

        {/* TELEGRAM BOT DEMO */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="flex flex-col items-center justify-center lg:items-end"
        >
          <TelegramBotDemo />
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
