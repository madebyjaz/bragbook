import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";


export default function UpdateEdu() {
    // entry ID from URL and set up nav
    const { entryId } = useParams();
    const navigate = useNavigate();

    // form and notif states
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNotif, setshowNotif] = useState(false);

    // Firebase fetch logic
    useEffect(() => {
        if (!auth.currentUser) return;
        const fetchEntry = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid, "education", entryId));
            if (docSnap.exists()) setFormData(docSnap.data());
            setLoading(false);
        };
        fetchEntry();
    }, [entryId]);

    // handler for changing inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handler for going back 
    const handleBack = () => {
        navigate("/portfolio");
        console.log("Back to portfolio");
    };

    // submission handler w/ Firebase update logic
    const handleSubmit = async (e) => {
        e.preventDefault();

        // update logic
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid, "education", entryId), {
                ...formData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating education entry:", error);
            return;
        }

        console.log("Updated education entry:", formData);
        setshowNotif(true);
        setTimeout(() => {
            setshowNotif(false);
            navigate("/portfolio");
        }, 3000);
    };

    // shared input class for styling
    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";

    if (loading) return <p>Loading...</p>;
    if (!formData) return <p>No data found</p>;

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-start justify-center py-10 px-4">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">

                {/* Edit Edu button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#003C61]">Edit Education Entry</h2>
                    <button type="button" onClick={handleBack}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 text-lg transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Degree (REQUIRED) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Degree / Certificate <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="degree" value={formData.degree} onChange={handleInputChange}
                            placeholder="e.g. B.S. Computer Science" required className={inputClass} />
                    </div>

                    {/* School / Institution (REQUIRED) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">School / Institution <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="school" value={formData.school} onChange={handleInputChange}
                            placeholder="e.g. Stanford University" required className={inputClass} />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                            placeholder="e.g. Stanford, CA" className={inputClass} />
                    </div>

                    {/* Dates (REQUIRED) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Dates <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="dates" value={formData.dates} onChange={handleInputChange}
                            placeholder="e.g. Sep 2015 - Jun 2019" required className={inputClass} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Description</label>
                        <textarea name="desc" value={formData.desc} onChange={handleInputChange} rows={4}
                            placeholder="Describe your studies, achievements, or relevant coursework..."
                            className={`${inputClass} resize-y min-h-[100px] font-sans`} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={handleBack}
                            className="border border-gray-200 text-gray-500 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="bg-[#007C77] hover:bg-[#005f5b] active:scale-95 text-white font-semibold px-10 py-3 rounded-xl text-sm transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {showNotif && (
                <div className="fixed bottom-8 right-8 bg-[#007C77] text-white px-6 py-4 rounded-xl text-sm font-semibold shadow-xl z-50">
                    ✔ Education Entry Updated Successfully!
                </div>
            )}
        </div>
    );
}