import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function EditProfile() {
    const navigate = useNavigate();

    // form and notif states 
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    // Firebase fetch 
    useEffect(() => {
        if (!auth.currentUser) return;
        const fetchProfile = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (docSnap.exists()) setFormData(docSnap.data());
            setLoading(false);
        };
        fetchProfile();
    }, []);

    // handler for changing inputs 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("socials.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // handler for going back to portfolio
    const handleBack = () => {
        navigate("/portfolio");
        console.log("Back to portfolio");
    };

    // submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Firebase update 
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                ...formData,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error updating profile:", err);
            return;
        }

        // console log (debugging purposes)and show notif
        console.log("Updated profile:", formData);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            navigate("/portfolio");
        }, 3000);
    };

    // shared input classes for styling
    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-[#007C77] focus:ring-2 focus:ring-[#007C77]/20 transition-all";

    if (loading) return <p>Loading...</p>;
    if (!formData) return <p>No profile found</p>;

    return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-start justify-center py-10 px-4">
            <div className="bg-[#F5F5F5] rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#003C61]">Edit Profile</h2>
                    <button type="button" onClick={handleBack}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 text-lg transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Basic info */}
                    <p className="text-xs font-extrabold text-[#003C61] uppercase tracking-widest">Basic Info</p>

                    {/* Name (REQUIRED) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Full Name <span className="text-[#e63946]">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                            placeholder="e.g. Jane Doe" required className={inputClass} />
                    </div>

                    {/* Tagline  */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Tagline / Title</label>
                        <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange}
                            placeholder="e.g. Full-Stack Developer | Open Source Contributor" className={inputClass} />
                    </div>

                    {/* Location  */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                            placeholder="e.g. San Francisco, CA" className={inputClass} />
                    </div>

                    {/* Email (REQUIRED) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Email <span className="text-[#e63946]">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                            placeholder="e.g. jane@example.com" required className={inputClass} />
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#003C61]">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4}
                            placeholder="Tell people about yourself..."
                            className={`${inputClass} resize-y min-h-[100px] font-sans`} />
                    </div>

                    <div className="border-t border-gray-200 pt-2" />

                    {/* Socials */}
                    <p className="text-xs font-extrabold text-[#003C61] uppercase tracking-widest">Social Links</p>

                    {[
                        { key: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/in/username" },
                        { key: "github",    label: "GitHub",    placeholder: "https://github.com/username" },
                        { key: "instagram",   label: "Instagram",   placeholder: "https://instagram.com/username" },
                        { key: "portfolio", label: "Portfolio", placeholder: "https://yoursite.com" },
                        { key: "other", label: "Other", placeholder: "https://example.com" },

                    ].map(({ key, label, placeholder }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#003C61]">{label}</label>
                            <input type="text" name={`socials.${key}`} value={formData.socials[key]}
                                onChange={handleInputChange} placeholder={placeholder} className={inputClass} />
                        </div>
                    ))}

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

            {showNotification && (
                <div className="fixed bottom-8 right-8 bg-[#007C77] text-white px-6 py-4 rounded-xl text-sm font-semibold shadow-xl z-50">
                    ✔ Profile Updated Successfully!
                </div>
            )}
        </div>
    );
}