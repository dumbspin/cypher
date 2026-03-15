"use client";

/**
 * RiskMeter — animated Chart.js doughnut chart that displays the risk score.
 *
 * - Doughnut ring colour transitions green → amber → red based on score
 * - Centre text counts up from 0 to final score over 1.2 seconds
 * - Animates on mount using Framer Motion
 */

import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";
import { scoreToHex } from "../utils/api";

// Register only the elements we need to keep bundle size small.
ChartJS.register(ArcElement, Tooltip);

/**
 * Linear interpolation between two hex colours based on a 0–1 ratio.
 * Used to smoothly blend between green, amber, and red.
 */
function lerp(a, b, t) {
  const hA = parseInt(a.slice(1), 16);
  const hB = parseInt(b.slice(1), 16);
  const rA = (hA >> 16) & 0xff, gA = (hA >> 8) & 0xff, bA = hA & 0xff;
  const rB = (hB >> 16) & 0xff, gB = (hB >> 8) & 0xff, bB = hB & 0xff;
  const r = Math.round(rA + (rB - rA) * t);
  const g = Math.round(gA + (gB - gA) * t);
  const b2 = Math.round(bA + (bB - bA) * t);
  return `#${((r << 16) | (g << 8) | b2).toString(16).padStart(6, "0")}`;
}

export default function RiskMeter({ score }) {
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  // Count-up animation from 0 to final score over 1200ms.
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const target = Math.min(score, 100);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(target * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const colour = scoreToHex(score);
  const remainColour = "rgba(30,45,69,0.6)";

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [colour, remainColour],
        borderWidth: 0,
        circumference: 270,
        rotation: -135,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: { tooltip: { enabled: false } },
    animation: { duration: 1200, easing: "easeOutCubic" },
  };

  const label =
    score < 30 ? "Safe" : score < 60 ? "Suspicious" : "Phishing";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative w-48 h-48">
        <Doughnut data={data} options={options} />

        {/* Centre overlay: score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color: colour, textShadow: `0 0 20px ${colour}55` }}
          >
            {displayScore}
          </span>
          <span className="text-text-muted text-sm mt-0.5">/ 100</span>
          <span
            className="text-xs font-semibold uppercase tracking-widest mt-1"
            style={{ color: colour }}
          >
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
