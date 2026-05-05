import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";

export default function Discover() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    // fetch up to 3 user profiles from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, "users"), limit(3));
                const snapshot = await getDocs(q);
                const fetchedUsers = await Promise.all(
                    snapshot.docs.map(async (userDoc) => {
                        const userData = { id: userDoc.id, ...userDoc.data() };

                        // fetch their most recent achievement as topAchievement
                        const achSnap = await getDocs(
                            query(collection(db, "users", userDoc.id, "achievements"), limit(1))
                        );
                        const topAchievement = achSnap.docs[0]?.data() || null;

                        return { ...userData, topAchievement };
                    })
                );
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    // autoplay carousel
    useEffect(() => {
        if (users.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % users.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [users]);

    const prev = () => setCurrent((c) => (c - 1 + users.length) % users.length);
    const next = () => setCurrent((c) => (c + 1) % users.length);

    return (
        <div className="min-h-screen" style={{ background: "radial-gradient(ellipse 90% 90% at 68% 18%, #0f7060 0%, #0c3040 42%, #081c2c 100%)" }}>

            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 shadow-sm" style={{ height: 52 }}>
                <span className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}
                    style={{ background: "linear-gradient(90deg, #2dd4bf, #0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    BragBook.cv
                </span>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/login")}
                        className="text-sm font-semibold text-white/80 hover:text-white px-4 py-1.5 rounded-lg transition-colors border-none cursor-pointer bg-transparent">
                        Log In
                    </button>
                    <button onClick={() => navigate("/signup")}
                        className="text-sm font-semibold text-[#072b28] px-4 py-1.5 rounded-lg border-none cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)" }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Page content */}
            <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-3">Discover</h1>
                    <p className="text-sm text-white/55">
                        Explore other people's proudest accomplishments and get inspired to showcase your own.
                    </p>
                </div>

                {/* Carousel */}
                {loading ? (
                    <p className="text-white/40 text-sm">Loading profiles...</p>
                ) : users.length === 0 ? (
                    <p className="text-white/40 text-sm">No profiles to show yet.</p>
                ) : (
                    <div className="w-full flex flex-col items-center gap-8">

                        {/* cards track */}
                        <div className="relative flex items-center justify-center w-full" style={{ height: 400 }}>
                            {users.map((user, i) => {
                                const offset = i - current;
                                const isCenter = offset === 0;
                                const isLeft   = offset === -1 || (current === 0 && i === users.length - 1);
                                const isRight  = offset === 1  || (current === users.length - 1 && i === 0);
                                const isHidden = !isCenter && !isLeft && !isRight;

                                const transform = isCenter
                                    ? "translateX(0) scale(1)"
                                    : isLeft
                                    ? "translateX(-240px) scale(0.82)"
                                    : isRight
                                    ? "translateX(240px) scale(0.82)"
                                    : "translateX(0) scale(0.7)";

                                const initials = user.name
                                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                    : '?';

                                return (
                                    <div key={user.id}
                                        onClick={() => !isCenter && setCurrent(i)}
                                        style={{
                                            position: "absolute",
                                            width: 280,
                                            transform,
                                            opacity: isHidden ? 0 : isCenter ? 1 : 0.55,
                                            zIndex: isCenter ? 10 : isHidden ? 0 : 5,
                                            transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                                            cursor: isCenter ? "default" : "pointer",
                                        }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-2xl select-none"
                                    >
                                        {/* gradient banner */}
                                        <div className="h-16 w-full"
                                            style={{ background: "linear-gradient(135deg, #007C77, #0d9488, #003C61)" }} />

                                        {/* avatar */}
                                        <div className="flex justify-center -mt-7 mb-2">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.name}
                                                    className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-extrabold border-4 border-white shadow-md"
                                                    style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                                    {initials}
                                                </div>
                                            )}
                                        </div>

                                        {/* user info */}
                                        <div className="px-5 pb-5 flex flex-col items-center gap-1.5 text-center">
                                            <p className="text-sm font-extrabold text-[#003C61]">{user.name || "Anonymous"}</p>
                                            <p className="text-[10px] text-gray-400 leading-snug">{user.tagline || ""}</p>
                                            {user.location && (
                                                <p className="text-[9px] text-gray-300">📍 {user.location}</p>
                                            )}

                                            {/* top achievement */}
                                            {user.topAchievement ? (
                                                <div className="w-full bg-gray-50 rounded-xl p-2.5 text-left mt-2">
                                                    <p className="text-[8px] font-extrabold text-[#007C77] uppercase tracking-widest mb-0.5">
                                                        🏆 Top Achievement
                                                    </p>
                                                    <p className="text-[11px] font-bold text-[#003C61]">{user.topAchievement.title}</p>
                                                    <p className="text-[9px] text-gray-400">💼 {user.topAchievement.company}</p>
                                                </div>
                                            ) : (
                                                <div className="w-full bg-gray-50 rounded-xl p-2.5 text-center mt-2">
                                                    <p className="text-[10px] text-gray-300">No achievements yet</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/login`); }}
                                                className="w-full py-2 rounded-full text-white text-[10px] font-bold border-none cursor-pointer mt-1"
                                                style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                                View Portfolio →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* prev / next arrows */}
                            <button onClick={prev}
                                className="absolute left-0 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl border-none cursor-pointer transition-colors"
                                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                                ‹
                            </button>
                            <button onClick={next}
                                className="absolute right-0 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl border-none cursor-pointer transition-colors"
                                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
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

                        {/* CTA */}
                        <div className="text-center mt-4">
                            <p className="text-white/50 text-xs mb-3">Ready to showcase your own achievements?</p>
                            <button onClick={() => navigate("/signup")}
                                className="px-8 py-3 rounded-full font-semibold text-sm border-none cursor-pointer text-[#072b28]"
                                style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)" }}>
                                Create Your Brag Book →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}