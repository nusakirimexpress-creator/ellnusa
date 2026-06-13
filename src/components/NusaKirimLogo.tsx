import React from 'react';

interface NusaKirimLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function NusaKirimLogo({ className = '', size = 36, showText = false }: NusaKirimLogoProps) {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* High Fidelity Recreated NusaKirim SVG Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Circular Bounds for alignment reference */}
        <mask id="circle-mask">
          <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
        </mask>

        <g mask="url(#circle-mask)">
          {/* 1. UPPER PART: Bridge & Red Arches */}
          {/* Top thick curved border */}
          <path
            d="M10 50 C10 20, 90 20, 90 50"
            fill="#E11D48"
          />
          {/* White cutout to create the double arches */}
          <path
            d="M 13 46 C 25 18, 75 18, 87 46 Z"
            fill="#FFFFFF"
          />
          {/* Red Inner Arch with bridge structure columns */}
          <path
            d="M 18 50 C 27 25, 73 25, 82 50 Z"
            fill="#E11D48"
          />
          {/* White space under the arch */}
          <path
            d="M 23 50 C 30 32, 70 32, 77 50 Z"
            fill="#FFFFFF"
          />
          
          {/* Bridge struts (vertical lines) across the arch */}
          {/* Strut 1 */}
          <rect x="34" y="30" width="3" height="20" fill="#FFFFFF" transform="rotate(-5, 34, 30)" />
          {/* Strut 2 */}
          <rect x="42" y="27" width="3.5" height="23" fill="#FFFFFF" />
          {/* Strut 3 */}
          <rect x="50" y="26" width="3.5" height="24" fill="#FFFFFF" />
          {/* Strut 4 */}
          <rect x="58" y="27" width="3.5" height="23" fill="#FFFFFF" />
          {/* Strut 5 */}
          <rect x="66" y="30" width="3" height="20" transform="rotate(5, 66, 30)" fill="#FFFFFF" />

          {/* 2. LOWER PART: Ocean Waves (Dark Grey / Black) */}
          {/* Wave 1 (Top Wave) */}
          <path
            d="M10 52 C 25 45, 45 42, 60 51 C 75 60, 90 54, 95 50"
            stroke="#1E293B"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Wave 2 (Bottom Wave) */}
          <path
            d="M 12 60 C 25 54, 45 52, 62 61 C 78 70, 90 64, 94 60"
            stroke="#1E293B"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Wave 3 (Bottom Fill curve to solid circle bottom) */}
          <path
            d="M 15 68 C 30 62, 45 60, 62 69 C 78 78, 86 72, 90 68"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Brand Text Styling */}
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-baseline">
            <span className="font-sans font-black text-xl tracking-tight text-rose-600">
              Nusa
            </span>
            <span className="font-sans font-black text-xl tracking-tight text-slate-800">
              Kirim
            </span>
            <span className="text-xs font-bold text-rose-600 ml-1.5 px-1.5 py-0.5 bg-rose-50 rounded-md uppercase font-mono tracking-wider scale-90">
              Jastip
            </span>
          </div>
          
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">
              LOGISTIK
            </span>
            <span className="text-[10px] text-white bg-rose-600 px-1 py-0.2 rounded-sm font-bold scale-90">
              群岛物流
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
