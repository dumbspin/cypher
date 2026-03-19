"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/82 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="relative w-full max-w-[380px] bg-surface border border-accent/18 rounded-3xl p-10 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Logo */}
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 mb-4">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-accent/20 stroke-accent stroke-[1.5px]">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              </svg>
            </div>

            <h2 className="text-[22px] font-800 text-accent tracking-[2px] text-center mb-1">
              CYPHER
            </h2>
            <p className="text-[13px] text-muted text-center mb-7">
              Authority Login — Sentinel Grid
            </p>

            <div className="w-full space-y-3 mb-5">
              <input
                type="email"
                placeholder="Authority Email"
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[13px] text-text outline-none focus:border-accent/35 transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-3.5 text-[13px] text-text outline-none focus:border-accent/35 transition-all"
              />
            </div>

            <button className="w-full bg-accent text-bg font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
              Authenticate
            </button>

            <p className="text-[11px] text-muted text-center mt-5 leading-relaxed">
              Verified authority accounts receive live district threat alerts and full Sentinel Grid write access.
            </p>

            <button 
              onClick={onClose}
              className="mt-6 text-[13px] text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
