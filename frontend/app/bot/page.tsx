"use client";
import React from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import FeatureCardsSection from "@/components/landing/FeatureCardsSection";
import AdvisoriesSection from "@/components/landing/AdvisoriesSection";

export default function BotPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col w-full min-h-screen"
    >
      <NavBar />
      
      <div className="flex-1 pt-20">
        <FeatureCardsSection />
        <AdvisoriesSection />
      </div>

      <FooterSection />
    </motion.main>
  );
}
