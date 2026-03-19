"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISTRICT_DATA: Record<string, { t: number; d: number; l: string; s: string; c: string }> = {
  "Dehradun":          {t:312, d:18, l:"critical", s:"Banking OTP",    c:"#a32d2d"},
  "Haridwar":          {t:198, d:11, l:"high",     s:"Fake GOV sites", c:"#d85a30"},
  "Uttarkashi":        {t:44,  d:2,  l:"safe",     s:"WhatsApp scams", c:"#1d9e75"},
  "Tehri Garhwal":     {t:67,  d:4,  l:"moderate", s:"Job fraud",      c:"#f4b430"},
  "Rudraprayag":       {t:31,  d:1,  l:"safe",     s:"Investment scam",c:"#1d9e75"},
  "Chamoli":           {t:28,  d:1,  l:"safe",     s:"Lottery fraud",  c:"#1d9e75"},
  "Pauri Garhwal":     {t:89,  d:6,  l:"moderate", s:"KYC phishing",   c:"#f4b430"},
  "Almora":            {t:112, d:7,  l:"high",     s:"Banking OTP",    c:"#d85a30"},
  "Bageshwar":         {t:58,  d:3,  l:"moderate", s:"Fake apps",      c:"#f4b430"},
  "Pithoragarh":       {t:72,  d:5,  l:"moderate", s:"SIM swap",       c:"#f4b430"},
  "Champawat":         {t:68,  d:4,  l:"moderate", s:"E-commerce",     c:"#f4b430"},
  "Nainital":          {t:241, d:14, l:"critical",  s:"Banking OTP",   c:"#a32d2d"},
  "Udham Singh Nagar": {t:287, d:19, l:"critical",  s:"Banking OTP",   c:"#a32d2d"},
};

const RISK_LABELS: Record<string, string> = { critical: "🔴 Critical", high: "🟠 High", moderate: "🟡 Moderate", safe: "🟢 Safe" };
const RISK_COLORS: Record<string, string> = { critical: "#e24b4a", high: "#d85a30", moderate: "#f4b430", safe: "#1d9e75" };

export default function UttarakhandThreatMap() {
  const [filter, setFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const sortedDistricts = useMemo(() => {
    return Object.entries(DISTRICT_DATA)
      .sort((a, b) => b[1].t - a[1].t)
      .slice(0, 7);
  }, []);

  const maxThreats = sortedDistricts[0][1].t;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="bg-[#0a0e14] p-5 rounded-2xl font-sans text-white border border-white/5 shadow-2xl overflow-hidden min-h-[520px]">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="font-['Syne'] text-lg font-extrabold flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#f4b430] mr-2 animate-pulse" />
            Sentinel Grid — Uttarakhand
          </div>
          <div className="text-[11px] text-white/35 mt-1">Live phishing threat heatmap · 13 districts</div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {Object.entries(RISK_COLORS).map(([lvl, color]) => (
            <div key={lvl} className="flex items-center gap-1.5 text-[11px] text-white/40">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_210px] gap-4 items-start">
        {/* Main Map Container */}
        <div>
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {["all", "critical", "high", "moderate", "safe"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] transition-all border ${
                  filter === f
                    ? "bg-[#f4b430]/15 border-[#f4b430]/40 text-[#f4b430]"
                    : "bg-white/5 border-white/10 text-white/45 hover:border-white/20"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div
            ref={mapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredDistrict(null)}
            className="relative bg-white/[0.02] border border-white/[0.07] rounded-xl p-2.5 aspect-[4/3] flex items-center justify-center overflow-visible"
          >
            <svg
              viewBox="190 138 85 78"
              className="w-full h-auto block overflow-visible drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="ukclip">
                  <path d="M 230.445,144.772 L 231.561,146.173 L 231.264,147.218 L 232.078,147.79 L 232.331,149.278 L 233.173,150.266 L 234.361,150.546 L 235.015,152.527 L 236.86,152.488 L 237.486,154.081 L 238.66,154.839 L 240.057,153.795 L 241.121,153.853 L 241.903,153.28 L 243.219,153.991 L 244.264,153.963 L 245.523,156.084 L 248.225,157.262 L 249.46,158.835 L 250.593,158.027 L 251.288,159.222 L 251.965,159.187 L 252.269,159.859 L 251.901,160.847 L 251.079,161.515 L 251.675,162.119 L 251.817,163.73 L 253.698,164.011 L 255.011,165.002 L 255.686,164.896 L 258.322,166.769 L 259.53,165.967 L 262.739,168.135 L 264.284,170.036 L 268.645,171.664 L 268.63,172.056 L 268.035,171.814 L 266.39,172.388 L 265.4,173.706 L 265.706,174.686 L 263.272,176.603 L 262.988,177.642 L 261.492,178.818 L 259.973,178.802 L 258.909,181.452 L 257.709,182.704 L 256.464,182.505 L 255.041,183.837 L 255.381,185.663 L 256.133,186.531 L 255.873,187.597 L 255.266,188.409 L 254.509,188.612 L 254.655,189.431 L 253.338,190.436 L 253.669,191.018 L 252.426,191.224 L 252.395,192.018 L 253.097,192.484 L 253.185,193.557 L 253.971,194.381 L 253.56,196.988 L 252.533,196.614 L 253.025,198.502 L 252.221,199.069 L 251.195,198.615 L 250.358,199.44 L 250.175,201.737 L 249.803,202.35 L 249.434,202.237 L 248.56,203.918 L 248.816,205.993 L 247.838,206.708 L 248.148,207.109 L 247.586,208.204 L 246.628,208.724 L 245.676,208.316 L 244.976,207.046 L 245.234,206.654 L 243.963,206.498 L 244.697,206.266 L 244.246,205.644 L 243.627,205.632 L 243.447,206.411 L 242.766,206.575 L 243.295,205.2 L 242.58,204.506 L 241.276,204.773 L 240.313,205.547 L 239.211,205.059 L 237.9,205.606 L 237.597,204.488 L 236.986,205.189 L 234.976,205.367 L 234.771,203.536 L 234.26,203.422 L 233.897,202.62 L 233.734,203.053 L 232.625,203.037 L 230.639,201.213 L 229.681,201.362 L 229.83,200.681 L 229.235,200.248 L 229.106,198.806 L 226.932,197.775 L 226.724,199.082 L 225.579,197.907 L 225.203,198.32 L 224.283,198.295 L 224.256,197.046 L 223.282,195.635 L 222.178,195.717 L 220.378,194.287 L 221.289,193.506 L 221.947,194.0 L 222.369,192.709 L 222.784,193.064 L 223.65,192.481 L 224.755,190.944 L 221.878,190.465 L 218.104,188.397 L 216.473,186.887 L 215.641,184.061 L 214.071,183.31 L 212.379,182.736 L 210.278,184.961 L 209.485,184.817 L 208.346,185.638 L 207.152,187.431 L 206.354,187.642 L 206.206,188.618 L 205.184,188.782 L 205.094,187.763 L 204.331,187.706 L 204.426,187.087 L 204.949,187.136 L 204.429,184.93 L 202.794,185.013 L 201.854,185.802 L 201.091,185.497 L 201.141,185.049 L 200.362,184.675 L 200.508,182.995 L 199.196,180.907 L 199.845,179.898 L 199.524,179.378 L 200.095,178.587 L 199.784,178.106 L 200.667,177.165 L 200.359,176.633 L 200.963,175.379 L 201.521,175.63 L 202.054,175.081 L 204.0,171.81 L 199.38,169.58 L 197.777,167.826 L 196.287,167.981 L 196.665,167.353 L 198.716,166.831 L 201.231,165.379 L 201.47,164.848 L 201.316,164.102 L 200.449,164.121 L 199.772,163.259 L 200.871,162.747 L 200.809,161.664 L 199.853,161.125 L 200.014,160.519 L 198.909,159.103 L 200.084,157.609 L 200.086,156.353 L 201.025,156.907 L 201.156,155.311 L 200.109,155.348 L 199.878,154.436 L 200.491,154.009 L 201.606,154.582 L 201.172,154.185 L 201.777,153.247 L 201.26,151.925 L 202.144,151.455 L 203.079,149.656 L 204.487,149.065 L 205.732,149.65 L 206.061,148.905 L 207.271,148.77 L 208.528,147.77 L 210.303,147.685 L 211.066,146.793 L 211.576,146.923 L 211.68,146.379 L 212.893,146.314 L 213.756,147.372 L 214.215,147.075 L 214.731,147.459 L 215.275,148.453 L 216.677,148.38 L 217.897,147.652 L 218.715,148.007 L 218.992,148.675 L 222.077,148.42 L 222.573,149.84 L 223.675,150.817 L 226.296,150.621 L 225.837,149.081 L 224.602,147.927 L 224.419,147.092 L 224.806,145.309 L 226.192,144.516 L 227.369,141.901 L 229.065,142.68 Z" />
                </clipPath>
              </defs>

              <g clipPath="url(#ukclip)">
                {Object.entries(DISTRICT_DATA).map(([name, data]) => {
                  const id = `d-${name.replace(/ /g, "_")}`;
                  const isVisible = filter === "all" || data.l === filter;
                  const isSelected = selectedDistrict === name;
                  const pathD = getPathByName(name);
                  if (!pathD) return null;

                  return (
                    <motion.path
                      key={name}
                      id={id}
                      d={pathD}
                      initial={false}
                      animate={{
                        opacity: isVisible ? 0.88 : 0.08,
                        stroke: isSelected || hoveredDistrict === name ? "#f4b430" : "rgba(10, 14, 20, 0.5)",
                        strokeWidth: isSelected ? 1.5 : hoveredDistrict === name ? 1.2 : 0.5,
                      }}
                      className="cursor-pointer transition-colors"
                      style={{ fill: data.c }}
                      onClick={() => setSelectedDistrict(name)}
                      onMouseEnter={() => setHoveredDistrict(name)}
                    />
                  );
                })}
              </g>

              {/* State Border Outline */}
              <path
                d="M 230.445,144.772 L 231.561,146.173 L 231.264,147.218 L 232.078,147.79 L 232.331,149.278 L 233.173,150.266 L 234.361,150.546 L 235.015,152.527 L 236.86,152.488 L 237.486,154.081 L 238.66,154.839 L 240.057,153.795 L 241.121,153.853 L 241.903,153.28 L 243.219,153.991 L 244.264,153.963 L 245.523,156.084 L 248.225,157.262 L 249.46,158.835 L 250.593,158.027 L 251.288,159.222 L 251.965,159.187 L 252.269,159.859 L 251.901,160.847 L 251.079,161.515 L 251.675,162.119 L 251.817,163.73 L 253.698,164.011 L 255.011,165.002 L 255.686,164.896 L 258.322,166.769 L 259.53,165.967 L 262.739,168.135 L 264.284,170.036 L 268.645,171.664 L 268.63,172.056 L 268.035,171.814 L 266.39,172.388 L 265.4,173.706 L 265.706,174.686 L 263.272,176.603 L 262.988,177.642 L 261.492,178.818 L 259.973,178.802 L 258.909,181.452 L 257.709,182.704 L 256.464,182.505 L 255.041,183.837 L 255.381,185.663 L 256.133,186.531 L 255.873,187.597 L 255.266,188.409 L 254.509,188.612 L 254.655,189.431 L 253.338,190.436 L 253.669,191.018 L 252.426,191.224 L 252.395,192.018 L 253.097,192.484 L 253.185,193.557 L 253.971,194.381 L 253.56,196.988 L 252.533,196.614 L 253.025,198.502 L 252.221,199.069 L 251.195,198.615 L 250.358,199.44 L 250.175,201.737 L 249.803,202.35 L 249.434,202.237 L 248.56,203.918 L 248.816,205.993 L 247.838,206.708 L 248.148,207.109 L 247.586,208.204 L 246.628,208.724 L 245.676,208.316 L 244.976,207.046 L 245.234,206.654 L 243.963,206.498 L 244.697,206.266 L 244.246,205.644 L 243.627,205.632 L 243.447,206.411 L 242.766,206.575 L 243.295,205.2 L 242.58,204.506 L 241.276,204.773 L 240.313,205.547 L 239.211,205.059 L 237.9,205.606 L 237.597,204.488 L 236.986,205.189 L 234.976,205.367 L 234.771,203.536 L 234.26,203.422 L 233.897,202.62 L 233.734,203.053 L 232.625,203.037 L 230.639,201.213 L 229.681,201.362 L 229.83,200.681 L 229.235,200.248 L 229.106,198.806 L 226.932,197.775 L 226.724,199.082 L 225.579,197.907 L 225.203,198.32 L 224.283,198.295 L 224.256,197.046 L 223.282,195.635 L 222.178,195.717 L 220.378,194.287 L 221.289,193.506 L 221.947,194.0 L 222.369,192.709 L 222.784,193.064 L 223.65,192.481 L 224.755,190.944 L 221.878,190.465 L 218.104,188.397 L 216.473,186.887 L 215.641,184.061 L 214.071,183.31 L 212.379,182.736 L 210.278,184.961 L 209.485,184.817 L 208.346,185.638 L 207.152,187.431 L 206.354,187.642 L 206.206,188.618 L 205.184,188.782 L 205.094,187.763 L 204.331,187.706 L 204.426,187.087 L 204.949,187.136 L 204.429,184.93 L 202.794,185.013 L 201.854,185.802 L 201.091,185.497 L 201.141,185.049 L 200.362,184.675 L 200.508,182.995 L 199.196,180.907 L 199.845,179.898 L 199.524,179.378 L 200.095,178.587 L 199.784,178.106 L 200.667,177.165 L 200.359,176.633 L 200.963,175.379 L 201.521,175.63 L 202.054,175.081 L 204.0,171.81 L 199.38,169.58 L 197.777,167.826 L 196.287,167.981 L 196.665,167.353 L 198.716,166.831 L 201.231,165.379 L 201.47,164.848 L 201.316,164.102 L 200.449,164.121 L 199.772,163.259 L 200.871,162.747 L 200.809,161.664 L 199.853,161.125 L 200.014,160.519 L 198.909,159.103 L 200.084,157.609 L 200.086,156.353 L 201.025,156.907 L 201.156,155.311 L 200.109,155.348 L 199.878,154.436 L 200.491,154.009 L 201.606,154.582 L 201.172,154.185 L 201.777,153.247 L 201.26,151.925 L 202.144,151.455 L 203.079,149.656 L 204.487,149.065 L 205.732,149.65 L 206.061,148.905 L 207.271,148.77 L 208.528,147.77 L 210.303,147.685 L 211.066,146.793 L 211.576,146.923 L 211.68,146.379 L 212.893,146.314 L 213.756,147.372 L 214.215,147.075 L 214.731,147.459 L 215.275,148.453 L 216.677,148.38 L 217.897,147.652 L 218.715,148.007 L 218.992,148.675 L 222.077,148.42 L 222.573,149.84 L 223.675,150.817 L 226.296,150.621 L 225.837,149.081 L 224.602,147.927 L 224.419,147.092 L 224.806,145.309 L 226.192,144.516 L 227.369,141.901 L 229.065,142.68 Z"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="0.45"
              />

              {/* Labels */}
              <g style={{ pointerEvents: "none" }} fontFamily="DM Sans,sans-serif" fontSize="3.2" fill="rgba(255,255,255,0.9)" textAnchor="middle">
                <text x="205.87" y="167.2">Dehradun</text>
                <text x="206.27" y="183.4">Haridwar</text>
                <text x="210.5" y="153.2">Uttarkashi</text>
                <text x="221.61" y="165.8">Tehri</text>
                <text x="230.2" y="162.2" fontSize="2.8">Rudra-</text>
                <text x="230.2" y="165.2" fontSize="2.8">prayag</text>
                <text x="239.5" y="160.5">Chamoli</text>
                <text x="223.2" y="181.8">Pauri</text>
                <text x="243.2" y="188.5">Almora</text>
                <text x="248.0" y="177.8" fontSize="2.8">Bagesh-</text>
                <text x="248.0" y="180.6" fontSize="2.8">war</text>
                <text x="254.5" y="166.0">Pithoragarh</text>
                <text x="249.5" y="196.0" fontSize="2.8">Champawat</text>
                <text x="225.5" y="199.5">Nainital</text>
                <text x="231.5" y="205.0" fontSize="2.6">Udham S. Nagar</text>
              </g>
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredDistrict && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}
                  className="absolute bg-[#141c2a] border border-[#f4b430]/35 rounded-lg p-2.5 pointer-events-none z-20 min-w-[155px] max-w-[190px] shadow-xl"
                >
                  <div className="font-['Syne'] font-bold text-[13px] text-[#f4b430] mb-1">
                    {hoveredDistrict}
                  </div>
                  <div className="flex justify-between gap-3 text-[11px] text-white/50 mt-0.5">
                    <span>Threats</span>
                    <span className="text-white font-medium">{DISTRICT_DATA[hoveredDistrict].t}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[11px] text-white/50 mt-0.5">
                    <span>Today</span>
                    <span className="text-white font-medium">{DISTRICT_DATA[hoveredDistrict].d}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[11px] text-white/50 mt-0.5">
                    <span>Risk</span>
                    <span className="text-white font-medium">{RISK_LABELS[DISTRICT_DATA[hoveredDistrict].l]}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[11px] text-white/50 mt-0.5">
                    <span>Top scam</span>
                    <span className="text-white font-medium">{DISTRICT_DATA[hoveredDistrict].s}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-2.5 lg:pt-11">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-3">
            <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-bold">Top threatened</div>
            <div className="flex flex-col gap-1.5">
              {sortedDistricts.map(([name, data]) => (
                <div
                  key={name}
                  onClick={() => setSelectedDistrict(name)}
                  className="flex items-center justify-between py-1 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.02] last:border-none group"
                >
                  <span className="text-[11px] text-white/65 flex-1 truncate mr-1.5 group-hover:text-white transition-colors">
                    {name.replace(" Garhwal", "").replace(" Singh Nagar", " Nagar")}
                  </span>
                  <div className="w-13 h-1 bg-white/[0.07] rounded-full shrink-0 mr-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(data.t / maxThreats) * 100}%`, backgroundColor: data.c }}
                    />
                  </div>
                  <span className="text-[11px] font-medium w-6 text-right" style={{ color: data.c }}>
                    {data.t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-3">
            <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-bold">Selected district</div>
            <div className="text-xs text-white/30">
              {selectedDistrict ? (
                <div className="space-y-1.5">
                  <div className="font-['Syne'] font-bold text-[13px] text-[#f4b430] mb-2">{selectedDistrict}</div>
                  <div className="flex justify-between py-0.5 border-b border-white/[0.04] last:border-none">
                    <span className="text-white/40 text-[11px]">Total threats</span>
                    <span className="text-white font-medium text-[11px]">{DISTRICT_DATA[selectedDistrict].t}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-white/[0.04] last:border-none">
                    <span className="text-white/40 text-[11px]">Reports today</span>
                    <span className="text-white font-medium text-[11px]">{DISTRICT_DATA[selectedDistrict].d}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-white/[0.04] last:border-none">
                    <span className="text-white/40 text-[11px]">Risk level</span>
                    <span className="text-white font-medium text-[11px]" style={{ color: RISK_COLORS[DISTRICT_DATA[selectedDistrict].l] }}>
                      {DISTRICT_DATA[selectedDistrict].l.charAt(0).toUpperCase() + DISTRICT_DATA[selectedDistrict].l.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-white/[0.04] last:border-none">
                    <span className="text-white/40 text-[11px]">Top scam type</span>
                    <span className="text-white font-medium text-[11px]">{DISTRICT_DATA[selectedDistrict].s}</span>
                  </div>
                </div>
              ) : (
                "Click a district on the map"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPathByName(name: string) {
  const paths: Record<string, string> = {
    "Dehradun": "M 196.692,157.889 L 198.702,152.639 L 202.319,151.923 L 206.741,153.355 L 211.363,155.025 L 216.789,156.696 L 217.392,160.514 L 215.985,166.958 L 213.976,171.014 L 211.363,174.833 L 207.343,177.219 L 204.329,178.89 L 200.309,179.606 L 197.295,178.174 L 196.692,172.924 L 196.692,164.571 Z",
    "Haridwar": "M 197.295,178.174 L 200.309,179.606 L 204.329,178.89 L 207.343,177.219 L 211.363,174.833 L 213.976,171.014 L 216.789,173.401 L 216.387,182.947 L 214.378,188.435 L 210.76,190.822 L 206.339,191.538 L 201.917,190.822 L 198.3,189.151 L 197.295,184.378 L 197.295,178.174 Z",
    "Uttarkashi": "M 196.692,157.889 L 196.692,152.639 L 198.702,152.639 L 202.319,147.866 L 205.334,143.093 L 212.77,143.093 L 220.809,143.093 L 228.044,144.764 L 230.053,151.446 L 228.446,156.219 L 225.431,158.128 L 220.809,159.082 L 216.789,156.696 L 211.363,155.025 L 206.741,153.355 L 202.319,151.923 L 198.702,152.639 L 196.692,157.889 Z",
    "Tehri Garhwal": "M 216.789,156.696 L 220.809,159.082 L 225.431,158.128 L 228.446,156.219 L 229.45,159.082 L 228.446,164.571 L 226.838,169.344 L 224.024,174.117 L 220.809,176.503 L 217.392,175.787 L 213.976,171.014 L 215.985,166.958 L 217.392,160.514 L 216.789,156.696 Z",
    "Rudraprayag": "M 228.446,156.219 L 230.053,151.446 L 232.867,155.025 L 235.48,156.696 L 234.877,162.901 L 232.063,166.958 L 229.45,169.344 L 226.838,169.344 L 228.446,164.571 L 229.45,159.082 L 228.446,156.219 Z",
    "Chamoli": "M 228.044,144.764 L 220.809,143.093 L 228.044,143.093 L 234.475,143.093 L 240.906,145.48 L 247.538,149.537 L 254.17,152.639 L 256.984,158.128 L 254.974,164.571 L 251.557,168.628 L 247.538,172.446 L 244.121,174.833 L 240.906,176.503 L 236.886,174.833 L 232.867,172.446 L 229.45,169.344 L 232.063,166.958 L 234.877,162.901 L 235.48,156.696 L 232.867,155.025 L 230.053,151.446 L 228.044,144.764 Z",
    "Pauri Garhwal": "M 213.976,171.014 L 217.392,175.787 L 220.809,176.503 L 224.024,174.117 L 226.838,169.344 L 229.45,169.344 L 232.867,172.446 L 236.886,174.833 L 240.906,176.503 L 244.121,179.606 L 240.906,183.662 L 237.489,188.435 L 234.073,190.822 L 230.053,193.208 L 226.034,193.924 L 221.412,192.015 L 217.995,189.629 L 214.779,188.435 L 210.76,186.765 L 207.343,184.378 L 206.339,180.56 L 207.343,177.219 L 211.363,174.833 L 213.976,171.014 Z",
    "Almora": "M 234.073,190.822 L 237.489,188.435 L 240.906,183.662 L 244.121,179.606 L 246.935,176.503 L 250.151,174.117 L 253.567,175.31 L 254.974,180.083 L 252.964,185.333 L 250.151,189.151 L 247.538,192.492 L 244.523,194.879 L 240.906,195.595 L 237.489,194.879 L 234.073,193.924 L 230.053,193.208 L 234.073,190.822 Z",
    "Bageshwar": "M 240.906,176.503 L 244.121,174.833 L 247.538,172.446 L 251.557,168.628 L 254.974,164.571 L 256.984,168.628 L 255.577,174.117 L 253.567,178.89 L 250.151,182.469 L 246.935,185.333 L 244.121,184.378 L 240.906,183.662 L 240.906,176.503 Z",
    "Pithoragarh": "M 247.538,149.537 L 240.906,145.48 L 234.475,143.093 L 247.538,143.093 L 254.974,146.673 L 258.993,152.639 L 262.209,158.128 L 264.219,164.571 L 265.625,171.014 L 263.013,176.503 L 260.199,180.56 L 256.984,183.662 L 252.964,185.333 L 254.974,180.083 L 253.567,175.31 L 250.151,174.117 L 246.935,176.503 L 244.121,179.606 L 251.557,168.628 L 254.974,164.571 L 256.984,158.128 L 254.17,152.639 L 247.538,149.537 Z",
    "Champawat": "M 244.523,194.879 L 247.538,192.492 L 250.151,189.151 L 252.964,185.333 L 256.984,183.662 L 260.199,188.435 L 258.993,194.879 L 255.577,199.652 L 251.557,202.038 L 247.538,202.754 L 243.518,201.561 L 240.504,198.697 L 240.906,195.595 L 244.523,194.879 Z",
    "Nainital": "M 217.995,189.629 L 221.412,192.015 L 226.034,193.924 L 230.053,193.208 L 234.073,193.924 L 237.489,194.879 L 240.906,195.595 L 240.504,198.697 L 237.489,202.754 L 234.073,205.856 L 230.053,207.527 L 226.034,208.243 L 222.014,208.243 L 218.799,206.811 L 216.387,204.424 L 214.779,201.561 L 213.976,197.981 L 214.779,193.208 L 214.779,188.435 L 217.995,189.629 Z",
    "Udham Singh Nagar": "M 214.779,188.435 L 214.779,193.208 L 213.976,197.981 L 214.779,201.561 L 216.387,204.424 L 218.799,206.811 L 222.014,208.243 L 226.034,208.243 L 230.053,207.527 L 234.073,205.856 L 237.489,202.754 L 240.504,198.697 L 243.518,201.561 L 247.538,202.754 L 251.557,202.038 L 255.577,199.652 L 256.984,204.424 L 252.964,208.243 L 247.538,208.243 L 240.906,208.243 L 234.073,208.243 L 227.441,208.243 L 222.014,208.243 L 217.392,207.527 L 214.779,204.424 L 214.779,199.174 L 214.779,188.435 Z",
  };
  return paths[name];
}
