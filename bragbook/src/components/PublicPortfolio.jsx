import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, orderBy, query, doc, getDoc } from "firebase/firestore";

// frames for each section of the public profile (same layout as Usr_Portfolio)
const FRAMES = [
    { id: "name_card", label: "Profile", x: 750, y: 340, w: 480, h: 500 },
    { id: "profile",      label: "About Me",     x: 60,   y: 60,   w: 580, h: 500   },
    { id: "education",    label: "Education",  x: 60,   y: 680,  w: 580, h: 380 },
    { id: "achievements", label: "Achievements", x: 1360,  y: 60,   w: 580, h: 400},
];

const CANVAS_W = 2060;
const CANVAS_H = 1100;

export default function PublicPortfolio() {
    // get the userId from the URL params
    const { userId } = useParams();

    const [canvasFrame, setCanvasFrame] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [educationEntries, setEducationEntries] = useState([]);
    const [achievementEntries, setAchievementEntries] = useState([]);
    const [expandedAchievement, setExpandedAchievement] = useState(null);

    // fetch the public user's profile data from Firestore
    useEffect(() => {
        if (!userId) return;
        const fetchProfile = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'users', userId));
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Error fetching public profile:", err);
                setNotFound(true);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

    // fetch education entries for this user
    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, "users", userId, "education"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setEducationEntries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [userId]);

    // fetch achievement entries for this user
    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, "users", userId, "achievements"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setAchievementEntries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [userId]);

    const goTo = (frame) => setCanvasFrame(frame);

    const currentIdx = FRAMES.findIndex(f => f.id === canvasFrame?.id);
    const prevFrame  = currentIdx > 0 ? FRAMES[currentIdx - 1] : null;
    const nextFrame  = currentIdx < FRAMES.length - 1 ? FRAMES[currentIdx + 1] : null;

    const getCanvasTransform = () => {
        const vw = window.innerWidth  || 1280;
        const vh = (window.innerHeight || 800) - 52;

        if (!canvasFrame) {
            const scaleX = (vw * 0.95) / CANVAS_W;
            const scaleY = (vh * 0.95) / CANVAS_H;
            const scale  = Math.min(scaleX, scaleY);
            const tx = (vw / scale - CANVAS_W) / 2;
            const ty = (vh / scale - CANVAS_H) / 2;
            return `scale(${scale}) translate(${tx}px, ${ty}px)`;
        }

        const scaleX = (vw * 0.88) / canvasFrame.w;
        const scaleY = (vh * 0.88) / canvasFrame.h;
        const scale  = Math.min(scaleX, scaleY, 1.9);
        const cx = canvasFrame.x + canvasFrame.w / 2;
        const cy = canvasFrame.y + canvasFrame.h / 2;
        const tx = vw / 2 / scale - cx;
        const ty = vh / 2 / scale - cy;
        return `scale(${scale}) translate(${tx}px, ${ty}px)`;
    };

    // loading state
    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f0f4f8]">
            <p className="text-[#007C77] font-semibold text-sm">Loading portfolio...</p>
        </div>
    );

    // user not found
    if (notFound) return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f0f4f8]">
            <div className="text-center">
                <p className="text-xl font-bold text-[#003C61] mb-2">Portfolio not found</p>
                <p className="text-sm text-gray-400">This user doesn't exist or their portfolio is unavailable.</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={{background: "#f0f4f8"}}>
            {/* Nav Bar — public version, no logout button */}
            <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm" style={{ height: 52 }}>
                <span className="text-xl font-bold" style={{ background: "linear-gradient(90deg, #003C61, #007C77, #0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> BragBook.cv </span>
                <span className="text-[10px] text-gray-400 font-medium">Public Portfolio</span>
            </nav>

            {/* main content area */}
            <div className="flex-1 relative overflow-hidden">
                <div style={{width: CANVAS_W, height: CANVAS_H, position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: getCanvasTransform(), transition: "transform 0.65s cubic-bezier(0.77, 0, 0.18, 1)"}}>

                    {/* frame labels for the overview */}
                    {!canvasFrame && FRAMES.map(f => (
                        <div key={f.id + "-1b1"} className="absolute text-[10px] font-bold text-[#007C77] uppercase tracking-widest pointer-events-none" style={{left: f.x + f.w / 2, top: f.y - 20, transform: "translateX(-50%)"}}> {f.label} </div>
                    ))}

                    {/* Profile name card — no edit buttons */}
                    <FrameCard frame={FRAMES[0]} active={canvasFrame?.id === "name_card"} onClick={() => goTo(FRAMES[0])}>
                        <div className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl"
                            style={{ background: "linear-gradient(135deg, #007C77, #0d9488, #003C61)" }} />
                        <div className="flex flex-col items-center" style={{ marginTop: 40 }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-lg"
                                style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                            </div>
                            <p className="text-xl font-extrabold text-[#003C61] mt-3">{userData?.name || 'Unknown User'}</p>
                            <p className="text-xs text-gray-400 text-center mt-1 leading-snug px-4">{userData?.tagline || ''}</p>
                            <p className="text-[10px] text-gray-300 mt-1">{userData?.location ? `📍 ${userData.location}` : ''}</p>
                        </div>
                    </FrameCard>

                    {/* About Me — no edit button */}
                    <FrameCard frame={FRAMES[1]} active={canvasFrame?.id === "profile"} onClick={() => goTo(FRAMES[1])}>
                        <div className="absolute left-6 right-6" style={{ top: 36 }}>
                            <p className="text-[10px] text-gray-300 mt-1">{userData?.location ? `📍 ${userData.location}` : ''} {userData?.email ? `· ✉️ ${userData.email}` : ''}</p>
                            <p className="text-[11px] text-gray-400 mt-4 mb-3">{userData?.bio || ''}</p>
                            <p className="text-xs font-extrabold text-[#003C61] mb-2">Connect</p>
                            <div className="grid grid-cols-2 gap-2">
                                {userData?.socials && Object.entries(userData.socials).map(([platform, url], i) => (
                                    url ? (
                                        <div key={i} className="border border-gray-200 rounded-xl p-2.5 flex gap-2.5 items-center hover:border-[#007C77] transition-colors cursor-pointer">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-[#007C77] shrink-0" style={{ background: "rgba(0,124,119,0.08)" }}>
                                                {platform.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#003C61] capitalize">{platform}</p>
                                                <p className="text-[9px] text-gray-300 truncate">{url}</p>
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    </FrameCard>

                    {/* Education — no add button */}
                    <FrameCard frame={FRAMES[2]} active={canvasFrame?.id === "education"} onClick={() => goTo(FRAMES[2])}>
                        <p className="text-sm font-extrabold text-[#003C61] mb-3">Education</p>
                        {educationEntries.length === 0 ? (
                            <p className="text-xs text-gray-300 mt-4 text-center">No education entries yet.</p>
                        ) : (
                            educationEntries.map((edu, i) => (
                                <div key={i} className="flex gap-3 p-3 mb-2 border border-gray-100 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold text-[#003C61]">{edu.degree}</p>
                                        <p className="text-[10px] text-gray-400">{edu.school} | {edu.location}</p>
                                        <p className="text-[10px] text-gray-400">{edu.dates}</p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">{edu.desc}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </FrameCard>

                    {/* Achievements — no add or delete buttons */}
                    <FrameCard frame={FRAMES[3]} active={canvasFrame?.id === "achievements"} onClick={() => goTo(FRAMES[3])}>
                        <p className="text-sm font-extrabold text-[#003C61] mb-3">Achievements</p>
                        <div style={{overflowY: "auto", maxHeight: "300px"}} onClick={(e) => e.stopPropagation()}>
                            {achievementEntries.length === 0 ? (
                                <p className="text-xs text-gray-300 mt-4 text-center">No achievements yet.</p>
                            ) : (
                                achievementEntries.map((entry) => (
                                    <div key={entry.id} className="border border-gray-200 rounded-xl p-3 mb-2 flex flex-col gap-1">
                                        <p className="text-[11px] font-bold text-[#003C61]">{entry.title}</p>
                                        <p className="text-[10px] text-gray-400">{entry.company || entry.category}</p>
                                        <p className="text-[10px] text-gray-400">
                                            {entry.dateStarted?.month} {entry.dateStarted?.year} — {entry.isPresent ? "Present" : `${entry.dateCompleted?.month} ${entry.dateCompleted?.year}`}
                                        </p>
                                        <span
                                            onClick={(e) => { e.stopPropagation(); setExpandedAchievement(expandedAchievement === entry.id ? null : entry.id); }}
                                            className="text-[10px] text-[#007C77] font-semibold mt-1 cursor-pointer"
                                        >
                                            {expandedAchievement === entry.id ? "Hide details ↑" : "View details →"}
                                        </span>
                                        {expandedAchievement === entry.id && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <p className="text-[10px] font-semibold text-[#003C61] mb-1">Description</p>
                                                <p className="text-[10px] text-gray-400">{entry.description || "No description provided."}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </FrameCard>

                </div>
            </div>

            {/* Prev arrow */}
            {canvasFrame && prevFrame && (
                <button onClick={() => goTo(prevFrame)}
                    className="fixed left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 shadow-lg rounded-full text-2xl text-[#003C61] flex items-center justify-center z-50 border-none cursor-pointer hover:bg-white transition-colors">
                    ‹
                </button>
            )}

            {/* Next arrow */}
            {canvasFrame && nextFrame && (
                <button onClick={() => goTo(nextFrame)}
                    className="fixed right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 shadow-lg rounded-full text-2xl text-[#003C61] flex items-center justify-center z-50 border-none cursor-pointer hover:bg-white transition-colors">
                    ›
                </button>
            )}

        </div>
    );
}

// Reusable Frame Card component for each section
function FrameCard({ frame, active, onClick, children }) {
    return (
        <div onClick={onClick} style={{ position: "absolute", left: frame.x, top: frame.y, width: frame.w, height: frame.h, padding: 28, boxSizing: "border-box", borderRadius: 20, backgroundColor: "#ffffff", boxShadow: active ? "0 0 0 3px #007C77, 0 24px 60px rgba(0,0,0,0.18)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", cursor: active ? "default" : "pointer", transition: "box-shadow 0.2s ease"}}
        onMouseEnter={e => { if (!active) e.currentTarget.style.boxShadow = "0 0 0 2.5px #007C77, 0 12px 40px rgba(0,0,0,0.13)"; }} onMouseLeave={e => { if (!active) e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}>
            {children}
        </div>
    );
}