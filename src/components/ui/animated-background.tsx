"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[1000px] h-[1000px] bg-gradient-to-b from-violet-600/15 via-violet-600/5 to-transparent rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-indigo-600/10 to-transparent rounded-full blur-[100px]" />
    </div>
  );
}

export function FloatingParticles() {
  return null;
}

export function GlowingOrb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-2xl opacity-50" />
      <div className="absolute inset-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-xl opacity-70" />
    </div>
  );
}

export function GridPattern() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }}
    />
  );
}
