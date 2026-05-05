import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ViewEdu() {

    // entry ID from URL and set up nav
    const { entryId } = useParams();
    const navigate = useNavigate();

    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    // Firebase fetch logic
    useEffect(() => {
        if (!auth.currentUser) return;
        const fetchEntry = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid, "education", entryId));
            if (docSnap.exists()) setEntry({ id: docSnap.id, ...docSnap.data() });
            setLoading(false);
        };
        fetchEntry();
    }, [entryId]);

    // handlers for back, edit, and delete (CRUD functionality)
    const handleBack = () => {
        navigate("/portfolio");
        console.log("back to portfolio");
    };

    const handleEdit = () => {
        navigate(`/education/edit/${entry.id}`);
        console.log("navigate to edit");
    };

    const handleDelete = () => {
        navigate(`/education/delete/${entry.id}`);
        console.log("navigate to delete");
    };

    if (loading) return <p>Loading...</p>;
    if (!entry) return <p>No data found</p>;

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-start justify-center py-10 px-4">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-xl p-8">

                {/* Education CRUD buttons */}
                <div className="flex items-center justify-between mb-6">
                    <button type="button" onClick={handleBack}
                        className="flex items-center gap-2 text-[#007C77] hover:text-[#005f5b] text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer">
                        ← Back to Portfolio
                    </button>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleEdit}
                            className="bg-[#007C77] hover:bg-[#005f5b] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors border-none cursor-pointer">
                            ✏ Edit
                        </button>
                        <button type="button" onClick={handleDelete}
                            className="bg-red-100 hover:bg-red-200 text-red-500 text-xs font-bold px-4 py-2 rounded-lg transition-colors border-none cursor-pointer">
                            🗑 Delete
                        </button>
                    </div>
                </div>

                {/* Degree badge */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: "rgba(13,148,136,0.10)" }}>🎓</div>

                <h2 className="text-2xl font-extrabold text-[#003C61] mb-1">{entry.degree}</h2>
                <p className="text-sm text-gray-500 mb-0.5">{entry.school}</p>
                <p className="text-xs text-gray-400 mb-1">📍 {entry.location}</p>
                <p className="text-xs text-[#007C77] font-semibold mb-6">📅 {entry.dates}</p>

                <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-[#003C61] uppercase tracking-widest mb-2">Description</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{entry.desc}</p>
                </div>
            </div>
        </div>
    );
}