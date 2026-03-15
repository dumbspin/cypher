"use client";

/**
 * DetectionBreakdown — displays all triggered detection reasons grouped by module.
 *
 * Each reason shows:
 * - Module name (e.g. "URL Analysis", "Domain Intelligence")
 * - Human-readable reason text
 * - Score contribution as a coloured badge
 *
 * Cards stagger into view using Framer Motion.
 */

import { motion } from "framer-motion";

const MODULE_ICONS = {
  "URL Analysis": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  "Domain Intelligence": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  ),
  "Content Analysis": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Blacklist: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

function ScoreBadge({ score }) {
  const colour =
    score <= 10
      ? "text-warning bg-warning/10 border-warning/20"
      : score <= 20
      ? "text-warning bg-warning/15 border-warning/30"
      : "text-danger bg-danger/10 border-danger/20";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${colour}`}>
      +{score}
    </span>
  );
}

export default function DetectionBreakdown({ reasons }) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="card">
        <h3 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          Detection Results
        </h3>
        <p className="text-text-muted text-sm text-center py-4">
          No suspicious indicators detected.
        </p>
      </div>
    );
  }

  // Group reasons by module
  const grouped = reasons.reduce((acc, r) => {
    if (!acc[r.module]) acc[r.module] = [];
    acc[r.module].push(r);
    return acc;
  }, {});

  return (
    <div className="card">
      <h3 className="text-text-primary font-semibold mb-5 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        Detection Breakdown
        <span className="ml-auto badge-phishing py-0.5 px-2 text-xs normal-case tracking-normal font-medium">
          {reasons.length} trigger{reasons.length !== 1 ? "s" : ""}
        </span>
      </h3>

      <div className="space-y-5">
        {Object.entries(grouped).map(([module, items], moduleIdx) => (
          <motion.div
            key={module}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIdx * 0.1, duration: 0.3 }}
          >
            {/* Module header */}
            <div className="flex items-center gap-2 mb-2.5 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <span className="text-accent">{MODULE_ICONS[module] || null}</span>
              {module}
            </div>

            {/* Reason rows */}
            <div className="space-y-2">
              {items.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: moduleIdx * 0.1 + idx * 0.06 }}
                  className="flex items-start justify-between gap-3 bg-background/50 border border-border/60 rounded-lg px-3 py-2.5"
                >
                  <p className="text-text-primary text-sm leading-relaxed flex-1">
                    {/* Strip the trailing (+N) from the reason since we show the badge */}
                    {reason.reason.replace(/\s*\(\+\d+\)$/, "")}
                  </p>
                  <ScoreBadge score={reason.score} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
