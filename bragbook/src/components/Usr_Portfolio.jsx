import { useState } from "react";

// sample data for now 
const user = {
    name: "John Doe",
    initials: "JD",
    title: "Full-Stack Developer | UI/UX Enthusiast | Open Source Contributor",
    location: "San Francisco, CA",


    education: [
        { degree: "B.S. Computer Science", school: "Stanford University", dates: "Sep 2015 - Jun 2019", desc: "Focused on software engineering and AI. Graduated with honors." },
        { degree: "M.S. Software Engineering", school: "MIT", dates: "Sep 2019 - Jun 2021", desc: "Specialized in distributed systems and cloud computing." },
    ],
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

}

// Reusable Frame Card component for each section 
function FrameCard({ frame, active, onClick, children }) {
    return (
        <div
            onClick={onClick}
            style={{
                position: "absolute",
                left: frame.x, top: frame.y,
                width: frame.w, height: frame.h,
                padding: 28, boxSizing: "border-box",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                boxShadow: active
                    ? "0 0 0 3px #59168B 0 24px 60px rgba(0,0,0,0.18)"
                    : "0 4px 24px rgba(0,0,0,0.08)",
                overflow: "hidden",
                cursor: active ? "default" : "pointer",
                transition: "box-shadow 0.2s ease",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.boxShadow = "0 0 0 2.5px #0d9488, 0 12px 40px rgba(0,0,0,0.13)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}
        >
            {children}
        </div>
    );
}