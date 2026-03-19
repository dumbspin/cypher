"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Components
import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import TrustLogos from "@/components/landing/TrustLogos";
import ScanSection from "@/components/landing/ScanSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ZonePreviewSection from "@/components/landing/ZonePreviewSection";
import ReportSection from "@/components/landing/ReportSection";
import FooterSection from "@/components/landing/FooterSection";

export default function LandingPage() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col w-full"
    >
      {/* Navigation Layer */}
      <NavBar />

      {/* Hero Section */}
      <HeroSection 
        onScanClick={() => scrollToSection("scanner")} 
      />

      {/* Trust & Verification Feed */}
      <TrustLogos />

      {/* Core Interaction - Link Scanner */}
      <ScanSection />

      {/* Technical Deep Dive */}
      <HowItWorksSection />

      {/* Geographical Threat Intelligence */}
      <ZonePreviewSection />

      {/* Community Reporting Engine */}
      <ReportSection />

      {/* Global Footer */}
      <FooterSection />

      
    </motion.main>
  );
}
