"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AdvisoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIPS = [
  {
    title: "Check the URL Carefully",
    description: "Phishers use 'look-alike' domains (e.g., faceb00k.com instead of facebook.com). Always double-check the spelling.",
  },
  {
    title: "Beware of Urgency",
    description: "Phishing emails often create a sense of panic ('Account suspended!', 'Unauthorized login!') to rush you into clicking.",
  },
  {
    title: "Verify the Sender",
    description: "Check the actual email address, not just the display name. Official communications come from official domains.",
  },
  {
    title: "Use Multi-Factor Authentication (MFA)",
    description: "Even if a phisher gets your password, MFA provides a critical second layer of defense for your accounts.",
  },
  {
    title: "Don't Trust Public Wi-Fi",
    description: "Avoid logging into sensitive accounts on public networks. They are susceptible to 'man-in-the-middle' attacks.",
  },
];

export function AdvisoriesModal({ isOpen, onClose }: AdvisoriesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Centering wrapper — flexbox centers the modal card perfectly */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface/50">
                  <h2 className="text-xl font-bold text-text-primary">Phishing Advisories</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tips List */}
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                  {TIPS.map((tip, idx) => (
                    <div key={idx} className="group flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-accent/5 border-t border-border text-center">
                  <p className="text-xs text-text-muted">
                    Stay safe out there. Sentinel<span className="text-accent font-semibold">URL</span> is here to help.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
