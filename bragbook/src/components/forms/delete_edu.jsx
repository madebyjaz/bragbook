import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

const mockEduEntry = {
    degree: "B.S. Computer Science",
    school: " University of Memphis",
    location: "Memphis, TN",
    dates: "Sep 2015 - Jun 2019",
    desc: "General Concentration. Graduated with honors. Related coursework: Data Structures, Algorithms, Software Engineering, Databases.",
};

export default function delete_edu() {

    // entry ID from URL and set up nav
    const { entryId } = useParams();
    const navigate = useNavigate();

    // Local state for entry data, notification, and delete button loading state
    const [entry] = useState(mockEduEntry);
    const [showNotif, setshowNotif] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // handler for going back 
    const handleBack = () => {
        navigate("/portfolio");
        console.log("Back to portfolio");
    };

    // handler for confirming deletion
    const handleDelete = async () => {
        setIsDeleting(true);

        // Firebase delete (uncomment when ready)
        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid, "education", entryId));
        } catch (err) {
            console.error("Error deleting education:", err);
            setIsDeleting(false);
            return;
        }

        // (For debugging purposes) notification and navigate back after a delay
        console.log("Deleted education entry");
        setshowNotif(true);
        setTimeout(() => {
            setshowNotif(false);
            navigate("/portfolio");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-md p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#003C61]">Delete Education Entry</h2>
                    <button type="button" onClick={handleBack}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 text-lg transition-colors">✕</button>
                </div>

                {/* Warning icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                        🗑️
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 mb-2">Are you sure you want to delete this education entry? This action cannot be undone.</p>

                {/* Entry preview */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 mt-4">
                    <p className="text-sm font-bold text-[#003C61]">{entry.degree}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{entry.school} | {entry.location}</p>
                    <p className="text-xs text-gray-400">{entry.dates}</p>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={handleBack}
                        className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-100 font-semibold py-3 rounded-xl text-sm transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} disabled={isDeleting}
                        className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-60">
                        {isDeleting ? "Deleting..." : "Delete Entry"}
                    </button>
                </div>
            </div>

            {showNotif && (
                <div className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-4 rounded-xl text-sm font-semibold shadow-xl z-50">
                    🗑️ Education Entry Successfully Deleted! 
                </div>
            )}
        </div>
    );
}