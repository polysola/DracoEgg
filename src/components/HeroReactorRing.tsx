import React from "react";

interface HeroReactorRingProps {
  eggHealth: number;
  children: React.ReactNode;
}

const HeroReactorRing: React.FC<HeroReactorRingProps> = ({
  eggHealth,
  children,
}) => {
  const normalizedHealth = Math.max(0, Math.min(100, eggHealth));

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] flex items-center justify-center font-orbitron my-2 pt-6">
      {/* 100% GPU Hardware-Accelerated Sci-Fi Reactor HUD Rings (Zero-Lag Ultra Smooth) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="neonArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="40%" stopColor="#8b5cf6" />
            <stop offset="80%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00d2ff" />
          </linearGradient>
        </defs>

        {/* 1. RADIAL CYBER GRID BACKGROUND (LƯỚI XOÁY 3D GPU ROTATING) */}
        <g
          opacity="0.4"
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{ transformOrigin: "180px 195px", animationDuration: "80s" }}
        >
          <circle cx="180" cy="195" r="142" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 7" />
          <circle cx="180" cy="195" r="115" stroke="#00d2ff" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="180" cy="195" r="85" stroke="#ec4899" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="20" y1="195" x2="340" y2="195" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="180" y1="35" x2="180" y2="355" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="70" y1="85" x2="290" y2="305" stroke="#00d2ff" strokeWidth="0.8" strokeDasharray="3 5" />
          <line x1="290" y1="85" x2="70" y2="305" stroke="#00d2ff" strokeWidth="0.8" strokeDasharray="3 5" />
        </g>

        {/* 2. OUTER SEGMENTED HUD ARC RING (GPU ROTATING CLOCKWISE) */}
        <g
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{ transformOrigin: "180px 195px", animationDuration: "22s" }}
        >
          <circle
            cx="180"
            cy="195"
            r="142"
            stroke="url(#neonArcGrad)"
            strokeWidth="7"
            strokeDasharray="24 10"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* 3. INNER CYAN DOTTED ORBIT RING (GPU ROTATING COUNTER-CLOCKWISE) */}
        <g
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{
            transformOrigin: "180px 195px",
            animationDuration: "30s",
            animationDirection: "reverse",
          }}
        >
          <circle
            cx="180"
            cy="195"
            r="154"
            stroke="#00d2ff"
            strokeWidth="2.5"
            strokeDasharray="3 9"
            opacity="0.8"
          />
        </g>

        {/* 4. GLOWING 3D PEDESTAL LAUNCHPAD BASE BELOW EGG */}
        <ellipse cx="180" cy="308" rx="115" ry="26" fill="url(#pedestalGlow)" />
        <ellipse
          cx="180"
          cy="308"
          rx="110"
          ry="24"
          stroke="#a855f7"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
        <ellipse
          cx="180"
          cy="308"
          rx="90"
          ry="17"
          stroke="#00d2ff"
          strokeWidth="1.8"
          fill="none"
          opacity="0.7"
        />
        <ellipse
          cx="180"
          cy="308"
          rx="65"
          ry="11"
          stroke="#ec4899"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* EMBEDDED CYBERPUNK 0-100% PROGRESS BAR FOR ARC DRAGON CORE INTEGRITY */}
      <div className="absolute top-0 z-30 bg-[#070518]/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-center w-60 sm:w-64 max-w-[90vw]">
        <div className="flex justify-between items-center text-[9px] font-black uppercase mb-1">
          <span className="text-[#c084fc] tracking-wider neon-purple-glow flex items-center space-x-1">
            <span>⚡</span>
            <span>ARC DRAGON CORE</span>
          </span>
          <span className="text-[#00d2ff] font-mono font-bold text-[10px]">
            {normalizedHealth.toFixed(1)}%
          </span>
        </div>
        {/* Sleek Neon Progress Bar Track & Fill */}
        <div className="w-full bg-[#0d0926] h-2 rounded-full overflow-hidden p-0.5 border border-white/10 relative shadow-[inset_0_0_6px_rgba(0,0,0,0.8)]">
          <div
            className="bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#00d2ff] h-full rounded-full transition-all duration-300 relative shadow-[0_0_10px_#8b5cf6]"
            style={{ width: `${normalizedHealth}%` }}
          >
            {/* Animated Highlight Pulse */}
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Central Hero Egg Content */}
      <div className="relative z-10 flex items-center justify-center mt-3">
        {children}
      </div>
    </div>
  );
};

export default HeroReactorRing;
