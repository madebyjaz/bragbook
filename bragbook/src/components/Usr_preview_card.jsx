import { useState, useEffect } from "react";

export default function PreviewCard({ users }) {
    const [current, setCurrent] = useState(0);

    // auto rotate it will advance every 4.5 seconds (enough time to actually read the card)
    useEffect(() => {
        if (!users || users.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % users.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [users]);

    if (!users || users.length === 0) return null;

    const prev = () => setCurrent((c) => (c - 1 + users.length) % users.length);
    const next = () => setCurrent((c) => (c + 1) % users.length);

    return (
        <div className="w-full flex flex-col items-center gap-6">

            {/* carousel tracking */}
            <div className="relative flex items-center justify-center w-full" style={{ height: 360 }}>

                {users.map((user, i) => {
                    const offset = i - current;
                    const isCenter = offset === 0;
                    const isLeft   = offset === -1 || (current === 0 && i === users.length - 1);
                    const isRight  = offset === 1  || (current === users.length - 1 && i === 0);
                    const isHidden = !isCenter && !isLeft && !isRight;

                    const transform = isCenter
                        ? "translateX(0) scale(1)"
                        : isLeft
                        ? "translateX(-220px) scale(0.82)"
                        : isRight
                        ? "translateX(220px) scale(0.82)"
                        : "translateX(0) scale(0.7)";

                    return (
                        <div key={user.id}
                            onClick={() => !isCenter && setCurrent(i)}
                            style={{
                                position: "absolute",
                                width: 260,
                                transform,
                                opacity: isHidden ? 0 : isCenter ? 1 : 0.55,
                                zIndex: isCenter ? 10 : isHidden ? 0 : 5,
                                transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                                cursor: isCenter ? "default" : "pointer",
                            }}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl select-none"
                        >
                            {/* gradient banner */}
                            <div className="h-14 w-full"
                                style={{ background: "linear-gradient(135deg, #007C77, #0d9488, #003C61)" }} />

                            {/* avatar */}
                            <div className="flex justify-center -mt-6 mb-2">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold border-4 border-white shadow-md"
                                    style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                    {user.initials}
                                </div>
                            </div>

                            {/* user info (location, tagline) */}
                            <div className="px-4 pb-4 flex flex-col items-center gap-1.5 text-center">
                                <p className="text-sm font-extrabold text-[#003C61]">{user.name}</p>
                                <p className="text-[11px] text-gray-500 leading-snug">{user.tagline}</p>
                                {user.location && (
                                    <p className="text-[10px] text-gray-400">📍 {user.location}</p>
                                )}

                                {/* top achievement w/ company and role */}
                                {user.topAchievement && (
                                    <div className="w-full bg-gray-200 rounded-xl p-2.5 text-left mt-1">
                                        <p className="text-[10px] font-extrabold text-[#007C77] uppercase tracking-widest mb-0.5">
                                            🏆 Top Achievement
                                        </p>
                                        <p className="text-[10px] font-bold text-[#003C61]">{user.topAchievement.title}</p>
                                        <p className="text-[10px] text-gray-500">💼 {user.topAchievement.company}</p>
                                    </div>
                                )}

                                <button className="w-full py-1.5 rounded-full text-white text-[10px] font-bold border-none cursor-pointer mt-1"
                                    style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                    View Profile →
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* prev / next arrows */}
                <button onClick={prev}
                    className="absolute left-0 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white text-xl flex items-center justify-center border-none cursor-pointer transition-colors backdrop-blur-sm">
                    ‹
                </button>
                <button onClick={next}
                    className="absolute right-0 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white text-xl flex items-center justify-center border-none cursor-pointer transition-colors backdrop-blur-sm">
                    ›
                </button>
            </div>

            {/* dot indicators */}
            <div className="flex gap-2">
                {users.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className="w-2 h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300"
                        style={{ backgroundColor: i === current ? "#2dd4bf" : "rgba(255,255,255,0.3)" }} />
                ))}
            </div>
        </div>
    );
}