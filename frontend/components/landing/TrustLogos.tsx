"use client";
import React from "react";
import LogosMarquee from "@/components/ui/LogosMarquee";

const TrustLogos: React.FC = () => {
  return (
    <section className="py-12 bg-surface/30 backdrop-blur-sm border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <span className="text-[10px] tracking-[2px] text-muted uppercase font-bold py-2 opacity-60">
            POWERED BY
          </span>
        </div>
        <LogosMarquee />
      </div>
    </section>
  );
};

export default TrustLogos;
