"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const botAvatar = (
  <div className="w-[26px] h-[26px] rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 self-end">
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L13.5 4.5V9C13.5 12 9 14.5 9 14.5C9 14.5 4.5 12 4.5 9V4.5L9 2Z" stroke="#f4b430" strokeWidth="1.2" fill="none"/>
      <path d="M7 9L8.5 10.5L11 7.5" stroke="#f4b430" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const steps = [
  {
    input: "/start",
    messages: [
      { from: "user", text: "/start", time: "9:38" },
      {
        from: "bot",
        time: "9:38",
        html: (
          <>
            <div className="text-[13px] font-medium text-[#f4b430] mb-1.5 flex items-center gap-1.5 font-display">
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L13.5 4.5V9C13.5 12 9 14.5 9 14.5C9 14.5 4.5 12 4.5 9V4.5L9 2Z" stroke="#f4b430" strokeWidth="1.5" fill="none"/>
                <path d="M7 9L8.5 10.5L11 7.5" stroke="#f4b430" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cypher Suraksha
            </div>
            <div className="text-[11px] text-white/65 leading-relaxed mb-2.5">
              Uttarakhand&apos;s phishing shield. Send me any suspicious link and I&apos;ll analyse it instantly — or report a scam you&apos;ve seen.
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="bg-[#2b5278]/25 border border-[#2b5278]/50 rounded-lg p-2 text-[10px] text-[#5ba4d4]">
                <strong className="block text-[11px] text-white mb-0.5">/scan</strong> Analyse a URL for threats
              </div>
              <div className="bg-[#2b5278]/25 border border-[#2b5278]/50 rounded-lg p-2 text-[10px] text-[#5ba4d4]">
                <strong className="block text-[11px] text-white mb-0.5">/report</strong> Report a scam or fraud
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  {
    input: "/scan https://paypal-verify-in.net/login",
    messages: [
      { from: "user", text: "/scan https://paypal-verify-in.net/login", time: "9:40" },
      {
        from: "bot",
        time: "9:40",
        html: (
          <>
            <div className="text-[11px] text-white/50 mb-1.5">Analysing URL...</div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 animate-spin">
                <circle cx="6" cy="6" r="5" stroke="rgba(244,180,48,0.2)" strokeWidth="1.5"/>
                <path d="M6 1C3.2 1 1 3.2 1 6" stroke="#f4b430" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] text-[#f4b430]">Checking 12 threat databases</span>
            </div>
            <div className="flex gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-[#f4b430] opacity-20 animate-pulse" />
               <span className="w-1.5 h-1.5 rounded-full bg-[#f4b430] opacity-20 animate-pulse delay-75" />
               <span className="w-1.5 h-1.5 rounded-full bg-[#f4b430] opacity-20 animate-pulse delay-150" />
            </div>
          </>
        ),
      },
    ],
  },
  {
    input: "/scan https://paypal-verify-in.net/login",
    messages: [
      { from: "user", text: "/scan https://paypal-verify-in.net/login", time: "9:40" },
      {
        from: "bot",
        time: "9:40",
        html: (
          <div className="bg-[#0f1923] border border-[#f4b430]/25 rounded-[10px] p-2.5 mt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#3d0f0f] border border-[#e24b4a]/40 rounded-md px-2 py-1 mb-2">
              <div className="w-1 h-1 rounded-full bg-[#e24b4a]" />
              <span className="text-[10px] font-medium text-[#e24b4a] tracking-wider uppercase">PHISHING DETECTED</span>
            </div>
            <div className="text-[10px] text-white/40 font-mono mb-2 break-all">paypal-verify-in.net/login</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Risk score</span><span className="text-[10px] font-medium text-[#e24b4a]">96 / 100</span></div>
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Domain age</span><span className="text-[10px] font-medium text-[#f4b430]">3 days old</span></div>
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Mimics</span><span className="text-[10px] font-medium text-[#e24b4a]">PayPal India</span></div>
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">SSL cert</span><span className="text-[10px] font-medium text-[#f4b430]">Self-signed</span></div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-white/35 leading-tight">
              Do not enter credentials. Reported to Cypher Grid — Uttarakhand.
            </div>
          </div>
        ),
      },
    ],
  },
  {
    input: "/scan https://digilocker.gov.in",
    messages: [
      { from: "user", text: "/scan https://digilocker.gov.in", time: "9:41" },
      {
        from: "bot",
        time: "9:41",
        html: (
          <div className="bg-[#0f1923] border border-[#1d9e75]/25 rounded-[10px] p-2.5 mt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#0a2218] border border-[#1d9e75]/40 rounded-md px-2 py-1 mb-2">
              <div className="w-1 h-1 rounded-full bg-[#1d9e75]" />
              <span className="text-[10px] font-medium text-[#1d9e75] tracking-wider uppercase">VERIFIED SAFE</span>
            </div>
            <div className="text-[10px] text-white/40 font-mono mb-2 break-all">digilocker.gov.in</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Risk score</span><span className="text-[10px] font-medium text-[#1d9e75]">2 / 100</span></div>
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Domain age</span><span className="text-[10px] font-medium text-[#1d9e75]">11 years</span></div>
              <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Category</span><span className="text-[10px] font-medium text-[#1d9e75]">Govt of India</span></div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-[#1d9e75] leading-tight">
              Official Government of India site. Safe to use.
            </div>
          </div>
        )
      }
    ]
  },
  {
    input: "/report",
    messages: [
      { from: "user", text: "/report", time: "9:43" },
      {
        from: "bot",
        time: "9:43",
        html: (
          <>
            <div className="text-[11px] text-white/70 leading-relaxed mb-2">
              Please share the scam details. You can send:
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
               {[
                 "A suspicious URL or phone number",
                 "A screenshot of the scam message",
                 "A brief description of what happened"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-2 text-[11px] text-white/60">
                   <div className="w-[18px] h-[18px] rounded-full bg-[#f4b430]/15 border border-[#f4b430]/30 flex items-center justify-center flex-shrink-0 text-[9px] text-[#f4b430] font-bold">{i+1}</div>
                   {text}
                 </div>
               ))}
            </div>
            <div className="text-[10px] text-white/30 pt-1.5 border-t border-white/10">Your report helps protect all of Uttarakhand.</div>
          </>
        )
      },
      { from: "user", text: "Got a fake KYC message from sbi-kyc-update.co.in — asking for Aadhaar + OTP", time: "9:44" },
      {
        from: "bot",
        time: "9:44",
        html: (
          <div className="bg-[#101e14] border border-[#1d9e75]/30 rounded-[10px] p-2.5 mt-1">
            <div className="text-[11px] font-medium text-[#1d9e75] mb-1.5 font-display flex items-center gap-1.5">
               <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#1d9e75" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
               Report received
            </div>
            <div className="flex justify-between py-1 border-b border-white/5"><span className="text-[10px] text-white/40">URL flagged</span><span className="text-[10px] font-medium text-[#e24b4a]">sbi-kyc-update.co.in</span></div>
            <div className="flex justify-between py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Scam type</span><span className="text-[10px] font-medium text-white">KYC / Aadhaar fraud</span></div>
            <div className="flex justify-between py-1 border-b border-white/5"><span className="text-[10px] text-white/40">Added to</span><span className="text-[10px] font-medium text-[#1d9e75]">Cypher Grid</span></div>
            <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] text-white/30">
              Thank you. This will be reviewed and shared with cybercrime authorities.
            </div>
          </div>
        )
      }
    ]
  }
];

const TelegramBotDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex flex-col items-center bg-[#0d1117] p-9 lg:p-12 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
      {/* LABEL ROW */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1d9e75] animate-pulse" />
        <a 
          href="https://t.me/cyphersuraksha_bot" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-[#f4b430]/15 border border-[#f4b430]/30 rounded-full px-3.5 py-1 text-[11px] font-medium text-[#f4b430] tracking-wider uppercase hover:bg-[#f4b430]/25 transition-all"
        >
          @cyphersuraksha_bot
        </a>
      </div>

      {/* PHONE FRAME */}
      <div className="w-[300px] bg-[#1a1a1e] rounded-[44px] border-2 border-[#2e2e36] relative overflow-hidden shadow-2xl">
        {/* PHYSICAL BUTTONS */}
        <div className="absolute left-[-3px] top-[88px] w-[3px] height-[30px] bg-[#2e2e36] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[126px] w-[3px] height-[30px] bg-[#2e2e36] rounded-l-sm" />
        <div className="absolute right-[-3px] top-[108px] w-[3px] height-[44px] bg-[#2e2e36] rounded-r-sm" />
        
        {/* NOTCH Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-[#1a1a1e] rounded-b-[18px] z-20">
           <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[28px] h-[9px] bg-[#0d0d0f] rounded-full" />
        </div>

        {/* SCREEN */}
        <div className="h-[600px] flex flex-col pt-7 bg-[#17212b]">
          {/* STATUS BAR */}
          <div className="flex justify-between items-center px-5 py-1.5 text-[11px] font-medium text-white/70">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x="0" y="3" width="3" height="7" rx="1" fill="currentColor"/><rect x="4" y="2" width="3" height="8" rx="1" fill="currentColor"/><rect x="8" y="1" width="3" height="9" rx="1" fill="currentColor"/><rect x="12" y="0" width="2" height="10" rx="1" fill="currentColor" fillOpacity="0.3"/></svg>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M6 2.5C7.9 2.5 9.6 3.3 10.8 4.6L12 3.4C10.5 1.9 8.4 1 6 1 3.6 1 1.5 1.9 0 3.4L1.2 4.6C2.4 3.3 4.1 2.5 6 2.5Z" fill="currentColor"/><path d="M6 5C7.1 5 8.1 5.4 8.8 6.1L10 4.9C9 3.9 7.6 3.3 6 3.3 4.4 3.3 3 3.9 2 4.9L3.2 6.1C3.9 5.4 4.9 5 6 5Z" fill="currentColor"/><circle cx="6" cy="8" r="1.2" fill="currentColor" fillOpacity="0.9"/></svg>
              <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor" fillOpacity="0.8"/><path d="M20 3.5C20.8 3.9 21.3 4.4 21.3 5.5C21.3 6.6 20.8 7.1 20 7.5V3.5Z" fill="currentColor" fillOpacity="0.5"/></svg>
            </div>
          </div>

          {/* TELEGRAM HEADER */}
          <div className="flex items-center gap-2.5 px-3.5 pt-2 pb-2.5 bg-[#17212b] border-b border-white/5">
            <span className="text-white/50 text-xl leading-none mr-0.5">‹</span>
            <div className="relative w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
               <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L13.5 4.5V9C13.5 12 9 14.5 9 14.5C9 14.5 4.5 12 4.5 9V4.5L9 2Z" stroke="#f4b430" strokeWidth="1.2"/><path d="M7 9L8.5 10.5L11 7.5" stroke="#f4b430" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1d9e75] border-[1.5px] border-[#17212b]" />
            </div>
            <div className="flex-1">
              <a 
                href="https://t.me/cyphersuraksha_bot" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white font-medium text-[13px] font-display hover:text-accent transition-colors"
                >
                  CypherSuraksha
              </a>
              <div className="text-[#1d9e75] text-[11px] leading-tight">bot · online</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50"><circle cx="8" cy="4" r="1.2" fill="white"/><circle cx="8" cy="8" r="1.2" fill="white"/><circle cx="8" cy="12" r="1.2" fill="white"/></svg>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 px-2 py-2.5 flex flex-col gap-1 overflow-y-auto bg-[#17212b]">
            <div className="text-center text-[10px] text-white/30 my-1.5 uppercase font-medium tracking-wider">Today</div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].messages.map((m, idx) => (
                  <div key={idx} className={`flex items-end gap-1.5 my-1 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    {m.from === "bot" && botAvatar}
                    <div>
                      <div className={`max-w-[220px] p-2.5 text-[12px] leading-relaxed relative ${m.from === "bot" ? "bg-[#182533] text-white/90 rounded-[14px] rounded-tl-[4px]" : "bg-[#2b5278] text-white rounded-[14px] rounded-tr-[4px]"}`}>
                        {m.html || m.text}
                      </div>
                      <div className={`text-[10px] text-white/30 mt-1 flex items-center gap-1 ${m.from === "bot" ? "justify-start" : "justify-end"}`}>
                        {m.time} {m.from === "user" && <span className="text-[#5ba4d4] -mt-0.5">✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* INPUT FIELD */}
          <div className="bg-[#0f1c2a] border-t border-white/5 p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 animate-pulse">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1"/><path d="M5 7H9M7 5V9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1" strokeLinecap="round" /></svg>
            </div>
            <div className="flex-1 bg-[#182533] border border-white/5 rounded-full px-3.5 py-2 text-[11px] text-white/40 italic">
               {steps[currentStep].input}
            </div>
            <div className="w-7 h-7 rounded-full bg-[#2b5278] flex items-center justify-center flex-shrink-0">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7L3 2L5 7L3 12L12 7Z" fill="white" fillOpacity="0.9"/></svg>
            </div>
          </div>

          {/* HOME INDICATOR */}
          <div className="h-5 flex items-end justify-center pb-1">
            <div className="w-20 h-[3px] bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* STEP NAV */}
      <div className="flex flex-wrap justify-center gap-2 mt-7">
        {["Welcome", "Scanning", "Threat Alert", "Safe URL", "Report Scam"].map((label, i) => (
          <button
            key={label}
            onClick={() => setCurrentStep(i)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all ${currentStep === i ? "bg-[#f4b430]/15 border border-[#f4b430]/40 text-[#f4b430]" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TelegramBotDemo;
