"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScanSection: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    if (!url) return;
    setIsScanning(true);
    setResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      const mockResults = [
        { 
          score: 84, 
          type: "Phishing", 
          color: "text-danger",
          dim: "bg-danger-dim border-danger/25 text-[#ff6b6b]",
          reasons: [
            { text: "Domain registered 3 days ago", impact: "+50" },
            { text: "Suspicious keywords detected", impact: "+20" },
            { text: "HTTP — no encryption", impact: "+15" }
          ]
        },
        { 
          score: 46, 
          type: "Suspicious", 
          color: "text-warning",
          dim: "bg-warning-dim border-warning/25 text-[#ffa733]",
          reasons: [
            { text: "Domain registered 18 days ago", impact: "+35" },
            { text: "Keyword 'verify' in URL", impact: "+10" }
          ]
        },
        { 
          score: 9, 
          type: "Safe", 
          color: "text-success",
          dim: "bg-success-dim border-success/25 text-[#33d66e]",
          reasons: [
            { text: "No suspicious indicators found", impact: "0" }
          ]
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult({ ...randomResult, url });
      setIsScanning(false);
    }, 1500);
  };

  return (
    <section id="scanner" className="py-24 px-8 lg:px-16 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-[700px] card-style p-10 bg-surface/80 shadow-2xl"
      >
        <h2 className="text-2xl font-800 text-text mb-2">Scan any suspicious URL instantly</h2>
        <p className="text-sm text-muted mb-8 max-w-md">
          Paste any link and get a complete risk report in under 4 seconds. No sign-in required.
        </p>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://suspicious-link.tk/verify..."
            className="flex-1 bg-surface2 border border-border rounded-xl px-5 py-3.5 text-[15px] text-text outline-none focus:border-accent/35 transition-all placeholder:text-muted/30"
          />
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-accent text-bg font-bold px-7 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50 min-w-[140px]"
          >
            {isScanning ? (
              <span className="flex items-center gap-1">
                Analysing<span className="animate-pulse">...</span>
              </span>
            ) : (
              "Scan Threat"
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { icon: "Shield", label: "Real-time detection" },
            { icon: "Map", label: "Feeds Sentinel Grid" },
            { icon: "Globe", label: "Web + Bot ecosystem" }
          ].map((tag, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface2 border border-border text-[11px] font-medium text-muted">
              <span className="w-1.5 h-1.5 bg-accent/40 rounded-full" />
              {tag.label}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 border-t border-border pt-8 overflow-hidden"
            >
              <div className="bg-surface2/50 border border-border rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-border">
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Risk Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-800 ${result.color}`}>{result.score}</span>
                      <span className="text-muted/40 text-sm font-bold">/ 100</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border ${result.dim}`}>
                    {result.type} VERDICT
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  {result.reasons.map((reason: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
                      <span className="text-xs text-text/80">{reason.text}</span>
                      <span className={`text-xs font-bold ${reason.impact === "0" ? "text-success" : "text-danger"}`}>
                        {reason.impact === "0" ? "CLEAN" : reason.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ScanSection;
