import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, onSnapshot, orderBy, query, doc, getDoc, deleteDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

// frames for each section of the profile
const FRAMES = [
    { id: "name_card", label: "Profile", x: 750, y: 340, w: 480, h: 500 },
    { id: "profile",      label: "About Me",     x: 60,   y: 60,   w: 580, h: 500   },
    { id: "education",    label: "Education",  x: 60,   y: 680,  w: 580, h: 380 },
    { id: "achievements", label: "Achievements", x: 1360,  y: 60,   w: 580, h: 400},
];

const CANVAS_W = 2060;
const CANVAS_H = 1100;

export default function Usr_Portfolio() {
    // state to track which frame the usr is currently on (null = overview)
    const [canvasFrame, setCanvasFrame] = useState(null);

    // useNavigate hook for redirecting after logout
    const navigate = useNavigate();

    // state to hold real user profile data fetched from Firestore
    const [userData, setUserData] = useState(null);

    // state to track loading while fetching user data from Firestore
    const [profileLoading, setProfileLoading] = useState(true);

    // state to hold the authenticated user once Firebase Auth is ready
    const [currentUser, setCurrentUser] = useState(null);

    // mock education entries. Moved inside component to fix invalid hook call error
    const [educationEntries, setEducationEntries] = useState([
        { degree: "B.S. Computer Science", school: "Stanford University", location: "Stanford, CA", dates: "Sep 2015 - Jun 2019", desc: "Focused on software engineering and AI." },
        { degree: "M.S. Software Engineering", school: "MIT", location: "Cambridge, MA", dates: "Sep 2019 - Jun 2021", desc: "Specialized in distributed systems." },
    ]);

    // wait for Firebase Auth to initialize before fetching any data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                setProfileLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // fetch the logged-in user's profile data from Firestore
    useEffect(() => {
        if (!currentUser) return;
        const fetchProfile = async () => {
            const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
            setProfileLoading(false);
        };
        fetchProfile();
    }, [currentUser]);

    // firebase fetch for education entries. I used ai to help write this useeffect funct bc I could not figure it out.
    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "users", currentUser.uid, "education"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEducationEntries(entries);
        });
        return () => unsubscribe();
    }, [currentUser]);

    // firebase fetch for achievement entries (#75)
    const [achievementEntries, setAchievementEntries] = useState([]);

    // tracks which achievement card is expanded to show details (#90)
    const [expandedAchievement, setExpandedAchievement] = useState(null);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "users", currentUser.uid, "achievements"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setAchievementEntries(entries);
        });
        return () => unsub();
    }, [currentUser]);

    // This allows user to sign out of Firebase and be redirected to homepage
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    // deletes an achievement entry from Firestore (#78)
    const handleDeleteAchievement = async (e, entryId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this achievement?")) return;
        await deleteDoc(doc(db, "users", currentUser.uid, "achievements", entryId));
    };

    // Acts as a handler to navigate to a specific frame
    const goTo = (frame) => setCanvasFrame(frame);
    // const goOverview = () => setCanvasFrame(null);

    const currentIdx = FRAMES.findIndex(f => f.id === canvasFrame?.id);
    const prevFrame  = currentIdx > 0 ? FRAMES[currentIdx - 1] : null;
    const nextFrame  = currentIdx < FRAMES.length - 1 ? FRAMES[currentIdx + 1] : null;

    // making a zoom/pan for the canvas
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

    // shows a  loading indicator while fetching profile data from Firebase
    if (profileLoading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f0f4f8]">
            <p className="text-[#007C77] font-semibold text-sm">Loading your portfolio...</p>
        </div>
    );

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={{background: "#f0f4f8"}}>
            {/* Nav Bar */}
            <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm" style={{ height: 52 }}>
                <span className="text-xl font-bold" style={{ background: "linear-gradient(90deg, #003C61, #007C77, #0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> BragBook.cv </span>
                <div className="flex items-center gap-3">
                    {/* Share portfolio link button (#77) */}
                    <button
                        onClick={() => {
                            const link = `${window.location.origin}/u/${currentUser.uid}`;
                            navigator.clipboard.writeText(link);
                            alert("Portfolio link copied!");
                        }}
                        className="text-sm font-semibold text-[#007C77] bg-white border border-[#007C77] hover:bg-[#007C77] hover:text-white px-4 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                        Share Portfolio
                    </button>
                    {/* Logout button — signs out of Firebase and redirects to homepage */}
                    <button
                        onClick={handleLogout}
                        className="text-sm font-semibold text-white bg-[#007C77] hover:bg-[#005f5b] px-4 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            {/* main content area */}
            <div className="flex-1 relative overflow-hidden">
                <div style={{width: CANVAS_W, height: CANVAS_H, position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: getCanvasTransform(), transition: "transform 0.65s cubic-bezier(0.77, 0, 0.18, 1)"}}>

                    {/* frame labels for the overview */}
                    {!canvasFrame && FRAMES.map(f => (
                        <div key={f.id + "-1b1"} className="absolute text-[10px] font-bold text-[#007C77] uppercase tracking-widest pointer-events-none" style={{left: f.x + f.w / 2, top: f.y - 20, transform: "translateX(-50%)"}}> {f.label} </div>
                    ))}

                    <FrameCard frame={FRAMES[0]} active={canvasFrame?.id === "name_card"} onClick={() => goTo(FRAMES[0])}>
                        <div className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl"
                            style={{ background: "linear-gradient(135deg, #007C77, #0d9488, #003C61)" }} />
                        <div className="flex flex-col items-center" style={{ marginTop: 40 }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-lg"
                                style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                {/* compute initials from real user name from Firestore (#73) */}
                                {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                            </div>
                            <p className="text-xl font-extrabold text-[#003C61] mt-3">{userData?.name || 'Your Name'}</p>
                            <p className="text-xs text-gray-400 text-center mt-1 leading-snug px-4">{userData?.tagline || 'Add a tagline in Edit Profile'}</p>
                            <p className="text-[10px] text-gray-300 mt-1">📍 {userData?.location || ''}</p>
                        </div>
                    </FrameCard>

                    <FrameCard frame={FRAMES[1]} active={canvasFrame?.id === "profile"} onClick={() => goTo(FRAMES[1])}>
                        <div className="absolute left-6 right-6" style={{ top: 36 }}>
                            <div className="flex items-end gap-4">
                                <div className="flex-1 pb-1">
                                    <p className="text-[10px] text-gray-300 mt-1">📍 {userData?.location || ''} · ✉️ {userData?.email || ''}</p>
                                </div>
                                <button /* onClick={(e) => { e.stopPropagation(); navigate("/profile/edit")}} */ className="self-start bg-gray-100 hover:bg-gray-200 text-[#003C61] text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"> Edit Profile </button>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-4 mb-3">{userData?.bio || 'Add a bio in Edit Profile'}</p>
                            <p className="text-xs font-extrabold text-[#003C61] mb-2">Connect</p>
                            <div className="grid grid-cols-2 gap-2">
                                {/* socials from Firestore are stored as an object — convert to array for display */}
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

                    <FrameCard frame={FRAMES[2]} active={canvasFrame?.id === "education"} onClick={() => goTo(FRAMES[2])}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-extrabold text-[#003C61]"> Education</p>
                            <button /* onClick={(e) => {e.stopPropagation(); navigate("/education/create")}} */ className="bg-[#007C77] hover:bg-[#005f5b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"> + New Education </button>
                        </div>
                        {educationEntries.length === 0 ? (
                            <p className="text-xs text-gray-300 mt-4 text-center">No education entries yet. Click "Add Education" to get started!</p>
                        ) : (
                            educationEntries.map((edu, i) => (
                                <div key={i} /* onClick={(e) => { e.stopPropagation(); navigate(`/education/view/${edu.id}`) }} */ className="flex gap-3 p-3 mb-2 border border-gray-100 rounded-xl hover:border-[#007C77]/40 transition-colors">
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

                    <FrameCard frame={FRAMES[3]} active={canvasFrame?.id === "achievements"} onClick={() => goTo(FRAMES[3])}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-extrabold text-[#003C61]"> Achievements</p>
                            <button /* onClick={(e) => {e.stopPropagation(); navigate("/achievements/create")}} */ className="bg-[#007C77] hover:bg-[#005f5b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"> + Add New Entry</button>
                        </div>
                        {/* achievement entries fetched from Firestore (#75) — replaces old hardcoded data */}
                        <div>
                            {achievementEntries.length === 0 ? (
                                <p className="text-xs text-gray-300 mt-4 text-center">No achievements yet. Click "+ Add New Entry" to get started!</p>
                            ) : (
                                achievementEntries.map((entry) => (
                                    <div key={entry.id} className="border border-gray-200 rounded-xl p-3 mb-2 flex flex-col gap-1 hover:border-[#007C77] transition-colors cursor-pointer">
                                        <p className="text-[11px] font-bold text-[#003C61]">{entry.title}</p>
                                        <p className="text-[10px] text-gray-400">{entry.company || entry.category}</p>
                                        <p className="text-[10px] text-gray-400">
                                            {entry.dateStarted?.month} {entry.dateStarted?.year} — {entry.isPresent ? "Present" : `${entry.dateCompleted?.month} ${entry.dateCompleted?.year}`}
                                        </p>
                                        {/* toggle description visibility (#90) */}
                                        <span
                                            onClick={(e) => { e.stopPropagation(); setExpandedAchievement(expandedAchievement === entry.id ? null : entry.id); }}
                                            className="text-[10px] text-[#007C77] font-semibold mt-1 cursor-pointer"
                                        >
                                            {expandedAchievement === entry.id ? "Hide details ↑" : "View details →"}
                                        </span>
                                        {/* expanded description view (#90) */}
                                        {expandedAchievement === entry.id && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <p className="text-[10px] font-semibold text-[#003C61] mb-1">Description</p>
                                                <p className="text-[10px] text-gray-400">{entry.description || "No description provided."}</p>
                                            </div>
                                        )}
                                        {/* delete button for achievement entry (#78) */}
                                        <button
                                            onClick={(e) => handleDeleteAchievement(e, entry.id)}
                                            className="text-[10px] text-red-400 hover:text-red-600 font-semibold mt-1 bg-transparent border-none cursor-pointer text-left p-0"
                                        >
                                            Delete
                                        </button>
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