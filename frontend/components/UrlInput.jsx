"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, AlertCircle, Loader2 } from "lucide-react";

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function validateUrl(value) {
    if (!value.trim()) return "Please enter a URL.";
    try {
      const parsed = new URL(
        value.startsWith("http") ? value : `https://${value}`
      );
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return "Only HTTP and HTTPS URLs are supported.";
      }
      if (!parsed.hostname || parsed.hostname.length < 2) {
        return "Please enter a valid URL with a hostname.";
      }
    } catch {
      return "Please enter a valid URL (e.g. https://example.com).";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const normalized = url.trim().startsWith("http")
      ? url.trim()
      : `https://${url.trim()}`;
    const err = validateUrl(url);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }
    setError("");
    onSubmit(normalized);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col sm:flex-row gap-3">
        {/* URL input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Globe className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <input
            ref={inputRef}
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste a URL to scan..."
            className="input-field pl-12 pr-4 h-14 text-base"
            disabled={loading}
            spellCheck={false}
            autoComplete="off"
            maxLength={2048}
          />
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={loading || !url.trim()}
          whileTap={{ scale: 0.98 }}
          className="btn-primary h-14 px-10 text-base font-bold shrink-0 shadow-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-5 h-5" strokeWidth={2.5} />
              Analyze
            </span>
          )}
        </motion.button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex items-center gap-2 text-danger text-sm font-medium px-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
