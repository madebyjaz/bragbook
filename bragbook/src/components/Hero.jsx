import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

  .hero-root * { cursor: none !important; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fu1 { animation: fadeUp 0.7s 0.05s ease both; }
  .fu2 { animation: fadeUp 0.7s 0.15s ease both; }
  .fu3 { animation: fadeUp 0.7s 0.25s ease both; }
  .fu4 { animation: fadeUp 0.7s 0.38s ease both; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 55%, #0d9488 100%);
    color: #072b28;
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 700;
    padding: 16px 36px;
    border-radius: 999px;
    border: none;
    letter-spacing: 0.01em;
    box-shadow: 0 0 48px rgba(45,212,191,0.4), 0 6px 28px rgba(0,0,0,0.35);
    transition: box-shadow 0.25s ease, transform 0.18s ease;
    cursor: none;
  }
  .btn-primary:hover {
    box-shadow: 0 0 72px rgba(45,212,191,0.6), 0 8px 36px rgba(0,0,0,0.45);
    transform: translateY(-2px) scale(1.025);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: rgba(255,255,255,0.88);
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 36px;
    border-radius: 999px;
    letter-spacing: 0.01em;
    transition: background 0.2s ease, transform 0.18s ease;
    cursor: none;
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }
`;

export default function Hero() {
  const sceneRef  = useRef(null);
  const glow1Ref  = useRef(null);
  const glow2Ref  = useRef(null);
  const glow3Ref  = useRef(null);
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const ringPos   = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const mx = e.clientX;
      const my = e.clientY;
      mouse.current = { x: mx, y: my };

      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx}px`;
        cursorRef.current.style.top  = `${my}px`;
      }

      const cx = (mx / window.innerWidth  - 0.5) * 2;
      const cy = (my / window.innerHeight - 0.5) * 2;

      if (sceneRef.current)
        sceneRef.current.style.transform = `translate(${cx * -10}px, ${cy * -7}px)`;
      if (glow1Ref.current)
        glow1Ref.current.style.transform = `translate(${cx * 24}px, ${cy * 16}px)`;
      if (glow2Ref.current)
        glow2Ref.current.style.transform = `translate(${cx * -18}px, ${cy * -12}px)`;
      if (glow3Ref.current)
        glow3Ref.current.style.transform = `translate(${cx * 12}px, ${cy * 9}px)`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.16;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="hero-root"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
        color: "#fff",
        userSelect: "none",
      }}
    >
      <style>{styles}</style>

      {/* Cursor dot */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "rgba(45,212,191,0.95)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1.5px solid rgba(45,212,191,0.38)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Background base gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 68% 18%, #0f7060 0%, #0c3040 42%, #081c2c 100%)",
        }}
      />

      {/* Glow layer 1 — top-right bloom */}
      <div
        ref={glow1Ref}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 60% 60% at 78% 14%, rgba(20,190,165,0.38) 0%, transparent 68%)",
          transition: "transform 0.12s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Glow layer 2 — bottom-left */}
      <div
        ref={glow2Ref}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 45% 45% at 18% 78%, rgba(6,85,95,0.55) 0%, transparent 68%)",
          transition: "transform 0.12s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Glow layer 3 — bottom-right accent */}
      <div
        ref={glow3Ref}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 35% 35% at 88% 82%, rgba(10,130,108,0.28) 0%, transparent 68%)",
          transition: "transform 0.12s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Noise overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          opacity: 0.045,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Main scene — parallax wrapper */}
      <div
        ref={sceneRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.09s ease-out",
          willChange: "transform",
        }}
      >
        {/* Badge */}
        <div
          className="fu1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 999,
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "0.01em",
            marginBottom: 30,
          }}
        >
          <span style={{ color: "#2dd4bf", fontSize: 14, lineHeight: 1 }}>✦</span>
          Your Career, Elevated
        </div>

        {/* Heading */}
        <h1
          className="fu2"
          style={{
            fontSize: "clamp(56px, 8.5vw, 108px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            color: "#fff",
            textAlign: "center",
            margin: "0 0 22px",
          }}
        >
          Bragbook.cv
        </h1>

        {/* Subtext */}
        <p
          className="fu3"
          style={{
            fontSize: "clamp(15px, 1.8vw, 20px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.68)",
            letterSpacing: "0.008em",
            textAlign: "center",
            margin: "0 0 46px",
            maxWidth: 640,
          }}
        >
          Transform your professional story into an immersive portfolio experience
        </p>

        {/* Buttons */}
        <div
          className="fu4"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          <button className="btn-primary">
            Start Building Free <span style={{ fontSize: 18 }}>→</span>
          </button>
          <button className="btn-secondary">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
