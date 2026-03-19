"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import UttarakhandThreatMap from "./UttarakhandThreatMap";


const ZonePreviewSection: React.FC = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-bg flex flex-col">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
        <div className="max-w-[500px]">
          <span className="section-tag text-danger/80 mb-3">SENTINEL GRID — LIVE</span>
          <h2 className="text-3xl lg:text-4xl font-800 text-text mb-4">
            Uttarakhand divided into threat zones
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            13 districts categorised into 4 zones based on scam type, volume, and threat pattern. Updated in real time from web and WhatsApp bot reports across the state.
          </p>
        </div>
        <Link href="/heatmap">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 border border-border text-accent font-bold text-sm rounded-xl hover:bg-accent-dim transition-all"
          >
            View Full Heatmap <span className="text-lg">→</span>
          </motion.button>
        </Link>
      </div>

      <div className="w-full">
        <UttarakhandThreatMap />
      </div>
    </section>
  );
};

export default ZonePreviewSection;
