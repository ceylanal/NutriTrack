import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light'; // dark means dark background (text is white), light means light background (text is dark green-slate)
  showSlogan?: boolean;
}

/**
 * High-fidelity vector SVG representation of the official NutriTrack logo:
 * - A custom smooth forest green rounded square container
 * - A high-contrast white apple silhouette with dual leaves and a stem
 * - A pixel-matched cutout green checkmark inside the apple body
 */
export function LogoIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`relative transition-transform hover:scale-105 duration-200 shrink-0 ${dimensions} ${className}`} id="nutritrack-logo-icon">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Rich Forest Green Rounded Squirckle Container */}
        <rect x="0" y="0" width="100" height="100" rx="24" fill="#0c4524" />
        
        {/* Tiny subtle glossy reflection on the top of the container */}
        <path d="M 12 10 Q 50 4 88 10 Q 50 18 12 10 Z" fill="white" opacity="0.08" />

        {/* Dual Leaves */}
        {/* Left Leaf */}
        <path d="M 50 20 C 45 13, 37 13, 32 18 C 39 23, 46 21, 50 20 Z" fill="white" />
        {/* Right Leaf */}
        <path d="M 50 20 C 55 13, 63 13, 68 18 C 61 23, 54 21, 50 20 Z" fill="white" />
        
        {/* Tiny Stem */}
        <path d="M 48.5 20 L 51.5 20 L 50 23 Z" fill="white" />

        {/* Smooth Apple Body Silhouette */}
        <path d="M 50 26 
                 C 53.5 25, 68 25, 73.5 35 
                 C 79 43.5, 78 61, 70 70 
                 C 63 79, 52 78, 50 76.5
                 C 48 78, 37 79, 30 70 
                 C 22 61, 21 43.5, 26.5 35 
                 C 32 25, 46.5 25, 50 26 Z" 
              fill="white" />
              
        {/* Crisp Forest Green Checked Tick cut-out */}
        <path d="M 37.5 52 
                 L 46.5 61 
                 L 62.5 41" 
              stroke="#0c4524" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Logo({ className = '', size = 'md', theme = 'light', showSlogan = true }: LogoProps) {
  // Styles depending on the background theme
  const titleColor = theme === 'dark' ? 'text-white' : 'text-[#0c4524]';
  const sloganColor = theme === 'dark' ? 'text-emerald-400/80' : 'text-slate-500';

  const textSizes = {
    sm: {
      title: 'text-sm font-bold',
      slogan: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      title: 'text-xl font-extrabold tracking-tight',
      slogan: 'text-[10px] leading-tight',
      gap: 'gap-3',
    },
    lg: {
      title: 'text-2xl font-black tracking-tight',
      slogan: 'text-xs',
      gap: 'gap-4',
    },
  }[size];

  return (
    <div className={`flex items-center ${textSizes.gap} ${className}`} id="nutritrack-logo-full">
      <LogoIcon size={size} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-sans ${textSizes.title} ${titleColor}`}>
            NutriTrack
          </span>
          {theme === 'dark' && (
            <span className="text-[9px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded">
              V1.0
            </span>
          )}
        </div>
        {showSlogan && (
          <div className={`font-sans font-medium max-w-[210px] sm:max-w-xs mt-0.5 ${textSizes.slogan} ${sloganColor}`}>
            Dietitian–Client Nutrition Tracking and Consultation Platform
          </div>
        )}
      </div>
    </div>
  );
}
