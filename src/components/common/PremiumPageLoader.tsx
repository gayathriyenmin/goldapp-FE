import React from 'react';

interface PremiumPageLoaderProps {
  isLoading?: boolean;
  text?: string;
  fullScreen?: boolean;
}

export const PremiumPageLoader: React.FC<PremiumPageLoaderProps> = ({
  isLoading = true,
  text = 'Synchronizing Ledger',
  fullScreen = false,
}) => {
  if (!isLoading) return null;

  return (
    <div 
      className={`flex flex-col items-center justify-center w-full relative select-none overflow-hidden py-12 ${
        fullScreen 
          ? 'fixed inset-0 z-[9999] bg-[#020617] min-h-screen' 
          : 'min-h-[75vh]'
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spinX {
          0% { transform: rotateX(0deg) rotateY(15deg); }
          100% { transform: rotateX(360deg) rotateY(15deg); }
        }
        @keyframes spinY {
          0% { transform: rotateX(15deg) rotateY(0deg); }
          100% { transform: rotateX(15deg) rotateY(360deg); }
        }
        @keyframes spinZ {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        @keyframes float-core {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.03); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) rotate(35deg); }
          100% { transform: translateX(150%) rotate(35deg); }
        }
        @keyframes float-sparkle {
          0% { transform: translateY(20px) scale(0.6); opacity: 0; }
          40% { opacity: 0.85; }
          100% { transform: translateY(-70px) scale(1.2); opacity: 0; }
        }
      `}} />

      {/* Glowing Golden Core Radial Aura */}
      <div className="absolute w-48 h-48 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.22)_0%,_transparent_70%)] pointer-events-none filter blur-2xl animate-pulse" />

      {/* Floating Sparkles (Cinematic ambiance) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-1 h-1 rounded-full bg-[#FACC15] animate-[float-sparkle_4s_infinite_ease-in-out] shadow-[0_0_6px_#FACC15]" style={{ left: '46%', top: '55%', animationDelay: '0.2s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-[float-sparkle_3.5s_infinite_ease-in-out] shadow-[0_0_8px_#FACC15]" style={{ left: '54%', top: '50%', animationDelay: '1.2s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-yellow-300 animate-[float-sparkle_4.5s_infinite_ease-in-out] shadow-[0_0_6px_#FACC15]" style={{ left: '50%', top: '60%', animationDelay: '2.2s' }} />
      </div>

      {/* The 3D Gyroscope Tourbillon Frame */}
      <div className="relative w-40 h-40 flex items-center justify-center animate-[float-core_4s_infinite_ease-in-out]" style={{ perspective: '1000px' }}>
        
        {/* Ring 1: Outer Gold Ring (X-Axis Rotation) */}
        <div 
          className="absolute w-36 h-36 rounded-full border border-double border-yellow-500/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'spinX 7s linear infinite'
          }}
        >
          <div className="absolute inset-1 rounded-full border border-yellow-600/25" />
          <div className="absolute inset-2 rounded-full border-[1.2px] border-dashed border-[#FACC15]/20" />
        </div>

        {/* Ring 2: Middle Gold Ring (Y-Axis Rotation) */}
        <div 
          className="absolute w-28 h-28 rounded-full border border-yellow-400/50 shadow-[inset_0_0_8px_rgba(250,204,21,0.1)]"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'spinY 5.5s linear infinite'
          }}
        >
          <div className="absolute inset-1 rounded-full border border-yellow-500/30" />
          <div className="absolute inset-2 rounded-full border border-dashed border-[#FFE57F]/15" />
        </div>

        {/* Ring 3: Inner Gold Ring (Z-Axis Rotation) */}
        <div 
          className="absolute w-20 h-20 rounded-full border border-[#D4AF37] opacity-80"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'spinZ 4s linear infinite'
          }}
        >
          <div className="absolute inset-0.5 rounded-full border border-yellow-700/40" />
          {/* Tick notches on inner watch face */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-[1px] h-full bg-yellow-400/50 absolute rotate-0" />
            <div className="w-[1px] h-full bg-yellow-400/50 absolute rotate-45" />
            <div className="w-[1px] h-full bg-yellow-400/50 absolute rotate-90" />
            <div className="w-[1px] h-full bg-yellow-400/50 absolute rotate-135" />
          </div>
        </div>

        {/* Central Core: Solid Shiny Gold Core Nucleus with concentric grooves */}
        <div 
          className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FFE57F] via-[#FACC15] via-[#D4AF37] to-[#8A640F] shadow-[0_4px_12px_rgba(212,175,55,0.4),inset_0_2px_6px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,0,0,0.6)] border border-yellow-600/50 overflow-hidden"
        >
          <div className="absolute inset-0.5 rounded-full border border-white/20 pointer-events-none" />
          
          {/* Glowing central star emblem */}
          <svg className="w-5 h-5 text-white drop-shadow-[0_0_4px_#FFFFFF] animate-pulse" viewBox="0 0 100 100">
            <path d="M50,15 L56,40 L81,45 L56,50 L50,75 L44,50 L19,45 L44,40 Z" fill="#FFF" />
          </svg>

          {/* Glint Shimmer sweep over the nucleus */}
          <div className="absolute inset-0 w-[200%] -translate-x-full rotate-[35deg] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_infinite_ease-in-out]" />
        </div>
      </div>

      {/* Luxury Minimalist Text */}
      <div className="mt-8 flex items-center space-x-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-300 drop-shadow-md">
          {text}
        </span>
        <div className="flex space-x-0.5">
          <span className="w-1 h-1 rounded-full bg-[#FACC15] animate-bounce shadow-[0_0_4px_#FACC15]" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 rounded-full bg-[#FACC15] animate-bounce shadow-[0_0_4px_#FACC15]" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 rounded-full bg-[#FACC15] animate-bounce shadow-[0_0_4px_#FACC15]" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
