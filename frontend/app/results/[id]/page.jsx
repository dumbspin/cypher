"use client";

/**
 * Results page (/results/[id]) — displays the full scan analysis for a given scan ID.
 *
 * Data is passed via search params (from the homepage redirect) to avoid a second
 * HTTP request. If the user navigates directly, the page shows an error state.
 *
 * Components rendered:
 * - RiskMeter (doughnut chart)
 * - ClassificationBadge (Safe / Suspicious / Phishing / Blacklisted)
 * - URL display (original and normalised if different)
 * - DetectionBreakdown (grouped reasons)
 * - TechnicalDetails (collapsible WHOIS)
 * - ScreenshotPreview (iframe screenshot)
 * - "Scan Another" button
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import RiskMeter from "../../../components/RiskMeter";
import ClassificationBadge from "../../../components/ClassificationBadge";
import DetectionBreakdown from "../../../components/DetectionBreakdown";
import TechnicalDetails from "../../../components/TechnicalDetails";
import ScreenshotPreview from "../../../components/ScreenshotPreview";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (!raw) {
      setParseError(true);
      return;
    }
    try {
      setResult(JSON.parse(decodeURIComponent(raw)));
    } catch {
      setParseError(true);
    }
  }, [searchParams]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (!result && !parseError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {[200, 120, 300, 180].map((w, i) => (
          <div key={i} className="skeleton h-6 rounded-lg" style={{ width: `${w}px`, maxWidth: "100%" }} />
        ))}
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (parseError || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-3">Scan not found</h1>
        <p className="text-text-muted mb-6">
          This scan result could not be loaded. Please run a new scan.
        </p>
        <Link href="/" className="btn-primary">
          ← Scan a URL
        </Link>
      </div>
    );
  }

  const {
    url,
    normalized_url,
    risk_score,
    raw_score,
    classification,
    reasons,
    domain_info,
    screenshot_url,
    cached,
    blacklisted,
    error: scanError,
  } = result;

  const urlsDiffer = url !== normalized_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-10 space-y-6"
    >
      {/* ── Top section: score + classification ─────────────────────── */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Risk meter */}
          <div className="shrink-0">
            <RiskMeter score={risk_score} />
            {raw_score > 100 && (
              <p className="text-center text-text-muted text-xs mt-2">
                Raw score: {raw_score} (capped at 100)
              </p>
            )}
          </div>

          {/* Classification + URL info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Classification</p>
              <ClassificationBadge classification={classification} blacklisted={blacklisted} />
            </div>

            {/* Scanned URL */}
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Scanned URL</p>
              <p className="font-mono text-sm text-text-primary break-all bg-background/60 border border-border/60 rounded-lg px-3 py-2">
                {url}
              </p>
            </div>

            {/* Normalised URL (show only if different) */}
            {urlsDiffer && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  Redirected to
                </p>
                <p className="font-mono text-sm text-warning break-all bg-warning/5 border border-warning/20 rounded-lg px-3 py-2">
                  {normalized_url}
                </p>
              </div>
            )}

            {/* Cached notice */}
            {cached && (
              <p className="text-text-muted text-xs flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c9 0 10-8 10-8"/>
                </svg>
                Result served from cache
              </p>
            )}

            {/* Scan error notice */}
            {scanError && (
              <p className="text-danger text-xs bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                Note: {scanError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Detection breakdown ───────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <DetectionBreakdown reasons={reasons} />
      </motion.div>

      {/* ── Technical details ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <TechnicalDetails domainInfo={domain_info} />
      </motion.div>

      {/* ── Screenshot ────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <ScreenshotPreview screenshotUrl={screenshot_url} targetUrl={normalized_url} />
      </motion.div>

      {/* ── Footer actions ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex items-center justify-center pt-4"
      >
        <Link href="/" className="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Scan Another URL
        </Link>
      </motion.div>
    </motion.div>
  );
}
