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

// state that will hold usr's education stored in firebase
const [educationEntries, setEducationEntries] = useState([]);

useEffect(() => {
    const q = query(collection(db, "users", auth.currentUser.uid, "education"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEducationEntries(entries);
    });
    return () => unsubscribe();
}, []);


// frames for each section of the profile 
const FRAMES = [
    { id: "overview",     label: "Overview",     },
    { id: "profile",      label: "Profile",     },
    { id: "education",    label: "Education",   },
    { id: "achievements", label: "Achievements", },
    { id: "contact",      label: "Connect",      },
];

const CANVAS_W = 1660;
const CANVAS_H = 1180;

export default function Usr_Portfolio() {
    // state to track which frame the usr is currently on (null = overview)
    const [canvasFrame, setCanvasFrame] = useState(null);

    // Firebase fetch could go here 

    const [educationEntries, setEducationEntries] = useState([
        { degree: "B.S. Computer Science", school: "Stanford University", location: "Stanford, CA", dates: "Sep 2015 - Jun 2019", desc: "Focused on software engineering and AI." },
        { degree: "M.S. Software Engineering", school: "MIT", location: "Cambridge, MA", dates: "Sep 2019 - Jun 2021", desc: "Specialized in distributed systems." },
    ]);

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
        if (!canvasFrame) return "scale(1) translate(0px, 0px)";
        const vw = window.innerWidth  || 1280;
        const vh = (window.innerHeight || 800) - 52;
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
        <div className="fixed inset-0 flex flex-col overflow-hidden " style={{}}>
            {/* Nav Bar */}
            <nav className="bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm " style={{ }}>
                <span className="text-xl font-bold " style={{ background: "linear-gradient(90deg, #003C61, #007C77, #0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"  }}>
                    BragBook.cv 
                </span>
                <div className=" ">
                    <button className="ext-xl text-[#003C61] bg-transparent border-none cursor-pointer "> ☰ </button>
                </div>
            </nav>

            {/* main content area */}
            <div className=" ">
                <div style={{width: CANVAS_W, height: CANVAS_H, position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: getCanvasTransform(), transition: "transform 0.65s cubic-bezier(0.77, 0, 0.18, 1)",}}>

                    {/* frame labels for the overview */}
                    {!canvasFrame && FRAMES.map(f => (
                        <div key={f.id + "-1b1"} className=" " style={{}}>
                            {f.label}
                        </div>
                    ))}

                    {/* overview frame */}
                    <FrameCard frame={FRAMES[0]} active={canvasFrame?.id === "overview"} onClick={() => goTo(FRAMES[0])}>
                        <div className=" " style={{}}>
                            <div className="">

                                <button className=" ">View My Work</button>
                            </div>
                        </div>
                    </FrameCard>
                    {/* Profile card frames */}    

                    <FrameCard frame={FRAMES[1]} active={canvasFrame?.id === "profile"} onClick={() => goTo(FRAMES[1])}>
                        <div className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #007C77, #0d9488, #003C61)" }} />
                        <div className="absolute top-8 left-6 right-6 flex items-end gap-4">

                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-extrabold border-2 border-white shadow shrink-0" style={{ background: "linear-gradient(135deg, #007C77, #0d9488)" }}>
                                {user.initials}
                            </div>

                            <div className="flex-1 pb-1">
                                <p className="text-base font-extrabold text-[#003C61]">{user.name}</p>
                                <p className="text-[10px] text-gray-400 leading-snug">{user.tagline}</p>
                                <p className=" ">{user.bio}</p>
                                <p className="text-[10px] text-gray-300 mt-1">📍 {user.location} · ✉️ {user.email}</p>

                                {/* social media links */}
                                {user.socials.map(s => (
                                        <a key={s.platform} href={s.url} className=" " style={{}}>
                                            {s.icon}
                                        </a>
                                    ))}
                            </div>

                            {/* link to Edit Profile form */}
                            <button className="self-start bg-gray-100 hover:bg-gray-200 text-[#003C61] text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer">
                                ✏ Edit Profile
                            </button>
                        </div>
                    </FrameCard>

                    {/* education frame */}
                    <FrameCard frame={FRAMES[2]} active={canvasFrame?.id === "education"} onClick={() => goTo(FRAMES[2])}>
                        <p className=" "> Education</p>
                        {/* education cards for each entry */}
                        {educationEntries.length === 0 ? (
                            <p className="text-gray-400 mt-4">No education entries yet. Click "Add Education" to get started!</p>
                        ) : (
                            educationEntries.map((edu, i) => (
                                <div key={i} className=" " >
                                    <div>
                                        <p className="text-sm font-semibold">{edu.degree}</p>
                                        <p className="text-sm text-gray-500">{edu.school} | {edu.location} </p>
                                        <p className="text-xs text-gray-400">{edu.dates}</p>
                                        <p className="text-sm mt-1">{edu.desc}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </FrameCard>

                    {/* achievement(brag) entry cards frame */}
                    

                </div>
            </div>

        </div>

    );
}

// Reusable Frame Card component for each section 
function FrameCard({ frame, active, onClick, children }) {
    return (
        <div style={{position: "relative", width: "100%", height:"100%", overflow:"hidden", borderRadius:12, background: "#f0f4f8"}}>
            {/* Scaling to make sure the entire canvas is visible */}
                <div style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: CANVAS_W,
                    height: CANVAS_H,
                    transformOrigin: "top left",
                    transform: `scale(${Math.min((FRAMES[0].w - 56) / CANVAS_W, (FRAMES[0].h - 56) / CANVAS_H)})`,
                    pointerEvents: "none", }}>

                        {FRAMES.slice(1).map(f => (
                            <div key={f.id} style={{
                                position: "absolute",
                                left: f.x, top: f.y,
                                width: f.w, height: f.h,
                                borderRadius: 20,
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center", }}>

                                    <span style={{fontSize: 13, fontWeight: 700, color: "", opacity: 0.5, textTransform: "uppercase", }}>{f.label} </span>
                            </div>
                        ))}
                </div>
        </div>
    );
}