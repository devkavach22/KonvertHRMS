import React from "react";

// TODO: Replace with your actual import path
// import logoSrc from './assets/Group 3.png';

interface UniqueBrandLoaderProps {
  isLoading?: boolean;
  text?: string;
  logoSrc: string; // The path to your K logo image
  className?: string; // Optional extra classes for the container
}

const BrandLoader: React.FC<UniqueBrandLoaderProps> = ({
  isLoading = true,
  text = "INITIALIZING SYSTEM...",
  logoSrc,
  className = "",
}) => {
  if (!isLoading) return null;

  return (
    // Main Container holding everything
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      {/* --- CSS Styles Injection --- */}
      {/* We inject styles locally so this component is self-contained */}
      <style>{`
        /* 1. The Logo Floating Effect */
        @keyframes float-center {
          0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
          50% { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 8px 12px rgba(255, 196, 46, 0.3)); }
        }

        /* 2. Orbital Rotation Keyframes */
        @keyframes orbit-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter-clockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* 3. The Pulsing Outer Ring boundary */
        @keyframes pulse-ring-boundary {
           0%, 100% { border-color: rgba(255, 196, 46, 0.1); box-shadow: 0 0 0 0 rgba(255, 104, 53, 0); }
           50% { border-color: rgba(255, 196, 46, 0.3); box-shadow: 0 0 20px 0 rgba(255, 104, 53, 0.1); }
        }

        /* Applying animations to classes */
        .animate-float-logo { animation: float-center 3s ease-in-out infinite; }
        .orbit-fast-cw { animation: orbit-clockwise 1.5s linear infinite; }
        .orbit-medium-ccw { animation: orbit-counter-clockwise 2.5s linear infinite; }
        .orbit-slow-cw { animation: orbit-clockwise 4s linear infinite; }
        .animate-pulse-boundary { animation: pulse-ring-boundary 3s ease-in-out infinite; }
      `}</style>

      {/* --- THE ORBITAL SYSTEM CONTAINER (Fixed Size: h-48 w-48) --- */}
      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* Orbit Path 3 (Outer - Yellow - Slow) */}
        <div className="absolute inset-0 orbit-slow-cw z-0">
          {/* The Satellite Dot placed at the 'top' of the rotation container */}
          <div className="h-4 w-4 rounded-full bg-[#FFC42E] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 blur-[2px] shadow-[0_0_10px_#FFC42E]"></div>
        </div>

        {/* Orbit Path 2 (Middle - Orange - Counter-Clockwise) */}
        <div className="absolute inset-6 orbit-medium-ccw z-10">
          <div className="h-3 w-3 rounded-full bg-[#FF6835] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 blur-[1px] shadow-[0_0_8px_#FF6835]"></div>
        </div>

        {/* Orbit Path 1 (Inner - Fast - Mixed Colors) */}
        <div className="absolute inset-12 orbit-fast-cw z-20 rounded-full border border-orange-100/10">
          {/* Satellite 1 at top */}
          <div className="h-2 w-2 rounded-full bg-[#FFC42E] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 shadow-[0_0_5px_#FFC42E]"></div>
          {/* Satellite 2 at bottom */}
          <div className="h-2 w-2 rounded-full bg-[#FF6835] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 shadow-[0_0_5px_#FF6835]"></div>
        </div>

        {/* subtle boundary ring definition */}
        <div className="absolute inset-2 rounded-full border border-orange-200/10 animate-pulse-boundary"></div>

        {/* THE CENTRAL LOGO */}
        <div className="relative z-30 animate-float-logo p-2">
          {/* We don't use a white circle background here, we let it float freely */}
          <img
            src={logoSrc}
            alt="Brand Logo"
            className="h-20 w-20 object-contain"
          />
        </div>
      </div>
      {/* --- END ORBITAL SYSTEM --- */}

      {/* Loading Text */}
      {text && (
        <div className="mt-8 flex flex-col items-center">
          <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase animate-pulse">
            {text}
          </span>
          {/* Optional decorative bar below text */}
          <div className="mt-2 h-0.5 w-16 bg-gradient-to-r from-[#FFC42E] to-[#FF6835] rounded-full opacity-50"></div>
        </div>
      )}
    </div>
  );
};

export default BrandLoader;
