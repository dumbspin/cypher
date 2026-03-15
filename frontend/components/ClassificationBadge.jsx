"use client";

/**
 * ClassificationBadge — renders Safe / Suspicious / Phishing + optional Blacklisted pill badges.
 *
 * Each badge has a coloured background, border, and icon for quick visual recognition.
 */

import { motion } from "framer-motion";

const BADGE_CONFIG = {
  Safe: {
    className: "badge-safe",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
  },
  Suspicious: {
    className: "badge-suspicious",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
  },
  Phishing: {
    className: "badge-phishing",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
};

export default function ClassificationBadge({ classification, blacklisted }) {
  const config = BADGE_CONFIG[classification] || BADGE_CONFIG.Safe;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-wrap items-center gap-2"
    >
      {/* Primary classification badge */}
      <span className={config.className}>
        {config.icon}
        {classification}
      </span>

      {/* Secondary blacklisted badge (shown in addition to classification) */}
      {blacklisted && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="badge-blacklisted"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          Blacklisted
        </motion.span>
      )}
    </motion.div>
  );
}
