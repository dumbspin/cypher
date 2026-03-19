"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection: React.FC<{ onScanClick: () => void }> = ({ onScanClick }) => {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 px-8 lg:px-16 pt-32 pb-12 items-center overflow-hidden">
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.14] scale-105"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        {/* VIGNETTE & OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
        <div className="absolute inset-0 bg-bg/20" />
      </div>

      {/* LEFT COLUMN */}
      <div className="relative z-10 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-accent-dim border border-accent/20 rounded-full px-4 py-1.5 text-[10px] font-bold text-accent tracking-[2px] uppercase mb-8"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          SENTINEL GRID — UTTARAKHAND
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl lg:text-[54px] font-800 leading-[1.07] tracking-[-1.5px] max-w-2xl"
        >
          <span className="text-text block">One click can</span>
          <span className="text-white">cost </span>
          <span className="italic text-muted/38">everything.</span>
          <br />
          <span className="text-white">We stop </span>
          <span className="italic text-accent/78">phishing threats.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base lg:text-lg text-muted max-w-[460px] leading-relaxed"
        >
          Cypher is Uttarakhand&apos;s first community-powered phishing detection platform. Scan any link. Report any scam. Protect your district — in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-3 mt-10"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onScanClick}
            className="bg-accent text-bg font-bold text-[15px] px-8 py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
          >
            Start Scanning <span className="text-lg">→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="relative z-10 flex flex-col gap-4">
      </div>
    </section>
  );
};

export default HeroSection;
