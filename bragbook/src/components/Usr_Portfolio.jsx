import { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";


// sample data for now 
const user = {
    name: "John Doe",
    initials: "JD",
    tagline: "Full-Stack Developer | UI/UX Enthusiast | Open Source Contributor",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    bio: "Passionate software engineer with 5+ years of experience.", 

    achievements: [
        { title: "E-Commerce Platform Development", company: "Tech Solutions Inc.", dates: "Jan 2022 - Dec 2023" },
        { title: "AI-Powered Analytics Dashboard",  company: "Data Insights Corp",  dates: "Mar 2021 - Aug 2021" },
        { title: "Open Source Contribution - UI Lib", company: "GitHub Community",  dates: "Jun 2020 - Present" },
        { title: "Mobile App for Healthcare",        company: "HealthTech Startup",  dates: "Sep 2019 - Feb 2020" },
    ],
    socials: [
        { platform: "LinkedIn",  url: "linkedin.com/in/johndoe", icon: "in" },
        { platform: "GitHub",    url: "github.com/johndoe",      icon: "gh" },
        { platform: "Twitter",   url: "twitter.com/johndoe",     icon: "tw" },
        { platform: "Portfolio", url: "johndoe.com",             icon: "PF" },
    ],
};


// frames for each section of the profile 
const FRAMES = [
    { id: "overview",   x: 680,  y: 380,  w: 640, h: "420" },
    { id: "profile",      label: "Profile",    x: 60,   y: 60,   w: 580, h: "800" },
    { id: "education",    label: "Education",  x: 60,   y: 680,  w: 580, h: "380" },
    { id: "achievements", label: "Achievements", x: 1360,  y: 60,   w: 580, h: "500"},
];

const CANVAS_W = 2060;
const CANVAS_H = 1160;

export default function Usr_Portfolio() {
    // state to track which frame the usr is currently on (null = overview)
    const [canvasFrame, setCanvasFrame] = useState(null);

    // Firebase fetch could go here 

    const [educationEntries, setEducationEntries] = useState([
        { degree: "B.S. Computer Science", school: "Stanford University", location: "Stanford, CA", dates: "Sep 2015 - Jun 2019", desc: "Focused on software engineering and AI." },
        { degree: "M.S. Software Engineering", school: "MIT", location: "Cambridge, MA", dates: "Sep 2019 - Jun 2021", desc: "Specialized in distributed systems." },
    ]);

    // state that will hold usr's education stored in firebase
    // const [educationEntries, setEducationEntries] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(collection(db, "users", auth.currentUser.uid, "education"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEducationEntries(entries);
        });
        return () => unsubscribe();
    }, []);


    // firebase fetch for education entries 
    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(
            collection(db, "users", auth.currentUser.uid, "education"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEducationEntries(entries);
        });
        return () => unsubscribe();
    }, []);



    const goTo = (frame) => setCanvasFrame(frame);
    const goOverview = () => setCanvasFrame(null);

    const currentIdx = FRAMES.findIndex(f => f.id === canvasFrame?.id);
    const prevFrame  = currentIdx > 0 ? FRAMES[currentIdx - 1] : null;
    const nextFrame  = currentIdx < FRAMES.length - 1 ? FRAMES[currentIdx + 1] : null;

    // making a zoom/pan for the canvas
    const getCanvasTransform = () => {
        const vw = window.innerWidth  || 1280;
        const vh = (window.innerHeight || 800) - 52;

        if (!canvasFrame) {
            // zoom out to fit the entire canvas in the viewport
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


    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden " style={{background: "#f0f4f8" }}>
            {/* Nav Bar */}
            <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm " style={{ height: 52 }}>
                <span className="text-xl font-bold " style={{ background: "linear-gradient(90deg, #003C61, #007C77, #0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"  }}>
                    BragBook.cv 
                </span>
                <div className="flex items-center gap-3 ">
                    <button className="ext-xl text-[#003C61] bg-transparent border-none cursor-pointer "> ☰ </button>
                </div>
            </nav>

            {/* main content area */}
            <div className="flex-1 relative overflow-hidden "> {/* canvas view */}
                <div style={{width: CANVAS_W, height: CANVAS_H, position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: getCanvasTransform(), transition: "transform 0.65s cubic-bezier(0.77, 0, 0.18, 1)"}}>

                    {/* frame labels for the overview */}
                    {!canvasFrame && FRAMES.map(f => (
                        <div key={f.id + "-1b1"} className=" absolute text-[10px] font-bold text-[#007C77] uppercase tracking-widest pointer-events-none" style={{left: f.x + f.w / 2, top: f.y - 20, transform: "translateX(-50%)"}}>
                            {f.label}
                        </div>
                    ))}

                    {/* Profile card frames */}    
                    <FrameCard frame={FRAMES[1]} active={canvasFrame?.id === "profile"} onClick={ () => goTo(FRAMES[1])}>
                        <div className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #007C77, #0d9488, #003C61)" }} />
                        
                        {/* avatar + name row */}
                        <div className="absolute left-6 right-6" style={{top: 36}}>
                            <div className="flex items-end gap-4">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-extrabold border-2 border-white shadow shrink-0" style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                    {user.initials}
                                </div>
                                <div className="flex-1 pb-1">
                                    <p className="text-base font-extrabold text-[#003C61]">{user.name}</p>
                                    <p className="text-[10px] text-gray-400 leading-snug">{user.tagline}</p>
                                    <p className="text-[10px] text-gray-300 mt-1">📍 {user.location} · ✉️ {user.email}</p>
                                </div>
                                <button className="self-start bg-gray-100 hover:bg-gray-200 text-[#003C61] text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer">
                                    Edit Profile
                                </button>
                            </div>
                        </div>     

                        {/* bio */}
                            <p className="text-[11px] text-gray-400 mb-4">{user.bio}</p>

                            {/* socials grid */}
                            <p className="text-xs font-extrabold text-[#003C61] mb-2">Connect</p>
                            <div className="grid grid-cols-2 gap-2">
                                {user.socials.map((soc, i) => (
                                    <div key={i} className="border border-gray-200 rounded-xl p-2.5 flex gap-2.5 items-center hover:border-[#007C77] transition-colors cursor-pointer">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-[#007C77] shrink-0" style={{ background: "rgba(0,124,119,0.08)" }}>
                                            {soc.icon}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#003C61]">{soc.platform}</p>
                                            <p className="text-[9px] text-gray-300">{soc.url}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                    </FrameCard>

                    {/* education frame */}
                    <FrameCard frame={FRAMES[2]} active={canvasFrame?.id === "education"} onClick={() => goTo(FRAMES[2])}>
                        <div className="flex justify-between items-center mb-3 "> 
                            <p className="text-sm font-extrabold text-[#003C61] "> Education</p>
                            <button className="bg-[#007C77] hover:bg-[#005f5b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer "> + New Education </button> {/* route the usr to create_education form */}
                        </div>
                        {/* education cards for each entry */}
                        {educationEntries.length === 0 ? (
                            <p className="text-xs text-gray-300 mt-4 text-center">No education entries yet. Click "Add Education" to get started!</p>
                        ) : (
                            educationEntries.map((edu, i) => (
                                <div key={i} className={`flex gap-3 p-3 mb-2 border border-gray-100 rounded-xl hover:border-[#007C77]/40 transition-colors`} >
                                    <div>
                                        <p className="text-sm font-semibold text-[#003C61]">{edu.degree}</p>
                                        <p className="text-[10px] text-gray-400">{edu.school} | {edu.location} </p>
                                        <p className="text-[10px] text-gray-400">{edu.dates}</p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">{edu.desc}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </FrameCard>

                    {/* achievement(brags) entries cards frame */}
                    <FrameCard frame={FRAMES[3]} active={canvasFrame?.id === "achievements"} onClick={() => goTo(FRAMES[3])}>
                        <div className="flex justify-between items-center mb-3 "> 
                            <p className="text-sm font-extrabold text-[#003C61] "> Achievements</p>
                            <button className="bg-[#007C77] hover:bg-[#005f5b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer "> + Add New Entry</button> {/* route the usr to achievement_create form */}
                        </div>
                        {/* achievement cards for each entry */}
                        <div>
                            {user.achievements.map((b_entry, i) => (
                                <div key={i} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-1 hover:border-[#007C77] transition-colors cursor-pointer">
                                    <div>
                                        <p className="text-[11px] font-bold text-[#003C61]">{b_entry.title}</p>
                                        <p className="text-[10px] text-gray-400">{b_entry.company}</p>
                                        <p className="text-[10px] text-gray-400">{b_entry.dates}</p>
                                        <span className="text-[10px] text-[#007C77] font-semibold mt-1">View details →</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FrameCard>

                </div>
            </div>

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