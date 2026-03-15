"use client";

/**
 * TechnicalDetails — collapsible card showing WHOIS/RDAP domain metadata.
 *
 * Displays: domain name, registrar, creation date, expiry date, country, age in days.
 * Collapsed by default; expands with a smooth Framer Motion animation.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/50 last:border-0">
      <span className="text-text-muted text-sm shrink-0">{label}</span>
      <span className="text-text-primary text-sm font-mono text-right break-all">{value}</span>
    </div>
  );
}

export default function TechnicalDetails({ domainInfo }) {
  const [open, setOpen] = useState(false);

  if (!domainInfo) return null;

  return (
    <div className="card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
        aria-controls="technical-details-body"
        id="technical-details-toggle"
      >
        <span className="font-semibold text-text-primary flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          Technical Details
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted shrink-0"
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="technical-details-body"
            role="region"
            aria-labelledby="technical-details-toggle"
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="mt-4 pt-4 border-t border-border/50">
              <InfoRow label="Domain" value={domainInfo.domain} />
              <InfoRow label="Registrar" value={domainInfo.registrar} />
              <InfoRow label="Creation Date" value={domainInfo.creation_date} />
              <InfoRow label="Expiry Date" value={domainInfo.expiry_date} />
              <InfoRow label="Domain Age" value={domainInfo.age_days != null ? `${domainInfo.age_days} days` : null} />
              <InfoRow label="Country" value={domainInfo.country} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
