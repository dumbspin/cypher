"use client";

/**
 * Homepage (/) — hero landing page with URL scanner.
 * Redesigned to match Karla-style lavender gradient landing page.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UrlInput from "../components/UrlInput";
import ShaderDemo from "../components/ui/ShaderDemo";
import { analyzeUrl } from "../utils/api";

// Skeleton overlay while the backend processes the request
function ScanSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-3" aria-live="polite" aria-label="Scanning URL">
      {[80, 60, 90, 50].map((w, i) => (
        <div key={i} className="skeleton h-4 rounded-full" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

// Integration brand logos strip
const INTEGRATIONS = [
  { name: "VirusTotal", style: "font-black tracking-tight italic" },
  { name: "PhishTank", style: "font-bold tracking-widest uppercase" },
  { name: "URLScan", style: "font-extrabold tracking-tight" },
  { name: "AbuseIPDB", style: "font-bold italic" },
  { name: "Whois", style: "font-black tracking-wider" },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState("");

  async function handleScan(url) {
    setLoading(true);
    setScanError("");
    try {
      const result = await analyzeUrl(url);
      router.push(`/results/${result.scan_id}?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (err) {
      setScanError(err.message || "Scan failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col overflow-x-hidden">

      {/* ── Shader Background ── */}
      <ShaderDemo />

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-start px-4 pt-10 sm:pt-14 pb-12 text-center">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-success/30 bg-success/10 text-success text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live Phishing Detection
          </div>
        </motion.div>

        {/* Headline — mixed serif/sans like Karla reference */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-tight mb-4 max-w-3xl"
        >
          Detect, Analyse,{" "}
          <br className="hidden sm:block" />
          <em className="font-serif font-bold not-italic text-accent">
            Stay Safe
          </em>{" "}
          with AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-text-muted text-base sm:text-lg max-w-md mb-10 leading-relaxed"
        >
          Instant phishing detection — URL analysis, domain intelligence,
          and live blacklist checks in one scan.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-4 mb-12"
        >
          <a href="#scan-input" className="btn-primary text-base px-8 py-3.5">
            Scan a URL
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base px-6 py-3.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            How it Works
          </a>
        </motion.div>

        {/* ── Floating URL input card ── */}
        <motion.div
          id="scan-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="card shadow-card">
            <UrlInput onSubmit={handleScan} loading={loading} />
          </div>
        </motion.div>

        {/* Skeleton loader */}
        {loading && <ScanSkeleton />}

        {/* Scan error */}
        {scanError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-danger text-sm max-w-md"
            role="alert"
          >
            {scanError}
          </motion.p>
        )}

        {/* ── Integrations strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 w-full max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border-solid opacity-60" />
            <p className="text-text-muted text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
              Powered by trusted intelligence sources
            </p>
            <div className="flex-1 h-px bg-border-solid opacity-60" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {INTEGRATIONS.map((brand) => (
              <span
                key={brand.name}
                className={`text-text-muted text-lg opacity-60 hover:opacity-90 transition-opacity ${brand.style}`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
