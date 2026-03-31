import { useState } from "react";

export default function Hero({ onZoomIn, onZoomOut }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    setOffset({ x, y });
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.05s linear",
      }}
      className="
        relative
        min-h-screen 
        flex flex-col items-center justify-center 
        text-center px-6 
        bg-gradient-to-b from-[#3CCFCF] to-[#2A6FDB]
        font-sans
      "
    >
      {/* Top tagline */}
      <h2 className="text-red/80 text-xl mb-3 tracking-wide">
        Your Career, Elevated
      </h2>

      {/* Main title */}
      <h1 className="text-white text-7xl font-extrabold mb-6">
        Bragbook.cv
      </h1>

      {/* Subheading */}
      <p className="text-white/90 text-xl max-w-2xl mb-12 leading-relaxed">
        Transform your professional story into an immersive portfolio experience.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-6">
        <button
          onClick={onZoomIn}
          className="
            px-10 py-4 
            rounded-xl 
            bg-[#5EEAD4] 
            text-gray-900 
            font-semibold 
            shadow-lg 
            hover:scale-105 
            transition
          "
        >
          Start Building Free →
        </button>

        <button
          onClick={onZoomOut}
          className="
            px-10 py-4 
            rounded-xl 
            bg-white/20 
            text-white 
            font-semibold 
            border border-white/40 
            hover:bg-white/30 
            transition
          "
        >
          Sign In
        </button>
      </div>
    </section>
  );
}
